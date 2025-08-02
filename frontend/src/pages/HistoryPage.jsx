import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/api'
import { useAuth } from '../contexts/AuthContext';
import { History, UserRound } from 'lucide-react';

function HistoryPage() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth();
  const [userHistory, setUserHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserHistory = async () => {
      if (!isAuthenticated) {
        setLoadingHistory(false);
        return;
      }
      setLoadingHistory(true);
      setError(null);
      try {
        const response = await API.get('/history');
        setUserHistory(response.data);
      } catch (err) {
        console.error('Error fetching history:', err.response?.data?.message || err.message);
        setError(err.response?.data?.message || 'Failed to load history.');
        setUserHistory([]);
      } finally {
        setLoadingHistory(false);
      }
    };

    if (!authLoading) {
      fetchUserHistory();
    }
  }, [isAuthenticated, authLoading]);

  if (authLoading || loadingHistory) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-inter p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-gray-200">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
            Symptom <span className="text-blue-600">Checker</span>
          </h1>
          <div className="flex items-center space-x-4">
            {user && (
              <span className="text-gray-700 text-lg font-medium flex items-center">
                <UserRound className="mr-2 text-purple-600" size={20} /> {user.name} ({user.age}, {user.sex})
              </span>
            )}
            <button
              onClick={logout}
              className="px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition duration-200 ease-in-out"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="flex justify-center mb-8 space-x-4">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-full font-semibold text-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition duration-300 ease-in-out"
          >
            Checker
          </button>
          <button
            onClick={() => navigate('/history')}
            className="px-6 py-3 rounded-full font-semibold text-lg bg-blue-600 text-white shadow-md transition duration-300 ease-in-out"
          >
            <History className="inline-block mr-2" size={20} /> History
          </button>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <History className="mr-2 text-orange-600" size={28} /> Your Search History
        </h2>
        {!isAuthenticated ? (
          <p className="text-gray-600 text-center py-8">Please log in to view your search history.</p>
        ) : userHistory.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No history found. Start detecting diseases on the Checker tab!</p>
        ) : (
          <ul className="space-y-4">
            {userHistory.map((entry) => (
              <li key={entry._id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500 mb-2">
                  <span className="font-semibold">Date:</span> {new Date(entry.timestamp).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  <span className="font-semibold">User:</span> {entry.userName} (Age: {entry.userAge}, Sex: {entry.userSex})
                </p>
                <p className="font-semibold text-gray-800 mb-2">
                  Symptoms Selected: <span className="font-normal">{entry.selectedSymptoms.map(s => s.name).join(', ')}</span>
                </p>
                <p className="font-semibold text-gray-800">
                  Detected Disease: <span className="font-normal text-blue-700">{entry.detectedDisease.name}</span>
                </p>
                <p className="text-gray-600 text-sm mt-1">{entry.detectedDisease.description.substring(0, 100)}...</p>
              </li>
            ))}
          </ul>
        )}
        {error && (
          <div className="mt-8 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryPage;