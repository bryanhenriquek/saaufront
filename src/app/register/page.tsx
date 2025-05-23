'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema, RegisterFormData } from '@/validations/validationSchema';
import { register as registerAPI } from '@/services/routes';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function Register() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [cpf, setCpf] = useState('');
    const [phone, setPhone] = useState('');

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
        resolver: yupResolver(registerSchema),
    });

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

    const onSubmit = async (data: RegisterFormData) => {
        const formData = new FormData();
        formData.append('username', data.username);
        formData.append('email', data.email);
        formData.append('birth_date', data.birth_date);
        formData.append('document', cpf.replace(/\D/g, ''));
        formData.append('phone', phone.replace(/\D/g, ''));
        formData.append('password', data.password);
        formData.append('role', 'user');
        formData.append('is_active', 'true');
        formData.append('is_superuser', 'false');
        formData.append('is_staff', 'false');

        try {
            await registerAPI(formData);
            toast.success('Cadastro realizado com sucesso!');
            router.push('/');
        } catch (error) {
            console.error(error);
            toast.error('Erro no cadastro');
        }
    };

    return (
        <main className="min-h-screen flex">
            <div className="w-1/2 bg-[#5F259F] text-white flex flex-col items-center justify-center p-8">
                <Image src="/logo.png" alt="Logo" width={350} height={350} className="mb-6" />
                <h2 className="text-4xl font-bold mb-4">Já possui login?</h2>
                <p className="mb-6 text-center max-w-sm">Clique no botão abaixo.</p>
                <Link
                    href="/"
                    className="border border-white py-2 px-6 rounded-full hover:bg-white hover:text-[#5F259F] transition"
                >
                    LOGIN
                </Link>
            </div>

            <div className="w-1/2 bg-gray-100 flex flex-col items-center justify-center p-10 text-black">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 bg-white bg-opacity-80 p-8 rounded-xl shadow-2xl w-auto">

                    {/* Nome */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Primeiro Nome</label>
                        <input {...register('username')} className="border rounded-md p-2 w-full" />
                        {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">E-mail</label>
                        <input {...register('email')} className="border rounded-md p-2 w-full" />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>

                    {/* Data de nascimento */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Data de nascimento</label>
                        <input type="date" {...register('birth_date')} className="border rounded-md p-2 w-full" />
                        {errors.birth_date && <p className="text-red-500 text-sm">{errors.birth_date.message}</p>}
                    </div>

                    {/* CPF */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">CPF</label>
                        <input
                            {...register('cpf')}
                            value={cpf}
                            onChange={handleCpfChange}
                            className="border rounded-md p-2 w-full"
                        />
                        {errors.cpf && <p className="text-red-500 text-sm">{errors.cpf.message}</p>}
                    </div>

                    {/* Telefone */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Telefone</label>
                        <input
                            {...register('phone')}
                            value={phone}
                            onChange={handlePhoneChange}
                            className="border rounded-md p-2 w-full"
                        />
                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                    </div>

                    {/* Senha */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Senha</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                {...register('password')}
                                className="border rounded-md p-2 w-full pr-10"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-2">
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.password && errors.password.message?.split('\n').map((line, idx) => (
                            <p key={idx} className="text-red-500 text-sm">{line}</p>
                        ))}
                    </div>

                    {/* Confirme a senha */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Confirme sua senha</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                {...register('confirmPassword')}
                                className="border rounded-md p-2 w-full pr-10"
                            />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-2 top-2">
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                    </div>

                    {/* Botão */}
                    <button type="submit" className="bg-[#5F259F] text-white py-2 px-4 rounded-md hover:bg-[#2e124f] transition">
                        Cadastrar
                    </button>
                </form>
            </div>
        </main>
    );
}
