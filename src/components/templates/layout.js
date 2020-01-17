/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import SearchDrawer from '@/components/organisms/SearchDrawer'
import { ContextStoreProvider } from '@/contextStore'
import NavBar from "../organisms/NavBar"
import { ThemeProvider } from '@material-ui/core/styles/'
import theme from '@/ui/theme'
import '@/i18n'
import { useTranslation } from 'react-i18next'

const Layout = (props) => {
  const { children, locale } = props
  const { i18n } = useTranslation()
  i18n.changeLanguage(locale)
  return (<>
    <ContextStoreProvider>
      <ThemeProvider theme={theme}>
        <SearchDrawer />

        <main>
          <NavBar></NavBar>
          {children}
        </main>

        {/* <main>{children}</main> */}
        <footer>
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>
        </footer>
      </ThemeProvider>
    </ContextStoreProvider>
  </>)
}
Layout.propTypes = {
  children: PropTypes.node.isRequired,
  locale: PropTypes.string.isRequired,
}

export default Layout
