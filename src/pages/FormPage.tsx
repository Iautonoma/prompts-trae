import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

const FormPage: React.FC = () => {
  const [formData, setFormData] = useState({
    'mauticform[nome]': '',
    'mauticform[email_de_contato]': '',
    'mauticform[whatsapp]': '',
    'mauticform[cidade]': '',
    'mauticform[estado]': '',
    'mauticform[nivel_de_experiencia_com]': '',
    'mauticform[voce_ja_conhece_ou_utiliz1]': '',
    'mauticform[quais_sao_os_seus_principais]': [] as string[],
    'mauticform[aceito_receber_informacoes_por]': false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    // Adicionar asteriscos vermelhos nos campos obrigatórios
    const requiredFields = document.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      const label = field.closest('.form-group')?.querySelector('label');
      if (label && !label.querySelector('.required-asterisk')) {
        const asterisk = document.createElement('span');
        asterisk.className = 'required-asterisk';
        asterisk.textContent = '*';
        asterisk.style.color = '#f44336';
        asterisk.style.fontWeight = 'bold';
        asterisk.style.marginLeft = '3px';
        label.appendChild(asterisk);
      }
    });
  }, []);

  const validateField = (name: string, value: any): string => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return 'Este campo é obrigatório';
    }
    
    if (name === 'mauticform[email_de_contato]') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Por favor, digite um email válido';
      }
    }
    
    if (name === 'mauticform[whatsapp]') {
      const phoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
      if (!phoneRegex.test(value.replace(/\s/g, ''))) {
        return 'Por favor, digite um telefone válido';
      }
    }
    
    return '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));

    // Validar campo em tempo real
    const error = validateField(name, type === 'checkbox' ? (e.target as HTMLInputElement).checked : value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    
    if (checked) {
      setFormData(prev => ({
        ...prev,
        'mauticform[quais_sao_os_seus_principais]': [...formData['mauticform[quais_sao_os_seus_principais]'], value]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        'mauticform[quais_sao_os_seus_principais]': formData['mauticform[quais_sao_os_seus_principais]'].filter(item => item !== value)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar todos os campos
    const newErrors: Record<string, string> = {};
    
    // Campos obrigatórios
    const requiredFields = [
      'mauticform[nome]',
      'mauticform[email_de_contato]',
      'mauticform[whatsapp]',
      'mauticform[cidade]'
    ];
    
    requiredFields.forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) {
        newErrors[field] = error;
      }
    });
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(item => formDataToSend.append(key, item));
        } else {
          formDataToSend.append(key, String(value));
        }
      });
      
      const response = await fetch('https://mautic.ia.br/form/submit?formId=1', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
        }
      });
      
      if (response.ok) {
        setSubmitSuccess(true);
        setTimeout(() => {
          window.location.href = 'https://trae.ia.br/sucesso';
        }, 3000);
      } else {
        throw new Error('Erro ao enviar formulário');
      }
    } catch (error) {
      alert('Erro ao enviar formulário. Por favor, tente novamente.');
      console.error('Erro:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addPhoneMask = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
      return cleaned.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }
  };

  if (submitSuccess) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-green-100 border border-green-400 text-green-700 px-8 py-6 rounded-lg text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">Inscrição realizada com sucesso!</h2>
            <p>Você será redirecionado em breve...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 text-center">
              <h1 className="text-3xl font-bold mb-2">TRAE no Brasil</h1>
              <p className="text-lg opacity-90">Lista de Inscrição</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Campo Nome */}
              <div className={`form-group ${errors['mauticform[nome]'] ? 'error' : ''}`}>
                <label htmlFor="mauticform_nome" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  id="mauticform_nome"
                  name="mauticform[nome]"
                  required
                  value={formData['mauticform[nome]']}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Seu nome completo"
                />
                {errors['mauticform[nome]'] && (
                  <p className="text-red-500 text-sm mt-1">{errors['mauticform[nome]']}</p>
                )}
              </div>

              {/* Campo Email */}
              <div className={`form-group ${errors['mauticform[email_de_contato]'] ? 'error' : ''}`}>
                <label htmlFor="mauticform_email_de_contato" className="block text-sm font-medium text-gray-700 mb-2">
                  Email de Contato
                </label>
                <input
                  type="email"
                  id="mauticform_email_de_contato"
                  name="mauticform[email_de_contato]"
                  required
                  value={formData['mauticform[email_de_contato]']}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="seu@email.com"
                />
                {errors['mauticform[email_de_contato]'] && (
                  <p className="text-red-500 text-sm mt-1">{errors['mauticform[email_de_contato]']}</p>
                )}
              </div>

              {/* Campo WhatsApp */}
              <div className={`form-group ${errors['mauticform[whatsapp]'] ? 'error' : ''}`}>
                <label htmlFor="mauticform_whatsapp" className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  id="mauticform_whatsapp"
                  name="mauticform[whatsapp]"
                  required
                  value={formData['mauticform[whatsapp]']}
                  onChange={(e) => {
                    const maskedValue = addPhoneMask(e.target.value);
                    handleInputChange({
                      ...e,
                      target: { ...e.target, value: maskedValue }
                    });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="(11) 99999-9999"
                />
                {errors['mauticform[whatsapp]'] && (
                  <p className="text-red-500 text-sm mt-1">{errors['mauticform[whatsapp]']}</p>
                )}
              </div>

              {/* Campo Cidade */}
              <div className={`form-group ${errors['mauticform[cidade]'] ? 'error' : ''}`}>
                <label htmlFor="mauticform_cidade" className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade
                </label>
                <input
                  type="text"
                  id="mauticform_cidade"
                  name="mauticform[cidade]"
                  required
                  value={formData['mauticform[cidade]']}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Sua cidade"
                />
                {errors['mauticform[cidade]'] && (
                  <p className="text-red-500 text-sm mt-1">{errors['mauticform[cidade]']}</p>
                )}
              </div>

              {/* Campo Estado */}
              <div className="form-group">
                <label htmlFor="mauticform_estado" className="block text-sm font-medium text-gray-700 mb-2">
                  Estado <span className="text-gray-500 text-sm">(opcional)</span>
                </label>
                <input
                  type="text"
                  id="mauticform_estado"
                  name="mauticform[estado]"
                  value={formData['mauticform[estado]']}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Ex: SP, RJ, MG..."
                />
              </div>

              {/* Nível de Experiência */}
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Nível de experiência com desenvolvimento <span className="text-gray-500 text-sm">(opcional)</span>
                </label>
                <div className="space-y-3">
                  {['iniciante', 'intermediario', 'avancado'].map((nivel) => (
                    <label key={nivel} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="mauticform[nivel_de_experiencia_com]"
                        value={nivel}
                        checked={formData['mauticform[nivel_de_experiencia_com]'] === nivel}
                        onChange={handleInputChange}
                        className="mr-3 text-green-500 focus:ring-green-500"
                      />
                      <span className="capitalize">{nivel}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Conhece TRAE */}
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Você já conhece ou utiliza o TRAE? <span className="text-gray-500 text-sm">(opcional)</span>
                </label>
                <div className="space-y-3">
                  {['sim', 'nao'].map((opcao) => (
                    <label key={opcao} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="mauticform[voce_ja_conhece_ou_utiliz1]"
                        value={opcao}
                        checked={formData['mauticform[voce_ja_conhece_ou_utiliz1]'] === opcao}
                        onChange={handleInputChange}
                        className="mr-3 text-green-500 focus:ring-green-500"
                      />
                      <span className="capitalize">{opcao === 'sim' ? 'Sim' : 'Não'}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Objetivos */}
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Qual seu principal objetivo com o Hackathon? <span className="text-gray-500 text-sm">(opcional, pode marcar vários)</span>
                </label>
                <div className="space-y-3">
                  {[
                    'Aprender novas tecnologias',
                    'Networking e conhecer pessoas',
                    'Ganhar prêmios',
                    'Resolver problemas reais',
                    'Me divertir e me desafiar'
                  ].map((objetivo) => (
                    <label key={objetivo} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="checkbox"
                        name="mauticform[quais_sao_os_seus_principais]"
                        value={objetivo}
                        checked={formData['mauticform[quais_sao_os_seus_principais]'].includes(objetivo)}
                        onChange={handleCheckboxChange}
                        className="mr-3 text-green-500 focus:ring-green-500"
                      />
                      <span>{objetivo}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Termos */}
              <div className="form-group">
                <label className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    name="mauticform[aceito_receber_informacoes_por]"
                    checked={formData['mauticform[aceito_receber_informacoes_por]']}
                    onChange={handleInputChange}
                    className="mr-3 mt-1 text-green-500 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">
                    Aceito receber informações por email sobre o TRAE e o Hackathon
                  </span>
                </label>
              </div>

              {/* Botão Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-green-600 hover:to-green-700 focus:ring-4 focus:ring-green-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Inscrição'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FormPage;