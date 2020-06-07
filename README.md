# QuantiPi 

QuantiPi is an Amazon Alexa skill which quizzes your knowledge of the digits of Pi. For example, if you say the first seven digits of Pi, and those digits are correct, QuantiPi gives you the next three digits to memorize. Otherwise, it corrects you on your first mistake. Then you can try again!

With daily practice, you can soon be a pi wizard, otherwise known as Sir Cumference.

## Getting Started
Reading Materials:

[Fact Skill Tutorial: Build an Alexa Skill in 6 Steps](https://developer.amazon.com/alexa-skills-kit/tutorials/fact-skill-1?&sc_channel=SEM&sc_campaign=Fact-Skill&sc_detail=Branded&sc_segment=Echo-Dev&sc_publisher=Google&sc_country=WW&sc_medium=SEM_Fact-Skill_Branded_Echo-Dev_Google_WW_0007&sc_trackingcode=0007&gclid=Cj0KCQjwvabPBRD5ARIsAIwFXBmUWe2E9UwiN2qvml6qxJ1f_eNyCqsmiouks4Tpgug7QNV62pxT71YaAhu9EALw_wcB)

[Alexa Skills Kit](https://developer.amazon.com/alexa-skills-kit)

[AWS Lambda Console](https://console.aws.amazon.com/lambda/)

### Prerequisites

Clone or download this repository, and open it in your favorite IDE.

Install required modules with `npm install`

When the code in index.js runs within AWS Lambda, it relies on the `alexa-sdk` module, which is installed by default with the Fact skill blueprint. In order to test and deploy projects from your local laptop, you will need to bundle in required modules such as the alexa-sdk within your folder.

Follow these steps to install the `alexa-sdk`:

Open a command prompt and navigate into the folder where your `index.js` lives.
Verify you have Node.JS installed by typing `npm --version`
Type `npm install --save alexa-sdk`
You will notice a new folder called node_modules which contains an `alexa-sdk` folder.
You can repeat and use any other Node modules to your project with the npm command.

You can now test your project from the command line, or package and deploy it to the AWS Lambda service.

## Authors

* **Mason Hall** - [Github](https://github.com/fmhall)
* **Melissa Masia** - [Github](https://github.com/melissamasia)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Thanks to VandyHacks, Brendan, Reed

