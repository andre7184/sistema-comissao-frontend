import api from '../../../services/api'; // Importa a instância do Axios
import type { Empresa } from '../types';

// *************************************************************
// Interfaces (DTOs - Data Transfer Objects) para a comunicação com a API
// *************************************************************

// DTO para a requisição de Cadastro (POST /api/superadmin/empresas)
interface CadastroEmpresaRequest {
    nomeFantasia: string; // A API usa 'nomeFantasia'
    cnpj: string;
    adminNome: string;
    adminEmail: string;
    adminSenha: string;
}

// DTO para a requisição de Atualização (PUT /api/superadmin/empresas/{id})
interface AtualizarEmpresaRequest {
    nomeFantasia: string;
    cnpj: string;
}

// O DTO de resposta da API (Empresa) deve corresponder à sua interface 'Empresa' em types.ts:
// { id, nome, cnpj, email, modulosAtivos }

export const superAdminService = {
  // 1. LISTAR EMPRESAS (GET /api/superadmin/empresas)
  listarEmpresas: async (): Promise<Empresa[]> => {
    // API retorna List<Empresa>
    const response = await api.get<Empresa[]>('/api/superadmin/empresas'); 
    return response.data;
  },

  // 2. CADASTRAR EMPRESA (POST /api/superadmin/empresas)
  cadastrarEmpresa: async (dados: CadastroEmpresaRequest): Promise<Empresa> => {
    // API retorna a Empresa criada (201 Created)
    const response = await api.post<Empresa>('/api/superadmin/empresas', dados); 
    return response.data;
  },

  // 3. ATUALIZAR EMPRESA (PUT /api/superadmin/empresas/{id})
  atualizarEmpresa: async (id: number, dados: AtualizarEmpresaRequest): Promise<Empresa> => {
    // API retorna a Empresa atualizada (200 OK)
    const response = await api.put<Empresa>(`/api/superadmin/empresas/${id}`, dados);
    return response.data;
  },
  
  // 4. LISTAR MÓDULOS (Para o Super Admin listar o Catálogo, se necessário)
  listarModulos: async () => {
    // Endpoint: GET /api/superadmin/modulos
    const response = await api.get('/api/superadmin/modulos');
    return response.data;
  },
  
  // Manter ativado/desativar módulos como mock ou implementar endpoint real
  ativarModulo: async (id: number) => {
    console.warn(`MOCK: Ativando módulo ${id}. Implemente a chamada PUT /api/superadmin/empresas/{empresaId}/modulos.`);
  },
  desativarModulo: async (id: number) => {
    console.warn(`MOCK: Desativando módulo ${id}. Implemente a chamada PUT /api/superadmin/empresas/{empresaId}/modulos.`);
  },
};