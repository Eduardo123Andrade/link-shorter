import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'
import { tags, resourceOptions } from './tags'

const stack = pulumi.getStack()

const websiteBucket = new aws.s3.BucketV2(
  'link-shorter-web',
  {
    bucket: `link-shorter-web-${stack}`,
    forceDestroy: true,
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
    errorDocument: { key: 'index.html' },
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

// CloudFront em frente ao S3 website para HTTPS + SPA routing
const websiteEndpoint = pulumi.interpolate`${websiteBucket.id}.s3-website.us-east-2.amazonaws.com`

const webCf = new aws.cloudfront.Distribution(
  'web-cf',
  {
    origins: [
      {
        domainName: websiteEndpoint,
        originId: 'web-s3-website-origin',
        customOriginConfig: {
          httpPort: 80,
          httpsPort: 443,
          originProtocolPolicy: 'http-only',
          originSslProtocols: ['TLSv1.2'],
        },
      },
    ],
    enabled: true,
    defaultRootObject: 'index.html',
    defaultCacheBehavior: {
      targetOriginId: 'web-s3-website-origin',
      viewerProtocolPolicy: 'redirect-to-https',
      allowedMethods: ['GET', 'HEAD'],
      cachedMethods: ['GET', 'HEAD'],
      forwardedValues: {
        queryString: false,
        cookies: { forward: 'none' },
      },
      minTtl: 0,
      defaultTtl: 86400,
      maxTtl: 31536000,
    },
    // SPA routing: qualquer 4xx do S3 devolve index.html com 200
    customErrorResponses: [
      {
        errorCode: 403,
        responseCode: 200,
        responsePagePath: '/index.html',
        errorCachingMinTtl: 0,
      },
      {
        errorCode: 404,
        responseCode: 200,
        responsePagePath: '/index.html',
        errorCachingMinTtl: 0,
      },
    ],
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

export const websiteBucketName = websiteBucket.id
export const websiteUrl = pulumi.interpolate`http://${websiteBucket.id}.s3-website.us-east-2.amazonaws.com`
export const webCloudfrontUrl = webCf.domainName.apply((d) => `https://${d}`)
