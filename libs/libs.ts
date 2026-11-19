export type DateDifferenceType = {
    y: number; m: number; d: number, dayDiff: number
}


export function getDateDifference(futureDateStr: string): DateDifferenceType {
    const [d, m, y] = futureDateStr.split('/').map(Number);
    const future = new Date(y, m - 1, d);
    const now = new Date();


    const diffMs = Math.abs(future.getTime() - now.getTime());
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) - 1;


    // Aproximación simple
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = diffDays % 30;


    return { y: years, m: months, d: days, dayDiff: diffDays };
}

export function getTotalMinutesFromDayDiff(dateDiff: DateDifferenceType): number {
    return dateDiff.dayDiff * 24 * 60;
}