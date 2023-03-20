import { Snackbar } from '@mui/material'
import { styled } from '@mui/material/styles'

export const ErrorBar = styled(Snackbar)({
  position: 'absolute',
  display: 'inherit',
  top: '0',
  left: '12rem !important',
  width: '50%',
  opacity: '0.8',
})
