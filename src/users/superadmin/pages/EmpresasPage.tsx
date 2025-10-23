import { useEffect, useState } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import type { Empresa } from '../types';
import { superAdminService } from '../services/superAdminService';

export default function EmpresasPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [form, setForm] = useState({ nome: '', cnpj: '', email: '' });
  const [editandoId, setEditandoId] = useState<number | null>(null);

  useEffect(() => {
    superAdminService.listarEmpresas().then(setEmpresas);
  }, []);

  const handleSubmit = async () => {
    if (editandoId) {
    await superAdminService.atualizarEmpresa(editandoId, form);
    } else {
    await superAdminService.cadastrarEmpresa({
        id: Date.now(),
        ...form,
        modulosAtivos: [],
    });
    }
    const atualizadas = await superAdminService.listarEmpresas();
    setEmpresas(atualizadas);
    setForm({ nome: '', cnpj: '', email: '' });
    setEditandoId(null);
  };

  const handleEditar = (empresa: Empresa) => {
    setForm({
        nome: empresa.nome,
        cnpj: empresa.cnpj,
        email: empresa.email,
    });
    setEditandoId(empresa.id);
  };

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-4">Empresas</h2>

      <div className="bg-white p-4 rounded shadow mb-6">
        <input
          type="text"
          placeholder="Nome"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          className="border p-2 mr-2 rounded"
        />
        <input
          type="text"
          placeholder="CNPJ"
          value={form.cnpj}
          onChange={(e) => setForm({ ...form, cnpj: e.target.value })}
          className="border p-2 mr-2 rounded"
        />
        <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="border p-2 mr-2 rounded"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editandoId ? 'Atualizar' : 'Cadastrar'}
        </button>
      </div>

      <ul className="space-y-2">
        {empresas.map((empresa) => (
          <li key={empresa.id} className="p-4 bg-gray-100 rounded shadow flex justify-between items-center">
            <div>
            <strong>{empresa.nome}</strong> — {empresa.cnpj} — {empresa.email}
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
    </DashboardLayout>
  );
}
