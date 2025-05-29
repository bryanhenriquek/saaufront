'use client';

import Link from 'next/link';

export default function About() {
    return (
        <main className="min-h-screen bg-cover bg-center text-black">
            <div className="flex flex-col items-center justify-center h-screen px-4 bg-[#5F259F]">
                <div className="bg-white bg-opacity-90 p-8 rounded-xl shadow-2xl max-w-6xl  overflow-y-auto w-full">

                    <h1 className="text-3xl font-bold text-[#5F259F] mb-6 text-center">
                        Sobre o Projeto
                    </h1>

                    <div className="w-full aspect-video mb-6">
                        <iframe
                            className="w-full h-full rounded-xl"
                            src="https://www.youtube.com/embed/jxRZ4axIN4I"
                            title="YouTube video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>

                    <p className="mb-4">
                        <strong>SAAU Frontend</strong> — Interface Web do Sistema de Autenticação e Administração de Usuários.
                    </p>

                    <p className="mb-4">
                        O <strong>SAAU Frontend</strong> é a interface web do sistema SAAU, responsável por oferecer uma
                        experiência amigável, acessível e segura para usuários interagirem com o sistema de autenticação,
                        gerenciamento de contas e controle de acesso.
                    </p>

                    <p className="mb-4">
                        Este projeto foi desenvolvido como parte de uma atividade acadêmica da <strong>Universidade de Mogi das Cruzes</strong>.
                    </p>

                    <h2 className="text-xl font-semibold text-[#5F259F] mb-2">Funcionalidades</h2>
                    <ul className="list-disc list-inside mb-4 space-y-1">
                        <li>Tela de login com validação de credenciais e uso de JWT</li>
                        <li>Redefinição de senha via token</li>
                        <li>Painel administrativo com controle baseado em papéis (RBAC)</li>
                        <li>Exclusão de conta e anonimização de dados conforme a LGPD</li>
                        <li>Integração total com o backend via API RESTful</li>
                    </ul>

                    <h2 className="text-xl font-semibold text-[#5F259F] mb-2">Tecnologias Utilizadas</h2>
                    <p className="mb-4">
                        Next.js, React, TailwindCSS, Axios, JWT, Django REST Framework.
                    </p>

                    <h2 className="text-xl font-semibold text-[#5F259F] mb-2">Integrantes do Projeto</h2>
                    <ul className="list-disc list-inside mb-4 space-y-1">
                        <li>
                            <a href="https://github.com/FlamingoLindo" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                Vitor Antunes Ferreira
                            </a> — RGM: 11221100950
                        </li>
                        <li>
                            <a href="https://github.com/LLizot" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                Lucas Lizot Mori
                            </a> — RGM: 11212100125
                        </li>
                        <li>
                            <a href="https://github.com/carloosz" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                Carlos Henrique
                            </a> — RGM: 11221504686
                        </li>
                        <li>
                            <a href="https://github.com/bryanhenriquek" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                Bryan Henrique de Oliveira Serrão
                            </a> — RGM: 11221101589
                        </li>
                    </ul>

                    <div className="mt-6 text-center">
                        <Link href="/" className="text-[#5F259F] hover:underline font-bold">
                            Voltar ao login
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
