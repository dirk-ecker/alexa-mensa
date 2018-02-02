'use strict';
const Alexa = require('alexa-sdk');
const mensaplan = require('mensaplan');
const APP_ID = 'amzn1.ask.skill.b408f752-ee31-4059-b1e3-cbb2acd959d1';

const languageStrings = {
  'de-DE': {
    'translation': {
      'SKILL_NAME': 'mensa jülich',
      'NOT_FOUND_MESSAGE': 'Keinen Eintrag gefunden.',
      'INTRO_MESSAGE': 'Der Speiseplan Mensa Jülich bietet an. <break time="1s"/>',
      'EXTRO_MESSAGE': 'Guten Appetit.',

      'HELP_MESSAGE': "Du kannst mich nach dem Mensaplan der FH Jülich fragen.",
      'HELP_REPROMPT': "Was möchtest Du wissen?",
      'STOP_MESSAGE': 'Tschüss'
    }
  }
};

exports.handler = function (event, context) {
  const alexa = Alexa.handler(event, context);
  alexa.APP_ID = APP_ID;
  // To enable string internationalization (i18n) features, set a resources object.
  alexa.resources = languageStrings;
  alexa.registerHandlers(handlers);
  try {
    alexa.execute();
  }
  catch (error) {
    console.log(JSON.stringify(error, null, 2));
  }
};

const handlers = {
  'LaunchRequest': function () {
    this.emit('GetLunchCard');
  },

  'GetLunchCard': function () {
    console.log(JSON.stringify(this.event.request.intent));
    const dateGiven = this.event.request.intent && this.event.request.intent.slots &&
      this.event.request.intent.slots.date && this.event.request.intent.slots.date.value;
    let dateValue;
    if (!dateGiven) {
      const today = new Date();
      const day = today.getDate();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();
      const dayFormatted = day < 10 ? ('0' + day) : '' + day;
      const monthFormatted = month < 10 ? ('0' + month) : '' + month;
      dateValue = '' + year + '-' + monthFormatted + '-' + dayFormatted;
    } else {
      dateValue = this.event.request.intent.slots.date.value;
    }
    console.log(dateGiven, dateValue);

    let speechOutput;
    mensaplan.lunchCard(dateValue, (result) => {
      if (!result) {
        speechOutput = this.t('NOT_FOUND_MESSAGE');
      } else {
        speechOutput = createSpeechOutput(this, result);
      }
      this.emit(':tellWithCard', speechOutput, this.t('SKILL_NAME'), speechOutput);
    });
  },

  'AMAZON.HelpIntent': function () {
    const speechOutput = this.t('HELP_MESSAGE');
    const reprompt = this.t('HELP_REPROMPT');
    this.emit(':ask', speechOutput, reprompt);
  },

  'AMAZON.CancelIntent': function () {
    this.emit(':tell', this.t('STOP_MESSAGE'));
  },

  'AMAZON.StopIntent': function () {
    this.emit(':tell', this.t('STOP_MESSAGE'));
  },

  'Unhandled': function () {
    const speechOutput = this.t('HELP_MESSAGE');
    const reprompt = this.t('HELP_REPROMPT');
    this.emit(':ask', speechOutput, reprompt);
  }
};

function createSpeechOutput(handlers, result) {
  let output = handlers.t('INTRO_MESSAGE');
  for (let meal of result) {
    output += `In der Kategorie ${meal.category}`;
    output += `gibt es ${meal.name}`;
    if (meal.prices.students) {
      output += `für ${meal.prices.students} Euro.`;
    } else {
      output += '.';
    }

    output += '<break time="1s"/>';
  }
  output += '<break time="500ms"/>' + handlers.t('EXTRO_MESSAGE');

  return output;
}
