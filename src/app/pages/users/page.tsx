'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import ToggleSwitch from '@/components/ToggleSwitch';
import toast from 'react-hot-toast';

type User = {
  id: number;
  name: string;
  email: string;
  birthdate: string;
  cpf: string;
  phone: string;
  is_staff: boolean;
  is_active: boolean;
};

export default function Users() {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: 'João Silva',
      email: 'joao@email.com',
      birthdate: '1990-05-10',
      cpf: '123.456.789-00',
      phone: '(11) 91234-5678',
      is_staff: true,
      is_active: true,
    },
    {
      id: 2,
      name: 'Maria Souza',
      email: 'maria@email.com',
      birthdate: '1985-03-22',
      cpf: '987.654.321-00',
      phone: '(21) 99876-5432',
      is_staff: false,
      is_active: false,
    },
    {
      id: 3,
      name: 'Carlos Santos',
      email: 'carlos@email.com',
      birthdate: '1995-12-01',
      cpf: '456.789.123-00',
      phone: '(31) 98765-4321',
      is_staff: false,
      is_active: true,
    },
  ]);

  const handleToggle = (id: number, newState: boolean) => {
    setUsers((u) =>
      u.map((user) =>
        user.id === id ? { ...user, is_active: newState } : user
      )
    );
    toast.success(`Usuário ${newState ? 'ativado' : 'desativado'}!`);
  };

  return (
    <section className="p-4">
      {/* Header */}
      <header className="flex items-center mb-4">
        <h1 className="text-2xl font-bold">Usuários</h1>
      </header>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="text-xs font-medium text-gray-500 uppercase bg-gray-50 text-left">
            <tr>
              <th className="px-6 py-3">Nome</th>
              <th className="px-6 py-3">E-mail</th>
              <th className="px-6 py-3">Data de nascimento</th>
              <th className="px-6 py-3">CPF</th>
              <th className="px-6 py-3">Telefone</th>
              <th className="px-6 py-3">Tipo</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-center">Excluir</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.birthdate}</td>
                <td className="px-6 py-4">{user.cpf}</td>
                <td className="px-6 py-4">{user.phone}</td>
                <td className="px-6 py-4">
                  {user.is_staff ? 'Administrador' : 'Usuário'}
                </td>
                <td className="px-6 py-4">
                  <ToggleSwitch
                    defaultOn={user.is_active}
                    onChange={(active) => handleToggle(user.id, active)}
                  />
                </td>
                <td className="px-6 py-4 flex justify-center">
                  <button
                    aria-label="Excluir"
                    className="text-gray-500 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
