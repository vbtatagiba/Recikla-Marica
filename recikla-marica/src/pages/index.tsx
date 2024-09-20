import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa o Bootstrap

const Home: React.FC = () => {
    return (
        <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100">
            <div className="text-center mb-4">
                <Image
                    src="/logo_recikla_marica.png"
                    alt="Logo ReciKla Maricá"
                    width={300}
                    height={300}
                />
            </div>
            <h2 className="mt-3">Bem-vindo ao ReciKla Maricá</h2>
            <p className="lead">O futuro da reciclagem começa aqui!</p>
            <div className="col-6">
                <div className="d-grid gap-2">
                    <Link href="auth/login" className="btn btn-success">
                            Login
                    </Link>
                    <Link href="auth/register" className="btn btn-primary">
                        Cadastre-se
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
