import { useState, useEffect } from "react";
import Layout from "@/components/Sidebar/Layout";
import items from "@/associate/data/Links";
import PaymentModal from "@/associate/components/PaymentModal"; // Import the new modal component
import LoadingScreen from "@/components/LoadingScreen";
import useAuthCheck from "@/auth/page";
import { databases } from "@/appwrite";

// Define the PaymentHistory interface with the correct type for createdAt
interface PaymentHistory {
  referenceNo: string;
  mode: string;
  channel: string;
  amount: number;
  status: string;
  client: { firstname: string; lastname: string }; // Client's first and last name
  psychotherapist: { firstName: string; lastName: string }; // Psychotherapist's first and last name
  booking: string;
  id: string; // Add a unique identifier for each payment to use as a key
  clientFirstName: string;
  clientLastName: string;
  psychoFirstName: string;
  psychoLastName: string;
  email: string;
  createdAt: Date; // Ensure this is of type Date
  declineReason: string;
  receipt: string;
}

const ClientsPayment = () => {
  const { loading: authLoading } = useAuthCheck(['associate']);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // Add state for the status filter
  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [selectedClient, setSelectedClient] = useState(null); // State for selected client's payment details

  // Fetch data for clients
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await databases.listDocuments('Butterfly-Database', 'Payment');

        // Assuming each payment document has a 'client' and 'psychotherapist' object with 'firstname' and 'lastname'
        const fetchedPayments = response.documents.map((doc) => ({
          referenceNo: doc.referenceNo,
          mode: doc.booking.mode,
          channel: doc.channel,
          amount: doc.amount,
          status: doc.status,
          client: doc.client, // Assuming the client data is already in this format
          psychotherapist: doc.psychotherapist, // Same assumption
          booking: doc.booking,
          id: doc.$id, 
          clientFirstName: doc.client.firstname,
          clientLastName: doc.client.lastname,
          psychoFirstName: doc.psychotherapist.firstName,
          psychoLastName: doc.psychotherapist.lastName,
          email: doc.client.userid.email,
          // Convert createdAt from string to Date
          createdAt: new Date(doc.$createdAt), // This ensures it becomes a Date object
          declineReason: doc.declineReason,
          receipt: doc.receipt
        }));

        setPayments(fetchedPayments); // Store the payments in the state
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false); // End the loading state once data is fetched
      }
    };

    fetchData();
  }, []);

  const openModal = (client) => {
    setSelectedClient(client);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedClient(null);
  };

  // Filter the clients based on search term and status
  const filteredPayments = payments.filter((client) => {
    const matchesSearch =
      client.clientFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.clientLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || client.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const renderClients = () => (
    <div className="mt-4 space-y-3 max-h-full overflow-y-auto mb-4"> {/* Make this container scrollable */}
      {filteredPayments.map((client, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 bg-white shadow rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
            <div>
              <h4 className="font-semibold">{client.clientFirstName} {client.clientLastName}</h4>
              <p className="text-sm text-gray-500">{client.email}</p>
            </div>
          </div>
          <button
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-400 rounded-full hover:bg-blue-600 transition"
            onClick={() => openModal(client)}
          >
            View Payment
          </button>
        </div>
      ))}
    </div>
  );

  if (authLoading || loading) {
    return <LoadingScreen />;
  }

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="bg-blue-50 min-h-screen flex flex-col">
        <div className="bg-white width rounded-b-lg fixed p-5 top-0 w-full z-10">
          <h2 className="text-2xl font-bold text-blue-400">Client&apos;s Payment</h2>
        </div>

        <div className="mt-24 px-5 flex-1 overflow-hidden">
          <div className="flex items-center justify-between">
            {/* Combined Search Input and Dropdown Filter */}
            <div className="flex items-center space-x-4">
              {/* Search Input */}
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Search clients..."
                  className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute top-2.5 right-3 h-5 w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M11 18a7 7 0 110-14 7 7 0 010 14z"
                  />
                </svg>
              </div>

              {/* Dropdown Filter for Status */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="rescheduled">Reschedule</option>
                  <option value="refunded">Refund</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 flex-1 overflow-y-auto">
            {renderClients()}
          </div>
        </div>
      </div>

      {/* Modal for Payment Details */}
      <PaymentModal 
        isOpen={showModal} 
        onClose={closeModal} 
        client={selectedClient} 
      />
    </Layout>
  );
};

export default ClientsPayment;
