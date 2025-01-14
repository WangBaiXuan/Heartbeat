import {
  CONFIG_TITLE,
  REQUIRED_DATA,
  REQUIRED_DATA_LIST,
  VELOCITY,
  LEAD_TIME_FOR_CHANGES,
  CYCLE_TIME,
  ALL,
  MEAN_TIME_TO_RECOVERY,
  CLASSIFICATION,
  DEPLOYMENT_FREQUENCY,
  CHANGE_FAILURE_RATE,
} from '../../../fixtures'
import { render, within } from '@testing-library/react'
import { MetricsTypeCheckbox } from '@src/components/Metrics/ConfigStep/MetricsTypeCheckbox'
import { Provider } from 'react-redux'
import { setupStore } from '../../../utils/setupStoreUtil'
import userEvent from '@testing-library/user-event'
import { SELECTED_VALUE_SEPARATOR } from '@src/constants'
let store = null

describe('MetricsTypeCheckbox', () => {
  const setup = () => {
    store = setupStore()
    return render(
      <Provider store={store}>
        <MetricsTypeCheckbox />
      </Provider>
    )
  }
  afterEach(() => {
    store = null
  })
  it('should show require data and do not display specific options when init', () => {
    const { getByText, queryByText } = setup()
    const require = getByText(REQUIRED_DATA)

    expect(require).toBeInTheDocument()

    const option = queryByText(VELOCITY)
    expect(option).not.toBeInTheDocument()
  })

  it('should show detail options when click require data button', async () => {
    const { getByRole } = setup()
    await userEvent.click(getByRole('button', { name: REQUIRED_DATA }))
    const listBox = within(getByRole('listbox'))
    const options = listBox.getAllByRole('option')
    const optionValue = options.map((li) => li.getAttribute('data-value'))

    expect(optionValue).toEqual(REQUIRED_DATA_LIST)
  })

  it('should show multiple selections when multiple options are selected', async () => {
    const { getByRole, getByText } = setup()
    await userEvent.click(getByRole('button', { name: REQUIRED_DATA }))

    const listBox = within(getByRole('listbox'))
    await userEvent.click(listBox.getByRole('option', { name: VELOCITY }))
    await userEvent.click(listBox.getByRole('option', { name: CYCLE_TIME }))

    expect(getByText([VELOCITY, CYCLE_TIME].join(SELECTED_VALUE_SEPARATOR))).toBeInTheDocument()
  })

  it('should show all selections when all option are select', async () => {
    const { getByRole, getByText } = setup()
    const displayedDataList = REQUIRED_DATA_LIST.slice(1, 8)
    await userEvent.click(getByRole('button', { name: REQUIRED_DATA }))

    const listBox = within(getByRole('listbox'))
    await userEvent.click(listBox.getByRole('option', { name: ALL }))

    expect(listBox.getByRole('option', { name: ALL })).toHaveAttribute('aria-selected', 'true')
    expect(getByText(displayedDataList.join(SELECTED_VALUE_SEPARATOR))).toBeInTheDocument()
  })

  it('should show all selections when click velocity selection and then click all selection', async () => {
    const { getByRole, getByText } = setup()
    const displayedDataList = REQUIRED_DATA_LIST.slice(1, 8)

    await userEvent.click(getByRole('button', { name: REQUIRED_DATA }))

    const listBox = within(getByRole('listbox'))
    await userEvent.click(listBox.getByRole('option', { name: VELOCITY }))
    await userEvent.click(listBox.getByRole('option', { name: ALL }))

    expect(listBox.getByRole('option', { name: ALL })).toHaveAttribute('aria-selected', 'true')
    expect(getByText(displayedDataList.join(SELECTED_VALUE_SEPARATOR))).toBeInTheDocument()
  })

  it('should be checked of All selected option when click any other options', async () => {
    const { getByRole } = setup()
    await userEvent.click(getByRole('button', { name: REQUIRED_DATA }))

    const listBox = within(getByRole('listbox'))
    const optionsToClick = [
      listBox.getByRole('option', { name: VELOCITY }),
      listBox.getByRole('option', { name: CYCLE_TIME }),
      listBox.getByRole('option', { name: CLASSIFICATION }),
      listBox.getByRole('option', { name: LEAD_TIME_FOR_CHANGES }),
      listBox.getByRole('option', { name: DEPLOYMENT_FREQUENCY }),
      listBox.getByRole('option', { name: CHANGE_FAILURE_RATE }),
      listBox.getByRole('option', { name: MEAN_TIME_TO_RECOVERY }),
    ]
    await Promise.all(optionsToClick.map((opt) => userEvent.click(opt)))

    expect(listBox.getByRole('option', { name: ALL })).toHaveAttribute('aria-selected', 'true')
  })

  it('should show some selections when click all option and then click velocity selection', async () => {
    const { getByRole, getByText } = setup()
    const displayedDataList = REQUIRED_DATA_LIST.slice(1, 7)

    await userEvent.click(getByRole('button', { name: REQUIRED_DATA }))
    const listBox = within(getByRole('listbox'))
    await userEvent.click(listBox.getByRole('option', { name: ALL }))

    await userEvent.click(listBox.getByRole('option', { name: MEAN_TIME_TO_RECOVERY }))

    expect(listBox.getByRole('option', { name: MEAN_TIME_TO_RECOVERY })).toHaveAttribute('aria-selected', 'false')
    expect(listBox.getByRole('option', { name: ALL })).toHaveAttribute('aria-selected', 'false')
    expect(getByText(displayedDataList.join(SELECTED_VALUE_SEPARATOR))).toBeInTheDocument()
  })

  it('should show none selection when double click all option', async () => {
    const { getByRole, getByText } = setup()
    await userEvent.click(getByRole('button', { name: REQUIRED_DATA }))

    const listBox = within(getByRole('listbox'))
    await userEvent.dblClick(listBox.getByRole('option', { name: ALL }))
    await userEvent.click(getByRole('listbox', { name: REQUIRED_DATA }))

    const errorMessage = getByText('Metrics is required')
    expect(errorMessage).toBeInTheDocument()
  })

  it('should show error message when require data is null', async () => {
    const { getByRole, getByText } = setup()

    await userEvent.click(getByRole('button', { name: REQUIRED_DATA }))
    const listBox = within(getByRole('listbox'))
    await userEvent.click(listBox.getByRole('option', { name: VELOCITY }))
    await userEvent.click(listBox.getByRole('option', { name: VELOCITY }))
    await userEvent.click(getByRole('listbox', { name: REQUIRED_DATA }))

    const errorMessage = getByText('Metrics is required')
    expect(errorMessage).toBeInTheDocument()
  })

  it('should show board component when click MetricsTypeCheckbox selection velocity ', async () => {
    const { getByRole } = setup()
    await userEvent.click(getByRole('button', { name: REQUIRED_DATA }))
    const listBox = within(getByRole('listbox'))
    await userEvent.click(listBox.getByRole('option', { name: VELOCITY }))

    expect(getByRole('heading', { name: CONFIG_TITLE.BOARD, hidden: true })).toBeInTheDocument()
  })

  it('should hidden board component when MetricsTypeCheckbox select is null given MetricsTypeCheckbox select is velocity ', async () => {
    const { getByRole, queryByText } = setup()

    await userEvent.click(getByRole('button', { name: REQUIRED_DATA }))
    const requireDateSelection = within(getByRole('listbox'))
    await userEvent.click(requireDateSelection.getByRole('option', { name: VELOCITY }))
    await userEvent.click(requireDateSelection.getByRole('option', { name: VELOCITY }))

    expect(queryByText(CONFIG_TITLE.BOARD)).not.toBeInTheDocument()
  })

  it('should pipelineTool component when click MetricsTypeCheckbox selection Lead time for changes ', async () => {
    const { getByRole } = setup()
    await userEvent.click(getByRole('button', { name: REQUIRED_DATA }))
    const listBox = within(getByRole('listbox'))
    await userEvent.click(listBox.getByRole('option', { name: LEAD_TIME_FOR_CHANGES }))

    expect(getByRole('heading', { name: CONFIG_TITLE.PIPELINE_TOOL, hidden: true })).toBeInTheDocument()
  })

  it('should hidden pipelineTool component when MetricsTypeCheckbox select is null given MetricsTypeCheckbox select is Lead time for changes ', async () => {
    const { getByRole, queryByText } = setup()

    await userEvent.click(getByRole('button', { name: REQUIRED_DATA }))
    const requireDateSelection = within(getByRole('listbox'))
    await userEvent.click(requireDateSelection.getByRole('option', { name: LEAD_TIME_FOR_CHANGES }))
    await userEvent.click(requireDateSelection.getByRole('option', { name: LEAD_TIME_FOR_CHANGES }))

    expect(queryByText(CONFIG_TITLE.PIPELINE_TOOL)).not.toBeInTheDocument()
  })
})
