import { useState } from 'react'
import { ERROR_MESSAGE_TIME_DURATION, INTERNAL_SERVER_ERROR_MESSAGE, UNKNOWN_ERROR_MESSAGE } from '@src/constants'
import { reportClient } from '@src/clients/report/ReportClient'
import { ReportRequestDTO } from '@src/clients/report/dto/request'
import { reportMapper } from '@src/hooks/reportMapper/report'
import { ReportDataWithThreeColumns, ReportDataWithTwoColumns } from '@src/hooks/reportMapper/reportUIDataStructure'

export interface useGenerateReportEffectInterface {
  generateReport: (params: ReportRequestDTO) => Promise<
    | {
        velocityList?: ReportDataWithTwoColumns[]
        cycleTimeList?: ReportDataWithTwoColumns[]
        classification?: ReportDataWithThreeColumns[]
        deploymentFrequencyList?: ReportDataWithThreeColumns[]
        leadTimeForChangesList?: ReportDataWithThreeColumns[]
        changeFailureRateList?: ReportDataWithThreeColumns[]
      }
    | undefined
  >
  isLoading: boolean
  isServerError: boolean
  errorMessage: string
}

export const useGenerateReportEffect = (): useGenerateReportEffectInterface => {
  const [isLoading, setIsLoading] = useState(false)
  const [isServerError, setIsServerError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const errorMessagesToCheck = [UNKNOWN_ERROR_MESSAGE, INTERNAL_SERVER_ERROR_MESSAGE]

  const generateReport = async (params: ReportRequestDTO) => {
    setIsLoading(true)
    try {
      const res = await reportClient.report(params)
      return reportMapper(res.response)
    } catch (e) {
      const err = e as Error
      if (errorMessagesToCheck.includes(err.message)) {
        setIsServerError(true)
      } else {
        setErrorMessage(`generate report: ${err.message}`)
        setTimeout(() => {
          setErrorMessage('')
        }, ERROR_MESSAGE_TIME_DURATION)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    generateReport,
    isLoading,
    isServerError,
    errorMessage,
  }
}
