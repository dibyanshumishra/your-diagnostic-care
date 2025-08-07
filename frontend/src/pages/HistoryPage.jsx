import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/api'
import { useAuth } from '../contexts/AuthContext';
import { History, UserRound, LogOut, Stethoscope } from 'lucide-react';

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
        const sortedHistory = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setUserHistory(sortedHistory);
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-4 sm:p-6 lg:p-8">
      {/* The change is in the line below */}
      <div className="w-full">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Symptom<span className="text-indigo-600">Checker</span>
          </h1>
          <div className="flex items-center space-x-4">
            {user && (
              <div className="text-right">
                <p className="text-slate-800 font-semibold flex items-center">
                  <UserRound className="mr-2 text-indigo-500" size={20} /> {user.name}
                </p>
                <p className="text-slate-500 text-sm">{user.age} years, {user.sex}</p>
              </div>
            )}
            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        <nav className="flex justify-center mb-10 space-x-2">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-full font-semibold text-lg text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <Stethoscope className="inline-block mr-2" size={20} /> Checker
          </button>
          <button
            onClick={() => navigate('/history')}
            className="px-6 py-3 rounded-full font-semibold text-lg bg-indigo-600 text-white shadow-lg transition-transform hover:scale-105"
          >
            <History className="inline-block mr-2" size={20} /> History
          </button>
        </nav>

        <main>
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
            <History className="mr-3 text-indigo-500" size={28} /> Your Diagnosis History
          </h2>
          {!isAuthenticated ? (
            <div className="text-center py-12">
              <p className="text-slate-500">Please log in to view your diagnosis history.</p>
            </div>
          ) : userHistory.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-slate-200">
              <p className="text-slate-500">No history found. Start a new diagnosis on the Checker tab!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userHistory.map((entry) => (
                <div key={entry._id} className="bg-white p-5 rounded-lg shadow-sm border border-slate-200 transition-shadow hover:shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-indigo-700">{entry.detectedDisease.name}</h3>
                      <p className="text-sm text-slate-500 mt-1">
                        <span className="font-semibold">Symptoms:</span> {entry.selectedSymptoms.map(s => s.name).join(', ')}
                      </p>
                    </div>
                    <p className="text-sm text-slate-400 text-right whitespace-nowrap">
                      {new Date(entry.timestamp).toLocaleDateString()}
                      <br />
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {error && (
            <div className="mt-8 p-4 bg-red-100 text-red-800 rounded-lg border border-red-200">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default HistoryPage;