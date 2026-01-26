import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Prompt, Category } from '../types';
import PromptCard from '../components/PromptCard';
import { Loader2 } from 'lucide-react';

const CategoryPage = () => {
  const { slug } = useParams();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!supabase) {
          setLoading(false);
          return;
        }
        // Fetch category details
        const { data: categoryData } = await supabase
          .from('categories')
          .select('*')
          .eq('slug', slug)
          .single();
        
        setCategory(categoryData);

        // Fetch prompts for this category
        if (categoryData) {
          const { data: promptsData } = await supabase
            .from('prompts')
            .select('*')
            .eq('category_slug', slug)
            .eq('is_approved', true)
            .order('usage_count', { ascending: false });
          
          setPrompts(promptsData || []);
        }
      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-trae" />
      </div>
    );
  }

  if (!category) {
    return <div className="text-center py-12 text-white">Categoria não encontrada.</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{category.name}</h1>
        <p className="text-zinc-400 text-lg">{category.description}</p>
      </div>

      {prompts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-zinc-900 rounded-lg border border-dashed border-zinc-800">
          <p className="text-zinc-500">Nenhum prompt encontrado nesta categoria ainda.</p>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
