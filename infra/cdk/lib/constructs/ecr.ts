import * as cdk from "aws-cdk-lib"

import { Construct } from "constructs"
import { Repository, TagStatus } from "aws-cdk-lib/aws-ecr"

interface EcrProps extends cdk.StackProps {
  repositoryName: string
}

export class EcrConstruct extends Construct {
  constructor(scope: Construct, id: string, props: EcrProps) {
    super(scope, id)

    const repository = new Repository(this, "Repository", {
      repositoryName: props.repositoryName,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      imageScanOnPush: true,
      lifecycleRules: [
        {
          maxImageCount: 5,
          tagStatus: TagStatus.ANY,
        },
        {
          maxImageAge: cdk.Duration.days(1),
          tagStatus: TagStatus.UNTAGGED,
        }
      ]
    })

    new cdk.CfnOutput(this, 'EcrRepositoryUri', {
      value: repository.repositoryUri,
      description: 'ECR Repository URI',
    });
  }
}
