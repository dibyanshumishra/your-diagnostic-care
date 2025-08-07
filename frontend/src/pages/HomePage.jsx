import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { Search, X, HeartPulse, Stethoscope, History, Info, UserRound, LogOut } from 'lucide-react';

function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [availableSymptoms, setAvailableSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [detectedDisease, setDetectedDisease] = useState(null);
  const [isLoadingSymptoms, setIsLoadingSymptoms] = useState(false);
  const [isLoadingDiagnosis, setIsLoadingDiagnosis] = useState(false);
  const [error, setError] = useState(null);

  const fetchSymptoms = useCallback(async () => {
      // Guard clause: Do not run this function if the user or user.age is not available yet.
      if (!user || !user.age) {
        return;
      }
      setIsLoadingSymptoms(true);
      setError(null);
      try {
        const response = await API.get(`/symptoms?age=${user.age}`);
        const data = await response.data;
        setAvailableSymptoms(data);
        
      } catch (err) {
        console.error('Error fetching symptoms:', err.response?.data?.message || err.message);
        setError('Failed to load symptoms. Please try again later.');
      } finally {
        setIsLoadingSymptoms(false);
      }
  }, [user]);
    
  useEffect(() => {
    fetchSymptoms();
  }, [fetchSymptoms]);

  const addSymptom = (symptom) => {
    if (!selectedSymptoms.some(s => s.id === symptom.id)) {
      if (selectedSymptoms.length < 5) {
        setSelectedSymptoms([...selectedSymptoms, symptom]);
        setSearchTerm('');
        setDetectedDisease(null);
        setError(null);
      } else {
        setError('You can select a maximum of 5 symptoms.');
      }
    }
  };

  const removeSymptom = (symptomId) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s.id !== symptomId));
    setDetectedDisease(null);
    setError(null);
  };

  const getDiseaseSuggestions = useCallback(async () => {
    if (selectedSymptoms.length === 0) {
      setError('Please select at least one symptom.');
      setDetectedDisease(null);
      return;
    }
    if (selectedSymptoms.length < 4) {
      setError('Please select at least 4 symptoms for a better detection.');
      setDetectedDisease(null);
      return;
    }

    if (!user || typeof user.age !== 'number' || !user.sex) {
        setError('User age and sex are required for accurate diagnosis. Please ensure your profile is complete.');
        setDetectedDisease(null);
        return;
    }


    setIsLoadingDiagnosis(true);
    setError(null);
    setDetectedDisease(null);

    try {
      const response = await API.post('/diagnose', {
        symptomIds: selectedSymptoms.map(s => s.id),
        sex: user.sex,
        age: user.age,
      });

      const primaryDisease = response.data[0]; 

      if (primaryDisease) {
        setDetectedDisease(primaryDisease);

        if (user) {
          await API.post('/history', {
            selectedSymptoms: selectedSymptoms.map(s => ({ id: s.id, name: s.name })),
            detectedDisease: {
              id: primaryDisease.id,
              name: primaryDisease.name,
              description: primaryDisease.description,
            },
          });
        }
      } else {
        setError('No particular disease could be detected with these symptoms. Please try different symptoms.');
        setDetectedDisease(null);
      }

    } catch (err) {
      console.error('Error getting disease suggestions:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Failed to get suggestions. Please try again.');
      setDetectedDisease(null);
    } finally {
      setIsLoadingDiagnosis(false);
    }
  }, [selectedSymptoms, user]);

  const filteredSymptoms = availableSymptoms.filter(symptom =>
    symptom.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedSymptoms.some(ss => ss.id === symptom.id)
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-4 sm:p-6 lg:p-8">
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
            className="px-6 py-3 rounded-full font-semibold text-lg bg-indigo-600 text-white shadow-lg transition-transform hover:scale-105"
          >
            <Stethoscope className="inline-block mr-2" size={20} /> Checker
          </button>
          <button
            onClick={() => navigate('/history')}
            className="px-6 py-3 rounded-full font-semibold text-lg text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <History className="inline-block mr-2" size={20} /> History
          </button>
        </nav>

        <main className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
              <Search className="mr-3 text-indigo-500" size={28} /> Select Your Symptoms
            </h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for a symptom (e.g., headache, fever)"
                className="w-full p-4 pl-12 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-black"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={selectedSymptoms.length >= 5}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={22} />
              {isLoadingSymptoms && (
                <p className="text-indigo-500 text-sm mt-2">Loading symptoms...</p>
              )}
              {searchTerm && filteredSymptoms.length > 0 && selectedSymptoms.length < 5 && (
                <ul className="absolute z-10 w-full bg-white border border-slate-300 rounded-lg shadow-xl mt-1 max-h-60 overflow-y-auto text-black">
                  {filteredSymptoms.map(symptom => (
                    <li
                      key={symptom.id}
                      className="p-3 hover:bg-indigo-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                      onClick={() => addSymptom(symptom)}
                    >
                      {symptom.name}
                    </li>
                  ))}
                </ul>
              )}
              {selectedSymptoms.length >= 5 && (
                <p className="text-amber-600 text-sm mt-2">Maximum 5 symptoms selected. Remove one to add another.</p>
              )}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
              <HeartPulse className="mr-3 text-green-500" size={28} /> Selected Symptoms
            </h2>
            {selectedSymptoms.length === 0 ? (
              <p className="text-slate-500">Your selected symptoms will appear here.</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {selectedSymptoms.map(symptom => (
                  <span
                    key={symptom.id}
                    className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full flex items-center text-md font-medium shadow-sm"
                  >
                    {symptom.name}
                    <button onClick={() => removeSymptom(symptom.id)} className="ml-2">
                      <X
                        className="text-indigo-500 cursor-pointer hover:text-indigo-800"
                        size={18}
                      />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </section>
          
          <section className="text-center">
            <button
              onClick={getDiseaseSuggestions}
              disabled={selectedSymptoms.length < 4 || isLoadingDiagnosis}
              className="w-full max-w-xs bg-indigo-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              {isLoadingDiagnosis ? (
                <>
                  <Stethoscope className="animate-pulse mr-2" size={22} /> Analyzing...
                </>
              ) : (
                <>
                  <Stethoscope className="mr-2" size={22} /> Diagnose Now
                </>
              )}
            </button>
          </section>

          {error && (
            <div className="mt-8 p-4 bg-red-100 text-red-800 rounded-lg border border-red-200">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}
          
          {detectedDisease && (
            <section className="mt-10">
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
                <Info className="mr-3 text-indigo-500" size={28} /> Diagnosis Result
              </h2>
              <div className="bg-slate-50 p-6 rounded-lg shadow-inner border border-slate-200">
                <h3 className="text-2xl font-bold text-indigo-700 mb-3">{detectedDisease.name}</h3>
                <p className="text-slate-600 leading-relaxed">{detectedDisease.description}</p>
                <div className="mt-4 text-sm text-slate-600 space-y-2">
                  {detectedDisease.commonSymptoms && detectedDisease.commonSymptoms.length > 0 && (
                      <p><span className="font-semibold text-slate-700">Common Symptoms:</span> {detectedDisease.commonSymptoms.join(', ')}</p>
                  )}
                  {detectedDisease.riskFactors && detectedDisease.riskFactors.length > 0 && (
                      <p><span className="font-semibold text-slate-700">Risk Factors:</span> {detectedDisease.riskFactors.join(', ')}</p>
                  )}
                  <p><span className="font-semibold text-slate-700">Basic Treatment:</span> {detectedDisease.basicTreatment}</p>
                </div>
              </div>
            </section>
          )}

        </main>
      </div>
    </div>
  );
}

export default HomePage;