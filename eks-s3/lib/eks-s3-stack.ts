import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";

export class EksS3Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.createBucket();
    this.createCluster();
  }

  private createBucket() {
    const { aws_s3: s3 } = cdk;

    const bucket = new s3.Bucket(this, "ArtifactsBucket", {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // in production, data should be retained
    });

    new cdk.CfnOutput(this, "BucketName", {
      value: bucket.bucketName,
      description: "Artifact bucket name",
    });
  }

  private async createCluster() {
    const { aws_eks: eks, aws_ec2: ec2, aws_iam: iam } = cdk;

    const cluster = new eks.Cluster(this, "EKSCluster", {
      version: eks.KubernetesVersion.V1_31,
      defaultCapacity: 1,
      defaultCapacityInstance: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.SMALL
      ), // runs cost effective instance for demo
    });

    // add current user to the system:masters group
    const stsClient = new STSClient({ region: this.region });
    const command = new GetCallerIdentityCommand({});
    try {
      const { Arn } = await stsClient.send(command);
      if (!Arn) throw Error("No user ARN found");
      cluster.awsAuth.addUserMapping(iam.User.fromUserArn(this, "User", Arn), {
        groups: ["system:masters"],
      });
    } catch (err) {
      console.error("Error getting caller identity", err);
    }

    new cdk.CfnOutput(this, "ClusterName", {
      value: cluster.clusterName,
      description: "EKS cluster name",
    });

    new cdk.CfnOutput(this, "KubeCommand", {
      value: `aws eks --region ${this.region} update-kubeconfig --name ${cluster.clusterName}`,
    });
  }
}
