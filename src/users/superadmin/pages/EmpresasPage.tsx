import { useEffect, useState } from 'react';
// IMPORTANTE: Ajuste o caminho para o seu DashboardLayout se necessário
import DashboardLayout from '../../../layouts/DashboardLayout'; 
import type { Empresa } from '../types';
import { superAdminService } from '../services/superAdminService';
import { formatarCnpj } from '../../../utils/formatters';

// Tipagem para o estado do formulário de Cadastro/Atualização
interface EmpresaForm {
    // Campos da Empresa (nome é nomeFantasia na API)
    nomeFantasia: string; 
    cnpj: string;
    // Campos do Admin (APENAS para Cadastro - Onboarding)
    adminNome: string; 
    adminEmail: string;
    adminSenha: string;
}

const initialForm: EmpresaForm = {
    nomeFantasia: '',
    cnpj: '',
    adminNome: '',
    adminEmail: '',
    adminSenha: '',
};

export default function EmpresasPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [form, setForm] = useState<EmpresaForm>(initialForm);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmpresas = async () => {
    setLoading(true);
    try {
        // 1. Chamada GET
        const data = await superAdminService.listarEmpresas();
        setEmpresas(data);
        setError(null);
    } catch (err: any) {
        console.error('Erro ao listar empresas:', err.response?.data || err.message);
        setError('Não foi possível carregar as empresas. Verifique a API ou seu token.');
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
        if (editandoId) {
            // Lógica de ATUALIZAÇÃO (PUT)
            // DTO para PUT: apenas nomeFantasia e cnpj são editáveis
            const updateData = { 
                nomeFantasia: form.nomeFantasia, 
                cnpj: form.cnpj 
            };
            await superAdminService.atualizarEmpresa(editandoId, updateData);
        } else {
            // Lógica de CADASTRO (POST)
            // DTO completo para POST (Onboarding)
            await superAdminService.cadastrarEmpresa({
                ...form,
                nomeFantasia: form.nomeFantasia,
            });
        }
        
        await fetchEmpresas(); // Recarrega a lista após a operação
        setForm(initialForm);
        setEditandoId(null);
    } catch (err: any) {
        console.error('Erro na operação:', err.response?.data || err.message);
        // Tratamento de erro específico da API
        const msg = err.response?.data?.message || `Erro ao ${editandoId ? 'atualizar' : 'cadastrar'} empresa. Verifique os dados.`;
        setError(msg);
    } finally {
        setLoading(false);
    }
  };

  const handleEditar = (empresa: Empresa) => {
    // Ao editar, só carregamos os campos editáveis da empresa. 
    // Campos de Admin (adminNome/Email/Senha) são resetados no initialForm
    setForm({
        ...initialForm, 
        nomeFantasia: empresa.nome, // Sua interface 'Empresa' usa 'nome'
        cnpj: empresa.cnpj,
        // O email da empresa na listagem é o email do Admin (se for o caso)
        adminEmail: empresa.email, // Carrega o email do Admin existente, embora não o editemos no PUT
    });
    setEditandoId(empresa.id);
  };
  
  const handleCancel = () => {
    setForm(initialForm);
    setEditandoId(null);
    setError(null);
  };

  // Funções de utilidade para desabilitar o botão
  const isFormIncomplete = editandoId ? 
    !form.nomeFantasia || !form.cnpj : 
    !form.nomeFantasia || !form.cnpj || !form.adminNome || !form.adminEmail || !form.adminSenha;

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const valorFormatado = formatarCnpj(e.target.value);
      setForm({ ...form, cnpj: valorFormatado });
  };

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-4">Gerenciamento de Empresas-Clientes</h2>

      {error && <div className="p-3 mb-4 bg-red-100 text-red-700 border border-red-400 rounded">{error}</div>}

      <div className="bg-white p-6 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-3">{editandoId ? 'Atualizar Empresa' : 'Cadastrar Nova Empresa'}</h3>
        
        {/* CAMPOS DA EMPRESA */}
        <div className="flex flex-wrap gap-4 mb-4">
            <input
                type="text"
                placeholder="Nome Fantasia"
                value={form.nomeFantasia}
                onChange={(e) => setForm({ ...form, nomeFantasia: e.target.value })}
                className="border p-2 rounded flex-1 min-w-[200px]"
            />
            <input
                type="text"
                placeholder="CNPJ (Ex: 00.000.000/0000-00)"
                value={form.cnpj}
                // ALTERAÇÃO: Usar o novo handler que aplica a formatação
                onChange={handleCnpjChange}
                // Limita o tamanho do input para 18 caracteres (tamanho máximo da máscara)
                maxLength={18} 
                className="border p-2 rounded flex-1 min-w-[200px]"
            />
        </div>


        {/* CAMPOS DO ADMIN (APENAS CADASTRO) */}
        {!editandoId && (
            <>
                <h4 className="text-md font-medium mt-4 mb-2">Dados do Primeiro Administrador (Onboarding)</h4>
                <div className="flex flex-wrap gap-4">
                    <input
                        type="text"
                        placeholder="Nome do Admin"
                        value={form.adminNome}
                        onChange={(e) => setForm({ ...form, adminNome: e.target.value })}
                        className="border p-2 rounded flex-1 min-w-[200px]"
                    />
                    <input
                        type="email"
                        placeholder="Email do Admin"
                        value={form.adminEmail}
                        onChange={(e) => setForm({ ...form, adminEmail: e.target.value })}
                        className="border p-2 rounded flex-1 min-w-[200px]"
                    />
                    <input
                        type="password"
                        placeholder="Senha Inicial"
                        value={form.adminSenha}
                        onChange={(e) => setForm({ ...form, adminSenha: e.target.value })}
                        className="border p-2 rounded flex-1 min-w-[150px]"
                    />
                </div>
            </>
        )}
        
        <div className='mt-6'>
            <button
                onClick={handleSubmit}
                className={`text-white px-6 py-2 rounded transition ${loading || isFormIncomplete ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                disabled={loading || isFormIncomplete}
            >
                {loading ? 'Processando...' : editandoId ? 'Atualizar Empresa' : 'Cadastrar Empresa'}
            </button>
            {editandoId && (
                <button
                    onClick={handleCancel}
                    className="ml-2 bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400 transition"
                    disabled={loading}
                >
                    Cancelar Edição
                </button>
            )}
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-3">Empresas Cadastradas</h3>
      {loading && empresas.length === 0 ? (
          <p>Carregando lista de empresas...</p>
      ) : (
          <ul className="space-y-2">
            {empresas.map((empresa) => (
              <li key={empresa.id} className="p-4 bg-white rounded shadow flex justify-between items-center border-l-4 border-blue-500">
                <div>
                <strong>{empresa.nome}</strong> 
                <span className="text-sm text-gray-600 ml-3"> | CNPJ: {empresa.cnpj} | Admin: {empresa.email}</span>
                </div>
                <button
                  onClick={() => handleEditar(empresa)}
                  className="text-sm text-blue-500 hover:underline"
                >
                  Editar
                </button>
              </li>
            ))}
          </ul>
      )}
    </DashboardLayout>
  );
}