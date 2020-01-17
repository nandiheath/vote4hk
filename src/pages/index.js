import React from "react"
import Layout from "@/components/templates/layout"
import DistrictSelector from "@/components/organisms/DistrictSelector"

const IndexPage = (props) => {
  return < Layout locale={props.pageContext.locale}>
    <DistrictSelector />
  </Layout >
}

export default IndexPage
