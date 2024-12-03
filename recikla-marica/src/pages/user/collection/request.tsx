import React, { useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br'; // Português para Day.js
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { parseCookies, destroyCookie } from 'nookies';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { requestCollection } from '../../api/services/api';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import Navbar from '@components/Navbar';
import { set } from 'date-fns';

export const  getServerSideProps: GetServerSideProps = async (ctx) => {
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

    return {
      props: {}, // Nenhuma propriedade extra é necessária aqui
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

const containerStyle = {
  width: '100%',
  height: '400px',
};

const RequestCollectionPage = () => {
  const [material, setMaterial] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [date, setDate] = useState(dayjs());

  // Informações de Localização
  const [location, setLocation] = useState({ lat: -22.915963785458224, lng: -42.81915540308423 });
  const [cep, setCep] = useState('');
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [bairro, setBairro] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
 // Para armazenar as coordenadas em formato de string
 const [coordinates, setCoordinates] = useState('');


  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();
  const materials = [
    'Vidro',
    'Plástico',
    'Papelão',
    'Ferro',
    'Alumínio',
    'Óleo de Cozinha',
    'Óleo de Motor',
  ];

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '', // Substituir pela chave da API
  });

  const handleMapClick = async (event: google.maps.MapMouseEvent) => {
    const latLng = event.latLng;
    if (latLng) {
      const lat = latLng.lat();
      const lng = latLng.lng();
      setLocation({ lat, lng });
      setCoordinates(`Latitude: ${lat}, Longitude: ${lng}`); // Atualiza o campo com as coordenadas
    }
  };
  
  // Busca dados do CEP
  const fetchCepData = async (value: string) => {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${value}/json/`);
      const { logradouro, bairro, localidade, uf } = response.data;

      setRua(logradouro || '');
      setBairro(bairro || '');
      setCidade(localidade || '');
      setEstado(uf || '');
    } catch (error) {
      console.error('Erro ao buscar o CEP:', error);
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = String(e.target.value.replace(/\D/g, '')).trim();

    // Limita a entrada a 8 caracteres
    if (value.length <= 8) {
      let formattedCep = '';

      if (value.length <= 5) {
        formattedCep = value;
      } else {
        formattedCep = `${value.slice(0, 5)}-${value.slice(5)}`;
      }

      setCep(formattedCep);

      // Verifica se o CEP possui o tamanho correto
      if (value.length === 8) {
        fetchCepData(value);
      }
    }
  };

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      // Obtém o token do cookie
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];
  
      if (!token) {
        throw new Error('Token ausente. O usuário precisa estar autenticado.');
      }
  
      // Decodifica o token para obter o userId
      const decodedToken = jwtDecode<{ user_id: number }>(token);
      const userId = decodedToken?.user_id;
  
      if (!userId) {
        throw new Error('ID do usuário não encontrado no token.');
      }
  
      // Cria o objeto requestData incluindo o userId
      const requestData = {
        material,
        quantity: `${quantity} ${unit}`,
        date: date.toISOString(),
        estado,
        cidade,
        rua,
        cep,
        bairro,
        numero,
        complemento,
        location,
        status: 'aguardando',
        userId
      };
  
      // Chama a função da API
      const response = await requestCollection(requestData);
  
      setSuccessMessage('Coleta solicitada com sucesso!');
      setMaterial('');
      setQuantity('');
      setUnit('');
      setDate(dayjs());
      setCep('');
      setEstado('');
      setCidade('');
      setBairro('');
      setRua('');
      setNumero('');
      setComplemento('');
      setLocation({ lat: -22.7942, lng: -42.8822 });
    } catch (error) {
      console.error('Erro na solicitação:', error);
      alert('Erro ao solicitar coleta. Tente novamente.');
    }
  };

  return (
    <div>
      {/* Menu superior */}
      <Navbar />

      {/* Conteúdo principal */}
      <div className="container mt-5">
        <div className="row justify-content-md-center">
          <div className="col-md-8 col-lg-6">
            <h1 className="text-center mb-4">Solicitar Coleta</h1>
            {successMessage && (
              <div className="alert alert-success mt-4 text-center">
                {successMessage}
              </div>
            )}
            <form onSubmit={handleRequest} className="p-4 border rounded shadow-sm bg-light">
              <div className="mb-3">
                <label htmlFor="material-select" className="form-label">
                  Material
                </label>
                <select
                  id="material-select"
                  className="form-select"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Escolha um material
                  </option>
                  {materials.map((mat) => (
                    <option key={mat} value={mat}>
                      {mat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="quantity-input" className="form-label">
                  Quantidade
                </label>
                <input
                  type="text"
                  id="quantity-input"
                  className="form-control"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Digite a quantidade"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="unit-select" className="form-label">
                  Unidade
                </label>
                <select
                  id="unit-select"
                  className="form-select"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Selecione a unidade
                  </option>
                  <option value="L">Litros (L)</option>
                  <option value="kg">Quilogramas (kg)</option>
                  <option value="unid">Unidades (unid)</option>
                </select>
              </div>

              <div className="mb-3">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileDateTimePicker
                    label="Data e Hora"
                    value={date}
                    onChange={(newValue) => setDate(newValue || dayjs())}
                    format="DD/MM/YYYY hh:mm A"
                  />
                </LocalizationProvider>
              </div>

              {/* Endereço */}
              <div className="mb-3">
                <Form.Group controlId="cep">
                  <Form.Label>CEP</Form.Label>
                  <Form.Control
                    type="text"
                    value={cep}
                    onChange={handleCepChange}
                    placeholder="Ex: 12345-678"
                  />
                </Form.Group>
              </div>
              <div className="mb-3">
                <Form.Group controlId="rua">
                  <Form.Label>Rua</Form.Label>
                  <Form.Control
                    type="text"
                    value={rua}
                    onChange={(e) => setRua(e.target.value)}
                  />
                </Form.Group>
              </div>
              <div className="mb-3">
                <Form.Group controlId="bairro">
                  <Form.Label>Bairro</Form.Label>
                  <Form.Control
                    type="text"
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                  />
                </Form.Group>
              </div>
              <div className="mb-3">
                <Form.Group controlId="cidade">
                  <Form.Label>Cidade</Form.Label>
                  <Form.Control
                    type="text"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                  />
                </Form.Group>
              </div>
              <div className="mb-3">
                <Form.Group controlId="estado">
                  <Form.Label>Estado</Form.Label>
                  <Form.Control
                    type="text"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                  />
                </Form.Group>
              </div>
              <div className="mb-3">
                <Form.Group controlId="numero">
                  <Form.Label>Número</Form.Label>
                  <Form.Control
                    type="text"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                  />
                </Form.Group>
              </div>
              <div className="mb-3">
                <Form.Group controlId="complemento">
                  <Form.Label>Complemento</Form.Label>
                  <Form.Control
                    type="text"
                    value={complemento}
                    onChange={(e) => setComplemento(e.target.value)}
                  />
                </Form.Group>
              </div>

              {/* Mapa */}
              <div className="mb-3">
                {isLoaded && (
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={location}
                    zoom={13}
                    onClick={handleMapClick}
                  >
                    <Marker position={location} />
                  </GoogleMap>
                )}
              </div>

              {/* Exibindo as coordenadas */}
              <div className="mb-3">
                <Form.Label>Coordenadas</Form.Label>
                <Form.Control
                  type="text"
                  value={coordinates}
                  readOnly  
                />
              </div>

              <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                  Solicitar Coleta
                </button>
              </div>
              <div className="d-grid mt-3">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => router.push('/user/dashboard')} // Redireciona ao Dashboard
                >
                  Voltar ao Dashboard
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <br></br>
    </div>
  );
};

export default RequestCollectionPage;
