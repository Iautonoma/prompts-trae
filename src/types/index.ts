export type Category = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  prompt_count: number;
};

export type Prompt = {
  id: string;
  title: string;
  description: string;
  content: string;
  category_slug: string;
  user_id: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  usage_count: number;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  email: string;
  name: string;
  is_contributor: boolean;
  submissions_count: number;
  created_at: string;
};
