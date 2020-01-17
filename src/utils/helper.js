import { DCREGION } from 'constants/dcregion'
import _ from 'lodash'

export const getDistrictListUriFromTag = tag => {
  const currentLanguage = getCurrentLanguage()
  return `/${currentLanguage}/district/2019/tags/${tag}`
}

export const getDistrictOverviewUriFromTag = code => {
  const currentLanguage = getCurrentLanguage()
  return `/${currentLanguage}/district/2019/${code}`
}

export const getConstituencyUriFromTag = code => {
  const currentLanguage = getCurrentLanguage()
  return `/${currentLanguage}/district/2019/${code}`
}

export const getCodeFromDistrictName = name => {
  let code = 'A'
  Object.keys(DCREGION).forEach(k => {
    if (DCREGION[k].zh_hk === name) {
      code = k
    }
  })
  return code
}

/**
 * Passing a councillor object and get the meta data for it
 * (By QUERY_GET_COUNCILLOR_AND_CANDIDATES query)
 */
export const getCouncillorMeta = councillor => {
  const result = {
    participatedOrdinary: 0,
    participatedByElection: 0,
    lastParticipated: {
      year: 2019,
      type: 'ordinary',
      votesDiff: 0,
      votes: 0,
      isWon: false,
    },
  }

  // should already sorted from query
  const participatedElections = councillor.person.candidates || []
  result.participatedByElection = participatedElections.filter(
    c => c.election_type === 'by-election'
  ).length
  result.participatedOrdinary = participatedElections.filter(
    c => c.election_type === 'ordinary'
  ).length

  if (participatedElections.length > 0) {
    // Filter out 2019 result
    const e = participatedElections.filter(
      e => !(e.year === 2019 && e.election_type === 'ordinary')
    )[0]
    const electionYear = e.year

    const myVotes = e.constituency.candidates.find(
      c => c.person.id === councillor.person.id && c.year === electionYear
    ).votes
    const highestVotes = e.constituency.candidates
      .filter(
        c => c.person.id !== councillor.person.id && c.year === electionYear
      )
      .map(c => c.votes)
      .reduce((c, v) => Math.max(c, v), 0)
    result.lastParticipated = {
      year: e.year,
      isWon: e.is_won,
      votesDiff: myVotes - highestVotes,
      votes: myVotes,
      type: e.election_type,
    }
  }
  return result
}

export const getColorFromCamp = camp => {
  if (!camp) return 'uncertain'
  const mapping = {
    泛民: 'democracy',
    民主: 'democracy',
    建制: 'establishment',
    本土: 'localist',
    傘兵: 'localist',
    自決: 'localist',
    其他: 'other',
    不明: 'uncertain',
  }

  return mapping[camp] || 'uncertain'
}

export const getColorFromPoliticalAffiliation = pa => {
  if (!pa) return 'uncertain'

  const mapping = {
    democracy: [
      '民主黨',
      '公民黨',
      '香港民主民生協進會',
      '民協',
      '社會民主連線',
      '支聯會',
      '民主動力',
      '街坊工友服務處',
      '街工',
      '工黨',
      '職工盟',
      '新民主同盟',
      '香港本土',
      '獨立民主派',
    ],
    establishment: [
      '民主建港協進聯盟',
      '民建聯',
      '新界社團聯會',
      '新社聯',
      '香港工會聯合會',
      '工聯會',
      '港九勞工社團聯會',
      '香港經濟民生聯盟',
      '西九新動力',
      '自由黨',
      '新民黨',
      '新世紀論壇',
    ],
    localist: [
      '香港眾志',
      '青年新政',
      '本土民主前線',
      '東九龍社區關注組',
      '天水圍民生關注平台',
      '慈雲山建設力量',
      '屯門社區關注組',
      '長沙灣社區發展力量',
      '社區網絡聯盟',
      '沙田社區網絡',
      '荃灣社區網絡',
      '天水圍社區發展網絡',
      '屯門社區網絡',
      '葵青連結動力',
      '藍田社區網絡',
      '埔向晴天',
      '荃灣民生動力',
      '北區動源',
      '維多利亞社區協會',
    ],
    other: ['民主思路', '新思維'],
  }

  for (let camp of Object.keys(mapping)) {
    for (let party of mapping[camp]) {
      if (pa.includes(party)) {
        return camp
      }
    }
  }

  return 'uncertain'
}

export const getProfilePath = person => {
  const { name_en, name_zh, uuid } = person
  const currentLanguage = getCurrentLanguage()
  return `/${currentLanguage}/profile/${name_zh || name_en}/${uuid}`
}

export const formatNumber = num =>
  num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')

export const getParameterByName = (name, url) => {
  if (!url) url = window.location.href
  name = name.replace(/[[\]]/g, '\\$&')
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

export const getCurrentUrl = () => {
  return window.location.href
}

export const getConstituencyTagsByCandidateCamps = candidates => {
  const tags = []
  const filteredCandidates = candidates.filter(
    c =>
      c.election_type === 'ordinary' &&
      c.nominate_status === 'confirmed' &&
      c.tags.findIndex(
        tag => tag.type === 'demo_status' && tag.tag === 'planb'
      ) === -1
  )

  if (filteredCandidates.length >= 3) {
    tags.push(withLanguage('Multiple candidates', '多人混戰'))
  }

  const groupedCamps = _.groupBy(filteredCandidates, c => c.camp)
  if (groupedCamps['民主'] && groupedCamps['民主'].length > 1) {
    tags.push(withLanguage('Multiple Pan-dem. candidates', '民主撞區'))
  }

  if (groupedCamps['建制'] && groupedCamps['建制'].length > 1) {
    tags.push(withLanguage('Multiple Pro-Est. candidates', '建制撞區'))
  }

  return tags
}

export const withLanguage = (name_en, name_zh) => {
  var lang = window.location.pathname.match(/^\/([\w]{2})\//)
  lang = lang ? lang[1] : 'zh'
  return lang === 'en' && name_en ? name_en : name_zh
}

export const getCurrentLanguage = () => {
  return i18n.language || window.localStorage.i18nextLng || 'zh'
}

export const geti18nFromCamp = (camp, isShortForm = false) => {
  if (!camp) return camp

  const suffix = isShortForm ? '_short_form' : ''
  const mapping = {
    民主: `camp.democracy${suffix}`,
    建制: `camp.establishment${suffix}`,
    其他: `camp.others${suffix}`,
  }

  if (!mapping[camp]) return camp
  return mapping[camp]
}

export const groupVoteStat = voteStats => {
  const data = _.groupBy(voteStats, stat => stat.subtype)
  data.aggregations = {
    all_voters: data.VOTERS.map(v => v.count).reduce((c, v) => c + v, 0),
    new_voters: data.NEW_VOTERS.map(v => v.count).reduce((c, v) => c + v, 0),
  }
  return data
}

export const computeTurnouts = (constituencies, turnouts, govData) => {
  if (_.isEmpty(constituencies) || _.isEmpty(turnouts)) {
    return []
  }

  const constituencyTurnouts = constituencies.map(constituency => {
    const constituencyTurnouts = _.get(
      turnouts,
      `${constituency.code}.cumulativeTurnout`,
      []
    )
    const turnoutIndex = _.findLastIndex(constituencyTurnouts, t => t !== null)
    const now = new Date()

    return {
      ...constituency,
      total: _.get(
        groupVoteStat(constituency.vote_stats),
        'aggregations.all_voters',
        0
      ),
      type: 'constituency',
      current: turnoutIndex >= 0 ? constituencyTurnouts[turnoutIndex] : 0,
      // hourly from 07:30
      updateTime: new Date(now.setHours(8 + (turnoutIndex || 0), 30)),
      url: `district/2019/${constituency.code}`,
    }
  })

  const districtTurnouts = _.map(
    _.groupBy(constituencyTurnouts, 'district.dc_code'),
    value => {
      return value.reduce((c, v) => {
        return c === null
          ? v
          : {
            ...v.district,
            current: c.current + v.current,
            total: c.total + v.total,
            updateTime:
              c.updateTime > v.updateTime ? c.updateTime : v.updateTime,
            type: 'district',
            url: `district/2019/${v.district.dc_code}`,
          }
      }, null)
    }
  )

  // overwrite data from gov
  districtTurnouts.forEach(dt => {
    const districtTotalFromGov = _.maxBy(
      _.get(govData, `${dt.dc_code}`, []),
      d => d || 0
    )
    if (dt.current < districtTotalFromGov) {
      dt.current = districtTotalFromGov
    }
  })

  const totalTurnout = districtTurnouts.reduce((c, v) => {
    return c === null
      ? v
      : {
        current: c.current + v.current,
        total: c.total + v.total,
        updateTime: c.updateTime > v.updateTime ? c.updateTime : v.updateTime,
        type: 'all',
        url: null,
      }
  }, null)
  const totalFromGov = _.maxBy(_.get(govData, 'total', []), d => d || 0)
  if (totalTurnout.current < totalFromGov) {
    totalTurnout.current = totalFromGov
  }

  return constituencyTurnouts
    .concat(districtTurnouts)
    .concat([totalTurnout])
    .map(turnout => {
      return {
        ...turnout,
        percentage:
          (turnout.current > 0 ? turnout.current / turnout.total : 0) * 100,
        updateTime: turnout.updateTime.toLocaleTimeString(navigator.language, {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }
    })
    .sort((a, b) => a.percentage - b.percentage)
}

export const getDistrictTurnouts = (constituencies, turnouts, govData) => {
  return computeTurnouts(constituencies, turnouts, govData).filter(
    t => t.type === 'district' || t.type === 'all'
  )
}

export const getConstituencyTurnouts = (
  constituencies,
  turnouts,
  govData,
  districtCode
) => {
  return computeTurnouts(constituencies, turnouts, govData).filter(
    t =>
      (t.type === 'constituency' && t.district.dc_code === districtCode) ||
      (t.type === 'district' && t.dc_code === districtCode) ||
      t.type === 'all'
  )
}

export const customVoteStationMapping = station_code => {
  const mapping = {
    M3901: '22.427643,114.071966',
  }
  if (mapping[station_code]) return mapping[station_code]
  return null
}
