import { GetServerSideProps } from 'next';
import { parseCookies, destroyCookie } from 'nookies';
import { useRouter } from 'next/router';
import Link from 'next/link';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = parseCookies(ctx);
  const token = cookies.token;

  console.log("Token recebido no getServerSideProps:", token);

  if (!token) {
    console.log('Token ausente no cookie.');
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
      console.error("Erro na validação do token:", await response.text());
      throw new Error('Token inválido ou expirado');
    }

    const data = await response.json();

    console.log("Dados do usuário recebidos:", data);

    return {
      props: {
        username: data.username || 'Usuário',
      },
    };
  } catch (error) {
    console.error('Erro ao buscar os dados do usuário:', error);

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

  return (
    <div className="container mt-5">
      <h1>Boas vindas, {username}</h1>
      <button
        className="btn btn-danger mb-3"
        onClick={() => {
          destroyCookie(null, 'token', { path: '/' });
          router.reload();
        }}
      >
        Sair
      </button>
      <div className="row">
        <div className="col">
          <Link href="/coletor/collection/request" passHref>
            <span className="btn btn-primary w-100 mb-3">Solicitar Coleta</span>
          </Link>
        </div>
        <div className="col">
          <Link href="/user/collection/list" passHref>
            <span className="btn btn-success w-100 mb-3">Lista de Coletas</span>
          </Link>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <Link href="/user/profile/edit" passHref>
            <span className="btn btn-warning w-100 mb-3">Editar Perfil</span>
          </Link>
        </div>
        <div className="col">
          <Link href="/map" passHref>
            <span className="btn btn-info w-100 mb-3">Localizar Rotas de Reciclagem</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
