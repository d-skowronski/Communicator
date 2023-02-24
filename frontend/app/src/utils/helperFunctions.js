/**
 * Date and time formatted depending on current datetime
 *
 * Formatting isoDate:
 *  - same day as currentDate: TIME
 *  - within 6 days than currentDate: WEEKDAY, TIME
 *  - over 6 days than currentDate: DAY, MONTH, TIME
 *  - year other than in currentDate: DAY, MONTH, YEAR, TIME
 * @param {str} isoDate ISO 8601 string
 * @returns {str} Formatted date and time
 */
export function getDisplayDate(isoDate) {
    const requestedDate = new Date(isoDate)
    const currentDate = new Date()
    const dayInMiliseconds = 86400000
    let displayDate = ''

    if(Math.abs(currentDate - requestedDate) < dayInMiliseconds * 6){
        displayDate += new Intl.DateTimeFormat(
            "en-US",
            { weekday: 'short'}
        ).format(requestedDate)
    }
    else if(currentDate.getFullYear() !== requestedDate.getFullYear()){
        displayDate += new Intl.DateTimeFormat(
            "en-US",
            {day: '2-digit', month: 'short', year: 'numeric'}
        ).format(requestedDate)
    }
    else{
        displayDate += new Intl.DateTimeFormat(
            "en-US",
            { day: '2-digit', month: 'short'}
        ).format(requestedDate)
    }

    displayDate += ' AT '
    displayDate += new Intl.DateTimeFormat(
        "en-US",
        { hour: '2-digit', minute: '2-digit'}
    ).format(requestedDate)

    return displayDate
  }