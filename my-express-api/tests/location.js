const axios = require('axios');

async function getGeolocationByAddress(
  estado,
  cidade,
  rua,
  cep = '',
  bairro = '',
  numero = ''
) {
  let missingParams = [];
  if (!estado) missingParams.push('Estado');
  if (!cidade) missingParams.push('Cidade');
  if (!rua) missingParams.push('Rua');

  if (missingParams.length > 0) {
    throw new Error(
      `Os campos: ` + missingParams.join(', ') + ` são obrigatórios`
    );
  }

  let address =
    `${rua}, ${numero || ''} ${bairro || ''}, ${cidade} - ${estado}, ${cep || ''}`.trim();

  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/geocode/json',
      {
        params: {
          address: address,
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        },
      }
    );

    const { lat, lng } = response.data.results[0].geometry.location;
    console.log(lat, lng);
  } catch (error) {
    throw error;
  }
}

getGeolocationByAddress(
  'SP',
  'São Paulo',
  'Av. Paulista',
  '01310-200',
  'Bela Vista',
  '1578'
);
