import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'
import { tags, resourceOptions } from './tags'
import { publicSubnetIds } from './vpc'
import { ecsSecurityGroupId } from './security-groups'
import { executionRoleArn, taskRoleArn } from './iam'
import { targetGroupArn } from './alb'
import { repositoryUrl } from './ecr'
import { webCloudfrontUrl } from './website'
import { reportsBucketName, reportsCloudfrontUrl } from './reports'

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

// Env vars estáticos: lidos do process.env (GitHub Secrets via Pulumi)
const staticEnv = ['PORT', 'NODE_ENV', 'DATABASE_URL'].map((key) => ({
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
    // URLs dinâmicas vêm dos outputs do CloudFront — sem secrets necessários
    containerDefinitions: pulumi
      .all([repositoryUrl, webCloudfrontUrl, reportsBucketName, reportsCloudfrontUrl])
      .apply(([repoUrl, frontendUrl, bucketName, reportsUrl]) =>
        JSON.stringify([
          {
            name: containerName,
            image: `${repoUrl}:latest`,
            essential: true,
            portMappings: [{ containerPort: 3001, protocol: 'tcp' }],
            environment: [
              ...staticEnv,
              { name: 'FRONTEND_BASE_URL', value: frontendUrl },
              { name: 'REPORTS_BUCKET_NAME', value: bucketName },
              { name: 'CLOUDFRONT_REPORTS_URL', value: reportsUrl },
            ],
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
