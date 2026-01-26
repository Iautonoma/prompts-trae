import React from 'react';
import { Link } from 'react-router-dom';
import { Search, PlusCircle, Menu, X } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';
import TraeLogo from './TraeLogo';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-black/80 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <TraeLogo className="h-8 text-trae" />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/search" className="text-zinc-400 hover:text-trae transition-colors">
              <Search className="w-5 h-5" />
            </Link>
            <Link to="/submit" className="flex items-center gap-2 bg-trae text-black px-4 py-2 rounded-lg hover:bg-trae-hover transition-colors font-medium">
              <PlusCircle className="w-4 h-4" />
              Enviar Prompt
            </Link>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-zinc-400 hover:text-white focus:outline-none"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={clsx("md:hidden bg-zinc-900 border-b border-zinc-800", isMenuOpen ? "block" : "hidden")}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/search"
            className="block px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:text-trae hover:bg-zinc-800"
            onClick={() => setIsMenuOpen(false)}
          >
            Buscar
          </Link>
          <Link
            to="/submit"
            className="block px-3 py-2 rounded-md text-base font-medium text-trae hover:text-trae-hover hover:bg-zinc-800"
            onClick={() => setIsMenuOpen(false)}
          >
            Enviar Prompt
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
