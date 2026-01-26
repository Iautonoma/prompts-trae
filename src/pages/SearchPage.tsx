import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Prompt } from '../types';
import PromptCard from '../components/PromptCard';
import { Search, Loader2 } from 'lucide-react';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(query);
  const [results, setResults] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setSearchParams({ q: searchTerm });
    setHasSearched(true);

    try {
      const { data } = await supabase
        .from('prompts')
        .select('*')
        .eq('is_approved', true)
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,tags.cs.{${searchTerm}}`);

      setResults(data || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      setSearchTerm(query);
      handleSearch();
    }
  }, [query]);

  return (
    <div>
      <div className="max-w-2xl mx-auto mb-12 text-center">
        <h1 className="text-3xl font-bold text-white mb-6">Buscar Prompts</h1>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 shadow-sm focus:ring-2 focus:ring-trae focus:border-trae outline-none text-lg transition-all"
            placeholder="Busque por termos, categorias ou tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-500 w-6 h-6" />
          <button 
            type="submit" 
            className="absolute right-2 top-2 bottom-2 bg-trae text-black px-6 rounded-lg font-medium hover:bg-trae-hover transition-colors"
          >
            Buscar
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-trae" />
        </div>
      ) : (
        <>
          {hasSearched && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-zinc-300">
                {results.length} resultados encontrados para "{query}"
              </h2>
            </div>
          )}
          
          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>
          ) : (
            hasSearched && (
              <div className="text-center py-12 bg-zinc-900 rounded-xl border border-dashed border-zinc-800">
                <p className="text-zinc-500 text-lg">Nenhum resultado encontrado. Tente termos diferentes.</p>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage;
