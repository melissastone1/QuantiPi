/*
 * Welcome to QuantiPi! 
 * This is an Amazon Alexa skill that teaches you the digits of Pi
 * Made for VandyHacks IV -- Fall 2017
 * Written by Mason Hall and Melissa Masia
 * */

let alexa = require('alexa-sdk');
import { pi, HELP_MESSAGE, WELCOME_MESSAGE, END_MESSAGE, UNHANDLED_GUESS, UNHANDLED_START, ONE_DIGIT_MESSAGE } from './constants';
import { getSpeechCon } from './utils/getSpeechCon';
import { isAnswerSlotValid } from './utils/isAnswerSlotValid';

// Two possible states for Alexa to be in, and each have different handlers
const states = {
    START: "_START",
    GUESS: "_GUESS"
};

const handlers = {
    // Triggers when user opens QuantiPi
    'LaunchRequest': function (){
        this.handler.state = states.START;
        this.emitWithState("Start");
    },
    // Default Help Intent from Amazon
    'AMAZON.HelpIntent': function(){
        this.emit(":ask", HELP_MESSAGE,HELP_MESSAGE);
        this.emit(":responseReady");
    }
};

// handlers for the START state
let startHandlers = alexa.CreateStateHandler(states.START, {
    // Delivers welcome message and moves user to guess
    "Start":function(){
        this.emit(":ask", WELCOME_MESSAGE);
        this.handler.state = states.GUESS;
        this.emitWithState("Guess");
        
    },
    // Acts as a middle man between the start and the guess
    "PlayIntent": function (){
        this.handler.state = states.GUESS;
        this.emitWithState("Guess");
    },
    // Default Help Intent from Amazon
    'AMAZON.HelpIntent': function(){
        this.emit(":ask", HELP_MESSAGE,HELP_MESSAGE);
        this.emit(":responseReady");
    },
    // Deals with all other start inputs
    "Unhandled": function (){
        this.emit(':ask', UNHANDLED_START,HELP_MESSAGE);
    }
});

// Handlers for the GUESS state
let guessHandlers = alexa.CreateStateHandler(states.GUESS, {
    // Prompts the user to give a guess
    "Guess": function (){
        this.emit(":ask","Tell me the digits of pi that you know.");
        this.emit("GuessIntent");
    },
    // Deals with the edge condition when someone says "3"
    "OneDigitIntent" : function(){
        this.emit(":ask",ONE_DIGIT_MESSAGE);
    },
    // The workhouse of the skill
    "GuessIntent": function () {
        
        let answerSlotValid = isAnswerSlotValid(this.event.request.intent);
        
        if (answerSlotValid){
            let valueString = answerSlotValid.toString();
            let guessIsCorrect = true;
            let indexOfincorrectDigit = 0;
            let valueLength = valueString.length;
            let responseString = "";

            for (var i = 0; i < valueLength; i++){
                if (valueString.charAt(i) !== pi.charAt(i)) {
                    correct = false;
                    indexOfincorrectDigit = i + 1;
                    break;
                }
            }
            
            if (guessIsCorrect) {
                var nextThree = '';
                for (var i = valueLength; i <valueLength + 3; i++){
                    nextThree = nextThree + " " + pi.charAt(i);
                }
                valueLength++;
                responseString = getSpeechCon(true) + " You got " + valueLength + " correct digits of pi. The next three are " + nextThree;
            } else {
                responseString = getSpeechCon(false) + " Unfortunately, you replaced "
                + pi.charAt(indexOfincorrectDigit- 1 ) + " with " + valueString.charAt(incorrectDigit - 1);
            }
            responseString = responseString + ". <break time='.5s'/>  Do you want to play again?";

            this.emit(":ask", responseString);
            this.emit(":responseReady");

        } else{
            this.emit(":ask",UNHANDLED_GUESS);
        }
    },
    // Default Yes Intent from Amazon
    "AMAZON.YesIntent": function () {

        this.emitWithState("Guess");
    },
    // Default No Intent from Amazon
    "AMAZON.NoIntent": function () {
        this.emit(":tell",END_MESSAGE);
    },
    // Default Help Intent from Amazon
    'AMAZON.HelpIntent': function(){
        this.emit(":ask", HELP_MESSAGE);
        this.emit(":responseReady");
    },
    // Deals with all other guesses
    "Unhandled": function (){
        this.emit(':ask',UNHANDLED_GUESS);
    }
});


// Connect to lambda and executes
exports.handler = function(event, context) {
    var Alexa = alexa.handler(event, context);
    Alexa.appId = "amzn1.ask.skill.9c5425fc-e3c8-4948-9866-823e49b08ff2";
    Alexa.registerHandlers(handlers, startHandlers, guessHandlers);
    Alexa.execute();
};
