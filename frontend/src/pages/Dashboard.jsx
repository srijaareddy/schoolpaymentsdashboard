import { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { format } from 'date-fns';
import { FaSearch, FaFilter, FaArrowLeft, FaArrowRight, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useQuery(
    ['transactions', page, status, startDate, endDate, searchTerm],
    async () => {
      const params = new URLSearchParams({
        page,
        limit: 10,
        ...(status && { status }),
        ...(startDate && { start_date: startDate }),
        ...(endDate && { end_date: endDate }),
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await axios.get(`http://localhost:5000/api/transactions?${params}`);
      return response.data;
    }
  );

  const { data: counts, isLoading: countsLoading } = useQuery('transactionCounts', async () => {
    const response = await axios.get('http://localhost:5000/api/transactions/counts');
    return response.data;
  });

  const handleSearch = (e) => {
    e.preventDefault();
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
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="page-title">Transactions Dashboard</h1>
          <p className="page-subtitle">Monitor and manage all school transactions</p>
        </div>
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by School ID or Order ID..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Transactions</h3>
          <p className="text-3xl font-bold text-blue-600">
            {countsLoading ? <LoadingSpinner /> : counts?.total || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Successful Transactions</h3>
          <p className="text-3xl font-bold text-green-600">
            {countsLoading ? <LoadingSpinner /> : counts?.success || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Pending Transactions</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {countsLoading ? <LoadingSpinner /> : counts?.pending || 0}
          </p>
        </div>
      </div>

      <div className="card p-6">
        <div className="filter-group">
          <div className="filter-item">
            <div className="select-wrapper">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="select"
              >
                <option value="">All Status</option>
                <option value="Success">Success</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>
          <div className="filter-item flex gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="date-input"
              placeholder="Start Date"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="date-input"
              placeholder="End Date"
            />
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Collect ID</th>
                <th>School ID</th>
                <th>Gateway</th>
                <th>Order Amount</th>
                <th>Transaction Amount</th>
                <th>Status</th>
                <th>Custom Order ID</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data?.transactions.map((transaction) => (
                <tr key={transaction.collect_id} className="animate-slide-up">
                  <td className="font-medium">{transaction.collect_id}</td>
                  <td>{transaction.school_id}</td>
                  <td>{transaction.gateway}</td>
                  <td className="font-medium">₹{transaction.order_amount.toLocaleString()}</td>
                  <td className="font-medium">₹{transaction.transaction_amount.toLocaleString()}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        transaction.status === 'Success'
                          ? 'status-success'
                          : transaction.status === 'Pending'
                          ? 'status-pending'
                          : 'status-failed'
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

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">
          <div className="text-sm text-gray-600">
            Showing {data?.transactions.length} of {data?.totalTransactions} transactions
          </div>
          <div className="pagination">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="pagination-btn"
            >
              <FaArrowLeft />
              Previous
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= data?.totalPages}
              className="pagination-btn"
            >
              Next
              <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 