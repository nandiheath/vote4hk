import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import { COLORS } from 'ui/theme'

export default styled(Typography)`
  && {
    && {
      font-weight: 500;
      color: ${COLORS.common.failure};
    }
  }
`