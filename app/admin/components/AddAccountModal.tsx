import { useState } from 'react';
import { account, databases, ID } from '@/appwrite';
import { Query } from 'appwrite';
import SuccessModal from './SuccessfulAddAccount';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTab: string; // To know which tab is currently active
}

const AddAccountModal: React.FC<AddAccountModalProps> = ({ isOpen, onClose, selectedTab }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+63');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState<string | null>(null);
  const [isAdminValidating, setIsAdminValidating] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\+63\d{10}$/;
    return phoneRegex.test(phone);
  };

  const handleAdminValidation = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);
    setIsAdminValidating(true);
  
    try {
      // Query the Accounts collection for the provided email
      const response = await databases.listDocuments('Butterfly-Database', 'Accounts', [
        Query.equal('email', adminEmail)
      ]);

      // Check if the email exists
      if (response.documents.length === 0) {
        throw new Error('Admin email not found');
      }

      // Log out any existing session
      await account.deleteSession('current');
      console.log('Logged out admin');

      // Call handleSubmit to proceed with account creation or any other logic
      await handleSubmit();

      // Log the admin back in using their credentials (assuming you have adminEmail and password available)
      const loginResponse = await account.createEmailPasswordSession(adminEmail, adminPassword);
      console.log('Logged in admin');

      {isModalOpen && (
        <SuccessModal selectedTab={selectedTab} onClose={() => setModalOpen(false)} />
      )}
      if (!loginResponse) {
        throw new Error('Failed to log in the admin');
      }

      setIsAdminModalOpen(false);
      onClose();
    } catch (err: any) {
      setAdminError(err.message || 'Invalid admin credentials');
    } finally {
      setIsAdminValidating(false);
    }
  };  

  const handleSubmit = async () => {
    setError(null);
    // Check if the email and phone number are valid
    if (!validateEmail(email)) {
      setError('Invalid email format.');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError('Phone number must start with +63 and be exactly 10 digits after +63.');
      return;
    }

    setLoading(true);
    try {
      const name = `${firstName} ${lastName}`;

      // Create the account in appwrite
      const userResponse = await account.create(ID.unique(), email, password, name);
      const accountId = userResponse.$id;
      console.log('Account created successfully');

      // Log in the user immediately after creating the account
      await account.createEmailPasswordSession(email, password);
      console.log('User logged in successfully.');

      // Create the user in the "Accounts" collection
      await databases.createDocument('Butterfly-Database', 'Accounts', accountId, {
        username: name,
        email: email,
        role: selectedTab.toLowerCase(),
      });
      console.log('Accounts Collection document added');

      // Create the user in the selected tab collection
      await databases.createDocument('Butterfly-Database', selectedTab, ID.unique(), {
        userId: accountId,
        firstName: firstName,
        lastName: lastName,
        phonenum: phoneNumber
      });

      console.log(selectedTab, ' Collection document added');

      // Log out the user
      await account.deleteSession('current'); // 'current' refers to the active session
      console.log('User logged out successfully.');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Main Add Account Modal */}
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-semibold mb-4">Add Account</h2>

          {error && <p className="text-red-500">{error}</p>}

          <form onSubmit={(e) => { e.preventDefault(); setIsAdminModalOpen(true); }} className="space-y-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-gray-500"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-gray-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-gray-500"
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                maxLength={13}
                className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-gray-500"
                placeholder="+63"
              />
              <small className="text-xs text-gray-500">Format: +63 followed by 10 digits</small>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-gray-500"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
              >
                {loading ? 'Adding...' : 'Next'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Admin Credentials Modal */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Admin Authentication</h2>

            {adminError && <p className="text-red-500">{adminError}</p>}

            <form onSubmit={handleAdminValidation} className="space-y-4">
              <div>
                <label htmlFor="adminEmail" className="block text-sm font-medium">
                  Admin Email
                </label>
                <input
                  type="email"
                  id="adminEmail"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                  className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-gray-500"
                />
              </div>

              <div>
                <label htmlFor="adminPassword" className="block text-sm font-medium">
                  Admin Password
                </label>
                <input
                  type="password"
                  id="adminPassword"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                  className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-gray-500"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAdminModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdminValidating}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                >
                  {isAdminValidating ? 'Validating...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddAccountModal;
