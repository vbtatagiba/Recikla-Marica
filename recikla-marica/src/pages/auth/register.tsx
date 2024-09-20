import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa o Bootstrap
import { useRouter } from 'next/router';

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Senhas não coincidem. Tente novamente.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
                
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Detalhes do erro:', errorData);
                throw new Error(errorData.message || 'Erro ao cadastrar. Tente novamente.');
            }

            console.log('Cadastro bem-sucedido');
            router.push('auth/login'); // Redireciona para a página de login
        } catch (error: any) {
            console.error('Erro ao se cadastrar:', error);
            setError(error.message || 'Erro ao cadastrar. Tente novamente.');
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center min-vh-100">
            <div className="col-md-6">
                <div className="text-center mb-4 d-flex justify-content-center">
                    <Image
                        src="/logo_recikla_marica.png"
                        alt="Logo ReciKla Maricá"
                        width={300}
                        height={300}
                    />
                </div>

                <h2 className="text-center mb-4">Cadastre-se</h2>
                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-12">
                        <label htmlFor="username" className="form-label">Nome de Usuário</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-12">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-12">
                        <label htmlFor="password" className="form-label">Senha</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-12">
                        <label htmlFor="confirm-password" className="form-label">Confirme a senha</label>
                        <input
                            type="password"
                            className="form-control"
                            id="confirm-password"
                            name="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && (
                        <div className="col-12">
                            <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                {error}
                                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>
                        </div>
                    )}
                    <div className="col-12">
                        <div className="d-grid gap-2">
                            <button type="submit" className="btn btn-success">Registrar</button>
                            <Link href="/" className="btn btn-primary">Voltar</Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
