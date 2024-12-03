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
  const { locations } = router.query;

  useEffect(() => {
    let map: google.maps.Map | null = null; // Inicialize como null
  
    const loadMap = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initMap&libraries=places`;
      script.defer = true;
      document.head.appendChild(script);
  
      script.onerror = () => {
        console.error('Erro ao carregar o Google Maps API');
        alert('Não foi possível carregar o mapa. Verifique sua conexão.');
      };
    };
  
    window.initMap = async () => {
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
  
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
  
            if (map) {
              map.setCenter(userLocation); // Verifique se map não é null
            }
  
            // Preparar os pontos de rota
            const locationsArray = locations
              ?.toString()
              .split(';')
              .map((location) => {
                const [lat, lng] = location.split(',').map((coord) => parseFloat(coord.trim()));
                if (!isNaN(lat) && !isNaN(lng)) {
                  return { lat, lng };
                } else {
                  console.warn('Coordenadas inválidas:', { lat, lng });
                  return null;
                }
              })
              .filter((location) => location !== null);
              
              
            if (locationsArray && locationsArray.length > 0) {
              try {
                const requestBody = {
                  origin: { location: { latLng: userLocation } },
                  destination: { location: { latLng: userLocation } },
                  intermediates: locationsArray.map((loc) => ({ location: { latLng: loc } })),
                  travelMode: 'DRIVE',
                };
  
                const response = await fetch(
                  `https://routes.googleapis.com/directions/v2:computeRoutes?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                  }
                );
  
                if (!response.ok) {
                  throw new Error(`Erro na API Routes: ${response.statusText}`);
                }
                
  
                const data = await response.json();
                const routePolyline = data.routes[0].polyline.encodedPolyline;
  
                // Decodificar polilinha e adicionar ao mapa
                if (map) {
                  const decodedPath = google.maps.geometry.encoding.decodePath(routePolyline);
                  const routePath = new google.maps.Polyline({
                    path: decodedPath,
                    geodesic: true,
                    strokeColor: '#4285F4',
                    strokeOpacity: 1.0,
                    strokeWeight: 4,
                  });
                  routePath.setMap(map);
                }
              } catch (error) {
                console.error('Erro ao calcular a rota:', error);
                alert('Não foi possível calcular a rota. Verifique as localizações selecionadas.');
              }
            }
          },
          (error) => {
            console.error('Erro ao obter a localização:', error.message);
            alert('Habilite o GPS e permita o acesso à localização.');
          }
        );
      }
    };
  
    loadMap();
  }, [locations]);
  

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
    </div>
  );
};

export default UserLocationMap;
