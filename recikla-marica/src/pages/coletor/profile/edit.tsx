import { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../../api/services/api';


const EditProfilePage = () => {
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setName(response.data.username);
        setEmail(response.data.email);
        setCurrentImage(response.data.profileImage ? response.data.profileImage.url : null); // Verifica se há uma URL na imagem
      } catch (error) {
        alert('Erro ao carregar perfil: ' + (error as Error).message);
      }
    };

    fetchProfile();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
    console.log(setFile)

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
      console.log(formData)
      formData.append('username', username);
      formData.append('email', email);
      if (password) {
        formData.append('password', password);
      }
      if (file) {
        formData.append('profileImage', file.name); // Adiciona o arquivo da nova imagem ao FormData
      }

    try {
      const response = await updateProfile(formData);
      if (response.status === 200) {
        alert('Perfil atualizado com sucesso!');
      } else {
        alert('Erro ao atualizar perfil.');
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
          <div className="text-center mb-3 d-flex justify-content-center">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Nova Foto de perfil"
                className="img-fluid rounded-circle"
                style={{ width: '300px', height: '300px' }}
              />
            ) : currentImage ? (
              <img
                src={currentImage}
                alt="Foto de perfil"
                className="img-fluid rounded-circle"
                style={{ width: '300px', height: '300px' }}
              />
            ) : (
              <img
                src="http://localhost:3001/uploads/padrao.png"
                alt="Foto padrão"
                className="img-fluid rounded-circle"
                style={{ width: '300px', height: '300px' }}
              />
            )}
          </div>
          <form onSubmit={handleSave} encType="multipart/form-data">
            <div className="form-group">
              <label htmlFor="formBasicName">Nome Completo</label>
              <input
                type="text"
                className="form-control"
                id="formBasicName"
                placeholder="Digite seu nome"
                value={username}
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

            <div className="form-group">
              <label htmlFor="formFile" className="form-label">Selecionar Nova Imagem</label>
              <input 
                className="form-control" 
                type="file" 
                id="formFile" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-3">
              Salvar Alterações
            </button>
          </form>
          <a href="/coletor/dashboard" className="btn btn-secondary mt-3">
            Voltar ao Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
