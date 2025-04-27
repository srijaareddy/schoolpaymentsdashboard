import { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';

const StatusChecker = () => {
  const [orderId, setOrderId] = useState('');
  const [searchOrderId, setSearchOrderId] = useState('');

  const { data, isLoading, error, refetch } = useQuery(
    ['transactionStatus', searchOrderId],
    async () => {
      if (!searchOrderId) return null;
      const response = await axios.get(
        `http://localhost:5000/api/transactions/check-status/${searchOrderId}`
      );
      return response.data;
    },
    {
      enabled: !!searchOrderId,
    }
  );

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchOrderId(orderId);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="page-title">Check Transaction Status</h1>
        <p className="text-gray-600">
          Enter the Custom Order ID to check the status of your transaction
        </p>
      </div>
      
      <div className="card p-8">
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="form-group">
            <label htmlFor="orderId" className="form-label">
              Custom Order ID
            </label>
            <div className="relative">
              <input
                type="text"
                id="orderId"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="input pl-10"
                placeholder="Enter Custom Order ID"
                required
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FaSpinner className="loading-spinner" />
                Checking...
              </>
            ) : (
              'Check Status'
            )}
          </button>
        </form>

        {isLoading && (
          <div className="mt-8 flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {error && (
          <div className="mt-8 p-4 bg-red-50 rounded-lg">
            <div className="text-red-600 font-medium">
              {error.response?.data?.message || 'Error checking transaction status'}
            </div>
            <button
              onClick={() => refetch()}
              className="mt-4 btn btn-secondary"
            >
              Try Again
            </button>
          </div>
        )}

        {data && (
          <div className="mt-8 space-y-4">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">Transaction Status</div>
              <div
                className={`status-badge ${
                  data.status === 'Success'
                    ? 'status-success'
                    : data.status === 'Pending'
                    ? 'status-pending'
                    : 'status-failed'
                } text-lg`}
              >
                {data.status}
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-gray-600">Order ID</div>
                <div className="font-medium">{searchOrderId}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-gray-600">Last Checked</div>
                <div className="font-medium">
                  {new Date().toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusChecker; 