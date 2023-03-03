import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { PipelineTool } from '@src/components/Metrics/ConfigStep/PipelineTool'
import {
  PIPELINE_TOOL_FIELDS,
  CONFIG_TITLE,
  PIPELINE_TOOL_TYPES,
  ERROR_MESSAGE_COLOR,
  MOCK_PIPELINE_URL,
} from '../../../fixtures'
import { Provider } from 'react-redux'
import { setupStore } from '../../../utils/setupStoreUtil'
import { setupServer } from 'msw/node'
import { rest } from 'msw'

export const fillPipelineToolFieldsInformation = () => {
  const mockInfo = 'mockToken'
  const tokenInput = screen.getByTestId('pipelineToolTextField').querySelector('input') as HTMLInputElement
  fireEvent.change(tokenInput, { target: { value: mockInfo } })
  expect(tokenInput.value).toEqual(mockInfo)
}

let store = setupStore()
const setup = () => {
  store = setupStore()
  return render(
    <Provider store={store}>
      <PipelineTool />
    </Provider>
  )
}

const server = setupServer(
  rest.post(MOCK_PIPELINE_URL, (req, res, ctx) => {
    return res(ctx.status(200))
  })
)

describe('PipelineTool', () => {
  beforeAll(() => server.listen())
  afterAll(() => server.close())

  it('should show pipelineTool title and fields when render pipelineTool component ', () => {
    const { getByRole, getByLabelText } = setup()

    PIPELINE_TOOL_FIELDS.map((field) => {
      expect(getByLabelText(`${field} *`)).toBeInTheDocument()
    })
    expect(getByRole('heading', { name: CONFIG_TITLE.PIPELINE_TOOL })).toBeInTheDocument()
  })

  it('should show default value buildKite when init pipelineTool component', () => {
    const { getByText, queryByText } = setup()
    const pipelineToolType = getByText(PIPELINE_TOOL_TYPES.BUILD_KITE)

    expect(pipelineToolType).toBeInTheDocument()

    const option = queryByText(PIPELINE_TOOL_TYPES.GO_CD)
    expect(option).not.toBeTruthy()
  })

  it('should clear other fields information when change board field selection', () => {
    const { getByRole, getByText } = setup()
    const tokenInput = screen.getByTestId('pipelineToolTextField').querySelector('input') as HTMLInputElement

    fireEvent.change(tokenInput, { target: { value: 'abcd' } })
    fireEvent.mouseDown(getByRole('button', { name: 'PipelineTool' }))
    fireEvent.click(getByText(PIPELINE_TOOL_TYPES.GO_CD))

    expect(tokenInput.value).toEqual('')
  })

  it('should clear all fields information when click reset button', async () => {
    const { getByRole, getByText, queryByRole } = setup()
    const tokenInput = screen.getByTestId('pipelineToolTextField').querySelector('input') as HTMLInputElement
    fillPipelineToolFieldsInformation()

    fireEvent.click(getByText('Verify'))
    await waitFor(() => {
      fireEvent.click(getByRole('button', { name: 'Reset' }))
    })

    expect(tokenInput.value).toEqual('')
    expect(getByText(PIPELINE_TOOL_TYPES.BUILD_KITE)).toBeInTheDocument()
    expect(queryByRole('button', { name: 'Reset' })).not.toBeTruthy()
    expect(queryByRole('button', { name: 'Verify' })).toBeDisabled()
  })

  it('should show detail options when click pipelineTool fields', () => {
    const { getByRole } = setup()
    fireEvent.mouseDown(getByRole('button', { name: 'PipelineTool' }))
    const listBox = within(getByRole('listbox'))
    const options = listBox.getAllByRole('option')
    const optionValue = options.map((li) => li.getAttribute('data-value'))

    expect(optionValue).toEqual(Object.values(PIPELINE_TOOL_TYPES))
  })

  it('should enabled verify button when all fields checked correctly given disable verify button', () => {
    const { getByRole } = setup()
    const verifyButton = getByRole('button', { name: 'Verify' })

    expect(verifyButton).toBeDisabled()

    fillPipelineToolFieldsInformation()

    expect(verifyButton).toBeEnabled()
  })

  it('should show error message and error style when token is empty', () => {
    const { getByText } = setup()
    const TOKEN_ERROR_MESSAGE = 'token is required'
    fillPipelineToolFieldsInformation()

    const tokenInput = screen.getByTestId('pipelineToolTextField').querySelector('input') as HTMLInputElement
    fireEvent.change(tokenInput, { target: { value: '' } })
    expect(getByText(TOKEN_ERROR_MESSAGE)).toBeVisible()
    expect(getByText(TOKEN_ERROR_MESSAGE)).toHaveStyle(ERROR_MESSAGE_COLOR)
  })

  it('should show reset button when verify succeed ', async () => {
    const { getByText } = setup()
    fillPipelineToolFieldsInformation()
    fireEvent.click(getByText('Verify'))
    await waitFor(() => {
      expect(getByText('Reset')).toBeVisible()
    })
  })

  it('should called verifyPipelineTool method once when click verify button', async () => {
    const { getByRole, getByText } = setup()
    fillPipelineToolFieldsInformation()
    fireEvent.click(getByRole('button', { name: 'Verify' }))
    await waitFor(() => {
      expect(getByText('Verified')).toBeInTheDocument()
    })
  })

  it('should check loading animation when click verify button', async () => {
    const { getByRole, getByTestId } = setup()
    fillPipelineToolFieldsInformation()
    fireEvent.click(getByRole('button', { name: 'Verify' }))

    expect(getByTestId('circularProgress')).toBeVisible()

    setTimeout(() => {
      expect(getByTestId('circularProgress')).not.toBeVisible()
    }, 1000)
  })
})
