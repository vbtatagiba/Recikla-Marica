import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Link from 'next/link';
import { useRouter } from 'next/router';
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

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [role, setRole] = useState<string>('usuario');
  
  ////////////////////////////////
  // INFORMAÇÕES DE LOCALIZAÇÃO //
  ////////////////////////////////
  const [cep, setCep] = useState('');
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');

  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchCepData = async (value: string) => {
    try {
      const response = await axios.get(
        `https://viacep.com.br/ws/${value}/json/`
      );
      const { logradouro, localidade, uf } = response.data;

      setRua(logradouro);
      setCidade(localidade);
      setEstado(uf);
    } catch (error) {
      console.error('Erro ao buscar o CEP:', error);
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = String(e.target.value.replace(/\D/g, '')).trim(); // Remove caracteres não numéricos

    // Limita a entrada a 8 caracteres
    if (value.length <= 8) {
      let formattedCep = '';

      if (value.length <= 5) {
        formattedCep = value;
      } else if (value.length <= 8) {
        formattedCep = `${value.slice(0, 5)}-${value.slice(5)}`;
      }

      setCep(formattedCep);

      // Verifica se o CEP possui o tamanho correto
      if (value.length === 8) {
        fetchCepData(value);
      }
    }
  };

  const handleEstadoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const str = e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase();

    if (str.length <= 2) {
      setEstado(str);
    }
  };

  const handleNumeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const number = String(e.target.value.replace(/\D/g, '')).trim();

    if (number.length <= 10) {
      setNumero(number);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Senhas não coincidem. Tente novamente.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          role,
          cep,
          estado,
          cidade,
          rua,
          numero,
          complemento,
          bairro
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Detalhes do erro:', errorData);
        throw new Error(
          errorData.message || 'Erro ao cadastrar. Tente novamente.'
        );
      }

      console.log('Cadastro bem-sucedido');
      router.replace('/auth/login');
    } catch (error: any) {
      console.error('Erro ao se cadastrar:', error);
      setError(error.message || 'Erro ao cadastrar. Tente novamente.');
    }
  };

  return (
    <div className='container d-flex align-items-center justify-content-center min-vh-100'>
      <div className='col-md-6'>
        <Logo />

        <h2 className='text-center mb-4'>Cadastre-se</h2>
        <form
          onSubmit={handleSubmit}
          className='row g-3'
        >
          <div className='col-12'>
            <label
              htmlFor='username'
              className='form-label'
            >
              Nome de Usuário
            </label>
            <input
              type='text'
              className='form-control'
              id='username'
              name='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className='col-12'>
            <label
              htmlFor='email'
              className='form-label'
            >
              Email
            </label>
            <input
              type='email'
              className='form-control'
              id='email'
              name='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className='col-12'>
            <label
              htmlFor='password'
              className='form-label'
            >
              Senha
            </label>
            <input
              type='password'
              className='form-control'
              id='password'
              name='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className='col-12'>
            <label
              htmlFor='confirm-password'
              className='form-label'
            >
              Confirme a senha
            </label>
            <input
              type='password'
              className='form-control'
              id='confirm-password'
              name='confirm-password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className='col-12'>
            <label
              htmlFor='role'
              className='form-label'
            >
              Tipo de conta
            </label>
            <select
              className='form-select'
              id='role'
              name='role'
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value='usuario'>Usuário</option>
              <option value='coletor'>Coletor</option>
            </select>
          </div>
          {error && (
            <div className='col-12'>
              <div
                className='alert alert-danger alert-dismissible fade show'
                role='alert'
              >
                {error}
                <button
                  type='button'
                  className='btn-close'
                  data-bs-dismiss='alert'
                  aria-label='Close'
                ></button>
              </div>
            </div>
          )}

          {/* INFORMAÇÕES DE LOCALIZAÇÃO */}
          <Form.Group
            controlId='editCep'
            className='mb-3'
          >
            <Form.Label>Cep</Form.Label>
            <Form.Control
              type='text'
              value={cep}
              onChange={handleCepChange}
              required
            />
          </Form.Group>
          <Form.Group
            controlId='editEstado'
            className='mb-3'
          >
            <Form.Label>Estado</Form.Label>
            <Form.Control
              type='text'
              value={estado}
              onChange={handleEstadoChange}
              required
            />
          </Form.Group>
          <Form.Group
            controlId='editCidade'
            className='mb-3'
          >
            <Form.Label>Cidade</Form.Label>
            <Form.Control
              type='text'
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group
            controlId='editRua'
            className='mb-3'
          >
            <Form.Label>Rua</Form.Label>
            <Form.Control
              type='text'
              value={rua}
              onChange={(e) => setRua(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="editBairro" className="mb-3">
            <Form.Label>Bairro</Form.Label>
            <Form.Control
              type="text"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group
            controlId='editNumero'
            className='mb-3'
          >
            <Form.Label>Número</Form.Label>
            <Form.Control
              type='text'
              value={numero}
              onChange={handleNumeroChange}
              required
            />
          </Form.Group>
          <Form.Group
            controlId='editComplemento'
            className='mb-3'
          >
            <Form.Label>Complemento</Form.Label>
            <Form.Control
              type='text'
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
              required
            />
          </Form.Group>

          <div
            className='col-12'
            style={{ marginBottom: '2em' }}
          >
            <div className='d-grid gap-2'>
              <button
                type='submit'
                className='btn btn-success'
              >
                Registrar
              </button>
              <Link
                href='/'
                className='btn btn-primary'
              >
                Voltar
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
