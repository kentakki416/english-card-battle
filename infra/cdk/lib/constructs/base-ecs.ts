import * as cdk from 'aws-cdk-lib'
import { Peer, Port, SecurityGroup, Vpc } from 'aws-cdk-lib/aws-ec2'
import { Cluster, ContainerImage, ContainerInsights, FargateService, FargateTaskDefinition, LogDriver, Protocol, Secret } from 'aws-cdk-lib/aws-ecs'
import { ApplicationLoadBalancer } from 'aws-cdk-lib/aws-elasticloadbalancingv2'
import { IManagedPolicy, ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs'

interface BaseEcsProps {
  vpc: Vpc
  cpu: number
  memoryLimitMiB: number
  containerPort: number
  hostPort: number
  desiredCount: number
  maxHealthyPercent: number
  minHealthyPercent: number
  enableExecuteCommand: boolean
  serviceName: string
  containerName: string
  image: ContainerImage
  logPrefix: string
  // アプリケーション固有の設定
  additionalSecurityGroups?: SecurityGroup[]
  additionalTaskRolePolicies?: IManagedPolicy[]
  additionalExecutionRolePolicies?: IManagedPolicy[]
  environmentVariables?: { [key: string]: string }
  secrets?: { [key: string]: Secret }
}

export class BaseEcsConstruct extends Construct {
  readonly cluster: Cluster
  readonly service: FargateService
  readonly alb: ApplicationLoadBalancer
  readonly taskDefinition: FargateTaskDefinition

  constructor(scope: Construct, id: string, props: BaseEcsProps) {
    super(scope, id)

    // ALBのセキュリティグループの設定
    const securityGroupForAlb = new SecurityGroup(this, 'SgAlb', {
      vpc: props.vpc,
      allowAllOutbound: false,
    })
    securityGroupForAlb.addIngressRule(Peer.anyIpv4(), Port.tcp(80))
    securityGroupForAlb.addEgressRule(Peer.anyIpv4(), Port.allTcp())

    // ALBの設定
    this.alb = new ApplicationLoadBalancer(this, 'Alb', {
      vpc: props.vpc,
      internetFacing: true,
      securityGroup: securityGroupForAlb,
      vpcSubnets: props.vpc.selectSubnets({
        subnetGroupName: 'Public',
      }),
    })

    // ECSクラスターの設定
    this.cluster = new Cluster(this, 'EcsCluster', {
      vpc: props.vpc,
      containerInsightsV2: ContainerInsights.ENABLED,
    })

    // タスク実行ロールの設定
    const executionRole = new Role(this, 'EcsTaskExecutionRole', {
      assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AmazonECSTaskExecutionRolePolicy'
        )
      ]
    })

    // 追加の実行ロールポリシー
    if (props.additionalExecutionRolePolicies) {
      props.additionalExecutionRolePolicies.forEach((policy) => {
        executionRole.addManagedPolicy(policy)
      })
    }

    // タスクロールの設定
    const taskRole = new Role(this, 'EcsServiceTaskRole', {
      assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMFullAccess')
      ]
    })

    // 追加のタスクロールポリシー
    if (props.additionalTaskRolePolicies) {
      props.additionalTaskRolePolicies.forEach((policy) => {
        taskRole.addManagedPolicy(policy)
      })
    }

    // タスク定義の設定
    this.taskDefinition = new FargateTaskDefinition(this, 'TaskDefinition', {
      cpu: props.cpu,
      memoryLimitMiB: props.memoryLimitMiB,
      executionRole,
      taskRole,
    })

    // コンテナの設定
    const container = this.taskDefinition.addContainer(props.containerName, {
      image: props.image,
      logging: LogDriver.awsLogs({
        streamPrefix: props.logPrefix
      }),
      environment: props.environmentVariables,
      secrets: props.secrets,
    })

    container.addPortMappings({
      containerPort: props.containerPort,
      hostPort: props.hostPort,
      protocol: Protocol.TCP
    })

    // Fargateのセキュリティグループの設定
    const securityGroupForFargate = new SecurityGroup(this, 'SgFargate', {
      vpc: props.vpc,
      allowAllOutbound: false,
    })
    securityGroupForFargate.addIngressRule(securityGroupForAlb, Port.tcp(80))
    securityGroupForFargate.addEgressRule(Peer.anyIpv4(), Port.allTcp())

    // 追加のセキュリティグループ
    const securityGroups = [securityGroupForFargate]
    if (props.additionalSecurityGroups) {
      securityGroups.push(...props.additionalSecurityGroups)
    }

    // Fargateサービスの設定
    this.service = new FargateService(this, 'FargateService', {
      cluster: this.cluster,
      vpcSubnets: props.vpc.selectSubnets({ subnetGroupName: 'Private' }),
      securityGroups: securityGroups,
      taskDefinition: this.taskDefinition,
      desiredCount: props.desiredCount,
      maxHealthyPercent: props.maxHealthyPercent,
      minHealthyPercent: props.minHealthyPercent,
      enableExecuteCommand: props.enableExecuteCommand,
      serviceName: props.serviceName,
    })

    // ALBのリスナーの設定
    this.alb.addListener('AlbListener', {
      port: 80,
    }).addTargets('FromAppTargetGroup', {
      port: 80,
      targets: [this.service],
    })

    // 出力
    new cdk.CfnOutput(this, 'LoadBalancerDNS', {
      value: this.alb.loadBalancerDnsName,
      exportName: `${props.serviceName}-alb-dns`,
    })

    new cdk.CfnOutput(this, 'ServiceName', {
      value: this.service.serviceName,
      exportName: `${props.serviceName}-service-name`,
    })
  }
}
