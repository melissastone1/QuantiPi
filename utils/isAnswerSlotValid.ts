// Determines if there is a valid guess being made
type Intent = {
    slots: {
        Answer: {
            value: number;
        }
    }
}

export const isAnswerSlotValid = (intent: Intent): number | boolean => {
    const answerSlotFilled = intent && intent.slots.Answer && intent.slots.Answer.value;
    const answerSlotsIsInt = answerSlotFilled && !isNaN(intent.slots.Answer.value);
    return answerSlotsIsInt ? intent.slots.Answer.value: false;
}
