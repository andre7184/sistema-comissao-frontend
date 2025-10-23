import type { Empresa, Modulo } from '../types';

let empresas: Empresa[] = [];
let modulos: Modulo[] = [
  { id: 1, nome: 'Vendas', ativo: true },
  { id: 2, nome: 'Comissões', ativo: false },
  { id: 3, nome: 'Relatórios', ativo: true },
];

export const superAdminService = {
  listarEmpresas: async (): Promise<Empresa[]> => empresas,
  cadastrarEmpresa: async (empresa: Empresa) => empresas.push(empresa),
  atualizarEmpresa: async (id: number, dados: Partial<Empresa>) => {
    empresas = empresas.map((e) => (e.id === id ? { ...e, ...dados } : e));
  },
  listarModulos: async (): Promise<Modulo[]> => modulos,
  ativarModulo: async (id: number) => {
    modulos = modulos.map((m) => (m.id === id ? { ...m, ativo: true } : m));
  },
  desativarModulo: async (id: number) => {
    modulos = modulos.map((m) => (m.id === id ? { ...m, ativo: false } : m));
  },
};
