import React from 'react'
import { PipelineMetricSelection } from './PipelineMetricSelection'
import { useAppDispatch, useAppSelector } from '@src/hooks'
import { MetricsSettingTitle } from '@src/components/Common/MetricsSettingTitle'
import {
  addADeploymentFrequencySetting,
  deleteADeploymentFrequencySetting,
  selectDeploymentFrequencySettings,
  updateDeploymentFrequencySettings,
} from '@src/context/Metrics/metricsSlice'
import { useMetricsStepValidationCheckContext } from '@src/hooks/useMetricsStepValidationCheckContext'
import { MetricsSettingAddButton } from '@src/components/Common/MetricsSettingButton'
import { PIPELINE_SETTING_TYPES } from '@src/constants'

export const DeploymentFrequencySettings = () => {
  const dispatch = useAppDispatch()
  const deploymentFrequencySettings = useAppSelector(selectDeploymentFrequencySettings)
  const { getDuplicatedPipeLineIds } = useMetricsStepValidationCheckContext()

  const handleAddPipeline = () => {
    dispatch(addADeploymentFrequencySetting())
  }

  const handleRemovePipeline = (id: number) => {
    dispatch(deleteADeploymentFrequencySetting(id))
  }

  const handleUpdatePipeline = (id: number, label: string, value: string) => {
    dispatch(updateDeploymentFrequencySettings({ updateId: id, label, value }))
  }

  return (
    <>
      <MetricsSettingTitle title={'Deployment frequency settings'} />
      {deploymentFrequencySettings.map((deploymentFrequencySetting) => (
        <PipelineMetricSelection
          key={deploymentFrequencySetting.id}
          type={PIPELINE_SETTING_TYPES.DEPLOYMENT_FREQUENCY_SETTINGS_TYPE}
          pipelineSetting={deploymentFrequencySetting}
          isShowRemoveButton={deploymentFrequencySettings.length > 1}
          onRemovePipeline={(id) => handleRemovePipeline(id)}
          onUpdatePipeline={(id, label, value) => handleUpdatePipeline(id, label, value)}
          isDuplicated={getDuplicatedPipeLineIds(deploymentFrequencySettings).includes(deploymentFrequencySetting.id)}
        />
      ))}
      <MetricsSettingAddButton onAddPipeline={handleAddPipeline} />
    </>
  )
}
