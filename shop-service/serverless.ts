import type {AWS} from '@serverless/typescript';

import getProductsList from "@functions/getProductsList";
import getProductById from "@functions/getProductsById";

const serverlessConfiguration: AWS = {
    service: 'shop-service',
    frameworkVersion: '3',
    plugins: ['serverless-auto-swagger', 'serverless-offline', 'serverless-webpack', 'serverless-esbuild'],
    provider: {
        name: 'aws',
        runtime: 'nodejs14.x',
        region: 'eu-west-1',
        stage: '${opt:stage, self:custom.stage, "dev"}',
        httpApi: {
            cors: false,
            payload: '1.0'
        },
        logs: {
            httpApi: true
        },
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
        },
    },
    // import the function via paths
    functions: {getProductsList, getProductById},
    package: {individually: true},
    custom: {
        webpack: {
            webpackConfig: './webpack.config.js'
        },
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ['aws-sdk'],
            target: 'node14',
            define: {'require.resolve': undefined},
            platform: 'node',
            concurrency: 10,
        },
        autoswagger: {
            apiType: "httpApi",
            generateSwaggerOnDeploy: true
        },
    },
};

module.exports = serverlessConfiguration;
