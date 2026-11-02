<div align="center">

# 🩺 Cuidarte+

### Plataforma de gestión de pacientes y exámenes médicos

**React + Vite · Node.js + Express · PostgreSQL · JWT · Swagger / OpenAPI**

![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=nodedotjs&logoColor=white) ![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white) ![Swagger](https://img.shields.io/badge/Swagger-OpenAPI-85EA2D?logo=swagger&logoColor=black) ![Hostinger](https://img.shields.io/badge/Deploy-Hostinger-673DE6) 

</div>

---

## 📘 Descripción

**Cuidarte+** es una aplicación académica para gestionar pacientes, registrar exámenes y resultados clínicos, administrar cuentas por roles y mantener eventos de auditoría. Incorpora interfaces diferenciadas para **pacientes, médicos y administradores**.

> **Aviso importante:** Este repositorio proviene de una implementación de uso académico con debilidades de seguridad conocidas, entre ellas contraseñas sin hash. **No utilizar con pacientes reales ni información clínica real** hasta completar una revisión de seguridad, privacidad y permisos. El despliegue aquí documentado resuelve la infraestructura, no certifica la aplicación para producción.

## 🧰 Tecnologías

| Capa | Tecnologías | Responsabilidad |
|---|---|---|
| 🎨 Frontend | React 19, Vite 7, Material UI, Tailwind CSS, Axios | Interfaz responsiva y navegación |
| ⚙️ Backend | Node.js, Express | API REST, validaciones y reglas del sistema |
| 🗃️ Datos | PostgreSQL, `pg` | Persistencia de usuarios, pacientes, exámenes y auditoría |
| 🔐 Autenticación | JWT | Inicio de sesión y roles (requiere endurecimiento de seguridad) |
| 📚 API | Swagger UI, OpenAPI 3 | Documentación interactiva en `/docs` |
| 🚀 Publicación | GitHub + Hostinger Node.js Web App | Compilación y despliegue sin Docker |

## ✨ Funcionalidades

- 👤 Registro e inicio de sesión.
- 🧑‍⚕️ Gestión de pacientes, personal médico y administradores.
- 🧪 Gestión de exámenes médicos y resultados.
- 📑 Documentos vinculados a exámenes.
- 🛡️ Gestión de roles y registro de auditoría.
- 🔎 Panel del paciente con consulta de resultados y exámenes.
- 📖 Especificación OpenAPI y documentación Swagger UI.

## 🏗️ Arquitectura

```text
Navegador (React/Vite) ───── HTTPS ────► Express (un solo proceso Node.js)
                                          ├── Frontend compilado (FRONTEND/dist)
                                          ├── API REST (/autenticacion, /pacientes, ...)
                                          ├── Swagger UI (/docs)
                                          └── PostgreSQL (servicio externo)
```

```text
Cuidarte+/
├── BACKEND/
│   ├── sql/init.sql             # Esquema y catálogos iniciales (sin pacientes ficticios)
│   ├── src/
│   │   ├── app.js               # Express y frontend estático
│   │   ├── db.js                # Conexión PostgreSQL mediante DATABASE_URL
│   │   ├── openapi.json         # Especificación Swagger
│   │   ├── routes/              # Autenticación, usuarios, exámenes, etc.
│   │   └── validations/
│   └── package.json
├── FRONTEND/
│   ├── src/                    # Vistas, componentes y clientes HTTP
│   ├── public/
│   └── package.json
├── .env.example
├── .gitignore
├── package.json                # Comandos del proyecto
└── README.md
```

## 💻 Ejecución local sin Docker

**Requisitos:** Node.js 20 o superior; PostgreSQL accesible.

1. Crea una base de datos PostgreSQL llamada `cuidarteplus` y ejecuta **solo en una base vacía** el SQL de `BACKEND/sql/init.sql`.
2. Copia `.env.example` a `.env` y configura `DATABASE_URL` y un `JWT_SECRET` aleatorio.
3. Instala dependencias desde la raíz:

```bash
npm install
```

4. Para trabajar con el frontend y la API por separado, abre dos terminales:

```bash
npm run dev
npm run dev:frontend
```

**Frontend:** http://localhost:3333 · **API:** http://localhost:4444 · **Swagger:** http://localhost:4444/docs

> El esquema `init.sql` crea catálogos básicos y tablas; no carga usuarios ni contraseñas de demostración. Registra cuentas mediante la interfaz cuando corresponda. Los datos del antiguo dump Docker no se incluyen por privacidad y seguridad.

Para simular producción con un único servidor:

```bash
npm run build
npm start
```

Abre `http://localhost:4444`.

## 📚 Swagger / OpenAPI

| Recurso | Ruta |
|---|---|
| 📖 Interfaz Swagger | `/docs` |
| 📄 OpenAPI 3 JSON | `/openapi.json` |
| ❤️ Estado básico | `/api/health` |

Principales grupos de rutas: `/autenticacion`, `/usuarios`, `/pacientes`, `/examenes`, `/documentos`, `/tipo-examen`, `/auditoria` y `/roles`. Los endpoints protegidos requieren `Authorization: Bearer <token>`.

## ☁️ Despliegue en Hostinger mediante GitHub

1. Sube este proyecto a GitHub (sin archivos `.env`, dump ni datos de pacientes).
2. En Hostinger abre **Sitios web → Crear sitio → Web App / Node.js → Import Git Repository** y selecciona el repositorio.
3. Selecciona un plan compatible con Node.js (**Business/Unlimited o Cloud**, sujeto a límites del plan). Usa Node.js 22 cuando esté disponible.
4. Configura **Build:** `npm run build` y **Start:** `npm start`. El archivo inicial es `BACKEND/src/app.js`. Si el entorno no ejecuta `postinstall`, instala también las dependencias de BACKEND y FRONTEND antes de compilar.
5. Agrega en el panel de variables de entorno: `NODE_ENV=production`, `DATABASE_URL`, `JWT_SECRET` (aleatorio, ≥32 caracteres), `DATABASE_SSL=true` solo si el proveedor lo exige y proporciona un certificado válido; `FRONTEND_URL=https://tu-dominio` si necesitas orígenes adicionales.
6. Usa **PostgreSQL externo** (por ejemplo, Supabase o una instancia PostgreSQL administrada); crea el esquema con `BACKEND/sql/init.sql` sin ejecutar el script sobre una base existente. No apuntes `DATABASE_URL` a un contenedor local.
7. Asocia tu dominio con HTTPS, publica y comprueba la página principal, `/api/health`, `/docs` y una cuenta de prueba sin información real.

**Importante:** Las variables `VITE_*` se incrustan durante la compilación. En este despliegue unificado **no configures `VITE_API_URL`**, ya que React llama a la API en el mismo dominio.

## 🔒 Pendientes antes de cualquier uso real

- Reemplazar almacenamiento y validación de contraseñas en texto plano por **Argon2id o bcrypt**, con migración de credenciales existentes.
- Auditar autorización de todas las rutas para evitar acceso cruzado a documentos y fichas clínicas.
- Implementar rate limiting, cabeceras de seguridad, gestión de sesiones y política de privacidad.
- Proteger respaldos, cifrar datos sensibles y definir retención y eliminación de datos.
- Crear pruebas automatizadas de autenticación, roles y acceso a exámenes.
- Revisar el sistema conforme a la normativa chilena aplicable y no subir información clínica real a repositorios públicos.

## 👨‍💻 Desarrollo

**Proyecto académico Cuidarte+** — Sistema de gestión de pacientes y exámenes médicos.
