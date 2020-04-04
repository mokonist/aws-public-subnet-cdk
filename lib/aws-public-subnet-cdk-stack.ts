import { Stack, Construct, StackProps } from "@aws-cdk/core";
import {
  CfnVPC,
  CfnRouteTable,
  CfnSubnet,
  CfnInternetGateway,
  CfnVPCGatewayAttachment,
  CfnRoute,
  CfnSubnetRouteTableAssociation,
} from "@aws-cdk/aws-ec2";

export class AwsPublicSubnetCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new CfnVPC(this, "vpc", {
      cidrBlock: "10.0.0.0/16",
      enableDnsHostnames: true,
      enableDnsSupport: true,
      tags: [{ key: "Name", value: "vpc" }],
    });

    const publicSubnet = new CfnSubnet(this, "subnet", {
      vpcId: vpc.ref,
      cidrBlock: "10.0.0.0/24",
      availabilityZone: this.availabilityZones[0],
      mapPublicIpOnLaunch: true,
      tags: [{ key: "Name", value: "subnet" }],
    });

    const igw = new CfnInternetGateway(this, "igw", {
      tags: [{ key: "Name", value: "igw" }],
    });

    const igwAttach = new CfnVPCGatewayAttachment(this, "igw-attach", {
      vpcId: vpc.ref,
      internetGatewayId: igw.ref,
    });

    const publicRouteTable = new CfnRouteTable(this, "public-route", {
      vpcId: vpc.ref,
    });

    const igwRoute = new CfnRoute(this, "public-route-igw", {
      routeTableId: publicRouteTable.ref,
      destinationCidrBlock: "0.0.0.0/0",
      gatewayId: igw.ref,
    });

    const association = new CfnSubnetRouteTableAssociation(this, "public-route-association", {
      routeTableId: publicRouteTable.ref,
      subnetId: publicSubnet.ref,
    });
  }
}
