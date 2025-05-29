'use client';

import { useEffect, useState } from 'react';
import { Eye, EyeOff, Plus, Trash2 } from 'lucide-react';
import ToggleSwitch from '@/components/ToggleSwitch';
import toast from 'react-hot-toast';
import { listUsers, deleteUser, updateUserStatus, register as registerUser } from '@/services/routes';
import { User } from '@/interfaces';
import { createPortal } from 'react-dom';
import { getUserFromToken } from '@/utils/tokenDecode';
import { useRouter } from 'next/navigation';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { MasterregisterSchema, MasterRegisterFormData } from '@/validations/validationSchema';

export default function Users() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<User | null>(null);
  const [creating, setCreating] = useState<boolean>(false);

  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<MasterRegisterFormData>({
    resolver: yupResolver(MasterregisterSchema),
  });

  useEffect(() => {
    const user = getUserFromToken();
    if (!user) {
      toast.error('Usuário não encontrado');
      router.push('/login');
    } else if (user.role !== 'master') {
      toast.error('Acesso negado');
      router.push('/pages/profile');
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
      toast.success('Usuário apagado com sucesso!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao apagar usuário');
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
      toast.success(`Usuário ${newState ? 'ativado' : 'desativado'}!`);
    } catch (err) {
      console.error(err);
      setUsers((u) =>
        u.map((user) =>
          user.id === id ? { ...user, is_active: !newState } : user
        )
      );
      toast.error('Falha ao atualizar status.');
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
    setValue('cpf', formatted);
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
    setValue('phone', value);
  };

  const handleCreateUser = async (data: MasterRegisterFormData) => {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('birth_date', data.birth_date);
    formData.append('document', data.cpf.replace(/\D/g, ''));
    formData.append('phone', data.phone.replace(/\D/g, ''));
    formData.append('role', 'master');
    formData.append('is_active', 'true');
    formData.append('is_superuser', 'true');
    formData.append('is_staff', 'true');


    try {
      await registerUser(formData);
      toast.success('Usuário criado com sucesso!');
      setCreating(false);
      reset();
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
                <th className="px-6 py-3">Nascimento</th>
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
                  <td className="px-6 py-4">{user.is_staff ? 'Administrador' : 'Usuário'}</td>
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

      {/* Modal de Cadastro */}
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
              <h2 className="text-lg font-bold mb-4">Criar novo usuário master</h2>

              <form onSubmit={handleSubmit(handleCreateUser)} className="space-y-4">
                {[
                  { label: 'Nome', name: 'username', type: 'text' },
                  { label: 'E-mail', name: 'email', type: 'email' },
                  { label: 'Senha', name: 'password', type: showPassword ? 'text' : 'password' },
                  { label: 'Confirmar Senha', name: 'confirmPassword', type: showConfirmPassword ? 'text' : 'password' },
                  { label: 'Nascimento', name: 'birth_date', type: 'date' },
                  { label: 'CPF', name: 'cpf', type: 'text' },
                  { label: 'Telefone', name: 'phone', type: 'text' },
                ].map(({ label, name, type }) => (
                  <div key={name}>
                    <label className="block text-sm mb-1">{label}</label>
                    <div className="relative">
                      <input
                        type={type}
                        {...register(name as keyof MasterRegisterFormData)}
                        {...(name === 'cpf'
                          ? { value: cpf, onChange: handleCpfChange }
                          : name === 'phone'
                            ? { value: phone, onChange: handlePhoneChange }
                            : {})}
                        className="w-full border border-gray-300 rounded-md p-2 pr-10"
                      />
                      {(name === 'password' || name === 'confirmPassword') && (
                        <button
                          type="button"
                          onClick={() => {
                            if (name === 'password') {
                              setShowPassword((prev) => !prev);
                            } else {
                              setShowConfirmPassword((prev) => !prev);
                            }
                          }}
                          className="absolute inset-y-0 right-2 flex items-center"
                        >
                          {(name === 'password' ? showPassword : showConfirmPassword) ? (
                            <EyeOff size={18} className="text-gray-600" />
                          ) : (
                            <Eye size={18} className="text-gray-600" />
                          )}
                        </button>
                      )}
                    </div>
                    {errors[name as keyof MasterRegisterFormData] && (
                      <p className="text-red-500 text-xs">
                        {errors[name as keyof MasterRegisterFormData]?.message?.toString()}
                      </p>
                    )}
                  </div>
                ))}

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
              <h2 className="text-lg font-bold mb-4">Deletar usuário</h2>
              <p className="mb-4">
                Tem certeza que deseja deletar o usuário <strong>{deleting.username}</strong>?
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
    </section>
  );
}
