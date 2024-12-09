import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import authService from "./appwrite/auth";
import { login, logout } from "./store/authSlice";
import { Header, Footer } from "./components/index";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        authService
          .getCurrentUser()
          .then((userData) => {
            if (userData) {
              dispatch(login({ userData }));
            } else {
              dispatch(logout());
            }
          })
      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, [dispatch]);

  return !loading ? (
    <ErrorBoundary>
      <ThemeProvider>
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
          <Header />
          <main className="flex-1 pt-16">
            <Outlet />
          </main>
          <Footer />
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  ) : null;
}

export default App;
