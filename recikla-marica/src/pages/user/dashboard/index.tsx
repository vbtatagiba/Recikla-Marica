import { GetServerSideProps } from 'next';
import { parseCookies, destroyCookie } from 'nookies';
import { useRouter } from 'next/router';
import Logo from '@components/Logo';
import Navbar from '@components/Navbar';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';

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
        username: data.username || 'Usuário',
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

const DashboardPage = ({ username }: { username: string }) => {
  const router = useRouter();

  const handleLogout = () => {
    destroyCookie(null, 'token', { path: '/' });
    router.reload();
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <Logo />
        <h1 className="text-center">Boas vindas, {username}!</h1>
        <div className="row mt-4">
          <div className="col-md-6 mb-3">
            <Link href="/user/collection/request" passHref>
              <span className="btn btn-primary w-100">Solicitar Coleta</span>
            </Link>
          </div>
          <div className="col-md-6 mb-3">
            <Link href="/user/collection/list" passHref>
              <span className="btn btn-success w-100">Lista de Coletas</span>
            </Link>
          </div>
          <div className="col-md-6 mb-3">
            <Link href="/user/profile/edit" passHref>
              <span className="btn btn-warning w-100">Editar Perfil</span>
            </Link>
          </div>
          <div className="col-md-6 mb-3">
            <Link href="/map" passHref>
              <span className="btn btn-info w-100">Localizar Rotas de Reciclagem</span>
            </Link>
          </div>
          <div className="col-md-12">
            <button className="btn btn-danger w-100 mt-3" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
