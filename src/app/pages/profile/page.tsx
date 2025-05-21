'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

type User = {
  id: number;
  name: string;
  email: string;
  birthdate: string;
  cpf: string;
  phone: string;
  is_staff: boolean;
};

export default function Profile() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>({
    id: 1,
    name: 'Roberto Carlos',
    email: 'robertinho@email.com',
    birthdate: '2000-02-11',
    cpf: '123.456.789-00',
    phone: '(11) 91234-5678',
    is_staff: true,
  });

  const handleDeleteAccount = () => {
    const confirm = window.confirm(
      'Tem certeza que deseja excluir sua conta? Esta ação não poderá ser desfeita.'
    );

    if (confirm) {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      toast.success('Sua conta foi excluída com sucesso!');
      router.push('/');
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-gray-700 text-lg">Nenhum usuário logado.</p>
      </div>
    );
  }

  return (
    <section className="p-6 bg-gray-100 min-h-screen max-w-md text-gray-700">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-[#5F259F] mb-2 text-left">Meu Perfil</h1>
        <p className="text-gray-600">Visualize e gerencie seus dados pessoais.</p>
      </header>

      <div className="space-y-4">
        <div>
          <h2 className="text-gray-600 text-sm font-semibold mb-1">Nome</h2>
          <p className="text-lg font-medium">{user.name}</p>
        </div>

        <div>
          <h2 className="text-gray-600 text-sm font-semibold mb-1">E-mail</h2>
          <p className="text-lg">{user.email}</p>
        </div>

        <div>
          <h2 className="text-gray-600 text-sm font-semibold mb-1">Data de nascimento</h2>
          <p className="text-lg">{user.birthdate}</p>
        </div>

        <div>
          <h2 className="text-gray-600 text-sm font-semibold mb-1">CPF</h2>
          <p className="text-lg">{user.cpf}</p>
        </div>

        <div>
          <h2 className="text-gray-600 text-sm font-semibold mb-1">Telefone</h2>
          <p className="text-lg">{user.phone}</p>
        </div>

        <div>
          <h2 className="text-gray-600 text-sm font-semibold mb-1">Tipo</h2>
          <p className="text-lg">{user.is_staff ? 'Administrador' : 'Usuário'}</p>
        </div>

        <button
          onClick={handleDeleteAccount}
          aria-label="Excluir"
          className="mt-6 w-full flex justify-center items-center gap-2 rounded-2xl bg-purple-900 px-4 py-2 text-white font-semibold hover:bg-purple-700 transition"
        >
          <Trash2 size={18} />
          Excluir Conta
        </button>

      </div>
    </section>
  );
}
