export default function isPastDate(reservation_date, reservation_time) {
    const day = new Date(
      `${reservation_date} ${reservation_time}`
    );
    //new Date() gives todays date
      const today = new Date()
    if (today > day) {
      return "Date and/or time cannot be in the past. Please select another date.";
    } else {
      return null;
    }
  }