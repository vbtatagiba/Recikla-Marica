const axios = require('axios');
const requestIp = require('request-ip');
const geoip = require('geoip-lite');

exports.convertAddressToGeolocation = async (req, res) => {
  const { estado, cidade, rua, cep, bairro, numero } = req.body;

  let missingObrigatoryParams = [];
  if (!estado) missingObrigatoryParams.push('Estado');
  if (!cidade) missingObrigatoryParams.push('Cidade');
  if (!rua) missingObrigatoryParams.push('Rua');

  if (missingObrigatoryParams.length > 0) {
    return res.status(500).json({
      error: `São campos obrigatórios: ` + missingObrigatoryParams.join(', '),
    });
  }

  let formattedAddress =
    `${rua}, ${numero || ''} ${bairro || ''}, ${cidade} - ${estado}, ${cep || ''}`.trim();

  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/geocode/json',
      {
        params: {
          address: formattedAddress,
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        },
      }
    );
    const { lat, lng } = response.data.results[0].geometry.location;
    res.status(200).json({ lat, lng });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

//{
//	"address": "Estr. do Retiro, 15 - São José de Imbassai, Maricá - RJ, 24911-850, Brazil"
//}

//{
//	"address": "Estação Sé - Se, São Paulo - SP, 01018-000, Brazil"
//}

exports.convertGeolocationToAddress = async (req, res) => {
  const { lat, lng } = req.body;

  if (!lat || !lng) {
    return res
      .status(400)
      .json({ error: 'Latitude e longitude são obrigatórias.' });
  }

  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/geocode/json',
      {
        params: {
          latlng: `${lat},${lng}`,
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        },
      }
    );

    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const address_components = response.data.results[0].address_components;

      const typesIdentifiers = Object.entries({
        estado: ['administrative_area_level_1'], // estado
        cidade: ['administrative_area_level_2'], // cidade
        rua: ['route'], // rua
        cep: ['postal_code'], // CEP
        bairro: ['sublocality', 'sublocality_level_1'], // bairro
        numero: ['street_number'], // número
      });

      const address = {};

      for (let i = 0; i < address_components.length; i++) {
        const e = address_components[i];
        for (let j = 0; j < e.types.length; j++) {
          for (let k = 0; k < typesIdentifiers.length; k++) {
            const identifier = typesIdentifiers[k][0];
            const types = typesIdentifiers[k][1];
            if (types.includes(e.types[j])) {
              address[identifier] = e.long_name;
              break;
            }
          }
        }
      }
      res.status(200).json({ address });
    } else {
      res.status(404).json({
        error: 'Endereço não encontrado para as coordenadas fornecidas.',
      });
    }
  } catch (error) {
    res.status(500).json({
      error: 'ERRO AO TRANSFORMAR A GEOLOCALIZAÇÃO EM ENDEREÇO: ' + error,
    });
  }
};

////////////////////////////////////////
// TÁ BEM RUINZINHO, MUITA IMPRECISÃO //
////////////////////////////////////////
exports.getCurrentGeolocation = async (req, res) => {
  let clientIp = requestIp.getClientIp(req);
  let localhost = false;

  if (clientIp.includes('127.0.0.1') || clientIp.startsWith('::1')) {
    localhost = true;
  }

  if (localhost) {
    try {
      // Faz uma requisição a um serviço externo para obter o IP público
      const response = await axios.get('https://api.ipify.org?format=json');
      clientIp = response.data.ip;
      // console.log('IP Público:', clientIp);
    } catch (error) {
      // console.error('Erro ao obter o IP público:', error);
      res.status(500).send("ERRO NO REQUEST AO 'api.ipify.org': ", error);
      return;
    }
  }

  // Agora você pode usar o clientIp com o geoip-lite
  const geo = geoip.lookup(clientIp);

  if (geo) {
    // console.log('Dados de Geolocalização:', geo);
    const lat = geo.ll[0];
    const lng = geo.ll[1];
    console.log({ lat, lng });
    res.json({ lat, lng });
  } else {
    // console.log(
    //  'Nenhum dado de geolocalização encontrado para o IP:',
    //  clientIp
    //);
    res
      .status(404)
      .send(
        'ERRO: Com o IP fornecido foi impossível identificar a localização'
      );
  }
};
