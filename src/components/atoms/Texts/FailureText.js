import styled from '@/components/atoms/texts/node_modules/styled-components'
import Typography from '@/components/atoms/texts/node_modules/@material-ui/core/Typography'
import React from '@/components/atoms/texts/node_modules/react'
import { COLORS } from '@/components/atoms/texts/node_modules/ui/theme'

export default styled(Typography)`
  && {
    && {
      font-weight: 500;
      color: ${COLORS.common.failure};
    }
  }
`