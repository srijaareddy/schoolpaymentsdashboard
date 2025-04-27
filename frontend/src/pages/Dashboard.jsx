import { useState, useMemo } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { format } from 'date-fns';
import { FaSearch, FaFilter, FaArrowLeft, FaArrowRight, FaArrowUp, FaArrowDown, FaChartLine, FaCheckCircle, FaClock } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useQuery(
    ['transactions', page, status, startDate, endDate],
    async () => {
      const params = new URLSearchParams({
        page,
        limit: 10,
        ...(status && { status }),
        ...(startDate && { start_date: startDate }),
        ...(endDate && { end_date: endDate }),
      });

      const response = await axios.get(`http://localhost:5000/api/transactions?${params}`);
      return response.data;
    }
  );

  const { data: counts, isLoading: countsLoading } = useQuery('transactionCounts', async () => {
    const response = await axios.get('http://localhost:5000/api/transactions/counts');
    return response.data;
  });

  const filteredTransactions = useMemo(() => {
    if (!data?.transactions) return [];
    
    return data.transactions.filter(transaction => 
      transaction.school_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.collect_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.custom_order_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data?.transactions, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    setAppliedSearchTerm(searchTerm);
    setPage(1);
  };

  
  const calculateStats = () => {
    if (!data?.transactions) return { totalAmount: 0, successCount: 0, pendingCount: 0 };

    const transactions = data.transactions;
    const totalAmount = transactions.reduce((sum, t) => sum + t.transaction_amount, 0);
    const successCount = transactions.filter(t => t.status === 'Success').length;
    const pendingCount = transactions.filter(t => t.status === 'Pending').length;

    return { totalAmount, successCount, pendingCount };
  };

  const stats = calculateStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6 text-center">
        <div className="text-red-600 mb-4">Error loading transactions</div>
        <button onClick={() => window.location.reload()} className="btn btn-secondary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Transactions Dashboard
            </h1>
            <p className="text-gray-400 mt-2">Monitor and manage all school transactions</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by School ID, Collect ID, or Order ID..."
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-100 placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 hover:border-blue-500 transition-all duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-300">Total Transactions</h3>
              <FaChartLine className="text-blue-500 text-xl" />
            </div>
            <p className="text-3xl font-bold text-blue-400 mt-4">
              {countsLoading ? <LoadingSpinner /> : counts?.total || 0}
            </p>
            <div className="mt-4 h-2 bg-gray-700 rounded-full">
              <div className="h-2 bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 hover:border-green-500 transition-all duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-300">Successful Transactions</h3>
              <FaCheckCircle className="text-green-500 text-xl" />
            </div>
            <p className="text-3xl font-bold text-green-400 mt-4">
              {countsLoading ? <LoadingSpinner /> : counts?.success || 0}
            </p>
            <div className="mt-4 h-2 bg-gray-700 rounded-full">
              <div className="h-2 bg-green-500 rounded-full" style={{ width: `${(counts?.success / counts?.total) * 100 || 0}%` }}></div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 hover:border-yellow-500 transition-all duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-300">Pending Transactions</h3>
              <FaClock className="text-yellow-500 text-xl" />
            </div>
            <p className="text-3xl font-bold text-yellow-400 mt-4">
              {countsLoading ? <LoadingSpinner /> : counts?.pending || 0}
            </p>
            <div className="mt-4 h-2 bg-gray-700 rounded-full">
              <div className="h-2 bg-yellow-500 rounded-full" style={{ width: `${(counts?.pending / counts?.total) * 100 || 0}%` }}></div>
            </div>
          </div>
        </div>

        {/* Filters and Table */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">All Status</option>
              <option value="Success">Success</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
            
            <div className="flex gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Collect ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">School ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Gateway</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Order Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Transaction Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Custom Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.collect_id} className="hover:bg-gray-700 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-400">{transaction.collect_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{transaction.school_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{transaction.gateway}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-400">₹{transaction.order_amount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-400">₹{transaction.transaction_amount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.status === 'Success'
                          ? 'bg-green-900 text-green-300'
                          : transaction.status === 'Pending'
                          ? 'bg-yellow-900 text-yellow-300'
                          : 'bg-red-900 text-red-300'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{transaction.custom_order_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{format(new Date(transaction.created_at), 'dd/MM/yyyy')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-400">
              Showing {filteredTransactions.length} of {data?.totalTransactions} transactions
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaArrowLeft className="inline mr-2" />
                Previous
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= data?.totalPages}
                className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <FaArrowRight className="inline ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 