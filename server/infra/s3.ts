import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'
import { tags, resourceOptions } from './tags'

const stack = pulumi.getStack()

const bucket = new aws.s3.BucketV2(
  'link-shorter-bucket',
  {
    bucket: `link-shorter-${stack}`,
    tags,
  },
  resourceOptions
)

new aws.s3.BucketPublicAccessBlock('link-shorter-bucket-public-access', {
  bucket: bucket.id,
  blockPublicAcls: true,
  blockPublicPolicy: true,
  ignorePublicAcls: true,
  restrictPublicBuckets: true,
})


export const bucketName = bucket.id
export const bucketArn = bucket.arn
export const pulumiBackendUrl = pulumi.interpolate`s3://${bucket.id}/IaC`
