import * as cdk from 'aws-cdk-lib'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import { Construct } from 'constructs'

import { Environment } from '../../parameter'

interface DynamoStackProps extends cdk.StackProps {
  environment: Environment
}

export class DynamoStack extends cdk.Stack {
  readonly userTable: dynamodb.Table
  readonly gameTable: dynamodb.Table

  constructor(scope: Construct, id: string, props: DynamoStackProps) {
    super(scope, id, props)

    // const parameters = getEnvironmentParameters(props.environment) // 現在未使用

    // User Table
    this.userTable = new dynamodb.Table(this, 'UserTable', {
      tableName: `${props.environment}-users`,
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: props.environment === 'prd'
        ? cdk.RemovalPolicy.RETAIN
        : cdk.RemovalPolicy.DESTROY,
    })

    // Game Table
    this.gameTable = new dynamodb.Table(this, 'GameTable', {
      tableName: `${props.environment}-games`,
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'timestamp',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: props.environment === 'prd'
        ? cdk.RemovalPolicy.RETAIN
        : cdk.RemovalPolicy.DESTROY,
    })

    // Export table names for other stacks
    new cdk.CfnOutput(this, 'UserTableName', {
      value: this.userTable.tableName,
      exportName: `${props.environment}-user-table-name`,
    })

    new cdk.CfnOutput(this, 'GameTableName', {
      value: this.gameTable.tableName,
      exportName: `${props.environment}-game-table-name`,
    })

    new cdk.CfnOutput(this, 'UserTableArn', {
      value: this.userTable.tableArn,
      exportName: `${props.environment}-user-table-arn`,
    })

    new cdk.CfnOutput(this, 'GameTableArn', {
      value: this.gameTable.tableArn,
      exportName: `${props.environment}-game-table-arn`,
    })
  }
}
