const AWS = require('aws-sdk')
const { sendResponse, validateInput } = require("../functions");

const cognito = new AWS.CognitoIdentityServiceProvider()

module.exports.handler = async (event) => {
    try {
        const isValid = validateInput(event.body)
        if (!isValid)
            return sendResponse(400, { message: 'Invalid input' })

        const { email, password } = JSON.parse(event.body)
        const { user_pool_id } = process.env
        const params = {
            UserPoolId: user_pool_id,
            Username: email,
            UserAttributes: [
                {
                    Name: 'email',
                    Value: email
                },
                {
                    Name: 'email_verified',
                    Value: 'true'
                }],
            MessageAction: 'SUPPRESS'
        }
        const response = await cognito.adminCreateUser(params).promise();
        if (response.User) {
            const paramsForSetPass = {
                Password: password,
                UserPoolId: user_pool_id,
                Username: email,
                Permanent: true
            };
            await cognito.adminSetUserPassword(paramsForSetPass).promise()
        }
        return sendResponse(200, { message: 'User registration successful' })
    }
    catch (error) {
        const message = error.message ? error.message : 'Internal server error'
        return sendResponse(500, { message })
    }
}