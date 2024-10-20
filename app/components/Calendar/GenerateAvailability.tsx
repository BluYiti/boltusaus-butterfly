import { databases } from '@/appwrite'; // Import the initialized 'databases' service from appwrite.ts

// Function to fetch all therapists from the Therapist collection
async function fetchTherapists() {
  try {
    const response = await databases.listDocuments(
      'Butterfly-Database', // Replace with your actual database ID
      'Psychotherapist' // Replace with your actual Therapist collection ID
    );
    
    // Assuming the therapist IDs are stored in a field named 'therapist_id'
    const therapists = response.documents.map((doc) => doc.therapist_id);
    return therapists;
  } catch (error) {
    console.error('Error fetching therapists:', error);
    throw error;
  }
}

// Function to create availability for the next month
async function createAvailabilityForNextMonth(therapists: string[]) {
  const today = new Date();
  const currentMonth = today.getMonth();
  const nextMonth = currentMonth + 1; // Month is 0-indexed (0 = January, 11 = December)
  const nextMonthStart = new Date(today.getFullYear(), nextMonth, 1);
  const nextMonthEnd = new Date(today.getFullYear(), nextMonth + 1, 0); // Last day of the next month

  // Loop through each day of the next month excluding Sundays
  for (let date = nextMonthStart; date <= nextMonthEnd; date.setDate(date.getDate() + 1)) {
    if (date.getDay() !== 0) { // Exclude Sundays (0 = Sunday)
      therapists.forEach(async (therapist) => {
        for (let hour = 9; hour <= 16; hour++) {
          const slotTime = `${hour}:00`;

          const availabilityData = {
            therapist_id: therapist,
            date: date.toISOString().split('T')[0], // Format YYYY-MM-DD
            slot: slotTime,
            is_available: true,
            booking_id: null,
          };

          // Insert into Appwrite database
          try {
            await databases.createDocument('Butterfly-Database', 'Availability', 'unique()', availabilityData);
            console.log(`Created availability for ${therapist} on ${availabilityData.date} at ${slotTime}`);
          } catch (error) {
            console.error('Error creating availability:', error);
          }
        }
      });
    }
  }
}

// Function to check if we're near the next month (1.5 weeks away)
function isTimeToCreateAvailability() {
  const today = new Date();
  const currentMonth = today.getMonth();
  const nextMonth = currentMonth + 1;
  const nextMonthStart = new Date(today.getFullYear(), nextMonth, 1);
  const oneAndHalfWeeksBeforeNextMonth = new Date(nextMonthStart);
  oneAndHalfWeeksBeforeNextMonth.setDate(oneAndHalfWeeksBeforeNextMonth.getDate() - 10); // 1.5 weeks before

  return today >= oneAndHalfWeeksBeforeNextMonth;
}

// Main function to fetch therapists and create availability
async function setupMonthlyAvailability() {
  if (isTimeToCreateAvailability()) {
    try {
      const therapists = await fetchTherapists(); // Fetch therapists dynamically
      await createAvailabilityForNextMonth(therapists);
    } catch (error) {
      console.error('Error during monthly availability setup:', error);
    }
  } else {
    console.log('It is not time yet to create availability.');
  }
}

// Trigger the availability setup process
setupMonthlyAvailability();
