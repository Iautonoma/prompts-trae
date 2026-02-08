import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Save, Lock, Loader2 } from 'lucide-react';

const AdminPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [settings, setSettings] = useState<{ key: string; value: string; description?: string }[]>([]);

  // Carregar configurações
  useEffect(() => {
    if (isAuthenticated) {
      fetchSettings();
    }
  }, [isAuthenticated]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      if (!supabase) {
        toast.error('Supabase não configurado');
        return;
      }

      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .order('key');

      if (error) {
        // Se a tabela não existir, provavelmente vai dar erro.
        // Vamos tratar silenciosamente ou mostrar erro específico
        console.error('Erro ao carregar configurações:', error);
        toast.error('Erro ao carregar configurações. Verifique se a tabela app_settings existe.');
      } else {
        setSettings(data || []);
        
        // Se não tiver a configuração do mautic, adiciona localmente para poder salvar
        if (!data?.find(s => s.key === 'mautic_form_url')) {
          setSettings(prev => [
            ...prev, 
            { 
              key: 'mautic_form_url', 
              value: 'https://mautic.ia.br/form/submit?formId=1',
              description: 'URL de submissão do formulário Mautic'
            }
          ]);
        }
      }
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Senha simples para proteção básica frontend
    // Em produção real, usar Supabase Auth
    if (password === 'admin123') {
      setIsAuthenticated(true);
      toast.success('Acesso concedido');
    } else {
      toast.error('Senha incorreta');
    }
  };

  const handleSave = async (key: string, value: string) => {
    setSaving(true);
    try {
      if (!supabase) return;

      // Verifica se existe
      const { data: existing } = await supabase
        .from('app_settings')
        .select('*')
        .eq('key', key)
        .single();

      let error;
      
      if (existing) {
        const result = await supabase
          .from('app_settings')
          .update({ value, updated_at: new Date().toISOString() })
          .eq('key', key);
        error = result.error;
      } else {
        const result = await supabase
          .from('app_settings')
          .insert([{ 
            key, 
            value, 
            description: key === 'mautic_form_url' ? 'URL de submissão do formulário Mautic' : '' 
          }]);
        error = result.error;
      }

      if (error) throw error;
      toast.success('Configuração salva com sucesso!');
      
      // Atualiza lista local
      setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));

    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar configuração');
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="max-w-md mx-auto mt-20 p-8 bg-zinc-900 rounded-lg border border-zinc-800">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-zinc-800 rounded-full">
              <Lock className="w-8 h-8 text-trae" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center mb-6">Área Administrativa</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">
                Senha de Acesso
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-black border border-zinc-800 rounded-lg focus:ring-2 focus:ring-trae focus:border-transparent text-white"
                placeholder="Digite a senha"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-trae text-black font-bold py-2 px-4 rounded-lg hover:bg-trae-hover transition-colors"
            >
              Entrar
            </button>
            <p className="text-xs text-center text-zinc-600 mt-4">
              Senha padrão: admin123
            </p>
          </form>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <div className="p-2 bg-trae/10 rounded-lg">
            <Save className="w-6 h-6 text-trae" />
          </div>
          Configurações do Sistema
        </h1>

        <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-xl font-semibold">Geral</h2>
            <p className="text-zinc-400 text-sm mt-1">Gerencie as variáveis globais do sistema</p>
          </div>

          <div className="p-6 space-y-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-trae" />
              </div>
            ) : (
              settings.map((setting) => (
                <div key={setting.key} className="bg-black/50 p-6 rounded-lg border border-zinc-800">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-white mb-1">
                      {setting.description || setting.key}
                    </label>
                    <p className="text-xs text-zinc-500 font-mono mb-2">{setting.key}</p>
                    <div className="flex gap-4">
                      <input
                        type="text"
                        defaultValue={setting.value}
                        id={`input-${setting.key}`}
                        className="flex-1 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-trae focus:border-transparent text-white font-mono text-sm"
                      />
                      <button
                        onClick={() => {
                          const input = document.getElementById(`input-${setting.key}`) as HTMLInputElement;
                          handleSave(setting.key, input.value);
                        }}
                        disabled={saving}
                        className="bg-zinc-800 text-white px-4 py-2 rounded-lg hover:bg-zinc-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Salvar
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500">
                    Última atualização: {new Date().toLocaleString()}
                  </p>
                </div>
              ))
            )}
            
            {!loading && settings.length === 0 && (
              <div className="text-center py-8 text-zinc-500">
                Nenhuma configuração encontrada. Verifique se a tabela <code>app_settings</code> foi criada.
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage;
