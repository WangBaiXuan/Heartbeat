import { reportMapper } from '@src/hooks/reportMapper/report'
import { EXPECTED_REPORT_VALUES, MOCK_REPORT_RESPONSE } from '../../fixtures'

describe('report response data mapper', () => {
  it('maps response velocity values to ui display value', () => {
    const mappedReportResponseValues = reportMapper(MOCK_REPORT_RESPONSE)

    expect(mappedReportResponseValues).toEqual(EXPECTED_REPORT_VALUES)
  })
})
