// Returns a random number between min and max
export const getRandom = (min: number, max: number) => {
    return Math.floor(Math.random() * (max-min+1)+min);
};
