import * as aws from '@pulumi/aws'
import { tags, resourceOptions } from './tags'
import { albDnsName } from './alb'

const apiCf = new aws.cloudfront.Distribution(
  'api-cf',
  {
    origins: [
      {
        domainName: albDnsName,
        originId: 'api-alb-origin',
        customOriginConfig: {
          httpPort: 80,
          httpsPort: 443,
          originProtocolPolicy: 'http-only',
          originSslProtocols: ['TLSv1.2'],
        },
      },
    ],
    enabled: true,
    defaultCacheBehavior: {
      targetOriginId: 'api-alb-origin',
      viewerProtocolPolicy: 'redirect-to-https',
      allowedMethods: ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT'],
      cachedMethods: ['GET', 'HEAD'],
      // Encaminha todos os headers para suportar WebSocket (Upgrade, Connection) e CORS
      forwardedValues: {
        queryString: true,
        headers: ['*'],
        cookies: { forward: 'all' },
      },
      // TTL 0: API não deve ser cacheada
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

export const apiCloudfrontUrl = apiCf.domainName.apply((d) => `https://${d}`)
