import { databases, Query } from '@/appwrite';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const HappeningAppointment = async () => {
  try {
    const currentTime = new Date();
    const currentMonth = monthNames[currentTime.getMonth()];
    const currentDay = currentTime.getDate();
    
    const currentSlot = parseTimeToSlots(currentTime);

    // Query to get all appointments for today based on month, day, and time slot
    const response = await databases.listDocuments('Butterfly-Database', 'Bookings', [
      Query.equal('month', currentMonth),
      Query.equal('day', currentDay),
      Query.equal('slots', currentSlot)
    ]);
    const appointmentsData = response.documents;

    // Check if there are no appointments for the current slot
    if (appointmentsData.length === 0) {
      console.log("No currently happening appointment");
      return; // Exit early if no appointments are found
    }

    // Use a for...of loop to handle async correctly
    for (const appointment of appointmentsData) {
      console.log('Processing appointment:', appointment);
    
      let slots = appointment.slots;

      // Ensure slots is always an array
      if (typeof slots === 'string') {
        slots = [slots];
      }

      // Update each slot's status to 'happening'
      if (Array.isArray(slots)) {
        for (const {} of slots) {
          console.log('Updating appointment with id:', appointment.$id);
          await updateAppointmentStatus(appointment.$id);
        }
      } else {
        console.log('Error: appointment.slots is not valid or cannot be converted to an array', appointment.slots);
      }
    }
    
  } catch (error) {
    console.error('Error fetching appointments:', error);
  } 
};

// Function to determine the closest time slot to the current time
const parseTimeToSlots = (currentTime: Date) => {
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();

  if (hours < 9 || (hours === 9 && minutes < 30)) return "09:00am";
  if (hours < 10 || (hours === 10 && minutes < 30)) return "10:00am";
  if (hours < 11 || (hours === 11 && minutes < 30)) return "11:00am";
  if (hours < 13 || (hours === 13 && minutes < 30)) return "01:00pm";
  if (hours < 14 || (hours === 14 && minutes < 30)) return "02:00pm";
  if (hours < 15 || (hours === 15 && minutes < 30)) return "03:00pm";
  if (hours < 16 || (hours === 16 && minutes < 30)) return "04:00pm";
  
  return "04:00pm";  // Default to 04:00pm if after 4pm
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
