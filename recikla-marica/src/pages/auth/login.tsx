import React, { useState, FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa o Bootstrap
import { useRouter } from 'next/router';
import axios from 'axios';


const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/auth/login', {
            email, password
          }, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
            localStorage.setItem('token', response.data.token);
            router.push('../dashboard');
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            setError('Email ou senha incorretos!');
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
                <h2 className="text-center mb-4">Entrar</h2>
                <form onSubmit={handleSubmit} className="row g-3">
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
                            <button type="submit" className="btn btn-success">Login</button>
                            <Link href="/auth/register" className="btn btn-primary">
                                Cadastre-se
                            </Link>
                            <Link href="/auth/forgot-password" className="btn btn-link">
                                Esqueci minha senha
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
