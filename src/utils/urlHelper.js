
const getLangPrefix = (lang) => lang === 'zh' ? '' : `/${lang}`

export const getDistrictPageURL = (lang, year, code) => `${getLangPrefix(lang)}/district/${year}/${code}`

export const getProfileURL = (lang, { name_en, name_zh, uuid }) => {
  return `/${getLangPrefix(lang)}/profile/${name_zh || name_en}/${uuid}`
}