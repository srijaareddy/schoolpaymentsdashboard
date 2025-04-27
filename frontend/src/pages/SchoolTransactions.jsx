import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { format } from 'date-fns';

const SchoolTransactions = () => {
  const { schoolId } = useParams();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data, isLoading, error } = useQuery(
    ['schoolTransactions', schoolId, startDate, endDate],
    async () => {
      const params = new URLSearchParams({
        ...(startDate && { start_date: startDate }),
        ...(endDate && { end_date: endDate }),
      });

      const response = await axios.get(
        `http://localhost:5000/api/transactions/school/${schoolId}?${params}`
      );
      return response.data;
    }
  );

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Error loading transactions</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Transactions for School: {schoolId}
        </h1>
        <div className="flex items-center space-x-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="input"
            placeholder="Start Date"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="input"
            placeholder="End Date"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Collect ID</th>
                <th>Gateway</th>
                <th>Order Amount</th>
                <th>Transaction Amount</th>
                <th>Status</th>
                <th>Custom Order ID</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((transaction) => (
                <tr key={transaction.collect_id}>
                  <td>{transaction.collect_id}</td>
                  <td>{transaction.gateway}</td>
                  <td>₹{transaction.order_amount}</td>
                  <td>₹{transaction.transaction_amount}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.status === 'Success'
                          ? 'bg-green-100 text-green-800'
                          : transaction.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td>{transaction.custom_order_id}</td>
                  <td>{format(new Date(transaction.created_at), 'dd/MM/yyyy')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SchoolTransactions; 