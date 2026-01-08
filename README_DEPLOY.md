# Guía de Despliegue para CRM Lite

Esta guía te ayudará a publicar tu aplicación en internet de forma gratuita.

## Parte 1: Frontend (Lo que ve el usuario)
Usaremos **Vercel** (gratis y muy rápido).

1.  Crea una cuenta en [Vercel.com](https://vercel.com).
2.  Instala Vercel CLI en tu terminal (si quieres hacerlo por comando):
    ```bash
    npm i -g vercel
    ```
3.  O simplemente sube tu código a GitHub.
4.  En Vercel, importa tu repositorio de GitHub.
5.  **IMPORTANTE:** En la configuración de "Environment Variables" de Vercel, agrega:
    *   `VITE_API_URL`: Aquí pondrás la URL de tu Backend (ver Parte 2). Por ahora, déjalo vacío o usa tu IP local si solo pruebas en casa.

## Parte 2: Backend (El servidor y base de datos)
Usaremos **Render** o **Railway** (tienen capas gratuitas).

### Opción Recomendada: Render.com
1.  Crea una cuenta en [Render.com](https://render.com).
2.  Crea un "New Web Service".
3.  Conecta tu repositorio.
4.  Configura:
    *   **Build Command:** `npm install`
    *   **Start Command:** `node src/index.js`
    *   **Root Directory:** `backend` (muy importante, porque tu backend está en una subcarpeta).
5.  En "Environment Variables", agrega:
    *   `DATABASE_URL`: Necesitarás una base de datos PostgreSQL. Render te permite crear una "PostgreSQL" gratis también. Copia la "Internal URL" y pégala aquí.
    *   `JWT_SECRET`: Escribe una clave secreta larga y segura.
    *   `PORT`: `3001` (o el que Render asigne automáticamente).

## Nota sobre la Base de Datos
Actualmente usas **SQLite** (un archivo local). Esto **NO funciona bien en la nube** (se borran los datos cada vez que reinicias).
Para producción, debes cambiar a **PostgreSQL**.
1.  En `backend/prisma/schema.prisma`, cambia `provider = "sqlite"` a `provider = "postgresql"`.
2.  Ejecuta `npx prisma generate`.

## Resumen Rápido (Solo ver en celular ahora mismo)
Si solo quieres verlo en tu celular en tu casa:
1.  Asegúrate que tu PC y celular estén en el mismo WiFi.
2.  Mira la terminal donde corre el frontend. Verás algo como `Network: http://192.168.1.X:5173`.
3.  Abre esa IP en tu celular.
