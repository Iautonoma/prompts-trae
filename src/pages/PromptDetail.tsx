import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Prompt } from '../types';
import { Loader2, Copy, Check, ArrowLeft, Tag, Calendar, User } from 'lucide-react';
import toast from 'react-hot-toast';

const PromptDetail = () => {
  const { id } = useParams();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPrompt = async () => {
      if (!id) return;
      
      try {
        if (!supabase) {
          setLoading(false);
          return;
        }
        const { data, error } = await supabase
          .from('prompts')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setPrompt(data);

        // Increment usage/view count (simple implementation)
        await supabase.rpc('increment_view_count', { prompt_id: id });

      } catch (error) {
        console.error('Error fetching prompt:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrompt();
  }, [id]);

  const handleCopy = async () => {
    if (!prompt) return;
    
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      toast.success('Prompt copiado!');
      
      // Increment usage count
      await supabase
        .from('prompts')
        .update({ usage_count: (prompt.usage_count || 0) + 1 })
        .eq('id', prompt.id);
        
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Erro ao copiar');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-trae" />
      </div>
    );
  }

  if (!prompt) {
    return <div className="text-center py-12 text-white">Prompt não encontrado.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center text-zinc-500 hover:text-trae mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Voltar para Home
      </Link>

      <div className="bg-zinc-900 rounded-xl shadow-sm border border-zinc-800 overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-zinc-800">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                  ${prompt.difficulty === 'beginner' ? 'bg-green-900/30 text-green-400 border border-green-900/50' : 
                    prompt.difficulty === 'intermediate' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-900/50' : 
                    'bg-red-900/30 text-red-400 border border-red-900/50'}`}>
                  {prompt.difficulty}
                </span>
                <Link to={`/category/${prompt.category_slug}`} className="text-xs font-medium text-zinc-500 hover:text-trae uppercase tracking-wide">
                  {prompt.category_slug}
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-white mb-3">{prompt.title}</h1>
              <p className="text-zinc-400 text-lg">{prompt.description}</p>
            </div>
            <button
              onClick={handleCopy}
              className={`flex-shrink-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all
                ${copied ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500' : 'bg-trae text-black hover:bg-trae-hover focus:ring-trae'}`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar Prompt
                </>
              )}
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-zinc-500">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1.5" />
              {new Date(prompt.created_at).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1.5" />
              {prompt.usage_count} usos
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 bg-black/50">
          <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">Conteúdo do Prompt</h2>
          <div className="relative group">
            <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleCopy}
                className="p-2 bg-zinc-800 rounded-md shadow-sm border border-zinc-700 text-zinc-400 hover:text-trae"
                title="Copiar apenas o texto"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <pre className="bg-black p-6 rounded-lg border border-zinc-800 text-zinc-300 whitespace-pre-wrap font-mono text-sm leading-relaxed overflow-x-auto shadow-sm">
              {prompt.content}
            </pre>
          </div>
        </div>
        
        {prompt.tags && prompt.tags.length > 0 && (
          <div className="p-6 sm:p-8 border-t border-zinc-800 bg-zinc-900">
            <h3 className="text-sm font-medium text-white mb-3 flex items-center">
              <Tag className="w-4 h-4 mr-2" />
              Tags Relacionadas
            </h3>
            <div className="flex flex-wrap gap-2">
              {prompt.tags.map(tag => (
                <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptDetail;
