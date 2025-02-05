import { databases, Query } from '@/appwrite'; // Adjust import path as needed

const DATABASE_ID = "Butterfly-Database";
const COLLECTION_ID = "Payment";

export const fetchYearlyProfit = async () => {
    try {
        const now = new Date();
        const year = now.getFullYear();

        const firstDay = new Date(`${year}-01-01T00:00:00.000Z`);
        const lastDay = new Date(`${year + 1}-01-01T00:00:00.000Z`);
        lastDay.setMilliseconds(-1);

        const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.greaterThanEqual('$createdAt', firstDay.toISOString()),
            Query.lessThanEqual('$createdAt', lastDay.toISOString())
        ]);

        const transactions = response.documents || [];

        // Group by month and calculate total amount
        const monthlyProfit: Record<string, number> = {};

        transactions.forEach((transaction) => {
            if (transaction.status === 'paid') {
                const date = new Date(transaction.$createdAt);
                const month = date.toLocaleString('en-US', { month: 'long' }); // Get full month name
                
                if (!monthlyProfit[month]) {
                    monthlyProfit[month] = 0;
                }
                monthlyProfit[month] += transaction.amount;
            }
        });

        return { 
            monthlyProfit: monthlyProfit,  // This should be an object { Jan: 5000, Feb: 7000, ... }
            transactions: response.documents || []  // Ensure transactions is always an array
        };
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return {}; // Return empty object
    }
};


// Function to arrange the transactions by month

// Function to get the total amount from transactions
export function getTotalAmount(transactions) {
    return transactions.reduce((sum, transaction) => sum + (transaction.amount || 0), 0);
}
