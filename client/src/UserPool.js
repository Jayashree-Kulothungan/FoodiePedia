var AmazonCognitoIdentity = require("amazon-cognito-identity-js");
var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;

//userpool name : Registration
const poolData = {
	UserPoolId: "us-east-1_qQRBlIuTM",
	ClientId: "gqab90ps3tcfo0ok589sba80d",
};

export default new CognitoUserPool(poolData);
