'use client'

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { register } from '@/services/api';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Register() {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [cpf, setCpf] = useState('');
    const [phone, setPhone] = useState('');

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);


        formData.set('document', cpf);
        formData.set('phone', phone);
        formData.set('role', 'user');
        formData.set('is_active', 'true');
        formData.set('is_superuser', 'false');
        formData.set('is_staff', 'false');

        try {
            await register(formData);
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
                <Image src="/logo.png" alt="Logo" className="mb-6" width={350} height={350}/>
                <h2 className="text-4xl font-bold mb-4">Já possui login?</h2>
                <p className="mb-6 text-center max-w-sm">
                    Clique no botão abaixo.
                </p>
                <Link
                    href="/"
                    className="border border-white text-white py-2 px-6 rounded-full hover:bg-white hover:text-[#5F259F] transition "
                >
                    LOGIN
                </Link>
            </div>
            <div className="w-1/2 bg-gray-100 flex flex-col items-center justify-center p-10">
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4 bg-white bg-opacity-80 p-8 rounded-xl shadow-2xl w-auto"
                >
                    {/* Nome */}
                    <div className="flex flex-col w-xs">
                        <label htmlFor="username" className="mb-1 font-semibold text-sm text-black">
                            Primeiro Nome
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            required
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col w-xs">
                        <label htmlFor="email" className="mb-1 font-semibold text-sm text-black">
                            E-mail
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        />
                    </div>

                    {/* Senha */}
                    <div className="flex flex-col">
                        <label htmlFor="password" className="mb-1 font-semibold text-sm text-black">
                            Senha
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                required
                                className="w-full border border-gray-300 rounded-md p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(v => !v)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 focus:outline-none"
                            >
                                {showPassword
                                    ? <EyeOff size={20} color='black' />
                                    : <Eye size={20} color='black' />
                                }
                            </button>
                        </div>
                    </div>

                    {/* Data de nascimento */}
                    <div className="flex flex-col w-xs">
                        <label htmlFor="birthdate" className="mb-1 font-semibold text-sm text-black">
                            Data de nascimento
                        </label>
                        <input
                            type="date"
                            id="birth_date"
                            name="birth_date"
                            required
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        />
                    </div>

                    {/* CPF */}
                    <div className="flex flex-col w-xs">
                        <label htmlFor="document" className="mb-1 font-semibold text-sm text-black">
                            CPF
                        </label>
                        <input
                            type="text"
                            inputMode="numeric"
                            id="document"
                            name="document"
                            value={cpf}
                            onChange={handleCpfChange}
                            maxLength={14}
                            required
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        />
                    </div>

                    {/* Telefone */}
                    <div className="flex flex-col w-xs">
                        <label htmlFor="phone" className="mb-1 font-semibold text-sm text-black">
                            Telefone
                        </label>
                        <input
                            type="text"
                            inputMode="numeric"
                            id="phone"
                            name="phone"
                            value={phone}
                            onChange={handlePhoneChange}
                            maxLength={15}
                            required
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        />
                    </div>

                    {/* Botão */}
                    <button
                        type="submit"
                        className="bg-[#5f259f] text-white py-2 px-4 rounded-md hover:bg-[#2e124f] transition cursor-pointer"
                    >
                        Cadastrar
                    </button>
                </form>
            </div>
        </main>
    );
}
