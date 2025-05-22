'use client';

import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import ToggleSwitch from '@/components/ToggleSwitch';
import toast from 'react-hot-toast';
import { listUsers, deleteUser } from '@/services/api';
import { User } from '@/interfaces';
import { createPortal } from 'react-dom';
import { getUserFromToken } from '@/utils/tokenDecode';
import { useRouter } from 'next/navigation';

export default function Users() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<User | null>(null);

  useEffect(() => {
    const user = getUserFromToken();
    console.log(user)
    if (!user) {
      toast.error("Usuário não encontrado");
      router.push('/login');
    } else if (user.role !== 'master') {
      toast.error(user.role);
      toast.error("Acesso negado");
      //router.push('/');
    }
    const fetchUsers = async () => {
      try {
        const data = await listUsers();
        setUsers(data);
      } catch (error) {
        toast.error('Erro ao carregar usuários');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  const handleToggle = (id: number, newState: boolean) => {
    setUsers((u) =>
      u.map((user) =>
        user.id === id ? { ...user, is_active: newState } : user
      )
    );
    toast.success(`Usuário ${newState ? 'ativado' : 'desativado'}!`);
  };

  const confirmDelete = async () => {
    if (!deleting) return toast.error("Usuário não encontrado");

    try {
      setLoading(true);
      await deleteUser(deleting.id);
      setUsers((prev) => prev.filter((u) => u.id !== deleting.id));
      setDeleting(null);
      toast.success("Usuário apagado com sucesso!");
    } catch (error) {
      console.error(error);
      const err = error as { response?: { data?: { error?: string; detail?: string } } };

      const backendMessage =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Erro ao apagar usuário";

      toast.error(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-4 bg-gray-100 min-h-screen">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-[#5F259F] mb-2 text-left">Usuários</h1>
        <p className="text-gray-600">Visualize e gerencie seus usuários.</p>
      </header>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Carregando usuários…</div>
        ) : (
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
                  <td className="px-6 py-4">{user.username}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.birth_date}</td>
                  <td className="px-6 py-4">{user.document}</td>
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
                      className="text-gray-500 hover:text-red-600 cursor-pointer"
                      onClick={() => setDeleting(user)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {deleting &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setDeleting(null)}
          >
            <div
              className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold mb-4 text-black">Deletar usuário</h2>
              <p className="mb-4 text-black">
                Você tem certeza que deseja deletar o usuário{' '}
                <strong>{deleting.username}</strong>?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer text-black"
                  onClick={() => setDeleting(null)}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                  onClick={confirmDelete}
                >
                  {loading ? 'Deletando...' : 'Deletar'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}
