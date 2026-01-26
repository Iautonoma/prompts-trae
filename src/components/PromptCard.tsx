import React from 'react';
import { Link } from 'react-router-dom';
import { Copy, Eye } from 'lucide-react';
import { Prompt } from '../types';

interface PromptCardProps {
  prompt: Prompt;
}

const PromptCard = ({ prompt }: PromptCardProps) => {
  return (
    <Link 
      to={`/prompt/${prompt.id}`}
      className="block bg-zinc-900 rounded-xl border border-zinc-800 shadow-sm hover:shadow-md hover:border-trae/50 transition-all duration-200 overflow-hidden h-full flex flex-col group"
    >
      <div className="p-5 flex-1">
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize
            ${prompt.difficulty === 'beginner' ? 'bg-green-900/30 text-green-400 border border-green-900/50' : 
              prompt.difficulty === 'intermediate' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-900/50' : 
              'bg-red-900/30 text-red-400 border border-red-900/50'}`}>
            {prompt.difficulty}
          </span>
          <span className="text-xs text-zinc-400 font-medium bg-zinc-800 px-2 py-0.5 rounded-md border border-zinc-700">
            {prompt.category_slug}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-trae transition-colors line-clamp-2">
          {prompt.title}
        </h3>
        
        <p className="text-zinc-400 text-sm line-clamp-3 mb-4">
          {prompt.description}
        </p>
        
        <div className="flex flex-wrap gap-1 mt-auto">
          {prompt.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded-md border border-zinc-700/50">
              #{tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-900/50 flex items-center justify-between text-xs text-zinc-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {prompt.usage_count}
          </span>
        </div>
        <div className="flex items-center gap-1 font-medium text-trae opacity-0 group-hover:opacity-100 transition-opacity">
          Ver detalhes
        </div>
      </div>
    </Link>
  );
};

export default PromptCard;
