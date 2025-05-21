'use client';

import { useState } from 'react';
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

  // ✅ Dados mockados simulando usuário logado
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
      // 🔥 Aqui você pode chamar sua API para excluir no backend
      // await deleteUser(user.id);

      // Simula remoção
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
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">Nenhum usuário logado.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-8">
        <h1 className="text-3xl font-bold text-[#181e7e] mb-6">Meu Perfil</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Nome</p>
            <p className="text-lg font-medium text-gray-800">{user.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">E-mail</p>
            <p className="text-lg font-medium text-gray-800">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Data de nascimento</p>
            <p className="text-lg font-medium text-gray-800">{user.birthdate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">CPF</p>
            <p className="text-lg font-medium text-gray-800">{user.cpf}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Telefone</p>
            <p className="text-lg font-medium text-gray-800">{user.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tipo de usuário</p>
            <p className="text-lg font-medium text-gray-800">
              {user.is_staff ? 'Administrador' : 'Usuário'}
            </p>
          </div>
        </div>

        {/* 🔥 Botão de excluir conta */}
        <div className="mt-8">
          <button
            onClick={handleDeleteAccount}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Excluir minha conta
          </button>
        </div>
      </div>
    </main>
  );
}
