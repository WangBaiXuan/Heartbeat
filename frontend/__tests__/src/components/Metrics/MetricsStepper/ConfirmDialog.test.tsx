import { render } from '@testing-library/react'
import { ConfirmDialog } from '@src/components/Metrics/MetricsStepper/ConfirmDialog'
import { CONFIRM_DIALOG_DESCRIPTION } from '../../../fixtures'

const onClose = jest.fn()
const onConfirm = jest.fn()

describe('confirm dialog', () => {
  it('should show confirm dialog', () => {
    const { getByText } = render(<ConfirmDialog isDialogShowing={true} onConfirm={onConfirm} onClose={onClose} />)

    expect(getByText(CONFIRM_DIALOG_DESCRIPTION)).toBeInTheDocument()
  })
})
