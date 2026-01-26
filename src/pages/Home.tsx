import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Category, Prompt } from '../types';
import CategoryCard from '../components/CategoryCard';
import PromptCard from '../components/PromptCard';
import { Loader2, ArrowRight, Search, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredPrompts, setFeaturedPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const { data: categoriesData } = await supabase
          .from('categories')
          .select('*')
          .order('name');
        
        if (categoriesData) setCategories(categoriesData);

        // Fetch featured prompts (most used for now)
        const { data: promptsData } = await supabase
          .from('prompts')
          .select('*')
          .eq('is_approved', true)
          .order('usage_count', { ascending: false })
          .limit(6);
        
        if (promptsData) setFeaturedPrompts(promptsData);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-trae" />
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="text-center py-16 sm:py-24 max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-trae text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4 mr-2" />
          Otimizado para Trae Editor
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
          Construa mais rápido com <span className="text-trae">Prompts Prontos</span>
        </h1>
        <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
          Um diretório curado de prompts testados para acelerar seu desenvolvimento com IA. Copie, cole e crie.
        </p>
        
        <form onSubmit={handleSearch} className="relative max-w-lg mx-auto mb-12">
          <input
            type="text"
            className="w-full pl-12 pr-4 py-4 rounded-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 shadow-sm focus:ring-2 focus:ring-trae focus:border-trae outline-none text-lg transition-all"
            placeholder="O que você quer construir hoje?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-500 w-6 h-6" />
          <button 
            type="submit" 
            className="absolute right-2 top-2 bottom-2 bg-trae text-black px-6 rounded-full font-medium hover:bg-trae-hover transition-colors"
          >
            Buscar
          </button>
        </form>
      </div>

      {/* Categories Grid */}
      <div className="mb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Navegue por Categorias</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </div>

      {/* Featured Prompts */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Prompts em Destaque</h2>
          <Link to="/search" className="text-trae font-medium hover:text-trae-hover flex items-center">
            Ver todos <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 sm:p-12 text-center text-white mb-8">
        <h2 className="text-3xl font-bold mb-4">Tem um prompt incrível?</h2>
        <p className="text-zinc-400 mb-8 max-w-2xl mx-auto text-lg">
          Compartilhe seu conhecimento com a comunidade e ajude outros desenvolvedores a construírem melhor.
        </p>
        <Link 
          to="/submit" 
          className="inline-block bg-trae text-black px-8 py-3 rounded-lg font-bold hover:bg-trae-hover transition-colors shadow-lg shadow-trae/10"
        >
          Enviar Prompt Agora
        </Link>
      </div>
    </div>
  );
};

export default Home;
