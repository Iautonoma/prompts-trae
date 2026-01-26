import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Category } from '../types';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader2, Send } from 'lucide-react';

const SubmitPrompt = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category_slug: '',
    difficulty: 'beginner',
    tags: ''
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('categories').select('*').order('name');
      if (data) setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!supabase) {
        toast.error('Supabase não configurado. Defina as variáveis no ambiente de produção.');
        return;
      }
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

      const { error } = await supabase.from('prompts').insert([
        {
          title: formData.title,
          description: formData.description,
          content: formData.content,
          category_slug: formData.category_slug,
          difficulty: formData.difficulty,
          tags: tagsArray,
          is_approved: true // Auto-approve for demo purposes
        }
      ]);

      if (error) throw error;

      toast.success('Prompt enviado com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('Error submitting prompt:', error);
      toast.error('Erro ao enviar prompt. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white">Enviar um Prompt</h1>
        <p className="mt-2 text-zinc-400">Contribua com a comunidade compartilhando seus melhores prompts para Trae.</p>
      </div>

      <div className="bg-zinc-900 rounded-xl shadow-sm border border-zinc-800 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-zinc-300 mb-1">
              Título do Prompt *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="w-full px-4 py-2 bg-black border border-zinc-700 rounded-lg focus:ring-2 focus:ring-trae focus:border-trae outline-none transition-all text-white placeholder-zinc-600"
              placeholder="Ex: Landing Page SaaS Moderna"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="category_slug" className="block text-sm font-medium text-zinc-300 mb-1">
              Categoria *
            </label>
            <select
              id="category_slug"
              name="category_slug"
              required
              className="w-full px-4 py-2 bg-black border border-zinc-700 rounded-lg focus:ring-2 focus:ring-trae focus:border-trae outline-none transition-all text-white"
              value={formData.category_slug}
              onChange={handleChange}
            >
              <option value="">Selecione uma categoria</option>
              {categories.map(cat => (
                <option key={cat.slug} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-zinc-300 mb-1">
                Dificuldade
              </label>
              <select
                id="difficulty"
                name="difficulty"
                className="w-full px-4 py-2 bg-black border border-zinc-700 rounded-lg focus:ring-2 focus:ring-trae focus:border-trae outline-none transition-all text-white"
                value={formData.difficulty}
                onChange={handleChange}
              >
                <option value="beginner">Iniciante</option>
                <option value="intermediate">Intermediário</option>
                <option value="advanced">Avançado</option>
              </select>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-zinc-300 mb-1">
                Tags (separadas por vírgula)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                className="w-full px-4 py-2 bg-black border border-zinc-700 rounded-lg focus:ring-2 focus:ring-trae focus:border-trae outline-none transition-all text-white placeholder-zinc-600"
                placeholder="react, tailwind, dashboard"
                value={formData.tags}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-zinc-300 mb-1">
              Descrição Curta *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={2}
              className="w-full px-4 py-2 bg-black border border-zinc-700 rounded-lg focus:ring-2 focus:ring-trae focus:border-trae outline-none transition-all text-white placeholder-zinc-600"
              placeholder="Uma breve explicação do que o prompt faz..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-zinc-300 mb-1">
              Conteúdo do Prompt *
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={8}
              className="w-full px-4 py-2 bg-black border border-zinc-700 rounded-lg focus:ring-2 focus:ring-trae focus:border-trae outline-none transition-all font-mono text-sm text-white placeholder-zinc-600"
              placeholder="Cole o prompt completo aqui..."
              value={formData.content}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-trae text-black py-3 px-4 rounded-lg hover:bg-trae-hover transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Enviar Prompt
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitPrompt;
