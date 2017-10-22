/*
 * Welcome to QuantiPi! 
 * This is an Amazon Alexa skill that teaches you the digits of Pi
 * Made for VandyHacks IV -- Fall 2017
 * Written by Mason Hall and Melissa Masia
 * Check out our Github and Devpost pages for more info
 * */

var alexa = require('alexa-sdk');

/**
 * Constants
 * **/
const pi = '1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632788659361533818279682303019520353018529689957736225994138912497217752834791315155748572424541506959508295331168617278558890750983817546374649393192550604009277016711390098488240128583616035637076601047101819429555961989467678374494482553797747268471040475346462080466842590694912933136770289891521047521620569660240580381501935112533824300355876402474964732639141992726042699227967823547816360093417216412199245863150302861829';
const HELP_MESSAGE = "I'm trying to help you learn the digits of pi. Give me your best guess and I'll help you along.";
const WELCOME_MESSAGE = "Welcome to QuantiPi! We help you learn the digits of pi. Say lets start learning to begin.";
const END_MESSAGE = "Thanks for playing. We hoped you learned some digits of pi." + "<say-as interpret-as='interjection'> Bon Voyage! </say-as><break strength='strong'/>" ;
const UNHANDLED_START = "Just say Lets start learning to make a guess! ";
const UNHANDLED_GUESS = "You did not give a valid guess. Do you want to try again?";
const ONE_DIGIT_MESSAGE = "Thats not a good guess! Pi starts with 3 point 1. Do you want to try again?";

/*This is a list of positive speechcons that this skill will use when a user gets a correct answer.  For a full list of supported
speechcons, go here: https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speechcon-reference */
const speechConsCorrect = ["Ahoy", "Booya", "All righty", "Bam", "Bazinga", "Bingo", "Boom", "Boing","Bravo", 
"Cha Ching", "Cheers", "Dynomite", "Hip hip hooray", "Hurrah", "Hurray", "Huzzah","Mazel Tov", "Oh dear.  Just kidding.  Hurray", "Kaboom", "Kaching", "Oh snap", "Phew",
"Righto", "Way to go", "Well done", "Whee", "Woo hoo", "Wowza", "Yowsa"];

/*This is a list of negative speechcons that this skill will use when a user gets an incorrect answer.  For a full list of supported
speechcons, go here: https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speechcon-reference */
const speechConsWrong = ["Argh", "Aw man", "Blarg", "Blast", "Boo", "Bummer", "Darn", "D'oh", "Dun dun dun", "Eek", "Honk", 
"Mamma mia", "Oh boy", "Oh dear", "Oh brother", "Oof", "Ouch", "Ruh roh", "Jeepers creepers","Good Grief", "Shucks", "Uh oh", "Wah wah", "Whoops a daisy", "Yikes"];

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
var startHandlers = alexa.CreateStateHandler(states.START, {
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
var guessHandlers = alexa.CreateStateHandler(states.GUESS, {
    // Prompts the user to give a guess
    "Guess": function (){
        this.emit(":ask","Tell me the digits of pi that you know.");
        this.emit("GuessIntent");
    },
    // Deals with the edge condition when someone says "3"
    "OneDigitIntent" : function(){
        this.emit(":ask",ONE_DIGIT_MESSAGE);
    },
    // The workhouse of the skill. Attempts to take the slot value of the 
    "GuessIntent": function () {
        
        var answerSlotValid = isAnswerSlotValid(this.event.request.intent);
        
        if (answerSlotValid){
            var valueString = answerSlotValid.toString();
            var correct = true;
            var incorrectDigit = 0;
            var valueLength = valueString.length;
            var responseString = "";

            for (var i = 0; i < valueLength; i++){
                if (valueString.charAt(i) !== pi.charAt(i)){
                    correct = false;
                    incorrectDigit = i + 1;
                    break;
                }
            }
            
            if(correct){
                var nextThree = '';
                for (var i = valueLength; i <valueLength + 3; i++){
                    nextThree = nextThree + pi.charAt(i);
                }
                valueLength++;
                responseString = getSpeechCon(true) + " You got " + valueLength + " correct digits of pi. The next three are " + nextThree;
            }else {
                responseString = getSpeechCon(false) + " Unfortunately, you replaced "
                + pi.charAt(incorrectDigit-1) + " with " + valueString.charAt(incorrectDigit-1);
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

// Returns a random number between min and max
function getRandom(min, max){
   return Math.floor(Math.random() * (max-min+1)+min);
}

// Returns a random positive or negative speech con depending on type, true or false respectively
function getSpeechCon(type){
   var speechCon = "";
   if (type) return "<say-as interpret-as='interjection'>" + speechConsCorrect[getRandom(0, speechConsCorrect.length-1)] + "! </say-as><break strength='strong'/>";
   else return "<say-as interpret-as='interjection'>" + speechConsWrong[getRandom(0, speechConsWrong.length-1)] + " </say-as><break strength='strong'/>";
}

// Determines if there is a valid guess being made
function isAnswerSlotValid(intent){

    const answerSlotFilled = intent && intent.slots.Answer && intent.slots.Answer.value;
    const answerSlotsIsInt = answerSlotFilled && !isNaN(intent.slots.Answer.value);
    if (answerSlotsIsInt){
        return intent.slots.Answer.value;
    }else {
        return false;
    }
}

// Connect to lambda and executes
exports.handler = function(event, context) {
    var Alexa = alexa.handler(event, context);
    Alexa.appId = "amzn1.ask.skill.9c5425fc-e3c8-4948-9866-823e49b08ff2";
    Alexa.registerHandlers(handlers, startHandlers, guessHandlers);
    Alexa.execute();
};
