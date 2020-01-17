import React from 'react'
import AsyncSelect from 'react-select/async'
import { components } from 'react-select'
// import * as AddressParser from 'hk-address-parser-lib'
import SearchBoxOption from '@components/molecules/SearchBoxOption'
import gql from 'graphql-tag'
import { Search } from '@material-ui/icons'
import { useTranslation } from 'react-i18next'
import { withLanguage } from '@/utils/i18n'
import { useApolloClient } from '@apollo/react-hooks'

const QUERY_GET_PEOPLE = gql`
  query($nameRegex: String) {
    dcd_candidates(
      where: {
        person: {
          _or: [
            { name_zh: { _like: $nameRegex } }
            { name_en: { _ilike: $nameRegex } }
          ]
        }
      }
      limit: 50
      order_by: { person_id: asc, year: desc }
      distinct_on: person_id
    ) {
      person {
        id
        uuid
        name_zh
        name_en
      }
      camp
      year
      constituency {
        code
        name_zh
        name_en
        district {
          dc_name_zh
          dc_name_en
        }
      }
    }
  }
`

//TODO: move to atoms?
const Group = props => (
  <div>
    <components.Group {...props} />
  </div>
)

const DropdownIndicator = props => {
  return (
    <components.DropdownIndicator {...props}>
      <Search />
    </components.DropdownIndicator>
  )
}

const SearchAllBox = props => {
  const { t, i18n } = useTranslation()
  const client = useApolloClient();
  // const { loading, data, error } = useQuery(QUERY_GET_ALL_DISTRICTS, {
  //   variables: {
  //     year: 2019,
  //   },
  //   client,
  // })

  // const getDisctrictNameByCode = code => {
  //   if (loading || error) {
  //     return {
  //       dname_zh: null,
  //       dname_en: null,
  //     }
  //   } else {
  //     return data.dcd_districts.find(d => d.dc_code === code.charAt(0))
  //   }
  // }

  // const searchAddress = async query => {
  //   const records = await AddressParser.parse(query)
  //   return records
  //     .filter((_, index) => index < 10)
  //     .map(record => {
  //       let constituency = getSingleFeatureFromPoint(record.coordinate())
  //       constituency = {
  //         ...constituency,
  //         ...getDisctrictNameByCode(constituency.code),
  //       }
  //       return {
  //         coordinate: record.coordinate(),
  //         constituency,
  //         label: withLanguage(
  //           record.fullAddress(AddressParser.Address.LANG_EN),
  //           record.fullAddress(AddressParser.Address.LANG_ZH)
  //         ),
  //         type: 'address',
  //       }
  //     })
  //     .filter(
  //       (ele, index, self) =>
  //         index === self.findIndex(record => record.label === ele.label)
  //     )
  //     .filter((_, i) => i <= 3)
  // }

  const searchPeople = async query => {
    const { data } = await client.query({
      query: QUERY_GET_PEOPLE,
      variables: {
        nameRegex: `%${query}%`,
      },
    })
    data.dcd_candidates.sort((a, b) => b.year - a.year)
    return data.dcd_candidates
      .map(c => ({
        label: withLanguage(i18n, c, 'person.name'), //c.person.name_zh || c.person.name_en,
        uuid: c.person.uuid,
        constituency: c.constituency,
        camp: c.camp,
        type: 'people',
      }))
      .filter((_, i) => i <= 3)
  }

  const search = async query => {
    const results = await Promise.all([searchPeople(query)])
    return [
      {
        label: t('candidates'),
        options: results[0],
      },
      {
        label: t('constituency'),
        options: [], // TODO: wait until addressparser is fixed
      },
    ]
  }

  return (
    <>
      <AsyncSelect
        components={{
          Option: SearchBoxOption,
          DropdownIndicator,
          Group,
        }}
        placeholder={t('searcher.placeholder')}
        noOptionsMessage={() => t('searcher.noResultPlaceholder') || ''}
        loadingMessage={() => t('searcher.loadingText') || ''}
        cacheOptions
        loadOptions={search}
        defaultOptions
      />
    </>
  )
}
export default SearchAllBox
