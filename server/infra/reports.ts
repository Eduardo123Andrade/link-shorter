import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'
import { tags, resourceOptions } from './tags'

const stack = pulumi.getStack()

const reportsBucket = new aws.s3.BucketV2(
  'reports-bucket',
  {
    bucket: `link-shorter-reports-${stack}`,
    tags,
  },
  resourceOptions
)

new aws.s3.BucketPublicAccessBlock(
  'reports-public-access-block',
  {
    bucket: reportsBucket.id,
    blockPublicAcls: true,
    blockPublicPolicy: true,
    ignorePublicAcls: true,
    restrictPublicBuckets: true,
  },
  resourceOptions
)

new aws.s3.BucketLifecycleConfigurationV2(
  'reports-lifecycle',
  {
    bucket: reportsBucket.id,
    rules: [
      {
        id: 'delete-after-24h',
        status: 'Enabled',
        expiration: { days: 1 },
        filter: { prefix: '' },
      },
    ],
  },
  resourceOptions
)

const reportsOac = new aws.cloudfront.OriginAccessControl(
  'reports-oac',
  {
    name: `link-shorter-reports-oac-${stack}`,
    originAccessControlOriginType: 's3',
    signingBehavior: 'always',
    signingProtocol: 'sigv4',
  },
  resourceOptions
)

const reportsCf = new aws.cloudfront.Distribution(
  'reports-cf',
  {
    origins: [
      {
        domainName: reportsBucket.bucketRegionalDomainName,
        originId: 'reports-s3-origin',
        originAccessControlId: reportsOac.id,
      },
    ],
    enabled: true,
    defaultCacheBehavior: {
      targetOriginId: 'reports-s3-origin',
      viewerProtocolPolicy: 'https-only',
      allowedMethods: ['GET', 'HEAD'],
      cachedMethods: ['GET', 'HEAD'],
      forwardedValues: {
        queryString: false,
        cookies: { forward: 'none' },
      },
      // TTL 0: cada CSV tem nome único (UUID), sem benefício de cache
      minTtl: 0,
      defaultTtl: 0,
      maxTtl: 0,
    },
    restrictions: {
      geoRestriction: { restrictionType: 'none' },
    },
    viewerCertificate: {
      cloudfrontDefaultCertificate: true,
    },
    tags,
  },
  resourceOptions
)

new aws.s3.BucketPolicy(
  'reports-bucket-policy',
  {
    bucket: reportsBucket.id,
    policy: pulumi.all([reportsBucket.arn, reportsCf.arn]).apply(
      ([bucketArn, cfArn]) =>
        JSON.stringify({
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: { Service: 'cloudfront.amazonaws.com' },
              Action: 's3:GetObject',
              Resource: `${bucketArn}/*`,
              Condition: {
                StringEquals: { 'AWS:SourceArn': cfArn },
              },
            },
          ],
        })
    ),
  },
  resourceOptions
)

export const reportsBucketName = reportsBucket.id
export const reportsBucketArn = reportsBucket.arn
export const reportsCloudfrontUrl = reportsCf.domainName.apply(
  (d) => `https://${d}`
)
