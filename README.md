# 2019區議會選舉｜投票指南 ✋🏻🧡⚡

This is the repository for [vote4.hk](https://vote4.hk)
Originated from [district-councils-dashboard](https://github.com/cswbrian/district-councils-dashboard)

## About us

- g0vhk [https://g0vhk.io/](https://g0vhk.io/)

## Stack

Our frontend is using:

- gatsby

Our open source data is at [https://github.com/nandiheath/dc-data](dc-data)

Our backend is using:

- [hasura graphql server](https://hasura.io/)
- patroni - HA supported psql server (with postgix supported)

## Development

### React Frontend

```bash
yarn install
yarn run dev
```

### i18n
We are using react-i18next to assert that needed translations get loaded or that your content gets rendered when the language changes. The full documentation is [here](https://react.i18next.com/). 

The translation json files for ``en`` and ``zh`` are located at ``web/src/locales/en/translation.json`` and ``web/src/locales/zh/translation.json`` respectively. By default, ``zh`` is used. If you have changes to the wording, please make sure they are added or updated in both json files.

Example:

web/src/locales/en/translation.json

```json
{
    "candidate.nominateStatus.disqualified": "Disqualified"
}
```

web/src/locales/zh/translation.json

```json
{
    "candidate.nominateStatus.disqualified": "取消資格"
}
```

Use ``useTranslation()`` for functional components:

```javascript
// Example: CandidatesContainer.js
// ---------------------------------------------
// 1. import useTranslation from react-i18next
import { useTranslation } from 'react-i18next'
// 2. define t from useTranslation()
const { t } = useTranslation()
// 3. use the t function with the key as the parameter 
const  status = t('candidate.nominateStatus.disqualified')
```

Use ``withLanguage(i18n)`` to show values for the selected language.

```javascript
// Example: Summary.js
// ---------------------------------------------
// 1. import withLanguage from utils/helper
import { withLanguage } from 'utils/helper'
// 2. withLanguage() takes 2 parameters - value in en and value in zh respectively
// In this example, district.name_en will be used if the lang is en
// if the lang is zh, district.name_zh will be used
// if district.name_en is null, it will fall back to zh 
withLanguage(district.name_en, district.name_zh)
// if you are not sure what the field names for both language are, check the query 
// which can be found either in the same file or in web/src/queries/gql.js
```

For interpolation, surround the dynamic value by curly brackets in ``translation.json``

```json
{
    "districtNewVoterchartContainer.text1": "Voters increased by {{ n }}%"
}
```

and pass an object with the key defined in curly brackets and the dynamic value in the second parameter

```javascript
// Example: DistrictNewVoterChartContainer.js
<Typography variant="h2">
    {
        t('districtNewVoterchartContainer.text1', {
            n: _.round(meta.increased * 100, 2)
        })
    }
</Typography>
```

## Reference

[立場區議會選舉專頁 - 2015](https://dce2015.thestandnews.com)  
[Vote Taiwan 投票指南](https://councils.g0v.tw)  
[天下雜誌 - 全台村里選舉互動地圖](https://web.cw.com.tw/election2018)  
[initiummedia/hk_district_council_election](https://github.com/initiummedia/hk_district_council_election)  
[voteview.com](https://voteview.com/)  
[https://www.uswatch.tw/](https://www.uswatch.tw/)  
