import { speechConsCorrect, speechConsWrong } from '../speechCons';
import { getRandom } from './getRandom';

export const getSpeechCon = (answerIsCorrect: boolean) =>{
    return answerIsCorrect
       ?"<say-as interpret-as='interjection'>" + speechConsCorrect[getRandom(0, speechConsCorrect.length-1)] + "! </say-as><break strength='strong'/>"
       : "<say-as interpret-as='interjection'>" + speechConsWrong[getRandom(0, speechConsWrong.length-1)] + " </say-as><break strength='strong'/>";
};
