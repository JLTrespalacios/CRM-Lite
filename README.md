# CRM Ligero - Sistema de Gestión de Citas y Clientes

Un sistema CRM moderno y ligero diseñado para pequeñas empresas, que permite gestionar clientes, agendar citas y visualizar métricas clave.

## 🚀 Características

- **Gestión de Clientes**: Crear, leer, actualizar y eliminar (CRUD) información de clientes.
- **Gestión de Citas**: Agendamiento de citas con validación de fechas y prevención de duplicados.
- **Autenticación Segura**: Registro e inicio de sesión con JWT y contraseñas hasheadas.
- **Panel de Control**: Dashboard con métricas clave y actividad reciente.
- **Interfaz Moderna**: UI/UX profesional con diseño responsive, modo oscuro en sidebar y animaciones fluidas.

## 🛠 Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS v3
- Lucide React (Iconos)
- React Router v7
- Axios

**Backend:**
- Node.js & Express
- Prisma ORM (SQLite para desarrollo / Postgres compatible)
- JWT & Bcrypt
- Helmet (Seguridad)

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- npm

## ⚙️ Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <url-del-repo>
cd crm-citas
```

### 2. Configurar el Backend
```bash
cd backend
npm install
```

Crea un archivo `.env` en la carpeta `backend` con el siguiente contenido:
```env
PORT=3000
DATABASE_URL="file:./dev.db"
JWT_SECRET="tu_secreto_super_seguro"
```

Inicializa la base de datos:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

Inicia el servidor:
```bash
npm run dev
```

### 3. Configurar el Frontend
En una nueva terminal:
```bash
cd frontend
npm install
```

Inicia el servidor de desarrollo:
```bash
npm run dev
```

## 🚀 Plan de Despliegue (Deploy)

### Opción Recomendada: Vercel (Frontend) + Render/Railway (Backend)

#### 1. Backend (Render / Railway)
1.  Sube tu código a GitHub.
2.  Crea un nuevo Web Service en Render o Railway.
3.  Conecta tu repositorio y selecciona la carpeta `backend` como root.
4.  **Variables de Entorno**: Configura `DATABASE_URL` y `JWT_SECRET`.
    *   *Nota*: Para producción, usa una base de datos PostgreSQL (Render/Railway ofrecen planes gratuitos/baratos). Cambia el proveedor en `schema.prisma` a `postgresql`.
5.  **Comando de Build**: `npm install && npx prisma generate`
6.  **Comando de Start**: `node src/index.js`

#### 2. Frontend (Vercel / Netlify)
1.  Crea un nuevo proyecto en Vercel.
2.  Importa tu repositorio y selecciona la carpeta `frontend` como root.
3.  Vercel detectará Vite automáticamente.
4.  **Variables de Entorno**:
    *   Crea un archivo `.env.production` en local o configura en el panel de Vercel:
        `VITE_API_URL=https://tu-backend-en-render.onrender.com/api`
5.  Despliega.

## 🔒 Seguridad
- **Helmet**: Cabeceras HTTP seguras configuradas.
- **CORS**: Configurado para permitir peticiones (ajustar origen en producción).
- **Validación**: Prevención de citas duplicadas y fechas pasadas.
- **Auth**: Tokens JWT con expiración de 1 día.

https://cmrlife.leonardotrespalacios.dev/login
