// pages/auth/reset-password.tsx
import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa o Bootstrap
import axios from 'axios';

const ResetPasswordPage: React.FC = () => {
    const router = useRouter();
    const { token } = router.query; // Obtém o token da query string

    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        // Verifica se o token está disponível
        if (!token) {
            setError('Token inválido ou não fornecido.');
            return;
        }

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        try {
            // Constrói a URL corretamente com o token da query
            const response = await axios.post(`http://localhost:3000/auth/reset-password?token=${token}`, {
              password
            }, {
              headers: {
                'Content-Type': 'application/json'
              }
            });
            setMessage('Senha redefinida com sucesso! Redirecionando para o login...');
            setTimeout(() => router.push('/auth/login'), 3000); // Redireciona após 3 segundos
          } catch (err) {
            // Exibe a mensagem de erro específica, se possível
            setError('Erro ao redefinir a senha.');
          }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center min-vh-100">
            <div className="col-md-6">
                <h2 className="text-center mb-4">Redefinir Senha</h2>
                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-12">
                        <label htmlFor="password" className="form-label">Nova Senha</label>
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
                        <label htmlFor="confirmPassword" className="form-label">Confirme a Nova Senha</label>
                        <input
                            type="password"
                            className="form-control"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                            <button type="submit" className="btn btn-primary">Redefinir Senha</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
