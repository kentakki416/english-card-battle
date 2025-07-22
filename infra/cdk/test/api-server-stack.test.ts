import * as cdk from "aws-cdk-lib"
import { Template } from "aws-cdk-lib/assertions"

import { ApiServerStack } from "../lib/api-server-stack"
import { Environment, getEnvironmentParameters } from "../lib/parameter"

describe(__filename, () => {

  describe("環境別スナップショットテスト", () => {
    const env: Environment[] = ["dev", "stg", "prd"]

    env.forEach((env) => {
      it(`${env}環境のスナップショットが一致する`, () => {
        const app = new cdk.App()
        const envProps = getEnvironmentParameters(env)
        const stack = new ApiServerStack(app, `${env}TestStack`, {
          environment: env,
          ...envProps,
        })
        const template = Template.fromStack(stack)

        expect(template.toJSON()).toMatchSnapshot()
      })
    })
  })
})
