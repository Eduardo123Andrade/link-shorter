import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'
import { tags, resourceOptions } from './tags'

const stack = pulumi.getStack()

const vpc = new aws.ec2.Vpc(
  'link-shorter-vpc',
  {
    cidrBlock: '10.0.0.0/16',
    enableDnsHostnames: true,
    enableDnsSupport: true,
    tags: { ...tags, Name: `link-shorter-vpc-${stack}` },
  },
  resourceOptions
)

const igw = new aws.ec2.InternetGateway(
  'link-shorter-igw',
  {
    vpcId: vpc.id,
    tags: { ...tags, Name: `link-shorter-igw-${stack}` },
  },
  resourceOptions
)

const publicSubnetA = new aws.ec2.Subnet(
  'link-shorter-subnet-a',
  {
    vpcId: vpc.id,
    cidrBlock: '10.0.1.0/24',
    availabilityZone: 'us-east-2a',
    mapPublicIpOnLaunch: true,
    tags: { ...tags, Name: `link-shorter-subnet-a-${stack}` },
  },
  resourceOptions
)

const publicSubnetB = new aws.ec2.Subnet(
  'link-shorter-subnet-b',
  {
    vpcId: vpc.id,
    cidrBlock: '10.0.2.0/24',
    availabilityZone: 'us-east-2b',
    mapPublicIpOnLaunch: true,
    tags: { ...tags, Name: `link-shorter-subnet-b-${stack}` },
  },
  resourceOptions
)

const publicSubnetC = new aws.ec2.Subnet(
  'link-shorter-subnet-c',
  {
    vpcId: vpc.id,
    cidrBlock: '10.0.3.0/24',
    availabilityZone: 'us-east-2c',
    mapPublicIpOnLaunch: true,
    tags: { ...tags, Name: `link-shorter-subnet-c-${stack}` },
  },
  resourceOptions
)

const routeTable = new aws.ec2.RouteTable(
  'link-shorter-rt',
  {
    vpcId: vpc.id,
    routes: [
      {
        cidrBlock: '0.0.0.0/0',
        gatewayId: igw.id,
      },
    ],
    tags: { ...tags, Name: `link-shorter-rt-${stack}` },
  },
  resourceOptions
)

new aws.ec2.RouteTableAssociation('link-shorter-rta-a', {
  subnetId: publicSubnetA.id,
  routeTableId: routeTable.id,
})

new aws.ec2.RouteTableAssociation('link-shorter-rta-b', {
  subnetId: publicSubnetB.id,
  routeTableId: routeTable.id,
})

new aws.ec2.RouteTableAssociation('link-shorter-rta-c', {
  subnetId: publicSubnetC.id,
  routeTableId: routeTable.id,
})

export const vpcId = vpc.id
export const publicSubnetIds = [publicSubnetA.id, publicSubnetB.id, publicSubnetC.id]
