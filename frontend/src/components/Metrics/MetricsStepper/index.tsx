import React, { useEffect, useState } from 'react'
import {
  BackButton,
  ButtonContainer,
  ButtonGroup,
  MetricsStepperContent,
  NextButton,
  SaveButton,
  StyledStep,
  StyledStepLabel,
  StyledStepper,
} from './style'
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch'
import { backStep, nextStep, selectStepNumber, updateTimeStamp } from '@src/context/stepper/StepperSlice'
import { ConfigStep } from '@src/components/Metrics/ConfigStep'
import {
  HOME_PAGE_ROUTE,
  METRICS_CONSTANTS,
  PIPELINE_SETTING_TYPES,
  REQUIRED_DATA,
  SAVE_CONFIG_TIPS,
  STEPS,
} from '@src/constants'
import { MetricsStep } from '@src/components/Metrics/MetricsStep'
import { ConfirmDialog } from '@src/components/Metrics/MetricsStepper/ConfirmDialog'
import { useNavigate } from 'react-router-dom'
import { selectConfig, selectMetrics } from '@src/context/config/configSlice'
import { useMetricsStepValidationCheckContext } from '@src/hooks/useMetricsStepValidationCheckContext'
import { ReportStep } from '@src/components/Metrics/ReportStep'
import { Tooltip } from '@mui/material'
import { exportToJsonFile } from '@src/utils/util'
import {
  savedMetricsSettingState,
  selectCycleTimeSettings,
  selectMetricsContent,
} from '@src/context/Metrics/metricsSlice'

const MetricsStepper = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const activeStep = useAppSelector(selectStepNumber)
  const [isDialogShowing, setIsDialogShowing] = useState(false)
  const requiredData = useAppSelector(selectMetrics)
  const config = useAppSelector(selectConfig)
  const metricsConfig = useAppSelector(selectMetricsContent)
  const [isDisableNextButton, setIsDisableNextButton] = useState(true)
  const { getDuplicatedPipeLineIds } = useMetricsStepValidationCheckContext()

  const { isShow: isShowBoard, isVerified: isBoardVerified } = config.board
  const { isShow: isShowPipeline, isVerified: isPipelineToolVerified } = config.pipelineTool
  const { isShow: isShowSourceControl, isVerified: isSourceControlVerified } = config.sourceControl
  const { metrics, projectName, dateRange } = config.basic

  const selectedBoardColumns = useAppSelector(selectCycleTimeSettings)
  const verifyPipeline = (type: string) => {
    const pipelines =
      type === PIPELINE_SETTING_TYPES.LEAD_TIME_FOR_CHANGES_TYPE
        ? metricsConfig.leadTimeForChanges
        : metricsConfig.deploymentFrequencySettings
    return pipelines.every(({ step }) => step !== '') && getDuplicatedPipeLineIds(pipelines).length === 0
  }

  const isShowCrewsSetting = isShowBoard
  const isShowRealDone =
    isShowBoard && selectedBoardColumns.filter((column) => column.value === METRICS_CONSTANTS.doneValue).length < 2
  const isShowDeploymentFrequency =
    requiredData.includes(REQUIRED_DATA.DEPLOYMENT_FREQUENCY) ||
    requiredData.includes(REQUIRED_DATA.CHANGE_FAILURE_RATE) ||
    requiredData.includes(REQUIRED_DATA.MEAN_TIME_TO_RECOVERY)
  const isShowLeadTimeForChanges = requiredData.includes(REQUIRED_DATA.LEAD_TIME_FOR_CHANGES)
  const isCrewsSettingValid = metricsConfig.users.length > 0
  const isRealDoneValid = metricsConfig.doneColumn.length > 0
  const isDeploymentFrequencyValid = verifyPipeline(PIPELINE_SETTING_TYPES.DEPLOYMENT_FREQUENCY_SETTINGS_TYPE)
  const isLeadTimeForChangesValid = verifyPipeline(PIPELINE_SETTING_TYPES.LEAD_TIME_FOR_CHANGES_TYPE)

  useEffect(() => {
    if (!activeStep) {
      const nextButtonValidityOptions = [
        { isShow: isShowBoard, isValid: isBoardVerified },
        { isShow: isShowPipeline, isValid: isPipelineToolVerified },
        { isShow: isShowSourceControl, isValid: isSourceControlVerified },
      ]
      const activeNextButtonValidityOptions = nextButtonValidityOptions.filter(({ isShow }) => isShow)
      projectName && dateRange.startDate && dateRange.endDate && metrics.length
        ? setIsDisableNextButton(!activeNextButtonValidityOptions.every(({ isValid }) => isValid))
        : setIsDisableNextButton(true)
    } else if (activeStep === 1) {
      const nextButtonValidityOptions = [
        { isShow: isShowCrewsSetting, isValid: isCrewsSettingValid },
        { isShow: isShowRealDone, isValid: isRealDoneValid },
        { isShow: isShowDeploymentFrequency, isValid: isDeploymentFrequencyValid },
        { isShow: isShowLeadTimeForChanges, isValid: isLeadTimeForChangesValid },
      ]
      const activeNextButtonValidityOptions = nextButtonValidityOptions.filter(({ isShow }) => isShow)
      activeNextButtonValidityOptions.every(({ isValid }) => isValid)
        ? setIsDisableNextButton(false)
        : setIsDisableNextButton(true)
    }
  }, [
    activeStep,
    isBoardVerified,
    isPipelineToolVerified,
    isShowBoard,
    isShowSourceControl,
    isShowPipeline,
    isSourceControlVerified,
    metrics,
    projectName,
    dateRange,
    selectedBoardColumns,
    metricsConfig,
  ])

  const filterMetricsConfig = (metricsConfig: savedMetricsSettingState) => {
    return Object.fromEntries(
      Object.entries(metricsConfig).filter(([, value]) => {
        if (Array.isArray(value)) {
          return (
            !value.every((item) => item.organization === '') &&
            !value.every((item) => item.flag === false) &&
            value.length > 0
          )
        } else {
          return true
        }
      })
    )
  }
  const handleSave = () => {
    const { projectName, dateRange, calendarType, metrics } = config.basic
    const configData = {
      projectName,
      dateRange,
      calendarType,
      metrics,
      board: isShowBoard ? config.board.config : undefined,
      pipelineTool: isShowPipeline ? config.pipelineTool.config : undefined,
      sourceControl: isShowSourceControl ? config.sourceControl.config : undefined,
    }

    const {
      leadTimeForChanges,
      deploymentFrequencySettings,
      users,
      doneColumn,
      targetFields,
      cycleTimeSettings,
      treatFlagCardAsBlock,
    } = filterMetricsConfig(metricsConfig)

    const metricsData = {
      crews: users,
      cycleTime: cycleTimeSettings
        ? {
            jiraColumns: cycleTimeSettings?.map(({ name, value }: { name: string; value: string }) => ({
              [name]: value,
            })),
            treatFlagCardAsBlock,
          }
        : undefined,
      doneStatus: doneColumn,
      classification: targetFields
        ?.filter((item: { name: string; key: string; flag: boolean }) => item.flag)
        ?.map((item: { name: string; key: string; flag: boolean }) => item.key),
      deployment: deploymentFrequencySettings,
      leadTime: leadTimeForChanges,
    }
    const jsonData = activeStep === 0 ? configData : { ...configData, ...metricsData }
    exportToJsonFile('config', jsonData)
  }

  const handleNext = () => {
    if (activeStep === 1) {
      dispatch(updateTimeStamp(new Date().getTime()))
    }
    dispatch(nextStep())
  }

  const handleBack = () => {
    setIsDialogShowing(!activeStep)
    dispatch(backStep())
  }

  const backToHomePage = () => {
    navigate(HOME_PAGE_ROUTE)
    setIsDialogShowing(false)
    window.location.reload()
  }

  const CancelDialog = () => {
    setIsDialogShowing(false)
  }

  return (
    <>
      <StyledStepper activeStep={activeStep}>
        {STEPS.map((label) => (
          <StyledStep key={label}>
            <StyledStepLabel>{label}</StyledStepLabel>
          </StyledStep>
        ))}
      </StyledStepper>
      <MetricsStepperContent>
        {activeStep === 0 && <ConfigStep />}
        {activeStep === 1 && <MetricsStep />}
        {activeStep === 2 && <ReportStep />}
      </MetricsStepperContent>
      <ButtonContainer>
        {activeStep !== 2 && (
          <>
            <Tooltip title={SAVE_CONFIG_TIPS} placement={'right'}>
              <SaveButton onClick={handleSave}>Save</SaveButton>
            </Tooltip>
            <ButtonGroup>
              <BackButton onClick={handleBack}>Back</BackButton>
              <NextButton onClick={handleNext} disabled={isDisableNextButton}>
                Next
              </NextButton>
            </ButtonGroup>
          </>
        )}
      </ButtonContainer>
      {isDialogShowing && (
        <ConfirmDialog isDialogShowing={isDialogShowing} onConfirm={backToHomePage} onClose={CancelDialog} />
      )}
    </>
  )
}

export default MetricsStepper
