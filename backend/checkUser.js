const prisma = require('./src/prisma');

async function checkUser() {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: 'trespalacios@hotmail.com',
      },
    });
    console.log('User check result:', user);
  } catch (error) {
    console.error('Error checking user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();
