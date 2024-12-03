import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import Logo from '@components/Logo';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const cookies = parseCookies(ctx);
    const token = cookies.token;

    if (token) {
        try {
            const response = await fetch('http://localhost:3001/auth/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                return {
                    redirect: {
                        destination: '/user/dashboard',
                        permanent: false,
                    },
                };
            }
        } catch (error) {
            console.error('Token inválido ou expirado:', error);
        }
    }

    return {
        props: {}, // Permite o acesso à página de login
    };
};

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/auth/forgot-password', {
              email
            }, {
              headers: {
                'Content-Type': 'application/json'
              }
            });
            setMessage('Link para redefinição de senha enviado para o seu e-mail.');
          } catch (err) {

            setError('Erro ao enviar o link de redefinição.');
          }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center min-vh-100">
            <div className="col-md-6">
                <Logo />
                <h2 className="text-center mb-4">Recuperar Senha</h2>
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
                    {message && (
                        <div className="col-12">
                            <div className="alert alert-success alert-dismissible fade show" role="alert">
                                {message}
                                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>
                        </div>
                    )}
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
                            <button type="submit" className="btn btn-success">Enviar E-mail</button>
                            <Link href="/auth/login" className="btn btn-primary">
                                Voltar para Login
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
