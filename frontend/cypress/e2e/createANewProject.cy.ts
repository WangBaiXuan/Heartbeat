import homePage from '../pages/home'
import metricsPage from '../pages/metrics'

describe('Create a new project', () => {
  it('Should create a new project manually', () => {
    homePage.navigate()

    homePage.createANewProject()

    metricsPage.typeProjectName('E2E Project')

    const today = new Date()
    const day = today.getDate()
    metricsPage.selectDateRange(`${day}`, `${day + 1}`)

    metricsPage.selectVelocityAndCycleTime()
  })
})