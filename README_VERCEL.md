# Guía de Despliegue en Vercel (Paso a Paso)

Tu proyecto ya está configurado para desplegarse como un "Monorepo" (Frontend + Backend juntos) en Vercel.

## 1. Preparar la Base de Datos (OBLIGATORIO)
Vercel no guarda archivos, por lo que SQLite (tu base de datos actual) **se borrará** cada vez que la web se duerma. Necesitas una base de datos en la nube (PostgreSQL).

1.  Ve a [Neon.tech](https://neon.tech) (es gratis y muy fácil).
2.  Crea una cuenta y un proyecto.
3.  Copia la "Connection String" (se ve como `postgres://usuario:password@...`).

## 2. Preparar el Código para la Nube
Antes de subir a Vercel, debes hacer un pequeño cambio en `backend/prisma/schema.prisma`:

1.  Abre `backend/prisma/schema.prisma`.
2.  Cambia la línea 7:
    *   De: `provider = "sqlite"`
    *   A:  `provider = "postgresql"`
3.  Guarda el archivo.

> **Nota:** Si haces esto, tu entorno local dejará de funcionar hasta que pongas la URL de Postgres en tu archivo `.env`. Puedes revertir el cambio cuando quieras trabajar en local.

## 3. Subir a Vercel
1.  Sube tu carpeta `crm-citas` a GitHub.
2.  Ve a [Vercel](https://vercel.com) -> "Add New..." -> "Project".
3.  Importa tu repositorio de GitHub.
4.  **Configuración del Proyecto (IMPORTANTE):**
    *   **Framework Preset:** Déjalo en "Other" o "Vite".
    *   **Root Directory:** Déjalo en `./` (la raíz).
    *   **Environment Variables:** Agrega estas variables:
        *   `DATABASE_URL`: Pega aquí la URL que copiaste de Neon.tech.
        *   `JWT_SECRET`: Escribe cualquier texto largo y secreto (ej. `mi-secreto-super-seguro-123`).
        *   `VITE_API_URL`: `/api` (Solo escribe `/api`, esto hará que el frontend busque el backend en la misma dirección).

5.  Dale a **Deploy**.

¡Listo! Vercel instalará todo, generará la base de datos y tu CRM estará online.
