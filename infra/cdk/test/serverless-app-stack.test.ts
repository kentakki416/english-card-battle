import * as cdk from "aws-cdk-lib"
import { Template } from "aws-cdk-lib/assertions"

import { ServerLessAppStack } from "../lib/serverless-app-stack"

describe(__filename, () => {

  describe("スナップショットテスト", () => {
    it("スナップショットが一致する", () => {
        const app = new cdk.App()
        const stack = new ServerLessAppStack(app, "TestStack", {})
        const template = Template.fromStack(stack)

        expect(template.toJSON()).toMatchSnapshot()
    })
  })
})
