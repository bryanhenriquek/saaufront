'use client'

import { useEffect, useState } from 'react';
import { Trash2, ClipboardSignatureIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';

import { User } from '@/interfaces';
import { deleteUser, getUser, changePassword } from '@/services/routes';
import { getUserFromToken } from '@/utils/tokenDecode';

import PasswordInput from '@/components/PasswordInput';

export default function Profile() {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<User | null>(null);

    const [deleting, setDeleting] = useState<boolean>(false);
    const [updating, setUpdating] = useState<boolean>(false);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            const decoded = getUserFromToken();
            if (!decoded) {
                toast.error('Usuário não encontrado.');
                router.push('/');
                return;
            }

            try {
                const data = await getUser(decoded.user_id);
                setUser(data);
            } catch (error) {
                console.error(error)
                toast.error('Erro ao carregar dados do usuário.');
                // env
                router.push('/');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    const confirmDelete = async () => {
        if (!user) return;

        try {
            setLoading(true);
            await deleteUser(user.id);
            localStorage.clear();
            toast.success('Conta excluída com sucesso!');
            router.push('/');
        } catch (error) {
            console.error(error)
            toast.error('Erro ao excluir conta.');
        } finally {
            setLoading(false);
            setDeleting(false);
        }
    };

    const handlePasswordUpdate = async () => {
        if (newPassword !== confirmPassword) {
            toast.error('As senhas não coincidem.');
            return;
        }

        try {
            setLoading(true);

            await changePassword({
                old_password: currentPassword,
                new_password: newPassword,
                confirm_password: confirmPassword,
            });

            toast.success('Senha atualizada com sucesso!');
            setUpdating(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error(error)
            toast.error('Erro ao atualizar senha.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <p className="text-gray-700 text-lg">Carregando...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <p className="text-gray-700 text-lg">Nenhum usuário encontrado.</p>
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
                <div><h2 className="text-sm font-semibold">Nome</h2><p>{user.username}</p></div>
                <div><h2 className="text-sm font-semibold">E-mail</h2><p>{user.email}</p></div>
                <div><h2 className="text-sm font-semibold">Data de nascimento</h2><p>{user.birth_date}</p></div>
                <div><h2 className="text-sm font-semibold">CPF</h2><p>{user.document}</p></div>
                <div><h2 className="text-sm font-semibold">Telefone</h2><p>{user.phone}</p></div>
                <div><h2 className="text-sm font-semibold">Tipo</h2><p>{user.is_staff ? 'Administrador' : 'Usuário'}</p></div>

                <button
                    onClick={() => setDeleting(true)}
                    className="w-full rounded-xl bg-purple-900 px-4 py-2 text-white hover:bg-purple-700 flex justify-center items-center gap-2 cursor-pointer"
                >
                    <Trash2 size={18} /> Excluir Conta
                </button>

                <button
                    onClick={() => setUpdating(true)}
                    className="w-full rounded-xl bg-purple-900 px-4 py-2 text-white hover:bg-purple-700 flex justify-center items-center gap-2 cursor-pointer"
                >
                    <ClipboardSignatureIcon size={18} /> Atualizar senha
                </button>
            </div>

            {/* Delete Modal */}
            {deleting && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                    onClick={() => setDeleting(false)}
                >
                    <div className="bg-white rounded-xl max-w-md p-6 text-black" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-lg font-bold mb-4">Deletar conta</h2>
                        <p>Tem certeza que deseja excluir sua conta <strong>{user.username}</strong>?</p>
                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={() => setDeleting(false)}
                                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer">
                                Cancelar
                            </button>
                            <button onClick={confirmDelete}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 cursor-pointer">
                                {loading ? 'Deletando...' : 'Deletar'}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Update Password Modal */}
            {updating && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 "
                    onClick={() => setUpdating(false)}
                >
                    <div className="bg-white rounded-xl max-w-md p-6 text-black w-full" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-lg font-bold mb-4">Alterar senha</h2>

                        <div className="space-y-3">
                            <PasswordInput
                                label="Senha atual"
                                id="current_password"
                                name="current_password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />

                            <PasswordInput
                                label="Nova senha"
                                id="new_password"
                                name="new_password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />

                            <PasswordInput
                                label="Confirme a nova senha"
                                id="confirm_password"
                                name="confirm_password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={() => setUpdating(false)}
                                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer">
                                Cancelar
                            </button>
                            <button onClick={handlePasswordUpdate}
                                className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 cursor-pointer">
                                {loading ? 'Atualizando...' : 'Atualizar'}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </section>
    );
}
