import * as cdk from "aws-cdk-lib"
import { Peer, Port, SecurityGroup, Vpc } from "aws-cdk-lib/aws-ec2"
import { Cluster, ContainerImage, FargateService, FargateTaskDefinition, LogDriver, Protocol } from "aws-cdk-lib/aws-ecs"
import { ApplicationLoadBalancer } from "aws-cdk-lib/aws-elasticloadbalancingv2"
import { ManagedPolicy, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam"
import { Construct } from "constructs"

interface EcsProps extends cdk.StackProps {
  vpc: Vpc,
  cpu: number
  memoryLimitMiB: number
  containerPort: number
  hostPort: number
  desiredCount: number
  maxHealthyPercent: number
  minHealthyPercent: number
  enableExecuteCommand: boolean
}

export class EcsConstruct extends Construct {
  constructor(scope: Construct, id: string, props: EcsProps) {
    super(scope, id)

    // ALBのセキュリティグループの設定
    const securityGroupForAlb = new SecurityGroup(this, "SgAlb", {
      vpc: props.vpc,
      allowAllOutbound: false,
    })
    securityGroupForAlb.addIngressRule(Peer.anyIpv4(), Port.tcp(80))
    // MEMO: 証明書作成後は以下に変更
    // securityGroupForAlb.addIngressRule(Peer.anyIpv4(), Port.tcp(443))
    securityGroupForAlb.addEgressRule(Peer.anyIpv4(), Port.allTcp())

    // ALBの設定
    const albForApp = new ApplicationLoadBalancer(this, "Alb", {
      vpc: props.vpc,
      internetFacing: true,
      securityGroup: securityGroupForAlb,
      vpcSubnets: props.vpc.selectSubnets({
        subnetGroupName: "Public",
      }),
    })

    // ECSクラスターの設定
    const cluster = new Cluster(this, "EcsCluster", {
      vpc: props.vpc,
      containerInsights: true,
    })

    // タスク実行ロールの設定
    const executionRole = new Role(this, "EcsTaskExecutionRole", {
      assumedBy: new ServicePrincipal("ecs-tasks.amazonaws.com"),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AmazonECSTaskExecutionRolePolicy"
        )
      ]
    })

    // タスクロールの設定
    const taskRole = new Role(this, "EcsServiceTaskRole", {
      assumedBy: new ServicePrincipal("ecs-tasks.amazonaws.com"),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName("AmazonSSMFullAccess")
      ]
    })

    // タスク定義の設定
    const taskDefinition = new FargateTaskDefinition(this, "TaskDefinition", {
      cpu: props.cpu,
      memoryLimitMiB: props.memoryLimitMiB,
      executionRole,
      taskRole,
    })
    taskDefinition.addContainer("api", {
      image: ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
      logging: LogDriver.awsLogs({
        streamPrefix: "englishCardBattle"
      })
    }).addPortMappings({
      containerPort: props.containerPort,
      hostPort: props.hostPort,
      protocol: Protocol.TCP
    })

    // Fargateのセキュリティグループの設定
    const securityGroupForFargate = new SecurityGroup(this, "SgFargate", {
      vpc: props.vpc,
      allowAllOutbound: false,
    })
    securityGroupForFargate.addIngressRule(securityGroupForAlb, Port.tcp(80))
    securityGroupForFargate.addEgressRule(Peer.anyIpv4(), Port.allTcp())

    // Fargateサービスの設定
    const fargateService = new FargateService(this, "FargateService", {
      cluster,
      vpcSubnets: props.vpc.selectSubnets({ subnetGroupName: "Private" }), // プライベートサブネットに配置
      securityGroups: [securityGroupForFargate],
      taskDefinition,
      desiredCount: props.desiredCount,
      maxHealthyPercent: props.maxHealthyPercent,
      minHealthyPercent: props.minHealthyPercent,
      enableExecuteCommand: props.enableExecuteCommand, // コンテナの実行コマンドを有効化
    })

    // ALBのリスナーの設定
    albForApp.addListener("AlbListener", {
      port: 80,
    }).addTargets("FromAppTargetGroup", {
      port: 80,
      targets: [fargateService],
    })

    new cdk.CfnOutput(this, "LoadBalancerDNS", {
      value: albForApp.loadBalancerDnsName,
    })
  }
}
