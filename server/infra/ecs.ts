import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'
import { tags, resourceOptions } from './tags'
import { publicSubnetIds } from './vpc'
import { ecsSecurityGroupId } from './security-groups'
import { executionRoleArn, taskRoleArn } from './iam'
import { targetGroupArn } from './alb'
import { repositoryUrl } from './ecr'

const stack = pulumi.getStack()

const cluster = new aws.ecs.Cluster(
  'link-shorter-cluster',
  {
    name: `link-shorter-cluster-${stack}`,
    tags,
  },
  resourceOptions
)

const containerName = `link-shorter-${stack}`

const envKeys = [
  'PORT',
  'NODE_ENV',
  'DATABASE_URL',
  'FRONTEND_BASE_URL',
]

const environment = envKeys.map((key) => ({
  name: key,
  value: process.env[key] ?? '',
}))

const taskDefinition = new aws.ecs.TaskDefinition(
  'link-shorter-task',
  {
    family: `link-shorter-${stack}`,
    cpu: '256',
    memory: '512',
    networkMode: 'awsvpc',
    requiresCompatibilities: ['FARGATE'],
    executionRoleArn,
    taskRoleArn,
    containerDefinitions: repositoryUrl.apply((repoUrl) =>
      JSON.stringify([
        {
          name: containerName,
          image: `${repoUrl}:latest`,
          essential: true,
          portMappings: [
            {
              containerPort: 3001,
              protocol: 'tcp',
            },
          ],
          environment,
        },
      ])
    ),
    tags,
  },
  resourceOptions
)

const service = new aws.ecs.Service(
  'link-shorter-service',
  {
    name: `link-shorter-service-${stack}`,
    cluster: cluster.arn,
    taskDefinition: taskDefinition.arn,
    desiredCount: 1,
    launchType: 'FARGATE',
    networkConfiguration: {
      subnets: publicSubnetIds,
      securityGroups: [ecsSecurityGroupId],
      assignPublicIp: true,
    },
    loadBalancers: [
      {
        targetGroupArn,
        containerName,
        containerPort: 3001,
      },
    ],
    tags,
  },
  {
    ...resourceOptions,
    ignoreChanges: [...(resourceOptions.ignoreChanges || []), 'taskDefinition', 'desiredCount'],
  }
)

export const clusterName = cluster.name
export const serviceName = service.name
export const taskDefinitionArn = taskDefinition.arn
