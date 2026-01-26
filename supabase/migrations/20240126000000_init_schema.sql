-- create table
CREATE TABLE categories (
    slug VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50) NOT NULL,
    prompt_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- insert initial categories
INSERT INTO categories (slug, name, description, icon) VALUES
('landing-pages', 'Landing Pages', 'Prompts para criar landing pages e homepages', 'layout'),
('dashboards', 'Dashboards', 'Painéis administrativos e dashboards de analytics', 'dashboard'),
('forms', 'Forms', 'Formulários de contato, pesquisas e inputs', 'form-input'),
('ecommerce', 'E-commerce', 'Lojas online e páginas de produto', 'shopping-cart'),
('authentication', 'Authentication', 'Login, cadastro e gerenciamento de usuários', 'user'),
('components', 'Components', 'Componentes de UI reutilizáveis', 'puzzle'),
('animations', 'Animations', 'Elementos interativos e animados', 'sparkles'),
('mobile-app', 'Mobile App', 'Aplicações mobile-first', 'smartphone');

-- create table
CREATE TABLE prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    category_slug VARCHAR(50) REFERENCES categories(slug),
    user_id UUID REFERENCES auth.users(id),
    difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    tags TEXT[],
    usage_count INTEGER DEFAULT 0,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- create indexes
CREATE INDEX idx_prompts_category ON prompts(category_slug);
CREATE INDEX idx_prompts_difficulty ON prompts(difficulty);
CREATE INDEX idx_prompts_approved ON prompts(is_approved);
CREATE INDEX idx_prompts_created ON prompts(created_at DESC);
CREATE INDEX idx_prompts_usage ON prompts(usage_count DESC);

-- grant permissions
GRANT SELECT ON prompts TO anon;
GRANT ALL ON prompts TO authenticated;

-- create table
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, prompt_id)
);

-- create indexes
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_prompt ON favorites(prompt_id);

-- grant permissions
GRANT SELECT ON favorites TO anon;
GRANT ALL ON favorites TO authenticated;

-- create table
CREATE TABLE views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
    ip_address INET,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- create indexes
CREATE INDEX idx_views_prompt ON views(prompt_id);
CREATE INDEX idx_views_date ON views(viewed_at);

-- grant permissions
GRANT SELECT ON views TO anon;
GRANT ALL ON views TO authenticated;

-- Enable RLS
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE views ENABLE ROW LEVEL SECURITY;

-- Prompts policies
CREATE POLICY "Anyone can view approved prompts" ON prompts
    FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can view their own unapproved prompts" ON prompts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Contributors can submit prompts" ON prompts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prompts" ON prompts
    FOR UPDATE USING (auth.uid() = user_id);

-- Favorites policies
CREATE POLICY "Users can view their own favorites" ON favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their favorites" ON favorites
    FOR ALL USING (auth.uid() = user_id);

-- Views policies (analytics)
CREATE POLICY "Anyone can create views" ON views
    FOR INSERT WITH CHECK (true);

-- Mock Data for Prompts
INSERT INTO prompts (title, description, content, category_slug, difficulty, tags, usage_count, is_approved) VALUES
('Hero Section Moderno', 'Crie uma seção hero moderna para uma landing page SaaS', 'Crie uma seção Hero moderna usando React e Tailwind CSS. Deve incluir um título grande e chamativo (h1), um subtítulo descritivo, dois botões de call-to-action (um primário e um secundário) e um placeholder para uma imagem ou ilustração à direita (no desktop) ou abaixo (no mobile). O design deve ser limpo, com bom uso de espaço em branco e tipografia legível. Use um gradiente sutil no fundo ou no texto do título para dar um toque moderno.', 'landing-pages', 'beginner', ARRAY['hero', 'landing-page', 'saas', 'modern'], 120, true),
('Dashboard de Analytics', 'Layout básico para um dashboard de análise de dados', 'Desenvolva um layout de dashboard para analytics. Deve ter uma sidebar de navegação à esquerda (colapsável em mobile), uma barra superior com perfil do usuário e notificações, e uma área principal de conteúdo. Na área principal, inclua cards de estatísticas no topo (ex: Total de Usuários, Receita, Sessões) e espaço para dois gráficos grandes abaixo. Use componentes modulares e responsivos.', 'dashboards', 'intermediate', ARRAY['dashboard', 'analytics', 'admin', 'layout'], 85, true),
('Formulário de Contato com Validação', 'Formulário de contato completo com validação de campos', 'Crie um componente de formulário de contato funcional. Deve incluir campos para Nome, Email, Assunto e Mensagem. Implemente validação em tempo real (ex: email inválido, campos obrigatórios) e feedback visual de erro. O botão de enviar deve mostrar estado de loading durante o envio. Estilize com Tailwind para parecer profissional e acessível (foco nos inputs, contraste adequado).', 'forms', 'beginner', ARRAY['form', 'contact', 'validation', 'input'], 200, true),
('Card de Produto E-commerce', 'Card de produto com hover effects e botão de adicionar ao carrinho', 'Projete um card de produto para um e-commerce. O card deve mostrar a imagem do produto, título, preço (com desconto opcional), avaliação (estrelas) e um botão "Adicionar ao Carrinho". Adicione um efeito de hover que levante levemente o card e talvez mostre opções adicionais (como "Visualização Rápida"). Garanta que seja responsivo e funcione bem em grids.', 'ecommerce', 'beginner', ARRAY['card', 'product', 'ecommerce', 'shop'], 150, true),
('Navbar Responsiva', 'Barra de navegação que se adapta a mobile e desktop', 'Crie uma barra de navegação (Navbar) responsiva. No desktop, deve mostrar o logo à esquerda e links de navegação à direita. No mobile, os links devem ser ocultados atrás de um menu "hambúrguer" que abre um drawer ou dropdown ao ser clicado. Inclua animações suaves para a transição do menu mobile. Use Tailwind CSS para o styling e gerenciamento de estado simples (useState) para o menu.', 'components', 'intermediate', ARRAY['navbar', 'menu', 'responsive', 'navigation'], 300, true),
('Página de Login Minimalista', 'Tela de login limpa e focada na conversão', 'Desenvolva uma página de login minimalista e elegante. Deve centralizar o formulário de login na tela. Inclua campos para Email e Senha, link para "Esqueci minha senha", botão de "Entrar" e opção de "Entrar com Google" (botão social). O design deve ser clean, usando sombras suaves e bordas arredondadas. Adicione uma imagem ou cor de fundo sutil.', 'authentication', 'beginner', ARRAY['login', 'auth', 'minimalist', 'form'], 180, true);
