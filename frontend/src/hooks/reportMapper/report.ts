import { ReportResponseDTO } from '@src/clients/report/dto/response'
import { changeFailureRateMapper } from '@src/hooks/reportMapper/changeFailureRate'
import { velocityMapper } from '@src/hooks/reportMapper/velocity'
import { cycleTimeMapper } from '@src/hooks/reportMapper/cycleTime'
import { classificationMapper } from '@src/hooks/reportMapper/classification'
import { deploymentFrequencyMapper } from '@src/hooks/reportMapper/deploymentFrequency'
import { leadTimeForChangesMapper } from '@src/hooks/reportMapper/leadTimeForChanges'
import { ReportDataWithThreeColumns, ReportDataWithTwoColumns } from '@src/hooks/reportMapper/reportUIDataStructure'

export const reportMapper = ({
  velocity,
  cycleTime,
  classification,
  deploymentFrequency,
  leadTimeForChanges,
  changeFailureRate,
}: ReportResponseDTO): {
  velocityList?: ReportDataWithTwoColumns[]
  cycleTimeList?: ReportDataWithTwoColumns[]
  classificationList?: ReportDataWithThreeColumns[]
  deploymentFrequencyList?: ReportDataWithThreeColumns[]
  leadTimeForChangesList?: ReportDataWithThreeColumns[]
  changeFailureRateList?: ReportDataWithThreeColumns[]
} => {
  const velocityList = velocity && velocityMapper(velocity)

  const cycleTimeList = cycleTime && cycleTimeMapper(cycleTime)

  const classificationList = classification && classificationMapper(classification)

  const deploymentFrequencyList = deploymentFrequency && deploymentFrequencyMapper(deploymentFrequency)

  const leadTimeForChangesList = leadTimeForChanges && leadTimeForChangesMapper(leadTimeForChanges)

  const changeFailureRateList = changeFailureRate && changeFailureRateMapper(changeFailureRate)

  return {
    velocityList,
    cycleTimeList,
    classificationList,
    deploymentFrequencyList,
    leadTimeForChangesList,
    changeFailureRateList,
  }
}
