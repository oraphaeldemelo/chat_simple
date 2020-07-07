const dialogflow = require('dialogflow');
const botCredentials = require('./bot-credentials');


exports.sendBot = async (message, session_id) => {
  const projectId = botCredentials.googleProjectID;
    // Create a new session
    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.sessionPath(projectId, session_id);

    // The text query request.
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          // The query to send to the dialogflow agent
          text: message,
          // The language used by the client (en-US)
          languageCode: botCredentials.dialogFlorSessionLanguageCode,
        },
      },
    };

    // Send request and log result
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;    
    return result.fulfillmentText;
}