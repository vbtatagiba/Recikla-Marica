import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';
import Navbar from '@components/Navbar';
import { getCollections } from '../../api/services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

type Collection = {
  id: number;
  material: string;
  quantity: string;
  date: string;
  cep: string;
  estado: string;
  cidade: string;
  bairro: string;
  rua: string;
  numero: string;
  complemento: string;
  location: string;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = parseCookies(ctx);
  const token = cookies.token;

  if (!token) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }

  try {
    const response = await fetch('http://localhost:3001/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Token inválido ou expirado');
    }

    const data = await response.json();

    return {
      props: {
        authenticated: true,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }
};

const CollectionListPage = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await getCollections();
        setCollections(data);
      } catch (err: any) {
        console.error('Erro ao buscar coletas:', err.message);
        setError('Erro ao carregar coletas.');
      }
    };

    fetchCollections();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  return (
    <div>
      <Navbar />

      <div className="container mt-5">
        <h1 className="text-center mb-4">Lista de Coletas</h1>
        {error && <div className="alert alert-danger text-center">{error}</div>}

        <table className="table table-striped table-responsive">
          <thead>
            <tr>
              <th>#</th>
              <th>Material</th>
              <th>Quantidade</th>
              <th>Data</th>
              <th>Local</th>
              <th>Localização</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((collection, index) => (
              <tr key={collection.id}>
                <td>{index + 1}</td>
                <td>{collection.material}</td>
                <td>{collection.quantity}</td>
                <td>{formatDate(collection.date)}</td>
                <td>{`${collection.rua}, ${collection.numero}, ${collection.cidade}`}</td>
                <td>{`${collection.location }`}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-center mt-4">
          <button
            className="btn btn-secondary"
            onClick={() => router.push('/user/dashboard')}
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectionListPage;
