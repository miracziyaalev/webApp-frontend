'use client';

import { useRouter } from 'next/navigation';

export default function Unauthorized() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-6">
          <h1 className="text-2xl font-bold text-white text-center">Yetkisiz Erişim</h1>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Bu sayfaya erişim yetkiniz bulunmamaktadır. Sadece admin kullanıcılar bu sayfaya erişebilir.
            </p>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 