import { useState, useEffect } from 'react';

interface Client {
  initials: string;
  name: string;
  status: string;
  userID: string;
  email: string;
}

export const useFetchClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();

      const fetchedClients = data.users.map((user: any) => ({
        initials: `${user.name[0]}${user.name.split(' ')[1]?.[0] || ''}`,
        name: user.name,
        userID: user.$id,
        email: user.email,
        status: user.prefs?.status || 'Unknown',
      }));

      setClients(fetchedClients);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setError('Failed to fetch client data.');
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return { clients, setClients, error };
};
