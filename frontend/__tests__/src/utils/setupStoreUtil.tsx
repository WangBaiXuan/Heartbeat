import { configureStore } from '@reduxjs/toolkit'
import { stepperSlice } from '@src/context/stepper/StepperSlice'
import { configSlice } from '@src/context/config/configSlice'
import { metricsSlice } from '@src/context/Metrics/metricsSlice'

export const setupStore = () => {
  return configureStore({
    reducer: {
      [stepperSlice.name]: stepperSlice.reducer,
      [configSlice.name]: configSlice.reducer,
      [metricsSlice.name]: metricsSlice.reducer,
    },
    middleware: [],
  })
}
