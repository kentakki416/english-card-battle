import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";
import { AwsProvider } from "./.gen/providers/aws/provider";
import { Vpc } from "./.gen/providers/aws/vpc";
import { Route53Zone } from "./.gen/providers/aws/route53-zone";

class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new AwsProvider(this, "Aws", {
      region: "ap-northeast-1",
    });

    new Vpc(this, "Vpc", {
      cidrBlock: "10.0.0.0/16",
      tags: {
        Name: "english-card-battle-vpc",
      },
      // tagsAll: {
      //   Name: "english-card-battle-vpc",
      // },
    })

    new Route53Zone(this, "Route53Zone", {
      name: "english-card-battle-test.com",
      comment: "",
      forceDestroy: false,
    })
  }
}

const app = new App();
new MyStack(app, "cdk-terraform");
app.synth();
