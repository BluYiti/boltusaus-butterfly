import { databases, Query } from "../appwrite";

const BOOKINGS_COLLECTION_ID = "Bookings";
const DATABASE_ID = "Butterfly-Database";

// Function to get the current date and time in 24-hour format
const getCurrentDate = (): { month: string; day: number; time: string } => {
    const now = new Date();
    const month = now.toLocaleString("en-US", { month: "long" }); // Full month name
    const day = now.getDate(); // Day of the month
    const timeFormat = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const time = timeFormat.format(now);  // Example: "15:00"
    console.log("Current date and time:", month, day, time);
    return { month, day, time };
};

const convertTo24HourFormat = (time12h: string): string => {
    const match = time12h.match(/^(\d{1,2}):(\d{2})(AM|PM)$/);
    if (!match) {
        throw new Error("Invalid time format. Use 'hh:mmAM' or 'hh:mmPM'.");
    }

    const [hours, minutes, period] = match;
    let hourNum = parseInt(hours, 10);

    if (period === "PM" && hourNum !== 12) {
        hourNum += 12;
    } else if (period === "AM" && hourNum === 12) {
        hourNum = 0;
    }

    return `${hourNum.toString().padStart(2, "0")}:${minutes}`;
};

function isPastOneHour(bookingSlot, currentTime) {
    // Convert bookingSlot and currentTime to Date objects
    const bookingDate = new Date(`1970-01-01T${bookingSlot}:00Z`);
    const currentDate = new Date(`1970-01-01T${currentTime}:00Z`);

    // Get the time difference in milliseconds
    const timeDifference = currentDate.getTime() - bookingDate.getTime();
    const oneHourInMillis = 60 * 60 * 1000; // 1 hour in milliseconds
    
    return timeDifference > oneHourInMillis;
}

// Function to update the status of bookings
const updateBookingStatus = async () => {
  try {
    const { month, day, time } = getCurrentDate();
    
    // Fetch bookings with status 'paid' or 'happening'
    const response = await databases.listDocuments(DATABASE_ID, BOOKINGS_COLLECTION_ID, [
      Query.equal("status", ["paid", "happening"]),
    ]);
    const bookings = response.documents;
    console.log("Bookings to update:", bookings);

    for (const booking of bookings) {
        const bookingMonth = booking.month;
        const bookingDay = booking.day;
        const bookingSlot = convertTo24HourFormat(booking.slots); // Assuming 'slot' exists in the document
        let updatedStatus = booking.status;
        console.log(bookingMonth, bookingDay, bookingSlot);
  
        if (
            booking.status === "paid" &&
            bookingMonth === month &&
            bookingDay === day &&
            bookingSlot <= time
        ) {
            updatedStatus = "happening";
        } else if (
            booking.status === "paid" &&
            (bookingMonth !== month && bookingDay < day)
        ) {
            updatedStatus = "missed";
        } else if (
            booking.status === "happening" &&
            (bookingMonth !== month ||  bookingDay < day || isPastOneHour(bookingSlot, time))
        ) {
            updatedStatus = "missed";
        }
  
        if (updatedStatus !== booking.status) {
          await databases.updateDocument(DATABASE_ID, BOOKINGS_COLLECTION_ID, booking.$id, {
            status: updatedStatus,
          });
        }
      }
    } catch (error) {
      console.error("Error updating booking statuses:", error);
    }
  };
  
  export { updateBookingStatus };
