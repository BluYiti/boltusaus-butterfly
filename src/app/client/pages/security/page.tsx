// SecuritySettings.tsx
const SecuritySettings = () => {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-semibold mb-4">Security</h1>
  
          {/* Security settings */}
          <ul className="space-y-4">
            <li className="text-sm">
              <span className="font-bold">Private account</span><br />
              You only have access to your account
            </li>
            <li className="text-sm">
              <span className="font-bold">All assessments are private</span>, only the Psychotherapist can view your pre-assessment and assessment scores
            </li>
            <li className="text-sm">
              <span className="font-bold">Recorded sessions are only accessed by the Psychotherapist</span>
            </li>
            <li className="text-sm">
              <span className="font-bold">Payment Accounts</span> can’t be accessed by Psychotherapists and Associates
            </li>
          </ul>
        </div>
      </div>
    );
  };
  
  export default SecuritySettings;
  