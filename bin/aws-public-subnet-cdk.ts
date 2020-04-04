#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AwsPublicSubnetCdkStack } from '../lib/aws-public-subnet-cdk-stack';

const app = new cdk.App();
new AwsPublicSubnetCdkStack(app, 'AwsPublicSubnetCdkStack');
