import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import React, { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const { success, error } = router.query;

        if (success === 'true') {
            alert("Login com Google realizado com sucesso!");
            router.replace('/user/dashboard'); // Redireciona para o dashboard após 2 segundos;
        }

        if (error === 'auth_failed') {
            alert("Falha na autenticação com o Google.");
            router.replace('/auth/login'); // Redireciona para a página de login após 3 segundos;
        }
    }, [router.query]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/auth/login', {
                email,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log("token: " + response.data.token);
            console.log("user: " + response.data.user.username);
            console.log("role: " + response.data.user.role);

            // // Armazena o token no localStorage
            // localStorage.setItem('token', response.data.token);

            // Armazena o token no cookie
            document.cookie = `token=${response.data.token}; path=/; SameSite=Lax; Secure=${process.env.NODE_ENV === 'production'}`;

            // Supondo que a resposta contenha o papel do usuário
            const userRole = response.data.user.role; // Acessa o papel do usuário da resposta

            // Redireciona baseado no papel do usuário
            if (userRole === 'usuario') {
                console.log("ENTROU AQUI!");
                router.replace('/user/dashboard');
            } else if (userRole === 'coletor') {
                router.replace('/coletor/dashboard');
            } else {
                setError('Papel do usuário desconhecido.');
            }

        } catch (error) {
            console.error("Erro ao fazer login:", error);
            setError('Email ou senha incorretos!');
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center min-vh-100">
            <div className="col-md-6">
                <Logo />
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

                            {/* <div className="d-flex justify-content-center gap-3 mt-3">
                                <button
                                    className="btn btn-outline-dark d-flex align-items-center justify-content-center"
                                    style={{ color: "#DB4437" }} // Cor do Google
                                    onClick={() => window.location.href = 'http://localhost:3001/auth/google'} // Redireciona diretamente para o backend
                                >
                                    <FaGoogle size={24} />
                                </button>


                                <button
                                    className="btn btn-outline-dark"
                                    style={{ color: "#333" }} // Cor do GitHub
                                    onClick={() => window.location.href = '/auth/github'}
                                >
                                    <FaGithub size={24} />
                                </button>
                            </div> */}

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