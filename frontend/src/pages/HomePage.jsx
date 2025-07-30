import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { Search, XCircle, HeartPulse, Stethoscope, History, Info, UserRound } from 'lucide-react';

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

  useEffect(() => {
    const fetchSymptoms = async () => {
      setIsLoadingSymptoms(true);
      setError(null);
      try {
        const response = await API.get('/symptoms');
        setAvailableSymptoms(response.data);
      } catch (err) {
        console.error('Error fetching symptoms:', err.response?.data?.message || err.message);
        setError('Failed to load symptoms. Please try again later.');
      } finally {
        setIsLoadingSymptoms(false);
      }
    };
    fetchSymptoms();
  }, []);

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
      setError('Please select at least 4 symptom.');
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
            className="px-6 py-3 rounded-full font-semibold text-lg bg-blue-600 text-white shadow-md transition duration-300 ease-in-out"
          >
            Checker
          </button>
          <button
            onClick={() => navigate('/history')}
            className="px-6 py-3 rounded-full font-semibold text-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition duration-300 ease-in-out"
          >
            <History className="inline-block mr-2" size={20} /> History
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Search className="mr-2 text-blue-600" size={24} /> Select Your Symptoms (Max 5)
          </h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search for a symptom..."
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={selectedSymptoms.length >= 5}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            {isLoadingSymptoms && (
              <p className="text-blue-500 text-sm mt-2">Loading symptoms...</p>
            )}
            {error && !isLoadingSymptoms && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
            {searchTerm && filteredSymptoms.length > 0 && selectedSymptoms.length < 5 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                {filteredSymptoms.map(symptom => (
                  <li
                    key={symptom.id}
                    className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => addSymptom(symptom)}
                  >
                    {symptom.name}
                  </li>
                ))}
              </ul>
            )}
            {selectedSymptoms.length >= 5 && (
              <p className="text-orange-600 text-sm mt-2">Maximum 5 symptoms selected. Remove some to add more.</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <HeartPulse className="mr-2 text-green-600" size={24} /> Your Selected Symptoms
          </h2>
          {selectedSymptoms.length === 0 ? (
            <p className="text-gray-500">No symptoms selected yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedSymptoms.map(symptom => (
                <span
                  key={symptom.id}
                  className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full flex items-center text-sm font-medium shadow-sm transition duration-200 ease-in-out hover:bg-blue-200"
                >
                  {symptom.name}
                  <XCircle
                    className="ml-2 text-blue-600 cursor-pointer hover:text-blue-800"
                    size={18}
                    onClick={() => removeSymptom(symptom.id)}
                  />
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={getDiseaseSuggestions}
          disabled={selectedSymptoms.length < 4 || isLoadingDiagnosis}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-800 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoadingDiagnosis ? (
            <>
              <Stethoscope className="animate-pulse mr-2" size={20} /> Detecting...
            </>
          ) : (
            <>
              <Stethoscope className="mr-2" size={20} /> Detect Potential Disease
            </>
          )}
        </button>

        {error && !isLoadingDiagnosis && (
          <div className="mt-8 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
            <p className="font-semibold">Detection Error:</p>
            <p>{error}</p>
          </div>
        )}

        {detectedDisease && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <Info className="mr-2 text-purple-600" size={24} /> Detected Condition
            </h2>
            <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{detectedDisease.name}</h3>
              <p className="text-gray-700 leading-relaxed">{detectedDisease.description}</p>
              <div className="mt-4 text-sm text-gray-600">
                {detectedDisease.commonSymptoms && detectedDisease.commonSymptoms.length > 0 && (
                    <p><span className="font-semibold">Common Symptoms:</span> {detectedDisease.commonSymptoms.join(', ')}</p>
                )}
                {detectedDisease.riskFactors && detectedDisease.riskFactors.length > 0 && (
                    <p><span className="font-semibold">Risk Factors:</span> {detectedDisease.riskFactors.join(', ')}</p>
                )}
                <p><span className="font-semibold">Basic Treatment:</span> {detectedDisease.basicTreatment}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;