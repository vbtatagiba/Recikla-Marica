import React from 'react';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import Link from 'next/link';
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
                // Usuário autenticado, redireciona para o dashboard
                return {
                    redirect: {
                        destination: '/user/dashboard',
                        permanent: false,
                    },
                };
            }
        } catch (error) {
            console.error('Erro ao validar o token:', error);
        }
    }

    // Se não houver token ou ele for inválido, renderiza a página de registro
    return {
        props: {}, // Nenhum dado adicional necessário
    };
};

const Home: React.FC = () => {
    return (
        <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100">
            <Logo />
            <h2 className="mt-3">Boas vindas ao ReciKla Maricá</h2>
            <p className="lead">O futuro da reciclagem começa aqui!</p>
            <div className="col-6">
                <div className="d-grid gap-2">
                    <Link href="/auth/login" className="btn btn-success">
                        Login
                    </Link>
                    <Link href="/auth/register" className="btn btn-primary">
                        Cadastre-se
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
