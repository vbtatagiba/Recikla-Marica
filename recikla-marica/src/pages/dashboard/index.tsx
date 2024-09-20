
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa o Bootstrap

const DashboardPage = () => {
  return (
    <div className="container mt-5">
      <h1>Bem-vindo, Usuário</h1>
      <div className="row">
        <div className="col">
          <a href="/collection/request" className="btn btn-primary w-100 mb-3">
            Solicitar Coleta
          </a>
        </div>
        <div className="col">
          <a href="/collection/list" className="btn btn-success w-100 mb-3">
            Lista de Coletas
          </a>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <a href="/profile/edit" className="btn btn-warning w-100 mb-3">
            Editar Perfil
          </a>
        </div>
        <div className="col">
          <a href="/map" className="btn btn-info w-100 mb-3">
            Localizar Rotas de Reciclagem
          </a>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
