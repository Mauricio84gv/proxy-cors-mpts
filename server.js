const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

// Captura errores globales para que el proceso no muera en silencio
process.on("uncaughtException", (err) => {
  console.error("❌ uncaughtException:", err);
});
process.on("unhandledRejection", (err) => {
  console.error("❌ unhandledRejection:", err);
});

// Ruta básica para verificar que Render lo mantiene vivo
app.get("/", (req, res) => {
  res.send("✅ Proxy funcionando en Render");
});

// Enlace a tu Google Apps Script
const TARGET_URL = "https://script.google.com/macros/s/AKfycbzWInYPLtjrKf8Jfaey09DODsHfmpKnfG6khN5RKDoP76mSdF40j5okYSid-JIamS5v/exec";

// Ruta que reenvía el formulario
app.post("/proxy", async (req, res) => {
  try {
    const response = await fetch(TARGET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });

    const data = await response.text();
    res.status(200).send(data);
  } catch (err) {
    console.error("❌ Error en /proxy:", err);
    res.status(500).json({ error: "Error al reenviar", details: err.message });
  }
});

// Mantiene el servidor en ejecución
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en el puerto ${PORT}`);
});
