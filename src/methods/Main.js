// Modules
import { createStore } from 'redux'
import Queue from 'queue'

// Local modules
import Configurations, { checkStorageSpace } from './Configurations'

// Docs
import Overwolf from '../docs/overwolf'

// Reducers
import Stores, { actions as StoreActions } from '../stores'

// Consts
import WIDGETS from '../configs/widgets' 

/**
 * Main module class.
 * 
 * This class is shared with all the windows/modules.
 * 
 * @version 0.1.0
 * @author DanielBGomez <contact@danielbgomez.com>
 */
 class Main {
    constructor(){
        // Defaults
        this.windows = {}
        this.widgets = []
        this.widgetsActions = {}
        this.store = createStore( Stores )

        // Modal queue
        this.queue = Queue({
            timeout: null,
            autostart: true,
            concurrency: 1,
            results: []
        })

        // Config files
        this.configs = {
            widgets: Configurations('widgets', WIDGETS)
        }
    }
    /**
     * Register a window
     * 
     * @param {String} slug     View Slug/Name
     * @param {String} id       View ID
     * @returns {Main} Self reference
     */
    registerWindow(slug, id){
        // Ignore if already exists
        if(this.windows[slug]) return

        // Store
        this.windows[slug] = id

        // Return instance
        return this
    }
    /**
     * Syncronize all config files with the persistent data
     */
    syncAllConfigs(){
        return new Promise((resolve, reject) => {
            // Check storage
            checkStorageSpace()
                .then(() => {
                    Promise.all( Object.keys(this.configs).map( key => this.configs[key].sync() ) )
                        .then(() => {
                            // Update widgets
                            this.widgets = this.configs.widgets.values
                            // Resolve
                            resolve(this)
                        })
                        .catch(reject)
                })
                .catch(reject)
        })
    }

    /**
     * @param {object} props
     */
    openModal(props = {}){
        this.queue.push(cb => {
            // Update modal
            this.store.dispatch( StoreActions.modal.update({
               ...props,
               opened: Date.now(),
               onClose: async () => {
                    // Execute props onClose if exists
                    if(props.onClose == 'function') await props.onClose();

                    // Queue CB
                    return cb()
                }
            }) )

            // Restore vindow
            Overwolf.windows.restore( this.windows.Modal )
        })
    }
}

// Exports
export default () => new Main()
export const Class = Main