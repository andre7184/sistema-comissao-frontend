export interface Empresa {
  id: number;
  nome: string;
  cnpj: string;
  email: string;
  modulosAtivos: string[];
}

export interface Modulo {
  id: number;
  nome: string;
  ativo: boolean;
}
