#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { EksS3Stack } from "../lib/eks-s3-stack";

const app = new cdk.App();
new EksS3Stack(app, "EksS3Stack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.AWS_DEFAULT_REGION,
  },
});
