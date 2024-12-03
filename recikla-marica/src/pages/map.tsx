import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import Navbar from '@components/Navbar';

// Adiciona a propriedade initMap ao tipo global do Window
declare global {
  interface Window {
    initMap: () => void;
  }
}

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

    return { props: {} };
  } catch (error) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }
};

const UserLocationMap = () => {
  const router = useRouter();

  useEffect(() => {
    let map: google.maps.Map | undefined;
    let marker: google.maps.Marker | undefined;

    const loadMap = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initMap`;
      script.defer = true;
      document.head.appendChild(script);

      script.onerror = () => {
        console.error('Erro ao carregar o Google Maps API');
        alert('Não foi possível carregar o mapa. Verifique sua conexão.');
      };
    };

    window.initMap = () => {
      const defaultLocation = { lat: -22.921216, lng: -42.8244992 };

      const mapElement = document.getElementById('map') as HTMLElement;
      if (!mapElement) {
        console.error("Elemento 'map' não encontrado");
        return;
      }

      map = new google.maps.Map(mapElement, {
        zoom: 15,
        center: defaultLocation,
      });

      marker = new google.maps.Marker({
        position: defaultLocation,
        map: map,
        title: 'Localização atual',
      });

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            marker?.setPosition(userLocation);
            map?.setCenter(userLocation);
            trackLocation();
          },
          (error) => {
            console.error('Erro ao obter a localização:', error.message);
            alert('Habilite o GPS e permita o acesso à localização.');
          }
        );
      }
    };

    const trackLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (position) => {
            const updatedLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            marker?.setPosition(updatedLocation);
            map?.setCenter(updatedLocation);
          },
          (error) => console.error('Erro ao rastrear localização:', error.message),
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      }
    };

    loadMap();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h1 className="text-center mb-4">Localizar Rotas de Reciclagem</h1>
        <div id="map" style={{ height: '80vh', width: '100%' }} />
        <div className="text-center mt-4">
          <button className="btn btn-secondary" onClick={() => router.push('/user/dashboard')}>
            Voltar ao Dashboard
          </button>
        </div>
      </div>
      <br></br>
    </div>
  );
};

export default UserLocationMap;
