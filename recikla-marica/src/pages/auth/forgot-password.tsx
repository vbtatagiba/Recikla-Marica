// pages/auth/forgot-password.tsx
import React, { useState, FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa o Bootstrap
import { useRouter } from 'next/router';
import axios from 'axios';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/auth/forgot-password', {
              email
            }, {
              headers: {
                'Content-Type': 'application/json'
              }
            });
            setMessage('Password reset link sent to your email.');
          } catch (err) {

            setError('Error sending reset link.');
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
