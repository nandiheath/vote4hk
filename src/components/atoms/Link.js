import styled from 'styled-components'
import Link from '@material-ui/core/Link'
import { COLORS } from '@/ui/theme'

export const UnstyledLink = styled(Link)`
  text-decoration: unset;
  color: black;
  font-style: unset;
  cursor: pointer;
`

export const DefaultLink = styled(UnstyledLink)`
  color: ${COLORS.main.primary};
  font-weight: 500;
`
