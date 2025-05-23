'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Terms() {
    return (
        <main className="min-h-screen bg-cover bg-center">
            <div className="flex flex-col items-center justify-center h-screen px-4 bg-[#5F259F]">
                <div className="bg-white bg-opacity-90 p-8 rounded-xl shadow-2xl max-w-2xl overflow-y-auto max-h-[80vh]">
                    <div className="flex justify-center">
                        <Image src="/logo.png" alt="Logo" className="mb-6" width={350} height={350}/>
                    </div>
                    <h1 className="text-2xl font-bold text-[#181e7e] mb-4 text-center">
                        Termos de Uso e Política de Privacidade
                    </h1>

                    <section className="text-black text-sm leading-relaxed space-y-4">
                        <p>
                            Ao utilizar nosso sistema, você concorda com os Termos de Uso e com a nossa Política de Privacidade. Leia atentamente antes de continuar.
                        </p>

                        <h2 className="font-semibold text-base mt-4">1. Coleta de Dados</h2>
                        <p>
                            Coletamos dados como nome, e-mail, CPF, telefone e data de nascimento para identificação e contato. Esses dados são armazenados de forma segura.
                        </p>

                        <h2 className="font-semibold text-base mt-4">2. Uso das Informações</h2>
                        <p>
                            As informações fornecidas são utilizadas exclusivamente para fins de autenticação, comunicação e melhoria dos nossos serviços.
                        </p>

                        <h2 className="font-semibold text-base mt-4">3. Compartilhamento de Dados</h2>
                        <p>
                            Não compartilhamos suas informações com terceiros sem seu consentimento, exceto quando exigido por lei.
                        </p>

                        <h2 className="font-semibold text-base mt-4">4. Segurança</h2>
                        <p>
                            Adotamos medidas técnicas e administrativas para proteger seus dados contra acessos não autorizados.
                        </p>

                        <h2 className="font-semibold text-base mt-4">5. Seus Direitos</h2>
                        <p>
                            Você pode solicitar acesso, correção ou exclusão dos seus dados a qualquer momento, conforme a LGPD.
                        </p>

                        <p>
                            Para mais informações, entre em contato com nosso suporte.
                        </p>
                    </section>

                    <div className="mt-6 text-center">
                        <Link href="/" className="text-[#5F259F] hover:underline hover: font-bold">
                            Voltar ao login
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}