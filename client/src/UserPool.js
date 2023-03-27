import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'us-east-1_QXtiv8zzH',
  ClientId: 'sq62jkbp446h23dsfgdrakh84'
};

export default new CognitoUserPool(poolData);