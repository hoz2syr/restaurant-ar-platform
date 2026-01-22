'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, AdminUser } from '@/lib/auth';

export function useAuth(requireAuth: boolean = true) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    
    if (!currentUser && requireAuth) {
      router.push('/login');
    } else {
      setUser(currentUser);
    }
    
    setLoading(false);
  }, [requireAuth, router]);

  const logout = () => {
    auth.logout();
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    logout,
  };
}
