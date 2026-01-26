import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../types';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  // Dynamically get icon component
  // @ts-ignore
  const IconComponent = (Icons[category.icon.charAt(0).toUpperCase() + category.icon.slice(1).replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); })] || Icons.Layout) as LucideIcon;

  return (
    <Link 
      to={`/category/${category.slug}`}
      className="flex flex-col items-center p-6 bg-zinc-900 rounded-xl border border-zinc-800 shadow-sm hover:shadow-md hover:border-trae hover:-translate-y-1 transition-all duration-200 group text-center h-full"
    >
      <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mb-4 group-hover:bg-trae/10 transition-colors text-trae border border-zinc-700 group-hover:border-trae/30">
        <IconComponent className="w-6 h-6" />
      </div>
      <h3 className="font-bold text-white mb-1">{category.name}</h3>
      <p className="text-sm text-zinc-400 line-clamp-2">{category.description}</p>
      {category.prompt_count > 0 && (
        <span className="mt-3 text-xs font-medium text-zinc-500 bg-zinc-800 px-2 py-1 rounded-full border border-zinc-700">
          {category.prompt_count} prompts
        </span>
      )}
    </Link>
  );
};

export default CategoryCard;
