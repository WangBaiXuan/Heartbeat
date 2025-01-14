import saveMetricsSettingReducer, {
  addADeploymentFrequencySetting,
  addALeadTimeForChanges,
  deleteADeploymentFrequencySetting,
  deleteALeadTimeForChange,
  initDeploymentFrequencySettings,
  initLeadTimeForChanges,
  saveCycleTimeSettings,
  saveDoneColumn,
  saveTargetFields,
  saveUsers,
  selectDeploymentFrequencySettings,
  selectOrganizationWarningMessage,
  selectPipelineNameWarningMessage,
  selectStepWarningMessage,
  updateDeploymentFrequencySettings,
  updateLeadTimeForChanges,
  updateMetricsImportedData,
  updateMetricsState,
  updatePipelineSettings,
  updatePipelineStep,
  updateTreatFlagCardAsBlock,
} from '@src/context/Metrics/metricsSlice'
import { store } from '@src/store'
import { CLASSIFICATION_WARNING_MESSAGE, PIPELINE_SETTING_TYPES } from '../fixtures'
import { ORGANIZATION_WARNING_MESSAGE, PIPELINE_NAME_WARNING_MESSAGE, REAL_DONE_WARNING_MESSAGE } from '@src/constants'
import { setupStore } from '../utils/setupStoreUtil'

const initState = {
  jiraColumns: [],
  targetFields: [],
  users: [],
  doneColumn: [],
  cycleTimeSettings: [],
  deploymentFrequencySettings: [{ id: 0, organization: '', pipelineName: '', step: '' }],
  leadTimeForChanges: [{ id: 0, organization: '', pipelineName: '', step: '' }],
  classification: [],
  treatFlagCardAsBlock: true,
  importedData: {
    importedCrews: [],
    importedCycleTime: {
      importedCycleTimeSettings: [],
      importedTreatFlagCardAsBlock: true,
    },
    importedDoneStatus: [],
    importedClassification: [],
    importedDeployment: [],
    importedLeadTime: [],
  },
  cycleTimeWarningMessage: null,
  classificationWarningMessage: null,
  realDoneWarningMessage: null,
  deploymentWarningMessage: [],
  leadTimeWarningMessage: [],
}

const mockJiraResponse = {
  targetFields: [{ key: 'issuetype', name: 'Issue Type', flag: false }],
  users: ['User A', 'User B'],
  jiraColumns: [
    {
      key: 'indeterminate',
      value: {
        name: 'Done',
        statuses: ['DONE', 'CLOSED'],
      },
    },
    {
      key: 'indeterminate',
      value: {
        name: 'Doing',
        statuses: ['ANALYSIS'],
      },
    },
    {
      key: 'indeterminate',
      value: {
        name: 'Testing',
        statuses: ['TESTING'],
      },
    },
  ],
}

describe('saveMetricsSetting reducer', () => {
  it('should show empty array when handle initial state', () => {
    const savedMetricsSetting = saveMetricsSettingReducer(undefined, { type: 'unknown' })

    expect(savedMetricsSetting.users).toEqual([])
    expect(savedMetricsSetting.targetFields).toEqual([])
    expect(savedMetricsSetting.jiraColumns).toEqual([])
    expect(savedMetricsSetting.doneColumn).toEqual([])
    expect(savedMetricsSetting.cycleTimeSettings).toEqual([])
    expect(savedMetricsSetting.deploymentFrequencySettings).toEqual([
      { id: 0, organization: '', pipelineName: '', step: '' },
    ])
    expect(savedMetricsSetting.leadTimeForChanges).toEqual([{ id: 0, organization: '', pipelineName: '', step: '' }])
    expect(savedMetricsSetting.treatFlagCardAsBlock).toBe(true)
    expect(savedMetricsSetting.importedData).toEqual({
      importedCrews: [],
      importedCycleTime: {
        importedCycleTimeSettings: [],
        importedTreatFlagCardAsBlock: true,
      },
      importedDoneStatus: [],
      importedClassification: [],
      importedDeployment: [],
      importedLeadTime: [],
    })
  })

  it('should store updated targetFields when its value changed', () => {
    const mockUpdatedTargetFields = {
      targetFields: [
        { key: 'issuetype', name: 'Issue Type', flag: true },
        { key: 'parent', name: 'Parent', flag: false },
        { key: 'customfield_10020', name: 'Sprint', flag: false },
      ],
    }
    const savedMetricsSetting = saveMetricsSettingReducer(
      initState,
      saveTargetFields({
        targetFields: mockUpdatedTargetFields.targetFields,
      })
    )

    expect(savedMetricsSetting.targetFields).toEqual(mockUpdatedTargetFields)
    expect(savedMetricsSetting.users).toEqual([])
    expect(savedMetricsSetting.jiraColumns).toEqual([])
  })

  it('should store updated doneColumn when its value changed', () => {
    const mockUpdatedDoneColumn = {
      doneColumn: ['DONE', 'CANCELLED'],
    }
    const savedMetricsSetting = saveMetricsSettingReducer(
      initState,
      saveDoneColumn({
        doneColumn: mockUpdatedDoneColumn.doneColumn,
      })
    )

    expect(savedMetricsSetting.doneColumn).toEqual(mockUpdatedDoneColumn)
  })

  it('should store updated users when its value changed', () => {
    const mockUpdatedUsers = {
      users: ['userOne', 'userTwo', 'userThree'],
    }
    const savedMetricsSetting = saveMetricsSettingReducer(
      initState,
      saveUsers({
        users: mockUpdatedUsers.users,
      })
    )

    expect(savedMetricsSetting.users).toEqual(mockUpdatedUsers)
  })

  it('should store saved cycleTimeSettings when its value changed', () => {
    const mockSavedCycleTimeSettings = {
      cycleTimeSettings: [{ name: 'TODO', value: 'To do' }],
    }
    const savedMetricsSetting = saveMetricsSettingReducer(
      initState,
      saveCycleTimeSettings({
        cycleTimeSettings: mockSavedCycleTimeSettings.cycleTimeSettings,
      })
    )

    expect(savedMetricsSetting.cycleTimeSettings).toEqual(mockSavedCycleTimeSettings)
  })

  it('should update metricsImportedData when its value changed given initial state', () => {
    const mockMetricsImportedData = {
      crews: ['mockUser'],
      cycleTime: {
        jiraColumns: ['mockCycleTimeSettings'],
        treatFlagCardAsBlock: true,
      },
      doneStatus: ['mockDoneStatus'],
      classification: ['mockClassification'],
      deployment: [{ id: 0, organization: 'organization', pipelineName: 'pipelineName', step: 'step' }],
      leadTime: [{ id: 0, organization: 'organization', pipelineName: 'pipelineName', step: 'step' }],
    }
    const savedMetricsSetting = saveMetricsSettingReducer(initState, updateMetricsImportedData(mockMetricsImportedData))

    expect(savedMetricsSetting.importedData).toEqual({
      importedCrews: mockMetricsImportedData.crews,
      importedCycleTime: {
        importedCycleTimeSettings: mockMetricsImportedData.cycleTime.jiraColumns,
        importedTreatFlagCardAsBlock: mockMetricsImportedData.cycleTime.treatFlagCardAsBlock,
      },
      importedDoneStatus: mockMetricsImportedData.doneStatus,
      importedClassification: mockMetricsImportedData.classification,
      importedDeployment: mockMetricsImportedData.deployment,
      importedLeadTime: mockMetricsImportedData.leadTime,
    })
  })

  it('should not update metricsImportedData when imported data is broken given initial state', () => {
    const mockMetricsImportedData = {
      crews: null,
      cycleTime: {
        jiraColumns: null,
        treatFlagCardAsBlock: null,
      },
      doneStatus: null,
      classification: null,
      deployment: null,
      leadTime: null,
    }

    const savedMetricsSetting = saveMetricsSettingReducer(initState, updateMetricsImportedData(mockMetricsImportedData))

    expect(savedMetricsSetting.users).toEqual([])
    expect(savedMetricsSetting.targetFields).toEqual([])
    expect(savedMetricsSetting.jiraColumns).toEqual([])
    expect(savedMetricsSetting.doneColumn).toEqual([])
    expect(savedMetricsSetting.cycleTimeSettings).toEqual([])
    expect(savedMetricsSetting.treatFlagCardAsBlock).toEqual(true)
    expect(savedMetricsSetting.deploymentFrequencySettings).toEqual([
      { id: 0, organization: '', pipelineName: '', step: '' },
    ])
    expect(savedMetricsSetting.leadTimeForChanges).toEqual([{ id: 0, organization: '', pipelineName: '', step: '' }])
  })

  it('should update metricsState when its value changed given isProjectCreated is false and selectedDoneColumns', () => {
    const mockUpdateMetricsStateArguments = {
      ...mockJiraResponse,
      isProjectCreated: false,
    }
    const savedMetricsSetting = saveMetricsSettingReducer(
      {
        ...initState,
        importedData: {
          ...initState.importedData,
          importedCrews: ['User B', 'User C'],
          importedClassification: ['issuetype'],
          importedCycleTime: {
            importedCycleTimeSettings: [{ Done: 'Done' }, { Testing: 'mockOption' }],
            importedTreatFlagCardAsBlock: true,
          },
          importedDoneStatus: ['DONE'],
        },
      },
      updateMetricsState(mockUpdateMetricsStateArguments)
    )

    expect(savedMetricsSetting.targetFields).toEqual([{ key: 'issuetype', name: 'Issue Type', flag: true }])
    expect(savedMetricsSetting.users).toEqual(['User B'])
    expect(savedMetricsSetting.cycleTimeSettings).toEqual([
      { name: 'Done', value: 'Done' },
      { name: 'Doing', value: '----' },
      { name: 'Testing', value: '----' },
    ])
    expect(savedMetricsSetting.doneColumn).toEqual(['DONE'])
  })

  it('should update metricsState when its value changed given isProjectCreated is false and no selectedDoneColumns', () => {
    const mockUpdateMetricsStateArguments = {
      ...mockJiraResponse,
      isProjectCreated: false,
    }

    const savedMetricsSetting = saveMetricsSettingReducer(
      {
        ...initState,
        importedData: {
          ...initState.importedData,
          importedCycleTime: {
            importedCycleTimeSettings: [{ Done: 'Review' }, { Testing: 'mockOption' }],
            importedTreatFlagCardAsBlock: true,
          },
          importedDoneStatus: ['DONE'],
        },
      },
      updateMetricsState(mockUpdateMetricsStateArguments)
    )

    expect(savedMetricsSetting.doneColumn).toEqual([])
  })

  it('should update metricsState when its value changed given isProjectCreated is true', () => {
    const mockUpdateMetricsStateArguments = {
      ...mockJiraResponse,
      isProjectCreated: true,
    }
    const savedMetricsSetting = saveMetricsSettingReducer(
      initState,
      updateMetricsState(mockUpdateMetricsStateArguments)
    )

    expect(savedMetricsSetting.targetFields).toEqual([{ key: 'issuetype', name: 'Issue Type', flag: false }])
    expect(savedMetricsSetting.users).toEqual(['User A', 'User B'])
    expect(savedMetricsSetting.cycleTimeSettings).toEqual([
      { name: 'Done', value: '----' },
      { name: 'Doing', value: '----' },
      { name: 'Testing', value: '----' },
    ])
    expect(savedMetricsSetting.doneColumn).toEqual([])
  })

  it('should update deploymentFrequencySettings when handle updateDeploymentFrequencySettings given initial state', () => {
    const savedMetricsSetting = saveMetricsSettingReducer(
      initState,
      updateDeploymentFrequencySettings({ updateId: 0, label: 'Steps', value: 'step1' })
    )

    expect(savedMetricsSetting.deploymentFrequencySettings).toEqual([
      { id: 0, organization: '', pipelineName: '', step: 'step1' },
    ])
  })

  it('should update a deploymentFrequencySetting when handle updateDeploymentFrequencySettings given multiple deploymentFrequencySettings', () => {
    const multipleDeploymentFrequencySettingsInitState = {
      ...initState,
      deploymentFrequencySettings: [
        { id: 0, organization: '', pipelineName: '', step: '' },
        { id: 1, organization: '', pipelineName: '', step: '' },
      ],
    }
    const updatedDeploymentFrequencySettings = [
      { id: 0, organization: 'mock new organization', pipelineName: '', step: '' },
      { id: 1, organization: '', pipelineName: '', step: '' },
    ]
    const savedMetricsSetting = saveMetricsSettingReducer(
      multipleDeploymentFrequencySettingsInitState,
      updateDeploymentFrequencySettings({ updateId: 0, label: 'organization', value: 'mock new organization' })
    )

    expect(savedMetricsSetting.deploymentFrequencySettings).toEqual(updatedDeploymentFrequencySettings)
  })

  it('should add a deploymentFrequencySetting when handle addADeploymentFrequencySettings given initial state', () => {
    const addedDeploymentFrequencySettings = [
      { id: 0, organization: '', pipelineName: '', step: '' },
      { id: 1, organization: '', pipelineName: '', step: '' },
    ]

    const savedMetricsSetting = saveMetricsSettingReducer(initState, addADeploymentFrequencySetting())

    expect(savedMetricsSetting.deploymentFrequencySettings).toEqual(addedDeploymentFrequencySettings)
  })

  it('should delete a deploymentFrequencySetting when handle deleteADeploymentFrequencySettings given initial state', () => {
    const savedMetricsSetting = saveMetricsSettingReducer(initState, deleteADeploymentFrequencySetting(0))

    expect(savedMetricsSetting.deploymentFrequencySettings).toEqual([])
  })

  it('should return deploymentFrequencySettings when call selectDeploymentFrequencySettings functions', () => {
    expect(selectDeploymentFrequencySettings(store.getState())).toEqual(initState.deploymentFrequencySettings)
  })

  it('should init deploymentFrequencySettings when handle initDeploymentFrequencySettings given multiple deploymentFrequencySettings', () => {
    const multipleDeploymentFrequencySettingsInitState = {
      ...initState,
      deploymentFrequencySettings: [
        { id: 0, organization: 'mockOrgName1', pipelineName: 'mockName1', step: 'step1' },
        { id: 1, organization: 'mockOrgName2', pipelineName: 'mockName2', step: 'step2' },
      ],
    }

    const savedMetricsSetting = saveMetricsSettingReducer(
      multipleDeploymentFrequencySettingsInitState,
      initDeploymentFrequencySettings()
    )

    expect(savedMetricsSetting.deploymentFrequencySettings).toEqual(initState.deploymentFrequencySettings)
  })

  it('should add a leadTimeForChange when handle leadTimeForChanges given initial state', () => {
    const addedLeadTimeForChanges = [
      { id: 0, organization: '', pipelineName: '', step: '' },
      { id: 1, organization: '', pipelineName: '', step: '' },
    ]

    const savedMetricsSetting = saveMetricsSettingReducer(initState, addALeadTimeForChanges())

    expect(savedMetricsSetting.leadTimeForChanges).toEqual(addedLeadTimeForChanges)
  })

  it('should delete a leadTimeForChange when handle deleteALeadTimeForChange given initial state', async () => {
    const savedMetricsSetting = saveMetricsSettingReducer(initState, deleteALeadTimeForChange(0))

    expect(savedMetricsSetting.leadTimeForChanges).toEqual([])
  })

  it('should update a leadTimeForChange when handle updateLeadTimeForChanges given multiple leadTimeForChanges', () => {
    const multipleLeadTimeForChangesInitState = {
      ...initState,
      leadTimeForChanges: [
        { id: 0, organization: '', pipelineName: '', step: '' },
        { id: 1, organization: '', pipelineName: '', step: '' },
      ],
    }
    const updatedLeadTimeForChanges = [
      { id: 0, organization: '', pipelineName: '', step: 'step1' },
      { id: 1, organization: '', pipelineName: '', step: '' },
    ]
    const savedMetricsSetting = saveMetricsSettingReducer(
      multipleLeadTimeForChangesInitState,
      updateLeadTimeForChanges({ updateId: 0, label: 'Steps', value: 'step1' })
    )

    expect(savedMetricsSetting.leadTimeForChanges).toEqual(updatedLeadTimeForChanges)
  })

  it('should init leadTimeForChanges when handle initLeadTimeForChanges given multiple leadTimeForChanges', () => {
    const multipleLeadTimeForChangesInitState = {
      ...initState,
      leadTimeForChanges: [
        { id: 0, organization: 'mockOrgName1', pipelineName: 'mockName1', step: 'step1' },
        { id: 1, organization: 'mockOrgName2', pipelineName: 'mockName2', step: 'step2' },
      ],
    }

    const savedMetricsSetting = saveMetricsSettingReducer(multipleLeadTimeForChangesInitState, initLeadTimeForChanges())

    expect(savedMetricsSetting.leadTimeForChanges).toEqual(initState.leadTimeForChanges)
  })

  it('should return false when update TreatFlagCardAsBlock value  given false', () => {
    const savedMetricsSetting = saveMetricsSettingReducer(initState, updateTreatFlagCardAsBlock(false))

    expect(savedMetricsSetting.treatFlagCardAsBlock).toBe(false)
  })

  describe('updatePipelineSettings', () => {
    const mockImportedDeployment = [
      { id: 0, organization: 'mockOrganization1', pipelineName: 'mockPipelineName1', step: 'mockStep1' },
      { id: 1, organization: 'mockOrganization1', pipelineName: 'mockPipelineName2', step: 'mockStep2' },
      { id: 2, organization: 'mockOrganization2', pipelineName: 'mockPipelineName3', step: 'mockStep3' },
    ]
    const mockImportedLeadTime = [
      { id: 0, organization: 'mockOrganization1', pipelineName: 'mockPipelineName1', step: 'mockStep1' },
    ]
    const mockInitState = {
      ...initState,
      importedData: {
        ...initState.importedData,
        importedDeployment: mockImportedDeployment,
        importedLeadTime: mockImportedLeadTime,
      },
    }
    const mockPipelineList = [
      {
        id: 'mockId1',
        name: 'mockPipelineName1',
        orgId: 'mockOrgId1',
        orgName: 'mockOrganization1',
        repository: 'mockRepository1',
        steps: ['mock step 1', 'mock step 2'],
      },
    ]
    const testCases = [
      {
        isProjectCreated: false,
        expectSetting: {
          deploymentFrequencySettings: [
            { id: 0, organization: 'mockOrganization1', pipelineName: 'mockPipelineName1', step: '' },
            { id: 1, organization: 'mockOrganization1', pipelineName: '', step: '' },
            { id: 2, organization: '', pipelineName: '', step: '' },
          ],
          leadTimeForChanges: [
            { id: 0, organization: 'mockOrganization1', pipelineName: 'mockPipelineName1', step: '' },
          ],
          deploymentWarningMessage: [
            { id: 0, organization: null, pipelineName: null, step: null },
            { id: 1, organization: null, pipelineName: PIPELINE_NAME_WARNING_MESSAGE, step: null },
            { id: 2, organization: ORGANIZATION_WARNING_MESSAGE, pipelineName: null, step: null },
          ],
          leadTimeWarningMessage: [{ id: 0, organization: null, pipelineName: null, step: null }],
        },
      },
      {
        isProjectCreated: true,
        expectSetting: {
          deploymentFrequencySettings: [{ id: 0, organization: '', pipelineName: '', step: '' }],
          leadTimeForChanges: [{ id: 0, organization: '', pipelineName: '', step: '' }],
          deploymentWarningMessage: [],
          leadTimeWarningMessage: [],
        },
      },
    ]

    testCases.forEach(({ isProjectCreated, expectSetting }) => {
      it(`should update pipeline settings When call updatePipelineSettings given isProjectCreated ${isProjectCreated}`, () => {
        const savedMetricsSetting = saveMetricsSettingReducer(
          mockInitState,
          updatePipelineSettings({ pipelineList: mockPipelineList, isProjectCreated })
        )

        expect(savedMetricsSetting.deploymentFrequencySettings).toEqual(expectSetting.deploymentFrequencySettings)
        expect(savedMetricsSetting.leadTimeForChanges).toEqual(expectSetting.leadTimeForChanges)
        expect(savedMetricsSetting.deploymentWarningMessage).toEqual(expectSetting.deploymentWarningMessage)
        expect(savedMetricsSetting.leadTimeWarningMessage).toEqual(expectSetting.leadTimeWarningMessage)
      })
    })
  })

  describe('updatePipelineSteps', () => {
    const mockImportedDeployment = [
      { id: 0, organization: 'mockOrganization1', pipelineName: 'mockPipelineName1', step: 'mockStep1' },
      { id: 1, organization: 'mockOrganization1', pipelineName: 'mockPipelineName2', step: 'mockStep2' },
      { id: 2, organization: 'mockOrganization2', pipelineName: 'mockPipelineName3', step: 'mockStep3' },
    ]
    const mockImportedLeadTime = [
      { id: 0, organization: 'mockOrganization1', pipelineName: 'mockPipelineName1', step: 'mockStep1' },
    ]
    const mockInitState = {
      ...initState,
      deploymentFrequencySettings: [
        { id: 0, organization: 'mockOrganization1', pipelineName: 'mockPipelineName1', step: '' },
        { id: 1, organization: 'mockOrganization1', pipelineName: 'mockPipelineName2', step: '' },
      ],
      leadTimeForChanges: [
        {
          id: 0,
          organization: 'mockOrganization1',
          pipelineName: 'mockPipelineName1',
          step: '',
        },
      ],
      importedData: {
        ...initState.importedData,
        importedDeployment: mockImportedDeployment,
        importedLeadTime: mockImportedLeadTime,
      },
      deploymentWarningMessage: [
        { id: 0, organization: null, pipelineName: null, step: null },
        { id: 1, organization: null, pipelineName: null, step: null },
      ],
      leadTimeWarningMessage: [{ id: 0, organization: null, pipelineName: null, step: null }],
    }
    const mockSteps = ['mockStep1']
    const testSettingsCases = [
      {
        id: 0,
        steps: mockSteps,
        type: PIPELINE_SETTING_TYPES.DEPLOYMENT_FREQUENCY_SETTINGS_TYPE,
        expectedSettings: [
          { id: 0, organization: 'mockOrganization1', pipelineName: 'mockPipelineName1', step: 'mockStep1' },
          { id: 1, organization: 'mockOrganization1', pipelineName: 'mockPipelineName2', step: '' },
        ],
        expectedWarning: [
          { id: 0, organization: null, pipelineName: null, step: null },
          { id: 1, organization: null, pipelineName: null, step: null },
        ],
      },
      {
        id: 1,
        steps: mockSteps,
        type: PIPELINE_SETTING_TYPES.DEPLOYMENT_FREQUENCY_SETTINGS_TYPE,
        expectedSettings: [
          { id: 0, organization: 'mockOrganization1', pipelineName: 'mockPipelineName1', step: '' },
          { id: 1, organization: 'mockOrganization1', pipelineName: 'mockPipelineName2', step: '' },
        ],
        expectedWarning: [
          { id: 0, organization: null, pipelineName: null, step: null },
          {
            id: 1,
            organization: null,
            pipelineName: null,
            step: 'Selected step of this pipeline in import data might be removed',
          },
        ],
      },
      {
        id: 0,
        steps: mockSteps,
        type: PIPELINE_SETTING_TYPES.LEAD_TIME_FOR_CHANGES_TYPE,
        expectedSettings: [
          { id: 0, organization: 'mockOrganization1', pipelineName: 'mockPipelineName1', step: 'mockStep1' },
        ],
        expectedWarning: [{ id: 0, organization: null, pipelineName: null, step: null }],
      },
      {
        id: 1,
        steps: mockSteps,
        type: PIPELINE_SETTING_TYPES.LEAD_TIME_FOR_CHANGES_TYPE,
        expectedSettings: [
          {
            id: 0,
            organization: 'mockOrganization1',
            pipelineName: 'mockPipelineName1',
            step: '',
          },
        ],
        expectedWarning: [{ id: 0, organization: null, pipelineName: null, step: null }],
      },
    ]

    testSettingsCases.forEach(({ id, type, steps, expectedSettings, expectedWarning }) => {
      const settingsKey =
        type === PIPELINE_SETTING_TYPES.DEPLOYMENT_FREQUENCY_SETTINGS_TYPE
          ? 'deploymentFrequencySettings'
          : 'leadTimeForChanges'
      const warningKey =
        type === PIPELINE_SETTING_TYPES.DEPLOYMENT_FREQUENCY_SETTINGS_TYPE
          ? 'deploymentWarningMessage'
          : 'leadTimeWarningMessage'

      it(`should update ${settingsKey} step when call updatePipelineSteps with id ${id}`, () => {
        const savedMetricsSetting = saveMetricsSettingReducer(
          mockInitState,
          updatePipelineStep({
            steps: steps,
            id: id,
            type: type,
          })
        )

        expect(savedMetricsSetting[settingsKey]).toEqual(expectedSettings)
        expect(savedMetricsSetting[warningKey]).toEqual(expectedWarning)
      })
    })
  })

  it('should set warningMessage have value when there are more values in the import file than in the response', () => {
    const mockUpdateMetricsStateArguments = {
      ...mockJiraResponse,
      isProjectCreated: false,
    }
    const savedMetricsSetting = saveMetricsSettingReducer(
      {
        ...initState,
        importedData: {
          ...initState.importedData,
          importedCycleTime: {
            importedCycleTimeSettings: [
              { ToDo: 'mockOption' },
              { Doing: 'Analysis' },
              { Testing: 'Testing' },
              { Done: 'Done' },
            ],
            importedTreatFlagCardAsBlock: true,
          },
        },
      },
      updateMetricsState(mockUpdateMetricsStateArguments)
    )

    expect(savedMetricsSetting.cycleTimeWarningMessage).toEqual(
      'The column of ToDo is a deleted column, which means this column existed the time you saved config, but was deleted. Please confirm!'
    )
  })

  it('should set warningMessage have value when the values in the import file are less than those in the response', () => {
    const mockUpdateMetricsStateArguments = {
      ...mockJiraResponse,
      isProjectCreated: false,
    }
    const savedMetricsSetting = saveMetricsSettingReducer(
      {
        ...initState,
        importedData: {
          ...initState.importedData,
          importedCycleTime: {
            importedCycleTimeSettings: [{ Doing: 'Analysis' }, { Done: 'Done' }],
            importedTreatFlagCardAsBlock: true,
          },
        },
      },
      updateMetricsState(mockUpdateMetricsStateArguments)
    )

    expect(savedMetricsSetting.cycleTimeWarningMessage).toEqual(
      'The column of Testing is a new column. Please select a value for it!'
    )
  })

  it('should set warningMessage have value when the key value in the import file matches the value in the response, but the value does not match the fixed column', () => {
    const mockUpdateMetricsStateArguments = {
      ...mockJiraResponse,
      isProjectCreated: false,
    }
    const savedMetricsSetting = saveMetricsSettingReducer(
      {
        ...initState,
        importedData: {
          ...initState.importedData,
          importedCycleTime: {
            importedCycleTimeSettings: [{ Doing: 'mockOption' }, { Testing: 'Analysis' }, { Done: 'Done' }],
            importedTreatFlagCardAsBlock: true,
          },
        },
      },
      updateMetricsState(mockUpdateMetricsStateArguments)
    )

    expect(savedMetricsSetting.cycleTimeWarningMessage).toEqual(
      'The value of Doing in imported json is not in dropdown list now. Please select a value for it!'
    )
  })

  it('should set warningMessage null when the key value in the imported file matches the value in the response and the value matches the fixed column', () => {
    const mockUpdateMetricsStateArguments = {
      ...mockJiraResponse,
      isProjectCreated: false,
    }
    const savedMetricsSetting = saveMetricsSettingReducer(
      {
        ...initState,
        importedData: {
          ...initState.importedData,
          importedCycleTime: {
            importedCycleTimeSettings: [{ Testing: 'Testing' }, { Doing: 'Done' }, { Done: 'Done' }],
            importedTreatFlagCardAsBlock: true,
          },
        },
      },
      updateMetricsState(mockUpdateMetricsStateArguments)
    )

    expect(savedMetricsSetting.cycleTimeWarningMessage).toBeNull()
  })

  it('should set warningMessage null when importedCycleTimeSettings in the imported file matches is empty', () => {
    const mockUpdateMetricsStateArguments = {
      ...mockJiraResponse,
      isProjectCreated: false,
    }
    const savedMetricsSetting = saveMetricsSettingReducer(
      {
        ...initState,
        importedData: {
          ...initState.importedData,
          importedCycleTime: {
            importedCycleTimeSettings: [],
            importedTreatFlagCardAsBlock: true,
          },
        },
      },
      updateMetricsState(mockUpdateMetricsStateArguments)
    )

    expect(savedMetricsSetting.cycleTimeWarningMessage).toBeNull()
  })

  it('should set classification warningMessage null when the key value in the imported file matches the value in the response and the value matches the fixed column', () => {
    const mockUpdateMetricsStateArguments = {
      ...mockJiraResponse,
      isProjectCreated: false,
    }
    const savedMetricsSetting = saveMetricsSettingReducer(
      {
        ...initState,
        importedData: {
          ...initState.importedData,
          importedClassification: ['issuetype'],
        },
      },
      updateMetricsState(mockUpdateMetricsStateArguments)
    )

    expect(savedMetricsSetting.classificationWarningMessage).toBeNull()
  })

  it('should set classification warningMessage have value when the key value in the imported file matches the value in the response and the value matches the fixed column', () => {
    const mockUpdateMetricsStateArguments = {
      ...mockJiraResponse,
      isProjectCreated: false,
    }
    const savedMetricsSetting = saveMetricsSettingReducer(
      {
        ...initState,
        importedData: {
          ...initState.importedData,
          importedClassification: ['test'],
        },
      },
      updateMetricsState(mockUpdateMetricsStateArguments)
    )

    expect(savedMetricsSetting.classificationWarningMessage).toEqual(CLASSIFICATION_WARNING_MESSAGE)
  })

  it('should set realDone warning message null when doneColumns in imported file matches the value in the response', () => {
    const mockUpdateMetricsStateArguments = {
      ...mockJiraResponse,
      jiraColumns: [
        {
          key: 'done',
          value: {
            name: 'Done',
            statuses: ['DONE', 'CLOSED'],
          },
        },
      ],
      isProjectCreated: false,
    }
    const savedMetricsSetting = saveMetricsSettingReducer(
      {
        ...initState,
        importedData: {
          ...initState.importedData,
          importedDoneStatus: ['DONE'],
        },
      },
      updateMetricsState(mockUpdateMetricsStateArguments)
    )

    expect(savedMetricsSetting.realDoneWarningMessage).toBeNull()
  })

  it('should set realDone warning message have value when doneColumns in imported file not matches the value in the response', () => {
    const mockUpdateMetricsStateArguments = {
      ...mockJiraResponse,
      jiraColumns: [
        {
          key: 'done',
          value: {
            name: 'Done',
            statuses: ['DONE', 'CLOSED'],
          },
        },
      ],
      isProjectCreated: false,
    }
    const savedMetricsSetting = saveMetricsSettingReducer(
      {
        ...initState,
        importedData: {
          ...initState.importedData,
          importedDoneStatus: ['CANCELED'],
        },
      },
      updateMetricsState(mockUpdateMetricsStateArguments)
    )

    expect(savedMetricsSetting.realDoneWarningMessage).toEqual(REAL_DONE_WARNING_MESSAGE)
  })

  it('should set realDone warning message null when doneColumns in imported file matches the value in cycleTimeSettings', () => {
    const mockUpdateMetricsStateArguments = {
      ...mockJiraResponse,
      jiraColumns: [
        {
          key: 'done',
          value: {
            name: 'Done',
            statuses: ['DONE', 'CLOSED'],
          },
        },
      ],
      isProjectCreated: false,
    }
    const savedMetricsSetting = saveMetricsSettingReducer(
      {
        ...initState,
        cycleTimeSettings: [{ name: 'Done', value: 'Done' }],
        importedData: {
          ...initState.importedData,
          importedDoneStatus: ['DONE', 'CLOSED'],
        },
      },
      updateMetricsState(mockUpdateMetricsStateArguments)
    )

    expect(savedMetricsSetting.realDoneWarningMessage).toBeNull()
  })

  it('should set realDone warning message have value when doneColumns in imported file not matches the value in cycleTimeSettings', () => {
    const mockUpdateMetricsStateArguments = {
      ...mockJiraResponse,
      jiraColumns: [
        {
          key: 'done',
          value: {
            name: 'Done',
            statuses: ['DONE', 'CLOSED'],
          },
        },
      ],
      isProjectCreated: false,
    }
    const savedMetricsSetting = saveMetricsSettingReducer(
      {
        ...initState,
        cycleTimeSettings: [{ name: 'Done', value: 'Done' }],
        importedData: {
          ...initState.importedData,
          importedDoneStatus: ['DONE', 'CLOSED', 'CANCELED'],
        },
      },
      updateMetricsState(mockUpdateMetricsStateArguments)
    )

    expect(savedMetricsSetting.realDoneWarningMessage).toEqual(REAL_DONE_WARNING_MESSAGE)
  })

  describe('select pipeline settings warning message', () => {
    const mockPipelineSettings = [
      {
        id: 0,
        organization: 'mockOrganization2',
        pipelineName: 'mockPipelineName1',
        step: 'mockStep',
      },
      {
        id: 1,
        organization: 'mockOrganization1',
        pipelineName: 'mockPipelineName2',
        step: ' mockStep1',
      },
    ]
    const mockImportData = {
      deployment: mockPipelineSettings,
      leadTime: mockPipelineSettings,
    }
    const mockPipelineList = [
      {
        id: 'mockId1',
        name: 'mockPipelineName1',
        orgId: 'mockOrgId1',
        orgName: 'mockOrganization1',
        repository: 'mockRepository1',
        steps: ['mock step 1', 'mock step 2'],
      },
    ]
    const mockSteps = ['mockStep']
    const ORGANIZATION_WARNING_MESSAGE = 'This organization in import data might be removed'
    const PIPELINE_NAME_WARNING_MESSAGE = 'This Pipeline in import data might be removed'
    const STEP_WARNING_MESSAGE = 'Selected step of this pipeline in import data might be removed'

    let store = setupStore()
    beforeEach(async () => {
      store = setupStore()
      await store.dispatch(updateMetricsImportedData(mockImportData))
      await store.dispatch(updatePipelineSettings({ pipelineList: mockPipelineList, isProjectCreated: false }))
      await store.dispatch(
        updatePipelineStep({
          steps: mockSteps,
          id: 0,
          type: PIPELINE_SETTING_TYPES.DEPLOYMENT_FREQUENCY_SETTINGS_TYPE,
        })
      )
      await store.dispatch(
        updatePipelineStep({
          steps: mockSteps,
          id: 1,
          type: PIPELINE_SETTING_TYPES.DEPLOYMENT_FREQUENCY_SETTINGS_TYPE,
        })
      )
      await store.dispatch(
        updatePipelineStep({ steps: mockSteps, id: 0, type: PIPELINE_SETTING_TYPES.LEAD_TIME_FOR_CHANGES_TYPE })
      )
      await store.dispatch(
        updatePipelineStep({ steps: mockSteps, id: 1, type: PIPELINE_SETTING_TYPES.LEAD_TIME_FOR_CHANGES_TYPE })
      )
    })
    afterEach(() => {
      jest.clearAllMocks()
    })
    it('should return organization warning message given its id and type', () => {
      expect(
        selectOrganizationWarningMessage(store.getState(), 0, PIPELINE_SETTING_TYPES.DEPLOYMENT_FREQUENCY_SETTINGS_TYPE)
      ).toEqual(ORGANIZATION_WARNING_MESSAGE)
      expect(
        selectOrganizationWarningMessage(store.getState(), 1, PIPELINE_SETTING_TYPES.DEPLOYMENT_FREQUENCY_SETTINGS_TYPE)
      ).toBeNull()
      expect(
        selectOrganizationWarningMessage(store.getState(), 0, PIPELINE_SETTING_TYPES.LEAD_TIME_FOR_CHANGES_TYPE)
      ).toEqual(ORGANIZATION_WARNING_MESSAGE)
      expect(
        selectOrganizationWarningMessage(store.getState(), 1, PIPELINE_SETTING_TYPES.LEAD_TIME_FOR_CHANGES_TYPE)
      ).toBeNull()
    })

    it('should return pipelineName warning message given its id and type', () => {
      expect(
        selectPipelineNameWarningMessage(store.getState(), 0, PIPELINE_SETTING_TYPES.DEPLOYMENT_FREQUENCY_SETTINGS_TYPE)
      ).toBeNull()
      expect(
        selectPipelineNameWarningMessage(store.getState(), 1, PIPELINE_SETTING_TYPES.DEPLOYMENT_FREQUENCY_SETTINGS_TYPE)
      ).toEqual(PIPELINE_NAME_WARNING_MESSAGE)
      expect(
        selectPipelineNameWarningMessage(store.getState(), 0, PIPELINE_SETTING_TYPES.LEAD_TIME_FOR_CHANGES_TYPE)
      ).toBeNull()
      expect(
        selectPipelineNameWarningMessage(store.getState(), 1, PIPELINE_SETTING_TYPES.LEAD_TIME_FOR_CHANGES_TYPE)
      ).toEqual(PIPELINE_NAME_WARNING_MESSAGE)
    })

    it('should return step warning message given its id and type', () => {
      expect(
        selectStepWarningMessage(store.getState(), 0, PIPELINE_SETTING_TYPES.DEPLOYMENT_FREQUENCY_SETTINGS_TYPE)
      ).toBeNull()
      expect(
        selectStepWarningMessage(store.getState(), 1, PIPELINE_SETTING_TYPES.DEPLOYMENT_FREQUENCY_SETTINGS_TYPE)
      ).toEqual(STEP_WARNING_MESSAGE)
      expect(
        selectStepWarningMessage(store.getState(), 0, PIPELINE_SETTING_TYPES.LEAD_TIME_FOR_CHANGES_TYPE)
      ).toBeNull()
      expect(selectStepWarningMessage(store.getState(), 1, PIPELINE_SETTING_TYPES.LEAD_TIME_FOR_CHANGES_TYPE)).toEqual(
        STEP_WARNING_MESSAGE
      )
    })
  })
})
