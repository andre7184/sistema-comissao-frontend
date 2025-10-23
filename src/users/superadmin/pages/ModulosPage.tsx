import { useEffect, useState } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import type { Modulo } from '../types';
import { superAdminService } from '../services/superAdminService';

export default function ModulosPage() {
  const [modulos, setModulos] = useState<Modulo[]>([]);

  useEffect(() => {
    superAdminService.listarModulos().then(setModulos);
  }, []);

  const toggleModulo = async (id: number, ativo: boolean) => {
    if (ativo) {
      await superAdminService.desativarModulo(id);
    } else {
      await superAdminService.ativarModulo(id);
    }
    const atualizados = await superAdminService.listarModulos();
    setModulos(atualizados);
  };

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-4">Gerenciar Módulos</h2>
      <ul className="space-y-2">
        {modulos.map((modulo) => (
          <li key={modulo.id} className="p-4 bg-white shadow rounded flex justify-between items-center">
            <span>{modulo.nome}</span>
            <button
              onClick={() => toggleModulo(modulo.id, modulo.ativo)}
              className={`px-3 py-1 rounded text-white ${
                modulo.ativo ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {modulo.ativo ? 'Desativar' : 'Ativar'}
            </button>
          </li>
        ))}
      </ul>
    </DashboardLayout>
  );
}
