import * as cdk from "@aws-cdk/core";
import * as iam from "@aws-cdk/aws-iam";
import * as s3 from "@aws-cdk/aws-s3";
import * as lambda from "@aws-cdk/aws-lambda";
import * as eventsources from "@aws-cdk/aws-lambda-event-sources";
import * as kms from "@aws-cdk/aws-kms";
import * as assert from "assert";
// import { join } from "path";
// import { Code, Runtime } from "aws-cdk-lib/aws-lambda";

export class LambdaTriggerStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // const key = new kms.Key(this, 'my-kms-key', {
    //   removalPolicy: cdk.RemovalPolicy.DESTROY,
    //   enableKeyRotation: false,
    // })

    const bucket = new s3.Bucket(this, "triggerBucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      encryption: s3.BucketEncryption.KMS,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });
    assert(bucket.encryptionKey instanceof kms.Key);

    const triggerRole = new iam.Role(this, "MyRole", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    });

    // triggerRole.addManagedPolicy(
    //   iam.ManagedPolicy.fromAwsManagedPolicyName(
    //     "service-role/AWSLambdaS3AccessExecutionRole"
    //   )
    // );

    const fn = new lambda.Function(this, "trigger", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("src"),
      handler: "index.handler",
      role: triggerRole,
    });

    fn.addEventSource(
      new eventsources.S3EventSource(bucket, {
        events: [s3.EventType.OBJECT_CREATED],
      })
    );
    bucket.grantReadWrite(fn);
  }
}
