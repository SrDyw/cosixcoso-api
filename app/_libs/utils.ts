export const GetDateString = (date : Date) : string  => {
    let d ={
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear()
    };

    return `${d.day}/${d.month}/${d.year}`;
} 

export const GetDate = (dateString: string, separator: string = "/") : Date => {
    const [day, month, year] = dateString.split(separator).map(Number);
    return new Date(year, month - 1, day); 
}