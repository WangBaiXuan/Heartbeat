export interface IPipelineToolVerifyResponse {
  pipelineList: pipeline[]
}

export interface pipeline {
  id: string
  name: string
  orgId: string
  orgName: string
  repository: string
  steps: string[]
}

export const initialPipelineToolVerifiedResponseState: IPipelineToolVerifyResponse = {
  pipelineList: [],
}
