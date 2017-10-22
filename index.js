/* Written by Mason and Melissa */
var alexa = require('alexa-sdk');


const pi = '1415926535';
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

        var answerSlotValid = isAnswerSlotValid(this.event.request.intent);
        if (answerSlotValid){
            var valueString = answerSlotValid.toString();
            var correct = true;
            var incorrectDigit = 0;
            var valueLength = valueString.length();
            for (var i = 0; i < valueLength; i++){
                if (valueString.charAt(i) !== pi.charAt(i)){
                    correct = false;
                    incorrectDigit = i + 1;
                    break;
                }
            }

            if(correct){
                this.emit(":ask", "Nice! You got  " + valueLength + "correct digits of pi. The next three are" );
            }else {
                this.emit(":ask", "Great work! Unfortunately, you replaced"
                    + pi.charAt(incorrectDigit-1) + "with" + valueString.charAt(incorrectDigit-1));
            }

            this.emit(":ask", "Do you want to play again?");
        }

    },
    "AMAZON.YesIntent": function () {
        this.emitWithState("Guess");
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

function isAnswerSlotValid(intent){
    const answerSlotFilled = intent && intent.slots.Answer && intent.slots.Answer.value;
    const answerSlotsIsInt = answerSlotFilled && !isNaN(intent.slots.Answer.value);
    if (answerSlotsIsInt){
        return intent.slots.Answer.value;
    }else {
        return false;
    }
}


// Connect to lambda
exports.handler = function(event, context) {
    var Alexa = alexa.handler(event, context);
    Alexa.appId = "amzn1.ask.skill.56f94021-5419-4e60-bf1e-03e9d205b492";
    Alexa.registerHandlers(handlers, startHandlers, guessHandlers);
    Alexa.execute();
};
