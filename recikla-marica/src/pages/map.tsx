import 'bootstrap/dist/css/bootstrap.min.css'; // Importa o Bootstrap

const MapPage = () => {
  return (
    <div className="container mt-5">
      <h1>Localizar Rotas de Reciclagem</h1>
      <div className="map-container">
        {/* Aqui você pode integrar um componente de mapa, como o Leaflet ou Google Maps */}
      </div>
    </div>
  );
};

export default MapPage;