import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'
import { tags, resourceOptions } from './tags'
import { vpcId } from './vpc'

const stack = pulumi.getStack()

const albSg = new aws.ec2.SecurityGroup(
  'link-shorter-alb-sg',
  {
    vpcId,
    description: 'Allow HTTP inbound traffic to ALB',
    ingress: [
      {
        protocol: 'tcp',
        fromPort: 80,
        toPort: 80,
        cidrBlocks: ['0.0.0.0/0'],
        description: 'HTTP from anywhere',
      },
    ],
    egress: [
      {
        protocol: '-1',
        fromPort: 0,
        toPort: 0,
        cidrBlocks: ['0.0.0.0/0'],
        description: 'All outbound traffic',
      },
    ],
    tags: { ...tags, Name: `link-shorter-alb-sg-${stack}` },
  },
  resourceOptions
)

const ecsSg = new aws.ec2.SecurityGroup(
  'link-shorter-ecs-sg',
  {
    vpcId,
    description: 'Allow traffic from ALB to ECS tasks',
    ingress: [
      {
        protocol: 'tcp',
        fromPort: 3001,
        toPort: 3001,
        securityGroups: [albSg.id],
        description: 'App port from ALB only',
      },
    ],
    egress: [
      {
        protocol: '-1',
        fromPort: 0,
        toPort: 0,
        cidrBlocks: ['0.0.0.0/0'],
        description: 'All outbound traffic',
      },
    ],
    tags: { ...tags, Name: `link-shorter-ecs-sg-${stack}` },
  },
  resourceOptions
)

export const albSecurityGroupId = albSg.id
export const ecsSecurityGroupId = ecsSg.id
