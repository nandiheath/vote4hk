import ApolloClient from 'apollo-boost'
import * as ReactHook from '@apollo/react-hooks'
import React from "react"
import PropTypes from "prop-types"
import { ContextStoreProvider } from '@/contextStore'
import { ThemeProvider } from '@material-ui/core/styles/'
import theme from '@/ui/theme'
import '@/i18n'
import { useTranslation } from 'react-i18next'

const client = new ApolloClient({
  uri: process.env.GATSBY_GRAPHQL_URI,
})

/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */



const App = (props) => {
  const { children, locale } = props
  const { i18n } = useTranslation()
  i18n.changeLanguage(locale)
  return (<>
    <ContextStoreProvider>
      <ReactHook.ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </ReactHook.ApolloProvider>
    </ContextStoreProvider>
  </>)
}

App.propTypes = {
  children: PropTypes.node.isRequired,
  locale: PropTypes.string.isRequired,
}

export default App
