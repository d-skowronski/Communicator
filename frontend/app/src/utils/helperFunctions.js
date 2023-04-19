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
export function getDisplayDate(isoDate, dateWithTime=true) {
    const requestedDate = new Date(isoDate)
    const currentDate = new Date()
    const dayInMiliseconds = 86400000
    let options = {}

    if(Math.abs(currentDate - requestedDate) < dayInMiliseconds){
        // Skip other conditions when it is the same day as requestedDate
    }
    else if(Math.abs(currentDate - requestedDate) < dayInMiliseconds * 6){
        options.weekday = 'short'
    }
    else if(currentDate.getFullYear() !== requestedDate.getFullYear()){
        options.month = 'short'
        options.year = 'numeric'
    }
    else{
        options.day = '2-digit'
        options.month = 'short'
    }

    let displayDate = ''
    // Add date according to options if any
    if(Object.keys(options).length > 0){
        displayDate += new Intl.DateTimeFormat("en-US", options).format(requestedDate)
        // Add prefix to time when date
        if(dateWithTime){
            displayDate += ' at '
        }
    }

    // Add time when dateWithTime is true or when there is no date
    if((Object.keys(options).length > 0 && dateWithTime) || Object.keys(options).length === 0){
        displayDate += new Intl.DateTimeFormat(
            "en-US",
            { hour: '2-digit', minute: '2-digit'}
        ).format(requestedDate)
    }

    return displayDate
  }