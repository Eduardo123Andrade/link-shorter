import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'
import { tags, resourceOptions } from './tags'
import { vpcId, publicSubnetIds } from './stack-reference'
import { albSecurityGroupId } from './security-groups'

const stack = pulumi.getStack()

const alb = new aws.lb.LoadBalancer(
  'link-shorter-alb',
  {
    name: `link-shorter-alb-${stack}`,
    internal: false,
    loadBalancerType: 'application',
    securityGroups: [albSecurityGroupId],
    subnets: publicSubnetIds,
    tags,
  },
  resourceOptions
)

const targetGroup = new aws.lb.TargetGroup(
  'link-shorter-tg',
  {
    name: `link-shorter-tg-${stack}`,
    port: 3001,
    protocol: 'HTTP',
    targetType: 'ip',
    vpcId,
    healthCheck: {
      enabled: true,
      path: '/health',
      port: '3001',
      protocol: 'HTTP',
      healthyThreshold: 2,
      unhealthyThreshold: 3,
      timeout: 5,
      interval: 30,
      matcher: '200',
    },
    tags,
  },
  resourceOptions
)

new aws.lb.Listener(
  'link-shorter-listener',
  {
    loadBalancerArn: alb.arn,
    port: 80,
    protocol: 'HTTP',
    defaultActions: [
      {
        type: 'forward',
        targetGroupArn: targetGroup.arn,
      },
    ],
    tags,
  },
  resourceOptions
)

export const albDnsName = alb.dnsName
export const albArn = alb.arn
export const targetGroupArn = targetGroup.arn
export const publicUrl = pulumi.interpolate`http://${alb.dnsName}`
