// generator.js — Generador de código Arduino (C++)
import * as Blockly from 'blockly/core';
import 'blockly/javascript'; // Asegura utilidades de generator

// Creamos un generador simple para C++ estilo Arduino.
const Arduino = new Blockly.Generator('arduino');

// Separadores
Arduino.STATEMENT_PREFIX = '';
Arduino.INDENT = '  ';

// --- Helpers
function valueToCodeOrDefault(block, name, order, def='') {
  const v = Arduino.valueToCode(block, name, order) || def;
  return v;
}

// Mapa básico de orden de operaciones (reutilizamos del JS generator si hace falta)
Arduino.ORDER_ATOMIC = 0;

// Plantilla final
Arduino.finish = function(code) {
  return code;
};

// Acumuladores para setup y loop
Arduino.setups = [];
Arduino.loops = [];

// setup_block
Arduino['setup_block'] = function(block) {
  const body = Arduino.statementToCode(block, 'BODY');
  Arduino.setups.push(body);
  return '';
};

// loop_block
Arduino['loop_block'] = function(block) {
  const body = Arduino.statementToCode(block, 'BODY');
  Arduino.loops.push(body);
  return '';
};

// pin_mode
Arduino['pin_mode'] = function(block) {
  const pin = valueToCodeOrDefault(block, 'PIN', Arduino.ORDER_ATOMIC, '13');
  const mode = valueToCodeOrDefault(block, 'MODE', Arduino.ORDER_ATOMIC, '"OUTPUT"');
  return `pinMode(${pin}, ${mode});\n`;
};

// digital_write
Arduino['digital_write'] = function(block) {
  const pin = valueToCodeOrDefault(block, 'PIN', Arduino.ORDER_ATOMIC, '13');
  const val = valueToCodeOrDefault(block, 'VAL', Arduino.ORDER_ATOMIC, 'true');
  const v = (val === 'true' || val === 'HIGH') ? 'HIGH' : (val === 'false' || val === 'LOW') ? 'LOW' : val;
  return `digitalWrite(${pin}, ${v});\n`;
};

// analog_read
Arduino['analog_read'] = function(block) {
  const pin = valueToCodeOrDefault(block, 'PIN', Arduino.ORDER_ATOMIC, 'A0');
  const code = `analogRead(${pin})`;
  return [code, Arduino.ORDER_ATOMIC];
};

// delay_ms
Arduino['delay_ms'] = function(block) {
  const ms = valueToCodeOrDefault(block, 'MS', Arduino.ORDER_ATOMIC, '1000');
  return `delay(${ms});\n`;
};

// Generación principal: arma setup() y loop()
Arduino.workspaceToCode = function(workspace) {
  Arduino.setups = [];
  Arduino.loops = [];
  let code = Blockly.utils.string.createUniqueString(); // dummy to invoke generators
  code = Blockly.Generator.prototype.workspaceToCode.call(this, workspace);
  const setupBody = Arduino.setups.join('');
  const loopBody  = Arduino.loops.join('');

  return `// Código generado por SmartBlock\n#include <Arduino.h>\n\nvoid setup() {\n${setupBody}}\n\nvoid loop() {\n${loopBody}}\n`;
};

// Export
window.SmartBlockArduino = Arduino;
