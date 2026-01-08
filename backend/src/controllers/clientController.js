const prisma = require('../prisma');

const getClients = async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      include: {
        appointments: {
          orderBy: { date: 'desc' },
          take: 1
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching clients' });
  }
};

const getClient = async (req, res) => {
  const { id } = req.params;
  try {
    const client = await prisma.client.findUnique({ where: { id: Number(id) } });
    if (!client) return res.status(404).json({ error: 'Client not found' });
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching client' });
  }
};

const createClient = async (req, res) => {
  const { name, email, phone } = req.body;
  try {
    const client = await prisma.client.create({
      data: { name, email, phone },
    });
    res.status(201).json(client);
  } catch (error) {
    if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Error creating client' });
  }
};

const updateClient = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  try {
    const client = await prisma.client.update({
      where: { id: Number(id) },
      data: { name, email, phone },
    });
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: 'Error updating client' });
  }
};

const deleteClient = async (req, res) => {
  const { id } = req.params;
  try {
    // Usar transacción para asegurar que se borren las citas antes que el cliente
    await prisma.$transaction([
      prisma.appointment.deleteMany({
        where: { clientId: Number(id) }
      }),
      prisma.client.delete({
        where: { id: Number(id) }
      })
    ]);
    res.json({ message: 'Client and associated appointments deleted' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Error al eliminar el cliente y sus citas asociadas.' });
  }
};

module.exports = { getClients, getClient, createClient, updateClient, deleteClient };
