import { devParameters } from './dev'
import { prdParameters } from './prd'
import { stgParameters } from './stg'
import { Environment, EnvironmentParameters } from './types'

export function getEnvironmentParameters(environment: Environment): EnvironmentParameters {
  switch (environment) {
    case 'dev':
      return devParameters
    case 'stg':
      return stgParameters
    case 'prd':
      return prdParameters
    default:
      return devParameters
  }
}

export * from './types'
