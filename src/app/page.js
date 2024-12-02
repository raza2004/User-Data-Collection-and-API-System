'use client'
import axios from 'axios';
import { useState, useEffect } from 'react';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ gender: '', city: '', country: '' });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/users', {
        params: {
          ...filters,
          page,
          limit: 10, // Adjust limit as needed
        },
      });
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
    setLoading(false);
  };

  // Function to trigger cron job API
  const triggerCronJob = async () => {
    try {
      const response = await axios.get('/api/cron');
      console.log('Cron job triggered:', response.data);
    } catch (err) {
      console.error('Failed to trigger cron job:', err);
    }
  };

  // Call fetchUsers whenever filters or page changes
  useEffect(() => {
    fetchUsers();
  }, [filters, page]);

  // Set up interval to call the cron job API every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      triggerCronJob();
    }, 5 * 60 * 1000); // 5 minutes

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [filters, page]);

  return (
    <div className="p-4">
      <div className="text-2xl font-bold mb-4">User Data</div>

      {/* Filters */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          className="border p-2"
          placeholder="Filter by city"
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
        />
        <input
          type="text"
          className="border p-2"
          placeholder="Filter by country"
          value={filters.country}
          onChange={(e) => setFilters({ ...filters, country: e.target.value })}
        />
        <select
          className="border p-2"
          value={filters.gender}
          onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
        >
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <button
          className="bg-blue-500 text-white p-2 rounded"
          onClick={fetchUsers}
        >
          Apply Filters
        </button>
      </div>

      {/* User List */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul className="list-disc ml-6">
          {users.map((user, idx) => (
            <li key={idx} className="mb-2">
              <strong>{user.name}</strong> ({user.gender}) - {user.email} -{' '}
              {user.city}, {user.country}
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      <div className="mt-4 flex items-center gap-4">
        <button
          disabled={page === 1}
          className={`p-2 bg-gray-300 rounded ${page === 1 ? 'opacity-50' : ''}`}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          className="p-2 bg-gray-300 rounded"
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UsersPage;
