// agent.js — Detección básica del Arduino Cloud/Create Agent en puertos 8990–9000
export async function findAgentBaseURL() {
  const ports = Array.from({length: 11}, (_, i) => 8990 + i);
  for (const p of ports) {
    try {
      const r = await fetch(`http://127.0.0.1:${p}/info`, { method: 'GET' });
      if (r.ok) return `http://127.0.0.1:${p}`;
    } catch (_) {}
  }
  throw new Error('Arduino Agent no encontrado en 8990–9000');
}

export async function detectAgent() {
  try {
    const base = await findAgentBaseURL();
    return { ok: true, base };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// Placeholder: el flujo real de subida depende del endpoint del agente / placa / board core instalado.
// Aquí dejamos un stub que más adelante conectaremos con compile/upload del agente o CLI local.
export async function uploadViaAgent({ code }) {
  const info = await detectAgent();
  if (!info.ok) throw new Error('Agente no detectado');
  // TODO: Integrar con endpoint real de compilación/carga del Agent (varía por placa/soporte).
  // Por ahora, solo mostramos que el agente fue encontrado.
  return { ok: true, message: `Agente detectado en ${info.base}. Falta integrar endpoint de subida.` };
}
