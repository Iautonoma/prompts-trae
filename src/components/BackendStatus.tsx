import React, { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const BackendStatus = () => {
  useEffect(() => {
    const run = async () => {
      if (!supabase) {
        toast.error('Supabase não configurado no ambiente de produção.');
        return;
      }
      try {
        const { data: cats, error: e1 } = await supabase
          .from('categories')
          .select('slug')
          .limit(1);
        if (e1) {
          toast.error('Erro ao ler categories');
        }
        const { data: prompts, error: e2 } = await supabase
          .from('prompts')
          .select('id')
          .eq('is_approved', true)
          .limit(1);
        if (e2) {
          toast.error('Erro ao ler prompts');
        }
        if ((cats && cats.length === 0) || (prompts && prompts.length === 0)) {
          toast('Sem dados carregados ainda', { icon: 'ℹ️' });
        }
      } catch {
        toast.error('Erro de conexão com Supabase');
      }
    };
    run();
  }, []);
  return null;
};

export default BackendStatus;
