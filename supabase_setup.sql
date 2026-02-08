-- Rode este script no Editor SQL do Supabase para criar a tabela de configurações

CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Política de leitura (pública para todos, pois o frontend precisa ler a URL do form)
CREATE POLICY "Leitura pública de configurações" ON app_settings
  FOR SELECT USING (true);

-- Política de escrita (apenas autenticados ou anon se for desenvolvimento simplificado - AJUSTE CONFORME NECESSIDADE)
-- Para este MVP, permitiremos que anon edite via admin com uma senha simples no frontend, 
-- mas o ideal é integrar com Supabase Auth.
-- Por enquanto, vamos permitir update para todos para facilitar o teste, mas em produção deve ser restrito.
CREATE POLICY "Escrita pública de configurações" ON app_settings
  FOR UPDATE USING (true) WITH CHECK (true);
  
CREATE POLICY "Inserção pública de configurações" ON app_settings
  FOR INSERT WITH CHECK (true);

-- Inserir valor padrão
INSERT INTO app_settings (key, value, description) 
VALUES ('mautic_form_url', 'https://mautic.ia.br/form/submit?formId=1', 'URL de submissão do formulário Mautic') 
ON CONFLICT (key) DO NOTHING;
