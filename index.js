/* Written by Mason and Melissa */
var alexa = require('alexa-sdk');


const pi = '3.1415926535';
const HELP_MESSAGE = "I'm trying to help you learn the digits of pi. Give me your best guess and I'll help you along.";
const WELCOME_MESSAGE = "Welcome to Pi Hard. We help you learn the digits of pi.";
const END_MESSAGE = "Thanks for playing. We hoped you learned some digits of pi.";

var states = {
    START: "_START",
    GUESS: "_GUESS"
};

const handlers = {
    'LaunchRequest': function (){
        this.handler.state = states.START;
        this.emitWithState("Start");
    },
    'AMAZON.HelpIntent': function(){
        this.emit(":ask", HELP_MESSAGE,HELP_MESSAGE);
        this.emit(":responseReady");
    },
    "Unhandled": function (){
        this.emit(':ask', HELP_MESSAGE,HELP_MESSAGE);
    }
};

var startHandlers = alexa.CreateStateHandler(states.START, {
    "Start":function(){
        this.emit(":ask", WELCOME_MESSAGE);
    },
    "PlayIntent": function (){
        this.handler.state = states.GUESS;
        this.emitWithState("Guess");
    },
    'AMAZON.HelpIntent': function(){
        this.emit(":ask", HELP_MESSAGE,HELP_MESSAGE);
        this.emit(":responseReady");
    },
    "Unhandled": function (){
        this.emit(':ask', HELP_MESSAGE,HELP_MESSAGE);
    }
});

var guessHandlers = alexa.CreateStateHandler(states.GUESS, {
    "Guess": function (){
        this.emit(":ask","Tell me the digits of pi that you know.");
        this.emit("GuessIntent");
    },
    "GuessIntent": function () {
        this.emit(":tell","GuessIntentEntered");
    },
    "AMAZON.YesIntent": function () {

    },
    "AMAZON.NoIntent": function () {
        this.emit(":tell",END_MESSAGE);
    },
    'AMAZON.HelpIntent': function(){
        this.emit(":ask", HELP_MESSAGE,HELP_MESSAGE);
        this.emit(":responseReady");
    },
    "Unhandled": function (){
        this.emit(':ask', HELP_MESSAGE,HELP_MESSAGE);
        console.log("unhandled-guessHandlers2")
    }
});


// Connect to lambda
exports.handler = function(event, context) {
    var Alexa = alexa.handler(event, context);
    Alexa.appId = "amzn1.ask.skill.56f94021-5419-4e60-bf1e-03e9d205b492";
    Alexa.registerHandlers(handlers, startHandlers, guessHandlers);
    Alexa.execute();
};
