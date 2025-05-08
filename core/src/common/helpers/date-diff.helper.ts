export const dateDiff = (date1: Date | string | number, date2: Date | string | number): number => {
    const diff = new Date(date1).getTime() - new Date(date2).getTime();
    return Math.abs(diff);
};

export const dateDiffInSeconds = (date1: Date | string | number, date2: Date | string | number): number => {
    return Math.floor(dateDiff(date1, date2) / 1000);
};

