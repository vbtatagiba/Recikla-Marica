
const Coleta = require('../models/Coleta');

exports.createColeta = async (req, res) => {
  const { material, quantity, date, address } = req.body;

  try {
    const coleta = await Coleta.create({
      material,
      quantity,
      date,
      address,
      userId: req.user.id,
    });
    res.status(201).json(coleta);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.getColetas = async (req, res) => {
  const coletas = await Coleta.findAll();
  res.status(200).json(coletas);
};

exports.updateColeta = async (req, res) => {
  const { id } = req.params;
  const coleta = await Coleta.findByPk(id);
  if (!coleta) return res.status(404).json({ error: 'Coleta não encontrada' });
  
  const { material, quantity, date, address } = req.body;
  coleta.update({ material, quantity, date, address });
  res.status(200).json(coleta);
};

exports.deleteColeta = async (req, res) => {
  const { id } = req.params;
  const coleta = await Coleta.findByPk(id);
  if (!coleta) return res.status(404).json({ error: 'Coleta não encontrada' });
  
  await coleta.destroy();
  res.status(204).send();
};
