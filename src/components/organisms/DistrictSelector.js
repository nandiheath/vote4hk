import React from 'react'
import { Typography, Button } from '@material-ui/core'
import styled from 'styled-components'
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from '@material-ui/core'
import _ from 'lodash'
import { DRAWER_CLOSE } from '@/reducers/drawer'
import ContextStore from '@/contextStore'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import AreaTabs from '@components/organisms/AreaTabs'

import { useTranslation } from 'react-i18next'
import { StaticQuery, graphql } from "gatsby"
import { withLanguage } from '@/utils/locale'

const QUERY_FETCH_AREA = graphql`
  query {
    remote {
      dcd_districts {
        area_code
        area_name_en
        area_name_zh
        dc_code
        dc_name_en
        dc_name_zh
        constituencies(where: { year: { _eq: 2019 } }) {
          code
          name_zh
          name_en
        }
      }
    }
  }
`

const Container = styled.div`
  && {
    width: 100%;
    display: flex;
    flex-direction: column;
    vertical-align: top;
  }
`

const DistrictContainer = styled(Button)`
  && {
    width: 50%;
    justify-content: left;
    text-align: left;
    text-transform: capitalize;
    font-size: ${props => props.fontsize}px;
  }
`

const DistrictExpansionPanel = styled(ExpansionPanel)`
  && {
    box-shadow: none;
  }
`

const DistrictExpansionPanelSummary = styled(ExpansionPanelSummary)`
  && {
    font-weight: 600px;
    .Mui-expanded {
    }
  }
`

const DistrictExpansionPanelDetails = styled(ExpansionPanelDetails)`
  && {
    padding: 0 16px 0;
  }
`

const DistrictSelector = (props) => {
  const {
    drawer: { dispatch },
  } = React.useContext(ContextStore)
  const { t, i18n } = useTranslation()
  return (
    <StaticQuery
      query={QUERY_FETCH_AREA}
      render={data => {
        const { expanded, } = props
        const renderDCCA = district => {
          return (
            <div key={district.dc_code}>
              <DistrictContainer
                key={district.dc_code}
                onClick={() => {
                  dispatch({ type: DRAWER_CLOSE })
                  // props.history.push(getDistrictOverviewUriFromTag(district.dc_code))
                }}
                color="secondary"
              >
                <Typography variant="h5">{t('districtSelector.overview')}</Typography>
              </DistrictContainer>
              {district.constituencies.map(c => {
                return (
                  <DistrictContainer
                    key={c.code}
                    onClick={() => {
                      dispatch({ type: DRAWER_CLOSE })
                      // props.history.push(getConstituencyUriFromTag(c.code))
                    }}
                  >
                    <Typography variant="h5">{withLanguage(i18n, c, 'name')}</Typography>
                  </DistrictContainer>
                )
              })}
            </div>
          )
        }

        const renderArea = (area, i) => (
          <div key={`area-${i}`}>
            {area.districts
              .sort((a, b) => {
                if (a.dc_code > b.dc_code) return 1
                if (a.dc_code < b.dc_code) return -1
                return 0
              })
              .map((d, index) => (
                <DistrictExpansionPanel
                  key={`district-panel-${d.dc_code}`}
                  TransitionProps={{ unmountOnExit: true }}
                >
                  <DistrictExpansionPanelSummary
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    expandIcon={<ExpandMoreIcon />}
                  >
                    <Typography variant="h5">{withLanguage(i18n, d, 'dc_name')}</Typography>
                  </DistrictExpansionPanelSummary>
                  <DistrictExpansionPanelDetails>
                    {renderDCCA(d)}
                  </DistrictExpansionPanelDetails>
                </DistrictExpansionPanel>
              ))}
          </div>
        )
        const areas = _.uniqBy(
          data.remote.dcd_districts.map(d => ({
            area_code: d.area_code,
            area_name_zh: withLanguage(i18n, d, 'area_name')
          })),
          'area_code'
        )

        const areasWithDistricts = areas.map(a => ({
          ...a,
          districts: data.remote.dcd_districts.filter(
            d =>
              withLanguage(i18n, d, 'area_name') ===
              withLanguage(i18n, a, 'area_name')
          ),
        }))

        const areaNames = areas.map(a =>
          withLanguage(i18n, a, 'area_name')
        )
        return (<Container>
          <AreaTabs titles={areaNames} expanded={expanded}>
            {areasWithDistricts.map((a, index) => {
              return renderArea(a, index)
            })}
          </AreaTabs>
        </Container>)
      }}
    />
  )
}

export default DistrictSelector
