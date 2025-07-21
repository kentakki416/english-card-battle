import { Environment, EnvironmentParameters } from './types';
import { devParameters } from './dev';
import { stgParameters } from './stg';
import { prdParameters } from './prd';

export function getEnvironmentParameters(environment: Environment): EnvironmentParameters {
  switch (environment) {
    case 'dev':
      return devParameters;
    case 'stg':
      return stgParameters;
    case 'prd':
      return prdParameters;
    default:
      throw new Error(`Unsupported environment: ${environment}`);
  }
}

export * from './types'; 
