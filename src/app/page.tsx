'use client'

import { useRouter } from 'next/navigation';
import { login } from '@/services/api';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    try {
      const response = await login(formData);

      const user = { ...response.user };
      delete user.password;

      localStorage.setItem('accessToken', response.access);
      localStorage.setItem('refreshToken', response.refresh);
      localStorage.setItem('user', JSON.stringify(response.user));

      router.push('/pages/users');
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Erro ao fazer login.");
    }
  };

  return (
    <main className="min-h-screen flex">
      <div className="w-1/2 bg-[#5F259F] text-white flex flex-col items-center justify-center p-8">
        <img src="/logo.png" alt="Logo" className="mb-6 w-40 h-auto" />
        <h2 className="text-4xl font-bold mb-4">Bem-vindo(a)</h2>
        <p className="mb-6 text-center max-w-sm">
          Caso ainda não tenha cadastro, clique no botão abaixo.
        </p>
        <Link
          href="/register"
          className="border border-white text-white py-2 px-6 rounded-full hover:bg-white hover:text-[#5F259F] transition "
        >
          CADASTRAR
        </Link>
      </div>
      <div className="w-1/2 bg-gray-100 flex flex-col items-center justify-center p-10">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 bg-white bg-opacity-80 p-8 rounded-xl shadow-2xl w-auto"
        >
          <div className="flex flex-col w-xs">
            <label htmlFor="email" className="mb-1 font-semibold text-sm text-black">
              E-mail
            </label>
            <input
              type="text"
              id="email"
              name="email"
              required
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>

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

          <button
            type="submit"
            className="bg-[#5F259F] text-white py-2 px-4 rounded-md hover:bg-[#2e124f] transition cursor-pointer"
          >
            Entrar
          </button>

          <div className="flex justify-center text-sm text-gray-500 mt-4">
            <Link href="/terms" className="text-[#2d2d2d] hover:underline font-bold">
              Políticas de Privacidade e os Termos de Uso
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}