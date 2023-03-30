import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import { StyledSection } from '@src/components/Common/ConfigForms'

export const PipelineMetricSelectionWrapper = styled(StyledSection)`
  width: 100%;
`

export const ButtonWrapper = styled('div')({
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-end',
})

export const RemoveButton = styled(Button)({
  width: '5rem',
  fontSize: '0.8rem',
  fontWeight: '550',
})