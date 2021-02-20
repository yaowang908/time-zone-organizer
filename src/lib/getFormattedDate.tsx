export const getFormattedDate = (date:Date):string => {
// console.log("🚀 ~ file: getFormattedDate.tsx ~ line 2 ~ getFormattedDate ~ date", date)
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return month + '/' + day + '/' + year;
}