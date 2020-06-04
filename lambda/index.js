const SKILL_NAME = 'トリップトリップ'

const Alexa = require('ask-sdk-core');
const { S3PersistenceAdapter } = require('ask-sdk-s3-persistence-adapter');
const storage = new S3PersistenceAdapter({ bucketName : 'alexa-skill-trip-trip' })
const getFromWikipedia = require('./api')

// persisted user context in S3

// pre action before running handler
const RequestInterceptor = {
  async process(handlerInput) {
    console.log(handlerInput)

    // get memory from S3
  }
}

const welcome = () => {
  // スキルの起動回数によってメッセージを変えてみる。
}


const decorate = (message, context = null) => {
  // not implement
  return message
}

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (request.type === 'LaunchRequest');
  },
  async handle(handlerInput) {

    // Welcome メッセージ
    const message = decorate(welcome())
    return handlerInput.responseBuilder
      // .speak(message)
      .speak(message)
      .withSimpleCard(SKILL_NAME, 'test')
      .withShouldEndSession(false)
      .getResponse();
  },
};

// core functionality for fact skill
const DestinationCityIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (request.type === 'IntentRequest' && request.intent.name === 'DestinationCityIntent');
  },
  async handle(handlerInput) {
    const city = Alexa.getSlotValue(handlerInput.requestEnvelope, 'city')
    console.log(city)
    const result = await getFromWikipedia(city)
    console.log(result)

    userContext.context.visit = userContext.context.visit + 1
    userContext.context.date = Date.now()
    userContext.context.lastVisitCityDetail = result
    userContext.context.lastVisitCity = city
    await storage.saveAttributes(handlerInput.requestEnvelope, userContext)
    const speech = `
      楽しんできてくださいね。
      <audio src="soundbank://soundlibrary/airport/airport_01" />
      いってらっしゃい。
    `
    console.log(speech)
    return handlerInput.responseBuilder
      .speak(speech)
      .withSimpleCard(SKILL_NAME, 'test')
      .getResponse();
  },
};

// core functionality for fact skill
const DestinationCountryIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (request.type === 'IntentRequest' && request.intent.name === 'DestinationCountryIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('test')
      .withSimpleCard(SKILL_NAME, 'test')
      .getResponse();
  },
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('help')
      .reprompt('help')
      .getResponse();
  },
};

const FallbackHandler = {
  // The FallbackIntent can only be sent in those locales which support it,
  // so this handler will always be skipped in locales where it is not supported.
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('fallback')
      .reprompt('fallback')
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('stop')
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    console.log(`Error stack: ${error.stack}`);
    return handlerInput.responseBuilder
      .speak('error')
      .reprompt('error')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    DestinationCityIntentHandler,
    DestinationCountryIntentHandler,
    HelpHandler,
    ExitHandler,
    FallbackHandler,
    SessionEndedRequestHandler,
  )
  .addRequestInterceptors(RequestInterceptor)
  .addErrorHandlers(ErrorHandler)
  .withPersistenceAdapter(storage)
  .lambda();
