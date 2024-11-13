import { databases, Query } from '@/appwrite';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Predefined time slots in hourly intervals
const timeSlots = [
  "09:00am", "10:00am", "11:00am", 
  "01:00pm", "02:00pm", "03:00pm", "04:00pm"
];

export const HappeningAppointment = async () => {
  try {
    const currentTime = new Date(2024, 10, 19, 9, 0, 0, 0); // November 19, 2024, 09:00:00 AM
    console.log(currentTime); //(year, monthIndex, day, hours, minutes, seconds, milliseconds)
    const currentMonth = monthNames[currentTime.getMonth()]; // Months are zero-indexed (0-11)
    const currentDay = currentTime.getDate();
    
    const currentSlot = parseTimeToSlots(currentTime); // This will return the appropriate slot string.

    // Query to get all appointments for today based on month, day, and time slot
    const response = await databases.listDocuments('Butterfly-Database', 'Bookings', [
      Query.equal('month', currentMonth), // Check the current month
      Query.equal('day', currentDay), // Check the current day
      Query.equal('slots', currentSlot) // Match the slot with the current slot
    ]);

    console.log(response.documents);
    const appointmentsData = response.documents;
    console.log(appointmentsData);

    appointmentsData.forEach(async (appointment: any) => {
      // Log to ensure we are processing the appointment
      console.log('Processing appointment:', appointment);
    
      // Ensure appointment.slots is always an array (if it's a single string, wrap it in an array)
      let slots = appointment.slots;
      
      // If slots is a string, wrap it in an array
      if (typeof slots === 'string') {
        slots = [slots];  // Convert single string into an array of one string
      }
    
      // Ensure slots is now an array and proceed
      if (Array.isArray(slots)) {
        slots.forEach(async (slot: string) => {
          console.log('Updating appointment with id:', appointment.$id);
            // Update the status of the appointment to "happening"
            await updateAppointmentStatus(appointment.$id);
        });
      } else {
        console.log('Error: appointment.slots is not valid or cannot be converted to an array', appointment.slots);
      }
    });     
    
  } catch (error) {
      console.error('Error fetching appointments:', error);
  } 
};

// Function to convert time string (e.g. "09:00am") to a Date object
const parseTimeToDate = (month: number, day: number, timeStr: string) => {
  const [time, period] = timeStr.split(/(am|pm)/);
  const [hours, minutes] = time.split(':').map(Number);

  const date = new Date();
  date.setMonth(month - 1); // Month is 0-indexed, so subtract 1
  date.setDate(day);
  date.setFullYear(new Date().getFullYear()); // Use the current year

  // Adjust hours based on the period (AM/PM)
  let adjustedHours = hours;
  if (period === 'pm' && hours !== 12) adjustedHours += 12;
  if (period === 'am' && hours === 12) adjustedHours = 0;

  date.setHours(adjustedHours);
  date.setMinutes(minutes);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
};

// Function to determine the closest time slot to the current time
const parseTimeToSlots = (currentTime: Date) => {
  // Get the current hour and minute
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();

  // Determine the closest time slot
  if (hours < 9 || (hours === 9 && minutes < 30)) return "09:00am";
  if (hours < 10 || (hours === 10 && minutes < 30)) return "10:00am";
  if (hours < 11 || (hours === 11 && minutes < 30)) return "11:00am";
  if (hours < 13 || (hours === 13 && minutes < 30)) return "01:00pm";
  if (hours < 14 || (hours === 14 && minutes < 30)) return "02:00pm";
  if (hours < 15 || (hours === 15 && minutes < 30)) return "03:00pm";
  if (hours < 16 || (hours === 16 && minutes < 30)) return "04:00pm";
  
  // Default: after 4pm, default to the latest slot (04:00pm)
  return "04:00pm";
};

// Function to update the status of the appointment to 'happening'
const updateAppointmentStatus = async (appointmentId: string) => {
  try {
    await databases.updateDocument(
      'Butterfly-Database', 
      'Bookings', 
      appointmentId, 
      { status: 'happening' }
    );
    console.log(`Appointment ${appointmentId} status updated to 'happening'`);
  } catch (error) {
    console.error('Error updating appointment status:', error);
  }
};
