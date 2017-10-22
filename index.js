/* Written by Mason and Melissa */
var alexa = require('alexa-sdk');

const pi = '141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117067982148086513282306647093844609550582231725359408128481117450284102701938521105559644622948954930381964428810975665933446128475648233786783165271201909145648566923460348610454326648213393607260249141273724587006606315588174881520920962829254091715364367892590360011330530548820466521384146951941511609433057270365759591953092186117381932611793105118548074462379962749567351885752724891227938183011949129833673362440656643086021394946395224737190702179860943702770539217176293176752384674818467669405132000568127145263560827785771342757789609173';
const HELP_MESSAGE = "I'm trying to help you learn the digits of pi. Give me your best guess and I'll help you along.";
const WELCOME_MESSAGE = "Welcome to Pi Hard. We help you learn the digits of pi. Say lets start learning to begin.";
const END_MESSAGE = "Thanks for playing. We hoped you learned some digits of pi.";
const UNHANDLED_START = "Just say Lets start learning to make a guess! ";
const UNHANDLED_GUESS = "You did not give a valid guess. Do you want to try again?";
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
        this.emit(':ask', "Unhandled handlers",HELP_MESSAGE);
    }
};

var startHandlers = alexa.CreateStateHandler(states.START, {
    "Start":function(){
        this.emit(":ask", WELCOME_MESSAGE);
        this.handler.state = states.GUESS;
        this.emitWithState("Guess");
        
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
        this.emit(':ask', UNHANDLED_START,HELP_MESSAGE);
    }
});

var guessHandlers = alexa.CreateStateHandler(states.GUESS, {
    "Guess": function (){
        this.emit(":ask","Tell me the digits of pi that you know.");
        this.emit("GuessIntent");
        console.log("made it to here");
    },
    "OneDigitIntent" : function(){
        this.emit(":ask","Thats not a good guess! Pi starts with 3 point 1. Do you want to try again?")
    },
    
    "GuessIntent": function () {
        
        console.log("Got to guess intent");
        var answerSlotValid = isAnswerSlotValid(this.event.request.intent);
        
        console.log(answerSlotValid);
        if (answerSlotValid){
            var valueString = answerSlotValid.toString();
            console.log(valueString);
            var correct = true;
            var incorrectDigit = 0;
        
            var valueLength = valueString.length;
            for (var i = 0; i < valueLength; i++){
                if (valueString.charAt(i) !== pi.charAt(i)){
                    correct = false;
                    incorrectDigit = i + 1;
                    
                    break;
                }
            }
            console.log(incorrectDigit);
            console.log(correct);
            console.log(valueLength);
        
            
            var responseString = "";
            if(correct){
                var nextThree = '';
                for (var i = valueLength; i <valueLength + 3; i++){
                    nextThree = nextThree + pi.charAt(i) + " ";
                }
                valueLength++;
                responseString = "Nice! You got " + valueLength + " correct digits of pi. The next three are " + nextThree;
            }else {
                responseString = "Nice try. Unfortunately, you replaced "
                + pi.charAt(incorrectDigit-1) + " with " + valueString.charAt(incorrectDigit-1);
            }
            responseString = responseString + ". <break time='1s'/>  Do you want to play again?";
            this.emit(":ask", responseString);
            this.emit(":responseReady");
        } else{
            this.emit(":ask",UNHANDLED_GUESS);
        }
    },
    "AMAZON.YesIntent": function () {

        this.emitWithState("Guess");
    },
    "AMAZON.NoIntent": function () {
        this.emit(":tell",END_MESSAGE);
    },
    'AMAZON.HelpIntent': function(){
        this.emit(":ask", HELP_MESSAGE);
        this.emit(":responseReady");
    },
    "Unhandled": function (){
        this.emit(':ask',UNHANDLED_GUESS);
    }
});

function isAnswerSlotValid(intent){
    console.log(":tell","Made it to Answer Slot Valid Function");
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
