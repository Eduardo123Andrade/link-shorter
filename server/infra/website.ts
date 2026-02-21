import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'
import { tags, resourceOptions } from './tags'

const stack = pulumi.getStack()

const websiteBucket = new aws.s3.BucketV2(
  'link-shorter-web',
  {
    bucket: `link-shorter-web-${stack}`,
    tags,
  },
  resourceOptions
)

const publicAccessBlock = new aws.s3.BucketPublicAccessBlock(
  'link-shorter-web-public-access',
  {
    bucket: websiteBucket.id,
    blockPublicAcls: false,
    blockPublicPolicy: false,
    ignorePublicAcls: false,
    restrictPublicBuckets: false,
  },
  resourceOptions
)

new aws.s3.BucketWebsiteConfigurationV2(
  'link-shorter-web-config',
  {
    bucket: websiteBucket.id,
    indexDocument: { suffix: 'index.html' },
    errorDocument: { key: '404.html' },
  },
  resourceOptions
)

new aws.s3.BucketPolicy(
  'link-shorter-web-policy',
  {
    bucket: websiteBucket.id,
    policy: websiteBucket.arn.apply((arn) =>
      JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: '*',
            Action: 's3:GetObject',
            Resource: `${arn}/*`,
          },
        ],
      })
    ),
  },
  { ...resourceOptions, dependsOn: [publicAccessBlock] }
)

export const websiteBucketName = websiteBucket.id
export const websiteUrl = pulumi.interpolate`http://${websiteBucket.id}.s3-website-us-east-2.amazonaws.com`
