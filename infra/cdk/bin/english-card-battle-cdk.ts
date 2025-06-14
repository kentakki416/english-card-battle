#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DevStack } from '../lib/dev-stack';

const app = new cdk.App();
new DevStack(app, 'EnglishCardBattleDevStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'ap-northeast-1'
  },
  description: 'English Card Battle Dev Environment'
}); 
