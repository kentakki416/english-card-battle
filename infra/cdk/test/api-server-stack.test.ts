import * as cdk from 'aws-cdk-lib'
import { Template } from 'aws-cdk-lib/assertions'

import { Environment } from '../lib/parameter'
import { ApiServerStack } from '../lib/stack/api-server-stack'
import { Route53Stack } from '../lib/stack/common/route53-stack'
import { VpcStack } from '../lib/stack/common/vpc-stack'

describe(__filename, () => {

  describe('環境別スナップショットテスト', () => {
    const env: Environment[] = ['dev', 'stg', 'prd']

    env.forEach((env) => {
      it(`${env}環境のスナップショットが一致する`, () => {
        const app = new cdk.App()

        // VPC Stackを作成
        const vpcStack = new VpcStack(app, `${env}VpcStack`, {
          environment: env,
        })

        const route53Stack = new Route53Stack(app, `${env}Route53Stack`, {
          environment: env
        })

        const stack = new ApiServerStack(app, `${env}TestStack`, {
          environment: env,
          vpcStack: vpcStack,
          route53Stack: route53Stack.hostedZone,
        })

        const template = Template.fromStack(stack)

        expect(template.toJSON()).toMatchSnapshot()
      })
    })
  })
})
