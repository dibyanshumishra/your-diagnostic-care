import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Lock, CalendarDays, KeyRound, Venus, Mars } from 'lucide-react'; // Icons

function AuthPage({ type }) {
  const navigate = useNavigate();
  const { register, login, isAuthenticated, loading } = useAuth();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); 

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    let result;
    if (type === 'register') {
      const parsedAge = parseInt(age);
      if (isNaN(parsedAge)) {    //NaN presents illegal numbers ,ie- illegal math operations
        setMessage('Please enter a valid age.');
        setMessageType('error');
        return;
      }
      result = await register(name, parsedAge, sex, email, password);
    } else {
      result = await login(email, password);
    }

    if (result.success) {
      setMessage(`Successfully ${type === 'register' ? 'registered' : 'logged in'}! Redirecting...`);
      setMessageType('success');
      setTimeout(() => navigate('/'), 1500);
    } else {
      setMessage(result.message || `Failed to ${type === 'register' ? 'register' : 'log in'}.`);
      setMessageType('error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          {type === 'register' ? 'Register' : 'Login'}
        </h2>

        {message && (
          <div className={`p-3 mb-4 rounded-lg text-center text-sm ${
            messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {type === 'register' && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="name">
                  Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    id="name"
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="age">
                  Age
                </label>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="number"
                    id="age"
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min="0"
                    max="120"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="sex">
                  Sex
                </label>
                <div className="relative">
                  {sex === 'male' ? <Mars className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} /> :
                   sex === 'female' ? <Venus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} /> :
                   <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />}
                  <select
                    id="sex"
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 appearance-none"
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                    required
                  >
                    <option value="">Select Sex</option>
                    <option value="male">male</option> {/* Infermedica expects lowercase 'male'/'female' */}
                    <option value="female">female</option>
                  </select>

                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>
            </>
          )}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                id="email"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                id="password"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={type === 'register' ? 6 : 1}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-800 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <>
                <KeyRound className="animate-pulse mr-2" size={20} /> Processing...
              </>
            ) : (
              <>
                <KeyRound className="mr-2" size={20} /> {type === 'register' ? 'Register' : 'Login'}
              </>
            )}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          {type === 'register' ? 'Already have an account?' : 'Don\'t have an account?'}
          <Link to={type === 'register' ? '/login' : '/register'} className="text-blue-600 hover:underline ml-1 font-semibold">
            {type === 'register' ? 'Login here' : 'Register here'}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default AuthPage;