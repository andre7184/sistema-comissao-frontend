import type { ReactNode } from 'react';

interface GenericFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function GenericFormModal({ isOpen, onClose, title, children }: GenericFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-600 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 m-4 relative">
        
        {/* Título e Botão Fechar */}
        <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 transition"
            onClick={onClose}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Conteúdo do Formulário (inputs dinâmicos) */}
        <div className="max-h-96 overflow-y-auto pr-2">
          {children}
        </div>

      </div>
    </div>
  );
}