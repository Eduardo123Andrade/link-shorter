import * as pulumi from '@pulumi/pulumi'

const env = pulumi.getStack()
const baseRef = new pulumi.StackReference(`organization/link-shorter-base/${env}`)

export const repositoryUrl = baseRef.getOutput('repositoryUrl') as pulumi.Output<string>
export const repositoryName = baseRef.getOutput('repositoryName') as pulumi.Output<string>
export const vpcId = baseRef.getOutput('vpcId') as pulumi.Output<string>
export const publicSubnetIds = baseRef.getOutput('publicSubnetIds') as pulumi.Output<string[]>
