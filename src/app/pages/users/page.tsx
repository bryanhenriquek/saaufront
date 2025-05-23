'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import ToggleSwitch from '@/components/ToggleSwitch';
import toast from 'react-hot-toast';
import { listUsers, deleteUser, updateUserStatus, register } from '@/services/api';
import { User } from '@/interfaces';
import { createPortal } from 'react-dom';
import { getUserFromToken } from '@/utils/tokenDecode';
import { useRouter } from 'next/navigation';

export default function Users() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<User | null>(null);
  const [creating, setCreating] = useState<boolean>(false);

  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const user = getUserFromToken();
    if (!user) {
      toast.error("Usuário não encontrado");
      router.push('/login');
    } else if (user.role !== 'master') {
      toast.error("Acesso negado");
      router.push('/');
    }

    const fetchUsers = async () => {
      try {
        const data = await listUsers();
        setUsers(data);
      } catch (error) {
        console.error(error);
        toast.error('Erro ao carregar usuários');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  const confirmDelete = async () => {
    if (!deleting) return;

    try {
      setLoading(true);
      await deleteUser(deleting.id);
      setUsers((prev) => prev.filter((u) => u.id !== deleting.id));
      setDeleting(null);
      toast.success("Usuário apagado com sucesso!");
    } catch (error) {
      console.error(error);
      //toast.error("Erro ao apagar usuário");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: number, newState: boolean) => {
    setUsers((u) =>
      u.map((user) =>
        user.id === id ? { ...user, is_active: newState } : user
      )
    );
    try {
      await updateUserStatus(id);
      toast.success(`Usuário ${newState ? "ativado" : "desativado"}!`);
    } catch (err) {
      console.error(err);
      setUsers((u) =>
        u.map((user) =>
          user.id === id ? { ...user, is_active: !newState } : user
        )
      );
      toast.error("Falha ao atualizar status.");
    }
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    const formatted = value
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setCpf(formatted);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length <= 10) {
      value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
      value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }
    setPhone(value);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    formData.set('document', cpf);
    formData.set('phone', phone);
    formData.set('role', 'master');
    formData.set('is_active', 'true');
    formData.set('is_superuser', 'true');
    formData.set('is_staff', 'true');

    try {
      await register(formData);
      toast.success('Usuário criado com sucesso!');
      setCreating(false);
      form.reset();
      setCpf('');
      setPhone('');
      const updated = await listUsers();
      setUsers(updated);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao criar usuário');
    }
  };

  return (
    <section className="p-4 bg-gray-100 min-h-screen">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-[#5F259F] mb-2 text-left">Usuários</h1>
        <div className="flex items-center justify-between">
          <p className="text-gray-600 mb-0">Visualize e gerencie seus usuários.</p>
          <button
            onClick={() => setCreating(true)}
            className="rounded-xl bg-purple-900 px-4 py-2 text-white hover:bg-purple-700 flex justify-center items-center gap-2 cursor-pointer"
          >
            <Plus size={18} /> Cadastrar master
          </button>
        </div>
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

      {/* Modal de Deletar */}
      {deleting &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm text-black"
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
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                  onClick={() => setDeleting(null)}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                  onClick={confirmDelete}
                >
                  {loading ? 'Deletando...' : 'Deletar'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Cadastro de usuário master */}
      {creating &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm text-black"
            onClick={() => setCreating(false)}
          >
            <div
              className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold mb-4 text-black">Criar novo usuário master</h2>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Nome</label>
                  <input
                    name="username"
                    required
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">E-mail</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Senha</label>
                  <input
                    name="password"
                    type="password"
                    required
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Data de Nascimento</label>
                  <input
                    name="birth_date"
                    type="date"
                    required
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">CPF</label>
                  <input
                    name="document"
                    value={cpf}
                    onChange={handleCpfChange}
                    required
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Telefone</label>
                  <input
                    name="phone"
                    value={phone}
                    onChange={handlePhoneChange}
                    required
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setCreating(false)}
                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                  >
                    Cadastrar
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}
