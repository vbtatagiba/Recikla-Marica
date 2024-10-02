import React, { useEffect } from 'react';

function UserLocationMap() {
  useEffect(() => {
    // Carregar o mapa ao inicializar o componente
    const loadMap = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initMap`;
      script.defer = true;
      document.head.appendChild(script);
    };
    
    // Função para inicializar o mapa
    window.initMap = function () {
      let map, marker;

      // Localização padrão até obter a localização real
      const defaultLocation = { lat: -22.921216, lng: -42.8244992 };

      map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: defaultLocation,
      });

      marker = new google.maps.Marker({
        position: defaultLocation,
        map: map,
        title: "Localização atual",
      });

      // Obter localização do usuário
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            console.log("Coordenadas obtidas:", userLocation); // Log das coordenadas
            marker.setPosition(userLocation);
            map.setCenter(userLocation);
            trackLocation(marker, map);
          },
          (error) => {
            console.error("Erro ao obter a localização:", error.message);
            alert("Habilite o GPS e permita o acesso à localização.");
          }
        );
      }
    };

    // Função para rastrear localização em tempo real
    const trackLocation = (marker, map) => {
      navigator.geolocation.watchPosition(
        (position) => {
          const updatedLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log("Localização atualizada:", updatedLocation); // Log das coordenadas atualizadas
          marker.setPosition(updatedLocation);
          map.setCenter(updatedLocation);
        },
        (error) => console.error("Erro ao rastrear localização:", error.message),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    };

    loadMap();
  }, []);
  
  return <div id="map" style={{ height: '100vh', width: '100%' }} />;
}

export default UserLocationMap;
