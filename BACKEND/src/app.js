const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");

const { pool } = require("./db");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const pacientesRoutes = require("./routes/pacientes");
const examenesRoutes = require("./routes/examenes");
const documentosRoutes = require("./routes/documentos");
const tipoExamenRoutes = require("./routes/tipo-examen");
const auditRoutes = require("./routes/audit");
const rolesRoutes = require("./routes/roles");

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",").map((origin) => origin.trim()).filter(Boolean);
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || (process.env.NODE_ENV !== "production" && /^http:\/\/localhost:\d+$/.test(origin))) {
      return callback(null, true);
    }
    return callback(new Error("Origen CORS no autorizado"));
  }
}));
app.use(express.json());
app.use(morgan("dev"));

const uploadsDir = path.join(__dirname, "..", "uploads", "documentos");
fs.mkdirSync(uploadsDir, { recursive: true });

app.use("/autenticacion", authRoutes);
app.use("/usuarios", userRoutes);
app.use("/pacientes", pacientesRoutes);
app.use("/examenes", examenesRoutes);
app.use("/documentos", documentosRoutes);
app.use("/tipo-examen", tipoExamenRoutes);
app.use("/auditoria", auditRoutes);
app.use("/roles", rolesRoutes);

const openapi = require("./openapi.json");
// URL relativa: Swagger funciona tanto en localhost como en el dominio de Hostinger.
openapi.servers = [{ url: "/", description: "Servidor actual" }];
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapi));
app.get("/openapi.json", (req, res) => {
  res.json(openapi);
});

// Los archivos clinicos no deben quedar expuestos como recursos estaticos publicos.
// Consultar los documentos a traves de las rutas autenticadas de /documentos.

app.get("/api/health", (req, res) => {
  res.json({ name: "cuidarteplus", status: "ok" });
});

// Frontend SPA compilado: un único proceso Node para Hostinger.
const frontendDist = path.resolve(__dirname, "../../FRONTEND/dist");
if (fs.existsSync(path.join(frontendDist, "index.html"))) {
  app.use(express.static(frontendDist));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/autenticacion") || req.path.startsWith("/usuarios") ||
        req.path.startsWith("/pacientes") || req.path.startsWith("/examenes") ||
        req.path.startsWith("/documentos") || req.path.startsWith("/tipo-examen") ||
        req.path.startsWith("/auditoria") || req.path.startsWith("/roles") ||
        req.path.startsWith("/docs") || req.path.startsWith("/openapi") || req.path.startsWith("/api/")) return next();
    return res.sendFile(path.join(frontendDist, "index.html"));
  });
}

const PORT = process.env.PORT || 4444;
app.listen(PORT, () => {
  console.log(`cuidarteplus API escuchando en puerto ${PORT}`);
});
