import { GetServerSideProps } from 'next';
import { parseCookies, destroyCookie } from 'nookies';
import { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../../api/services/api';
import Navbar from '@components/Navbar';
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
        initialUsername: data.username || '',
        initialEmail: data.email || '',
        initialProfileImage: data.profileImage || null,
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

const EditProfilePage = () => {
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewImage(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    if (password) {
      formData.append('password', password);
    }
    if (file) {
      formData.append('profileImage', file); // Nome do campo deve ser 'profileImage'
    }
  
    try {
      const response = await updateProfile(formData);
      if (response.status === 200) {
        setSuccessMessage('Perfil atualizado com sucesso!');
        setErrorMessage(null);
      } else {
        setErrorMessage('Erro ao atualizar perfil.');
      }
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
      setErrorMessage('Erro ao salvar alterações.');
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
            <h1 className="text-center mb-4">Editar Perfil</h1>

            {successMessage && (
              <div className="alert alert-success text-center">{successMessage}</div>
            )}
            {errorMessage && (
              <div className="alert alert-danger text-center">{errorMessage}</div>
            )}

            <form onSubmit={handleSave} className="p-4 border rounded shadow-sm bg-light">
              {/* <div className="d-flex justify-content-center mb-4">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Nova Foto de perfil"
                    className="img-fluid rounded-circle"
                    style={{ width: '150px', height: '150px' }}
                  />
                ) : currentImage ? (
                  <img
                    src={`http://localhost:3001${currentImage}`}
                    alt="Foto de perfil"
                    className="img-fluid rounded-circle"
                    style={{ width: '150px', height: '150px' }}
                  />
                ) : (
                  <img
                    src="http://localhost:3001/uploads/padrao.png"
                    alt="Foto padrão"
                    className="img-fluid rounded-circle"
                    style={{ width: '150px', height: '150px' }}
                  />
                )}
              </div> */}

              <div className="mb-3">
                <label htmlFor="formBasicName" className="form-label">
                  Nome Completo
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="formBasicName"
                  placeholder="Digite seu nome"
                  value={username}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="formBasicEmail" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="formBasicEmail"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="formBasicPassword" className="form-label">
                  Senha
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="formBasicPassword"
                  placeholder="Digite sua nova senha (deixe em branco para manter a atual)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* <div className="mb-3">
                <label htmlFor="formFile" className="form-label">
                  Selecionar Nova Imagem
                </label>
                <input
                  className="form-control"
                  type="file"
                  id="formFile"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div> */}

              <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                  Salvar Alterações
                </button>
              </div>
              <div className="d-grid mt-3">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => window.location.href = '/user/dashboard'}
                >
                  Voltar ao Dashboard
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
