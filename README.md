# SmartBlock Starter (Vercel static)

Proyecto mínimo para programar Arduino con bloques (Blockly) y generar código C++/Arduino.

## Estructura
- `index.html` — Shell principal, incluye Blockly desde CDN y carga los JS locales.
- `js/blocks.js` — Bloques personalizados (setup, loop, pinMode, digitalWrite, analogRead, delay).
- `js/generator.js` — Generador de código Arduino (C++), arma `setup()` y `loop()`.
- `js/agent.js` — Detector básico del Arduino Cloud/Create Agent (puertos 8990–9000).
- `js/app.js` — Inicializa Blockly, UI y acciones (copiar, descargar, detectar agente).
- `firmware/blink.ino` — Ejemplo simple para pruebas.

## Deploy en Vercel
Este proyecto es **estático**. No requiere build.
1. Sube esta carpeta a GitHub.
2. Conecta el repo a Vercel y despliega (no uses la sección `builds`).

## Evitar 429
No uses `raw.githubusercontent.com` para cargar tus propios scripts. Sirve todo localmente (Vercel).

## Arduino Cloud Agent
Para poder hablar con el agente desde tu dominio:
1. Edita `config.ini` del agente e incluye tu dominio exacto:
   ```
   origins = https://tu-dominio.vercel.app, http://localhost:5173
   ```
2. Reinicia el agente.
3. En la app, pulsa “Detectar Agente”. Si lo encuentra, verás el puerto.

> **Nota:** El endpoint de **subida** no está implementado en este starter. Requiere integrar el flujo de compilación/carga del agente (varía según placa/board core). Dejamos el `stub` en `uploadViaAgent()` para completar en el siguiente paso.

## Desarrollo local
Puedes servirlo con cualquier servidor estático, por ejemplo:
```bash
python3 -m http.server 5173
```
Y abrir `http://localhost:5173`.
