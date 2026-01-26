import React from 'react';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';
import BackendStatus from './BackendStatus';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-black font-sans text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackendStatus />
        {children}
      </main>
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: '#18181b',
            color: '#fff',
            border: '1px solid #27272a',
          },
        }}
      />
      
      <footer className="bg-black border-t border-zinc-800 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-zinc-500 text-sm">
          <p>© 2026 Trae Prompts. Otimizado para desenvolvimento por <a href="https://iautonoma.com.br" target="_blank" rel="noopener noreferrer" className="text-trae hover:underline">IAutonoma.com.br</a></p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
