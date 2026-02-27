import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'
import { tags, resourceOptions } from './tags'
import { reportsBucketArn } from './reports'

const stack = pulumi.getStack()

const ecsAssumeRolePolicy = JSON.stringify({
  Version: '2012-10-17',
  Statement: [
    {
      Effect: 'Allow',
      Principal: { Service: 'ecs-tasks.amazonaws.com' },
      Action: 'sts:AssumeRole',
    },
  ],
})

const executionRole = new aws.iam.Role(
  'link-shorter-ecs-execution-role',
  {
    name: `link-shorter-ecs-execution-${stack}`,
    assumeRolePolicy: ecsAssumeRolePolicy,
    tags,
  },
  resourceOptions
)

new aws.iam.RolePolicyAttachment('link-shorter-ecs-execution-policy', {
  role: executionRole.name,
  policyArn: 'arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy',
})

const taskRole = new aws.iam.Role(
  'link-shorter-ecs-task-role',
  {
    name: `link-shorter-ecs-task-${stack}`,
    assumeRolePolicy: ecsAssumeRolePolicy,
    tags,
  },
  resourceOptions
)

new aws.iam.RolePolicy(
  'task-s3-reports-policy',
  {
    role: taskRole.id,
    policy: reportsBucketArn.apply((arn) =>
      JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Action: ['s3:PutObject'],
            Resource: `${arn}/reports/*`,
          },
        ],
      })
    ),
  },
  resourceOptions
)

export const executionRoleArn = executionRole.arn
export const taskRoleArn = taskRole.arn
