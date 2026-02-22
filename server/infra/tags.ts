import * as pulumi from '@pulumi/pulumi'

const stack = pulumi.getStack()

export const tags: Record<string, string> = {
  Environment: stack.toUpperCase(),
  IaC: 'true',
  Project: 'ftr-d1-link-shorter',
  CreatedAt: new Date().toISOString(),
}

// Use this for resources to prevent CreatedAt from being updated on each pulumi up
export const resourceOptions: pulumi.CustomResourceOptions = {
  ignoreChanges: ['tags.CreatedAt'],
}
