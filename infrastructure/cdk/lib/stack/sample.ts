import * as cdk from 'aws-cdk-lib'
import * as eb from 'aws-cdk-lib/aws-elasticbeanstalk'
import * as route53 from 'aws-cdk-lib/aws-route53'
import { Construct } from 'constructs'

/**
 * シンプルなElastic BeanstalkとRoute53を含むスタック
 */
export class SimpleApiServerStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props)

        // Elastic Beanstalkアプリケーション
        const ebApplication = new eb.CfnApplication(this, 'SimpleApiApplication', {
            applicationName: 'simple-api-server'
        })

        // Elastic Beanstalk環境
        const ebEnvironment = new eb.CfnEnvironment(this, 'SimpleApiEnvironment', {
            applicationName: ebApplication.ref,
            environmentName: 'simple-api-server-env',
            cnamePrefix: 'simple-api-server',
            description: 'Simple API Server Environment',
            solutionStackName: '64bit Amazon Linux 2023 v6.5.1 running Node.js 20',
                optionSettings: [
                // 基本的な設定のみ
                {
                    namespace: 'aws:autoscaling:launchconfiguration',
                    optionName: 'InstanceType',
                    value: 't3.micro'
                },
                {
                    namespace: 'aws:autoscaling:asg',
                    optionName: 'MinSize',
                    value: '1'
                },
                {
                    namespace: 'aws:autoscaling:asg',
                    optionName: 'MaxSize',
                    value: '2'
                },
                {
                    namespace: 'aws:elasticbeanstalk:environment',
                    optionName: 'LoadBalancerType',
                    value: 'application'
                }
            ]
        })

        // Route53 Hosted Zone（例として）
        const hostedZone = new route53.HostedZone(this, 'SimpleApiHostedZone', {
            zoneName: 'simple-api.example.com'
        })

        // Route53 CNAMEレコード - EB環境のエンドポイントを直接指定
        new route53.CnameRecord(this, 'SimpleApiCnameRecord', {
            zone: hostedZone,
            recordName: 'api',
            domainName: `${ebEnvironment.attrEndpointUrl}`
        })

        // 出力
        new cdk.CfnOutput(this, 'ApiUrl', {
            value: `http://${ebEnvironment.attrEndpointUrl}`,
            description: 'API Server URL'
        })

        new cdk.CfnOutput(this, 'HostedZoneName', {
            value: hostedZone.zoneName,
            description: 'Hosted Zone Name'
        })
    }
}
