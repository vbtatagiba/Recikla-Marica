// pages/collection/list.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa o Bootstrap

const CollectionListPage = () => {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    // Faz a requisição para buscar as coletas
    const fetchCollections = async () => {
      try {
        const response = await axios.get('/api/collections');
        setCollections(response.data);
      } catch (error) {
        alert('Erro ao carregar lista de coletas: ' + error);
      }
    };

    fetchCollections();
  }, []);

  return (
    <div className="container mt-5">
      <h1>Lista de Coletas</h1>
      <ul className="list-group">
        {collections.map((collection, index) => (
          <li key={index} className="list-group-item">
            <strong>Material:</strong> {collection.material} <br />
            <strong>Quantidade:</strong> {collection.quantity} <br />
            <strong>Data:</strong> {collection.date} <br />
            <strong>Endereço:</strong> {collection.address}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CollectionListPage;
