  const Coletas = require('../models/Coletas');
  const User = require('../models/User');
  const { sendRequestAcceptedEmail } = require('../utils/email');

  exports.createColeta = async (req, res) => {
    const { userId, material, quantity, date, cep, estado, cidade, bairro, rua, numero, complemento,location } = req.body;
    try {
      const coleta = await Coletas.create({
        material,
        quantity,
        date,
        cep,
        estado,
        cidade,
        bairro,
        rua,
        numero,
        complemento,
        location,
        status: 'aguardando',
        userId,
      });
      res.status(201).json(coleta);
    } catch (err) {
      console.error('Erro ao criar coleta:', err.message);
      res.status(400).json({ error: `Erro ao criar coleta: ${err.message}` });
    }
  };

  exports.getColetas = async (req, res) => {
    try {
      const coletasFiltradas = await Coletas.findAll({
        where: { userId: req.user.user_id },
      });
      res.status(200).json(coletasFiltradas);
    } catch (error) {
      console.error('Erro ao buscar coletas:', error.message);
      res.status(500).json({ error: 'Erro ao buscar coletas associadas ao usuário.' });
    }
  };

  exports.getMaterials = async (req, res) => {
    try {
      const materials = await Coletas.findAll({
        attributes: ['material'],
        // order: [['material', 'ASC']]
      });
      if (materials.length === 0) {
        res.status(404).json({ message: 'NENHUM MATERIAL CADASTRADO' });
      }
      // const allMaterialList = [... new Set(materials.map(material => material.material))]
      let allMaterialList = [];
      for (const e of materials) {
        const material = e.material;
        if (!allMaterialList.includes(material)) {
          allMaterialList.push(material);
        }
      }
      allMaterialList.sort();
      res.status(200).json({ materials: allMaterialList });
    } catch (error) {
      const errorMessage = `ERRO EM: "coletaController.getMaterials"\n${error.message}`;
      console.log(errorMessage);
      res.status(500).json({ message: errorMessage });
    }
  };

  exports.getMaterialQuantities = async (req, res) => {
    const { material } = req.query;
    try {
      const quantities = await Coletas.findAll({
        attributes: ['quantity'],
        where: { material },
        order: [['quantity', 'ASC']],
      });
      if (quantities.length === 0) {
        res.status(404).json({
          message: 'NENHUMA QUANTIDADE ENCONTRADA PARA O ITEM DECLARADO',
        });
      }
      const allQuantitiesList = quantities.map((quantity) => quantity.quantity);

      // allQuantitiesList.sort((x, y) => parseFloat(x) - parseFloat(y))

      res.status(200).json({ allQuantitiesList });
    } catch (error) {
      const errorMessage = `ERROR EM "coletaController.getMaterialQuantities"\n${error.message}`;
      console.log(errorMessage);
      res.status(500).json({ errorMessage });
    }
  };

  exports.updateColeta = async (req, res) => {
    const { id } = req.params;
    const coleta = await Coletas.findByPk(id);
    if (!coleta) return res.status(404).json({ error: 'Coleta não encontrada' });

    const { material, quantity, date, address } = req.body;
    coleta.update({ material, quantity, date, address });
    res.status(200).json(coleta);
  };

  exports.deleteColeta = async (req, res) => {
    const { id } = req.params;
    const coleta = await Coletas.findByPk(id);
    if (!coleta) return res.status(404).json({ error: 'Coleta não encontrada' });

    await coleta.destroy();
    res.status(204).send();
  };

  exports.getAvailableColetas = async (req, res) => {
    try {
      const coletas = await Coletas.findAll({
        where: { status: 'pendente' }, // Apenas coletas que não foram aceitas
      });
      res.status(200).json(coletas);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  exports.acceptColeta = async (req, res) => {
    const { id } = req.params;
    const coletorId = req.user.id; // ID do coletor autenticado

    try {
      // Busca a coleta pelo ID com os dados do solicitante e do coletor
      const coleta = await Coletas.findByPk(id, {
        include: [
          { model: User, as: 'user', attributes: ['email', 'username'] }, // Solicitante
          { model: User, as: 'coletor', attributes: ['username', 'email'] }, // Coletor (opcional)
        ],
      });
      // Verifica se a coleta existe
      if (!coleta) {
        return res.status(404).json({ error: 'Coleta não encontrada' });
      }

      // Verifica se a coleta está no status correto
      if (coleta.status !== 'aguardando') {
        return res.status(400).json({ error: 'Coleta já foi aceita ou concluída' });
      }

      // Atualiza o status e associa o coletor
      coleta.status = 'em_andamento';
      coleta.coletorId = coletorId;
      await coleta.save();

      // Dados do solicitante
      const userEmail = coleta.user?.email;
      const userName = coleta.user?.username;

      // Nome do coletor
      const coletorNome = req.user.username;

      // Detalhes da coleta para o e-mail
      const requestDetails = {
        description: coleta.material || 'Descrição não disponível', // Material da coleta
        quantity: coleta.quantity || 'Quantidade não especificada',
        address: `${coleta.rua}, ${coleta.numero}, ${coleta.bairro}, ${coleta.cidade} - ${coleta.estado}`,
        complemento: coleta.complemento ? `Complemento: ${coleta.complemento}` : '',
        date: coleta.date ? new Date(coleta.date).toLocaleString('pt-BR') : 'Data não definida',
      };

      // Verifica se o e-mail do solicitante está disponível e envia
      if (userEmail) {
        try {
          await sendRequestAcceptedEmail(userEmail, coletorNome, requestDetails);
          console.log(`E-mail enviado para o solicitante: ${userEmail}`);
        } catch (emailError) {
          console.error('Erro ao enviar e-mail:', emailError.message);
        }
      } else {
        console.warn('Solicitante não possui e-mail cadastrado.');
      }

      // Responde com sucesso
      res.status(200).json({ message: 'Coleta aceita e e-mail enviado', coleta });
    } catch (error) {
      console.error('Erro ao aceitar coleta:', error);
      res.status(500).json({ error: 'Erro interno no servidor' });
    }
  };
