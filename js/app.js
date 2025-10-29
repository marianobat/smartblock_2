// app.js — Inicialización de Blockly y UI
import * as Blockly from 'blockly/core';
import 'blockly/blocks';
import { detectAgent, uploadViaAgent } from './agent.js';
import './blocks.js';
import './generator.js';

const toolbox = document.getElementById('toolbox');
const blocklyDiv = document.getElementById('blocklyDiv');
const blocklyArea = document.getElementById('blocklyArea');
const out = document.getElementById('out');
const btnCopy = document.getElementById('btnCopy');
const btnDownload = document.getElementById('btnDownload');
const btnDetectAgent = document.getElementById('btnDetectAgent');
const btnUpload = document.getElementById('btnUpload');
const agentState = document.getElementById('agentState');
const agentInfo = document.getElementById('agentInfo');

// Workspace
const workspace = Blockly.inject(blocklyDiv, {
  toolbox,
  renderer: 'zelos',
  zoom: { controls: true, wheel: true },
  trashcan: true,
});

// Ajuste responsivo del área Blockly
function onResize() {
  const element = blocklyArea;
  let x = 0;
  let y = 0;
  let el = element;
  do {
    x += el.offsetLeft;
    y += el.offsetTop;
    el = el.offsetParent;
  } while (el);
  blocklyDiv.style.left = x + 'px';
  blocklyDiv.style.top = y + 'px';
  blocklyDiv.style.width = element.offsetWidth + 'px';
  blocklyDiv.style.height = element.offsetHeight + 'px';
  Blockly.svgResize(workspace);
}
window.addEventListener('resize', onResize, false);
setTimeout(onResize, 0);

// Generación de código
function updateCode() {
  const code = window.SmartBlockArduino.workspaceToCode(workspace);
  out.value = code;
}
workspace.addChangeListener(updateCode);

// Botones
btnCopy.addEventListener('click', () => {
  out.select();
  document.execCommand('copy');
  btnCopy.textContent = '¡Copiado!';
  setTimeout(() => (btnCopy.textContent = 'Copiar código'), 1500);
});

btnDownload.addEventListener('click', () => {
  const blob = new Blob([out.value], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sketch.ino';
  a.click();
  URL.revokeObjectURL(url);
});

btnDetectAgent.addEventListener('click', async () => {
  agentState.textContent = 'Buscando...';
  agentState.className = 'badge muted';
  try {
    const info = await detectAgent();
    if (info.ok) {
      agentState.textContent = 'Agente detectado';
      agentState.className = 'badge ok';
      agentInfo.textContent = `Encontrado en ${info.base}. Para subir, integraremos el endpoint del agente en el próximo paso.`;
    } else {
      agentState.textContent = 'Agente no detectado';
      agentState.className = 'badge warn';
      agentInfo.textContent = 'Asegúrate de que el Agente está corriendo y que tu dominio está permitido en config.ini.';
    }
  } catch (e) {
    agentState.textContent = 'Error';
    agentState.className = 'badge err';
    agentInfo.textContent = e.message;
  }
});

btnUpload.addEventListener('click', async () => {
  agentState.textContent = 'Subiendo...';
  agentState.className = 'badge muted';
  try {
    const res = await uploadViaAgent({ code: out.value });
    if (res.ok) {
      agentState.textContent = 'Listo (stub)';
      agentState.className = 'badge ok';
      agentInfo.textContent = res.message;
    } else {
      agentState.textContent = 'Fallo de subida';
      agentState.className = 'badge err';
      agentInfo.textContent = res.message || 'Error desconocido.';
    }
  } catch (e) {
    agentState.textContent = 'Error';
    agentState.className = 'badge err';
    agentInfo.textContent = e.message;
  }
});

// Carga un ejemplo inicial
function loadExample() {
  const xmlText = `
    <xml xmlns="https://developers.google.com/blockly/xml">
      <block type="setup_block" x="20" y="20">
        <statement name="BODY">
          <block type="pin_mode">
            <value name="PIN"><shadow type="math_number"><field name="NUM">13</field></shadow></value>
            <value name="MODE"><shadow type="text"><field name="TEXT">OUTPUT</field></shadow></value>
            <next>
              <block type="digital_write">
                <value name="PIN"><shadow type="math_number"><field name="NUM">13</field></shadow></value>
                <value name="VAL"><shadow type="logic_boolean"><field name="BOOL">TRUE</field></shadow></value>
              </block>
            </next>
          </block>
        </statement>
      </block>
      <block type="loop_block" x="20" y="160">
        <statement name="BODY">
          <block type="digital_write">
            <value name="PIN"><shadow type="math_number"><field name="NUM">13</field></shadow></value>
            <value name="VAL"><shadow type="logic_boolean"><field name="BOOL">TRUE</field></shadow></value>
            <next>
              <block type="delay_ms">
                <value name="MS"><shadow type="math_number"><field name="NUM">500</field></shadow></value>
                <next>
                  <block type="digital_write">
                    <value name="PIN"><shadow type="math_number"><field name="NUM">13</field></shadow></value>
                    <value name="VAL"><shadow type="logic_boolean"><field name="BOOL">FALSE</field></shadow></value>
                    <next>
                      <block type="delay_ms">
                        <value name="MS"><shadow type="math_number"><field name="NUM">500</field></shadow></value>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>
  `;
  const xml = Blockly.Xml.textToDom(xmlText);
  Blockly.Xml.domToWorkspace(xml, workspace);
  updateCode();
}
loadExample();
