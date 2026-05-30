import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../../utils/general';
import Loader from '../Loader';

interface AuthRouteProps {
  children: React.ReactNode;
  isPublic?: boolean;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children, isPublic = false }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  const checkAuthentication = () => {
    try {
      const authenticated = isAuthenticated();
      setIsAuth(authenticated);
    } catch (error) {
      setIsAuth(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthentication();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === 'refreshToken' || e.key === 'isEASL') {
        checkAuthentication();
      }
    };

    const handleCustomStorageChange = () => {
      checkAuthentication();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageChange', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleCustomStorageChange);
    };
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (isPublic) {
    if (isAuth) {
      return <Navigate to='/' replace />;
    }
    return <>{children}</>;
  }

  if (!isAuth) {
    return <Navigate to='/auth/login' replace />;
  }

  return <>{children}</>;
};

export default AuthRoute;
