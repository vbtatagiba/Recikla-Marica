import { parseCookies } from 'nookies';
import axios from 'axios';

// Define a URL base para as APIs
const api = axios.create({
    baseURL: 'http://localhost:3001', // URL base do backend
    headers: {
        'Content-Type': 'application/json',
    },
});

// Função para fazer login
export const login = async (email: string, password: string) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        return response.data; // Sucesso: retorna os dados da API
    } catch (error: any) {
        console.error('Erro ao fazer login:', error);

        // Verifica se o erro é do axios e retorna uma mensagem apropriada
        if (axios.isAxiosError(error)) {
            if (error.response) {
                // Erro HTTP com mensagem da API
                throw new Error(error.response.data.message || 'Erro desconhecido no servidor.');
            } else if (error.request) {
                // Erro na requisição (ex.: problema de rede)
                throw new Error('Erro ao se conectar ao servidor. Verifique sua conexão.');
            }
        }

        // Outros erros (não relacionados ao axios)
        throw new Error('Ocorreu um erro inesperado.');
    }
};

// Função para fazer cadastro
export const register = async (name: string, email: string, password: string) => {
    return await api.post('/auth/register', { email, password });
};

// Função para enviar e-mail de recuperação de senha
export const sendForgotPasswordEmail = async (email: string) => {
    return await api.post('/api/auth/forgot-password', { email });
};

// Função para redefinir a senha
export const resetPassword = async (token: string, password: string) => {
    return await api.post('/api/auth/reset-password', { token, password });
};

// Função para obter perfil
export const getProfile = async () => {
    try {
        const cookies = parseCookies();
        const token = cookies.token;

        if (!token) {
        throw new Error('Token ausente. O usuário precisa estar autenticado.');
        }

        const response = await api.get('/auth/profile', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });

        return response.data;
    } catch (error) {
        console.error('Erro ao obter o perfil:', error);
        throw new Error('Erro ao obter o perfil do usuário.');
    }
};

// Função para atualizar perfil
export const updateProfile = async (data: FormData) => {
    const cookies = parseCookies();
    const token = cookies.token;

    if (!token) {
        throw new Error('Token ausente. O usuário precisa estar autenticado.');
    }

    return await api.put('/auth/profile', data, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });
};

// Função para solicitar coleta
export const requestCollection = async (data: {
        material: string;
        quantity: string;
        date: string;
        estado: string;
        cidade: string;
        rua: string;
        cep: string;
        bairro: string;
        numero: string;
        complemento: string;
        status: string;
        userId: number;
    }) => {
        try {
            // Obtém o token do cookie
            const token = document.cookie
            .split('; ')
            .find((row) => row.startsWith('token='))
            ?.split('=')[1];

            if (!token) {
            throw new Error('Token ausente. O usuário precisa estar autenticado.');
            }

            const response = await api.post('/api/coletas', data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });
            return response.data; // Retorna os dados da API em caso de sucesso
        } catch (error: any) {
            console.error('Erro ao solicitar coleta:', error);

            if (axios.isAxiosError(error)) {
            if (error.response) {
                throw new Error(error.response.data.message || 'Erro desconhecido no servidor.');
            } else if (error.request) {
                throw new Error('Erro ao se conectar ao servidor. Verifique sua conexão.');
            }
            }

            throw new Error('Erro inesperado.');
        }
};

// Função para obter a lista de coletas
export const getCollections = async () => {
    try {
        const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];

        if (!token) {
            throw new Error('Token ausente. O usuário precisa estar autenticado.');
        }

        const response = await api.get('/api/coletas', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data; // Retorna os dados da API
    } catch (error: any) {
        console.error('Erro ao buscar coletas:', error);
        throw new Error(
        error.response?.data?.message || 'Erro ao carregar coletas.'
        );
    }
};
