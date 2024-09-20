import { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../api/services/api'; // Importa as funções para obter e atualizar perfil
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa o Bootstrap

const EditProfilePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile(); // Usa a função para obter perfil
        setName(response.data.name);
        setEmail(response.data.email);
        setAddress(response.data.address);
        setCurrentImage(response.data.profileImage); // Assume que o backend retorna a URL da imagem de perfil
      } catch (error) {
        alert('Erro ao carregar perfil: ' + (error as Error).message);
      }
    };

    fetchProfile();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('address', address);
    if (password) {
      formData.append('password', password);
    }
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    try {
      const response = await updateProfile(formData); // Usa a função para atualizar perfil
      if (response.status === 200) {
        alert('Perfil atualizado com sucesso!');
      } else {
        alert('Falha ao atualizar perfil.');
      }
    } catch (error) {
      alert('Erro ao salvar alterações: ' + (error as Error).message);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-md-center">
        <div className="col-md-6">
          <h1 className="text-center">Editar Perfil</h1>
          <form onSubmit={handleSave} encType="multipart/form-data">
            <div className="form-group text-center">
              <label htmlFor="formProfileImage">Foto de Perfil</label>
              <div>
                {currentImage && <img src={currentImage} alt="Profile" className="img-thumbnail mb-2" style={{ width: '150px', height: '150px' }} />}
                <input
                  type="file"
                  className="form-control-file"
                  id="formProfileImage"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="formBasicName">Nome Completo</label>
              <input
                type="text"
                className="form-control"
                id="formBasicName"
                placeholder="Digite seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="formBasicEmail">Email</label>
              <input
                type="email"
                className="form-control"
                id="formBasicEmail"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="formBasicAddress">Endereço</label>
              <input
                type="text"
                className="form-control"
                id="formBasicAddress"
                placeholder="Digite seu endereço"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="formBasicPassword">Senha</label>
              <input
                type="password"
                className="form-control"
                id="formBasicPassword"
                placeholder="Digite sua nova senha (deixe em branco para manter a atual)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-3">
              Salvar Alterações
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
