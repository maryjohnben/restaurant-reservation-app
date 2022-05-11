//if chosen date is tuesday then return an error message if not undefined
export default function isTuesday(date) {
    const day = new Date(date);
    //getUTCDay() return day in such a way that 0 is sunday 1 is monday and 2 is tuesday
    if (day.getUTCDay() === 2) { 
      return "Restaurant is closed on Tuesday. Please select another day.";
    } else {
      return null;
    }
  }
  
