const AWS = require('aws-sdk')
const { sendResponse, validateInput } = require("../functions");

const cognito = new AWS.CognitoIdentityServiceProvider()

module.exports.handler = async (event) => {
    try {
        const isValid = validateInput(event.body)
        if (!isValid)
            return sendResponse(400, { message: 'Invalid input' })

        const { email, password } = JSON.parse(event.body)
        const { user_pool_id, client_id } = process.env
        const params = {
            AuthFlow: "ADMIN_NO_SRP_AUTH",
            UserPoolId: user_pool_id,
            ClientId: client_id,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password
            }
        }
        const response = await cognito.adminInitiateAuth(params).promise();
        return sendResponse(200, { message: 'Success', token: response.AuthenticationResult.IdToken })
    }
    catch (error) {
        const message = error.message ? error.message : 'Internal server error'
        return sendResponse(500, { message })
    }
}