// pages/collection/request.tsx
import { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa o Bootstrap

const RequestCollectionPage = () => {
  const [material, setMaterial] = useState('');
  const [quantity, setQuantity] = useState('');
  const [date, setDate] = useState('');
  const [address, setAddress] = useState('');

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    const requestData = {
      material,
      quantity,
      date,
      address,
    };

    try {
      const response = await axios.post('/api/collection', requestData);
      if (response.status === 200) {
        alert('Coleta solicitada com sucesso!');
      } else {
        alert('Falha ao solicitar coleta.');
      }
    } catch (error) {
      alert('Erro na solicitação: ' + error);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-md-center">
        <div className="col-md-6">
          <h1 className="text-center">Solicitar Coleta</h1>
          <form onSubmit={handleRequest}>
            <div className="form-group">
              <label htmlFor="formMaterial">Material</label>
              <input
                type="text"
                className="form-control"
                id="formMaterial"
                placeholder="Ex: Garrafas de vidro"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="formQuantity">Quantidade</label>
              <input
                type="text"
                className="form-control"
                id="formQuantity"
                placeholder="Digite a quantidade"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="formDate">Data e Hora</label>
              <input
                type="datetime-local"
                className="form-control"
                id="formDate"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="formAddress">Endereço para Coleta</label>
              <input
                type="text"
                className="form-control"
                id="formAddress"
                placeholder="Digite o endereço"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-3">
              Solicitar Coleta
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestCollectionPage;
