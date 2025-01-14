import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { HttpStatusCode } from 'axios'
import { MOCK_EXPORT_CSV_REQUEST_PARAMS, MOCK_EXPORT_CSV_URL } from '../fixtures'
import { csvClient } from '@src/clients/report/CSVClient'
import http from 'http'

const server = setupServer(rest.get(MOCK_EXPORT_CSV_URL, (req, res, ctx) => res(ctx.status(HttpStatusCode.Ok))))

describe('verify export csv', () => {
  beforeAll(() => server.listen())
  afterAll(() => server.close())

  it('should download the pipeline CSV file when export csv request status 200', async () => {
    const mockBlob = new Blob(['CSV data'], { type: 'text/csv' })
    const mockResponse = { data: mockBlob }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    const mockCreateObjectURL = jest.fn().mockImplementation((blob) => {
      return `mock-url:${blob}`
    })
    const appendChildSpy = jest.spyOn(document.body, 'appendChild')
    const removeChildSpy = jest.spyOn(document.body, 'removeChild')
    window.URL.createObjectURL = mockCreateObjectURL

    const mockAxiosInstance = { get: mockGet }
    await csvClient.exportCSVData.call({ axiosInstance: mockAxiosInstance }, MOCK_EXPORT_CSV_REQUEST_PARAMS)

    expect(mockCreateObjectURL).toHaveBeenCalledWith(mockBlob)
    expect(appendChildSpy).toHaveBeenCalled()
    expect(removeChildSpy).toHaveBeenCalled()
  })

  it('should throw error when export csv request status 500', async () => {
    server.use(rest.get(MOCK_EXPORT_CSV_URL, (req, res, ctx) => res(ctx.status(HttpStatusCode.InternalServerError))))
    await expect(async () => {
      await csvClient.exportCSVData(MOCK_EXPORT_CSV_REQUEST_PARAMS)
    }).rejects.toThrow(http.STATUS_CODES[500])
  })
})
