const prisma = require('../prisma');

const getAppointments = async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        client: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    });
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Error al obtener las citas' });
  }
};

const createAppointment = async (req, res) => {
  try {
    const { date, clientId } = req.body;
    const userId = req.user.userId; // From authMiddleware

    if (!date || !clientId) {
      return res.status(400).json({ error: 'Fecha y Cliente son obligatorios' });
    }

    const appointmentDate = new Date(date);

    // Validation: Date must be valid
    if (isNaN(appointmentDate.getTime())) {
      return res.status(400).json({ error: 'Fecha inválida' });
    }

    // Allow past appointments for CRM history purposes
    // if (appointmentDate < new Date()) {
    //   return res.status(400).json({ error: 'La cita debe ser en una fecha futura' });
    // }

    // Validation: Check for double booking (exact time match for this user)
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        userId: userId,
        date: appointmentDate,
        status: { not: 'cancelled' }
      }
    });

    if (existingAppointment) {
      return res.status(409).json({ error: 'Ya tienes una cita programada a esta hora' });
    }

    const appointment = await prisma.appointment.create({
      data: {
        date: appointmentDate,
        clientId: parseInt(clientId),
        userId: userId,
        status: 'pending'
      },
      include: {
        client: true
      }
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Error al crear la cita' });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        client: true
      }
    });

    res.json(appointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: 'Error al actualizar la cita' });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.appointment.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Cita eliminada correctamente' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ error: 'Error al eliminar la cita' });
  }
};

module.exports = {
  getAppointments,
  createAppointment,
  updateAppointmentStatus,
  deleteAppointment
};
