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
