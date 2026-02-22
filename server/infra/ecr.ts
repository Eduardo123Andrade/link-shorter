import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'
import { tags, resourceOptions } from './tags'

const stack = pulumi.getStack()
const repoName = `link-shorter-${stack}`

const repository = new aws.ecr.Repository(
  'link-shorter',
  {
    name: repoName,
    imageTagMutability: 'IMMUTABLE',
    imageScanningConfiguration: {
      scanOnPush: true,
    },
    forceDelete: true,
    tags,
  },
  resourceOptions
)

new aws.ecr.LifecyclePolicy('link-shorter-lifecycle', {
  repository: repository.name,
  policy: JSON.stringify({
    rules: [
      {
        rulePriority: 1,
        description: 'Remove untagged images after 1 day',
        selection: {
          tagStatus: 'untagged',
          countType: 'sinceImagePushed',
          countUnit: 'days',
          countNumber: 1,
        },
        action: {
          type: 'expire',
        },
      },
      {
        rulePriority: 2,
        description: 'Keep only the last 5 tagged images',
        selection: {
          tagStatus: 'tagged',
          tagPatternList: ['*'],
          countType: 'imageCountMoreThan',
          countNumber: 5,
        },
        action: {
          type: 'expire',
        },
      },
    ],
  }),
})

export const repositoryUrl = repository.repositoryUrl
export const repositoryName = repository.name
