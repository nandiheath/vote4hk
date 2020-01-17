import React from "react"
import Layout from "@/components/templates/Layout"
import App from "@/components/templates/App"
import DistrictSelector from "@/components/organisms/DistrictSelector"
import SearchBox from '@/components/organisms/SearchBox';

const IndexPage = (props) => {
  return <App locale={props.pageContext.locale}>
    < Layout>
      <DistrictSelector />
      <SearchBox />
    </Layout >
  </App>
}

export default IndexPage
