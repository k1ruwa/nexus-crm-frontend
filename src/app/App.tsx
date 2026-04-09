import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { useEffect } from 'react';
import { initDB } from './lib/db';
import { usePWA } from './hooks/usePWA';

export default function App() {
  usePWA(); // Register service worker for PWA

  useEffect(() => {
    // Initialize IndexedDB on app start
    initDB().catch(console.error);
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </>
  );
}