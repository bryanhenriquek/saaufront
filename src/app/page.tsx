'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '@/validations/validationSchema';
import { useRouter } from 'next/navigation';
import { login } from '@/services/routes';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';

type LoginFormData = {
  email: string;
  password: string;
};

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register: registerInput,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);

      const response = await login(formData);

      localStorage.setItem('accessToken', response.access);
      localStorage.setItem('refreshToken', response.refresh);
      localStorage.setItem('user', JSON.stringify(response.user));

      router.push('/pages/profile');
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Erro ao fazer login.");
    }
  };

  return (
    <main className="min-h-screen flex">
      <div className="w-1/2 bg-[#5F259F] text-white flex flex-col items-center justify-center p-8">
        <Image src="/logo.png" alt="Logo" className="mb-6" width={350} height={350} />
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

        <div className="justify-end flex flex-col items-center mt-10 underline cursor-pointer">
          <Link href="/about">Veja como o projeto foi construído!</Link>
        </div>
      </div>

      <div className="w-1/2 bg-gray-100 flex flex-col items-center justify-center p-10">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 bg-white bg-opacity-80 p-8 rounded-xl shadow-2xl w-auto"
        >
          {/* Email */}
          <div className="flex flex-col w-xs">
            <label htmlFor="email" className="mb-1 font-semibold text-sm text-black">
              E-mail
            </label>
            <input
              type="text"
              id="email"
              {...registerInput('email')}
              className={`border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
            />
            {errors.email && (
              <span className="text-red-500 text-xs">{errors.email.message}</span>
            )}
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
                {...registerInput('password')}
                className={`w-full border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-md p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} color="black" /> : <Eye size={20} color="black" />}
              </button>
            </div>
            {errors.password && (
              <span className="text-red-500 text-xs">{errors.password.message}</span>
            )}
          </div>

          {/* Botão */}
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
