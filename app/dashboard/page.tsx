'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/remote-configs`;

interface User {
  username: string;
  isAdmin: boolean;
}

export default function Dashboard() {
  const router = useRouter();
  const [configValue, setConfigValue] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Authentication kontrolü
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userStr = localStorage.getItem('user');
    
    if (!isAuthenticated || !userStr) {
      router.push('/login');
      return;
    }

    const userData = JSON.parse(userStr) as User;
    setUser(userData);
    fetchConfig();
  }, [router]);

  // Config değerini getir
  const fetchConfig = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setConfigValue(Boolean(data.value));
      setError(null);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      setError('Failed to fetch config value');
    } finally {
      setLoading(false);
    }
  };

  // Config değerini güncelle
  const updateConfig = async (newValue: boolean) => {
    try {
      setLoading(true);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: Number(newValue) }),
      });
      const data = await response.json();
      setConfigValue(Boolean(data.value));
      setError(null);
      setIsDropdownOpen(false);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      setError('Failed to update config value');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Remote Config Control</h1>
              <p className="text-blue-100 text-sm mt-1">Welcome, {user?.username}</p>
            </div>
            <div className="flex items-center gap-4">
              {user.isAdmin && (
                <button
                  onClick={() => router.push('/dashboard/users')}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Users
                </button>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Logout
              </button>
            </div>
            
          </div>
        </div>

        <div className="p-6 space-y-6">
          {loading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-red-600 text-center mb-3">{error}</div>
              <button 
                onClick={fetchConfig}
                className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
              >
                Retry Connection
              </button>
            </div>
          ) : (
            <>
              {/* Status Card */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">Current Status:</span>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                    configValue 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {configValue ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-6">
                <button
                  onClick={() => updateConfig(true)}
                  className={`px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${
                    configValue
                      ? 'bg-green-600 text-white'
                      : 'bg-green-100 text-green-800 hover:bg-green-600 hover:text-white'
                  }`}
                  disabled={loading}
                >
                  Activate
                </button>
                <button
                  onClick={() => updateConfig(false)}
                  className={`px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${
                    !configValue
                      ? 'bg-red-600 text-white'
                      : 'bg-red-100 text-red-800 hover:bg-red-600 hover:text-white'
                  }`}
                  disabled={loading}
                >
                  Deactivate
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            {lastUpdated ? `Last updated: ${lastUpdated}` : 'Not updated yet'}
          </p>
        </div>
      </div>
    </div>
  );
} 