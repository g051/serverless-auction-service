# Codingly.io: Base Serverless Framework Template

https://codingly.io

## What's included

- Folder structure used consistently across our projects.
- [serverless-pseudo-parameters plugin](https://www.npmjs.com/package/serverless-pseudo-parameters): Allows you to take advantage of CloudFormation Pseudo Parameters.
- [serverless-bundle plugin](https://www.npmjs.com/package/serverless-pseudo-parameters): Bundler based on the serverless-webpack plugin - requires zero configuration and fully compatible with ES6/ES7 features.

## Getting started

```
sls create --name YOUR_PROJECT_NAME --template-url https://github.com/codingly-io/sls-base
cd YOUR_PROJECT_NAME
npm install
```

You are ready to go!

## Prerequisites

- AWS account
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

```
$ aws configure
AWS Access Key ID [None]: *YourAccessKey*
AWS Secret Access Key [None]: *YourSecretKey*
Default region name [None]: ap-southeast-1
Default output format [None]: yaml
```

- [node + npm](https://nodejs.dev/)
- [serverless](https://www.serverless.com/)
  `npm install -g serverless`
