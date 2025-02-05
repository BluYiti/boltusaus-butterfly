import { useState } from "react";

const RenderReports = ({ monthlyProfit, transactions }) => {
  const [openMonths, setOpenMonths] = useState({});

  // Function to toggle month expansion
  const toggleMonth = (month) => {
    setOpenMonths((prev) => ({
      ...prev,
      [month]: !prev[month], // Toggle specific month
    }));
  };

  return (
    <div className="mt-4 space-y-3">
      <h3 className="text-lg font-bold mb-4">Monthly Profit</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(monthlyProfit).map(([month, profit]) => {
          return (
            <div
              key={month}
              className="p-4 bg-white shadow rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg"
              onClick={() => toggleMonth(month)} // ✅ Now the whole div is clickable
            >
              <h4 className="font-semibold text-blue-500">{month}</h4>
              <p className="text-gray-700 text-lg">₱{profit.toLocaleString()}</p>

              {openMonths[month] && (
                <div className="mt-2 bg-gray-100 p-2 rounded-lg">
                  <h5 className="font-semibold text-gray-600 mb-2">
                    Transactions:
                  </h5>
                  <ul className="space-y-1">
                    {transactions
                      .filter((t) => {
                        const transactionDate = new Date(t.$createdAt);
                        const transactionMonth = transactionDate.toLocaleString(
                          "en-US",
                          { month: "long" }
                        );

                        return (
                          transactionMonth.toLowerCase() === month.toLowerCase() &&
                          t.status === "paid"
                        );
                      })
                      .map((t, index) => (
                        <li key={index} className="text-sm text-gray-700">
                          {new Date(t.$createdAt).toLocaleDateString()} - ₱
                          {t.amount.toLocaleString()} ({t.channel})
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RenderReports;
