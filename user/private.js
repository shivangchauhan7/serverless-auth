const { sendResponse } = require('../functions/index')

module.exports.handler = async (event) => {
    return sendResponse(200, { message: `Email ${event.requestContext.authorizer.claims.email} has been authorized` })
}