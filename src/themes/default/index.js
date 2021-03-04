// Modules
import React from 'react'
// import PropTypes from 'prop-types'
import { createGlobalStyle } from 'styled-components'
import { transparentize } from 'polished'

// Contents
import { normalize } from 'styled-normalize'

// Configs
import colors from '../colors'

// Elements
const GlobalStyle = createGlobalStyle`
    ${normalize}

    * {
        padding: 0;
        margin: auto;
        text-align: center;
        box-sizing: border-box;
    }

    html {
        width: 100%;
        height: 100%;
        background-color: ${ transparentize(0.95, colors.grayDark_3) }
    }
    body,
    #app {
        width: inherit;
        height: inherit;
    }

    #app {
        overflow-y: auto;
    }
`

// Components
const GlobalStyleWrapper = ({
}) => (
    <GlobalStyle />
)

// Props
// GlobalStyleWrapper.defaultProps = {
// }

// GlobalStyleWrapper.propTypes = {
// }

// Exports
export default GlobalStyleWrapper