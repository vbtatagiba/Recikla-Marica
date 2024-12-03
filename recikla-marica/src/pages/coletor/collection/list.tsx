import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';


const CollectionListPage = () => {
  const [collections, setCollections] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Faz a requisição para buscar as coletas
    const fetchCollections = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        alert('Token não encontrado. Faça login novamente.');
        return;
      }

      try {
        const response = await axios.get('http://localhost:3001/api/coletas', {
          headers: {
            'Authorization': `Bearer ${token}` // Inclui o token no cabeçalho da requisição
          }
        });
        setCollections(response.data);
      } catch (error) {
        alert('Erro ao carregar lista de coletas: ' + error);
      }
    };

    fetchCollections();
  }, []);

  // Função para aceitar uma coleta
  const acceptCollection = async (id: number) => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.put(`http://localhost:3001/api/coletas/${id}/aceitar`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        // Atualiza o estado local para remover a coleta aceita
        setCollections((prevCollections) =>
          prevCollections.map((collection) =>
            collection.id === id
              ? { ...collection, status: 'em_andamento', collectorId: response.data.collectorId }
              : collection
          )
        );
        router.push('../coletor/dashboard');
      } else {
        alert('Erro ao aceitar a coleta.');
      }
    } catch (error) {
      alert('Erro ao aceitar coleta: ' + error);
    }
  };

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  // Função para formatar a quantidade com separador de milhar
  const formatQuantity = (quantity: number) => {
    return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 0 }).format(quantity);
  };

  return (
    <div className="container mt-5">
      <h1>Lista de Coletas</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Material</th>
            <th>Quantidade</th>
            <th>Data</th>
            <th>Endereço</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {collections.map((collection, index) => (
            <tr key={collection.id}>
              <td>{index + 1}</td>
              <td>{collection.material}</td>
              <td>{collection.quantity}</td>
              <td>{formatDate(collection.date)}</td>
              <td>{collection.address}</td>
              <td>
                {collection.status === 'aguardando' ? (
                  <button
                    className="btn btn-success"
                    onClick={() => acceptCollection(collection.id)}
                  >
                    Aceitar
                  </button>
                ) : (
                  <span className="badge bg-secondary">Em andamento</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <a style={{ marginBottom: '50px' }} href="/coletor/dashboard" className="btn btn-secondary mt-3">
        Voltar ao Dashboard
      </a>
    </div>
  );
};

export default CollectionListPage;
