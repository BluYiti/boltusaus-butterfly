export default function BookSession() {
    // Retrieve stored details from sessionStorage
    const selectedDate = sessionStorage.getItem('selectedDate');
    const selectedTime = sessionStorage.getItem('selectedTime');
    const consultationOption = sessionStorage.getItem('consultationOption');
  
    return (
      <div className="text-center flex flex-col items-center justify-center min-h-screen p-6">
        <h1 className="text-2xl font-bold mb-4">Hi Raianna!</h1>
        <p className="mb-2">I'm Hanni, your psychologist.</p>
        <p className="mb-6">
          Book your first live consultation. <br />
          Available on: {selectedDate} at {selectedTime} ({consultationOption})
        </p>
        <button className="py-2 px-8 bg-blue-500 text-white rounded-lg">
          BOOK SESSION
        </button>
      </div>
    );
  }
  