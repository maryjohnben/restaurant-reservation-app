export default function isPastDateAndClosed(reservation_date, reservation_time) {
    const day = new Date(
      `${reservation_date} ${reservation_time}`
    );
    //new Date() gives todays date
      const today = new Date()
    if (today > day) {
      return "Date and/or time cannot be in the past. Please select another date.";
    }
    if(day.getHours() <= 10 || (day.getHours() === 10 && day.getMinutes < 30)) {
      return 'Restaurant will not open until 10:30AM. Please reserve a later time.'
        }
        if((day.getHours() > 21) || (day.getHours() === 21 && day.getMinutes > 30)) {
          return 'Restaurant closes at 10:30PM and last time available for reservation is 9.30PM. Please pick another time.'
        }
          return null
      }
      