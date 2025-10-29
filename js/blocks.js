// blocks.js — Definición de bloques personalizados
import * as Blockly from 'blockly/core';
import 'blockly/blocks'; // bloques estándar

// Bloque setup()
Blockly.Blocks['setup_block'] = {
  init: function() {
    this.appendStatementInput('BODY')
        .setCheck(null)
        .appendField('setup');
    this.setColour('#0ea5e9');
    this.setTooltip('Código a ejecutar una sola vez.');
    this.setHelpUrl('');
  }
};

// Bloque loop()
Blockly.Blocks['loop_block'] = {
  init: function() {
    this.appendStatementInput('BODY')
        .setCheck(null)
        .appendField('loop');
    this.setColour('#0ea5e9');
    this.setTooltip('Código a ejecutar en bucle.');
    this.setHelpUrl('');
  }
};

// pinMode(pin, MODE)
Blockly.Blocks['pin_mode'] = {
  init: function() {
    this.appendValueInput('PIN').setCheck('Number').appendField('pinMode pin');
    this.appendValueInput('MODE').setCheck('String').appendField('modo');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#22c55e');
    this.setTooltip('Configura el modo del pin (INPUT/OUTPUT/INPUT_PULLUP).');
  }
};

// digitalWrite(pin, value)
Blockly.Blocks['digital_write'] = {
  init: function() {
    this.appendValueInput('PIN').setCheck('Number').appendField('digitalWrite pin');
    this.appendValueInput('VAL').setCheck('Boolean').appendField('valor');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#22c55e');
    this.setTooltip('Escribe HIGH o LOW en un pin digital.');
  }
};

// analogRead(pin)
Blockly.Blocks['analog_read'] = {
  init: function() {
    this.appendValueInput('PIN').setCheck('String').appendField('analogRead pin');
    this.setOutput(true, 'Number');
    this.setColour('#eab308');
    this.setTooltip('Lee un valor analógico (A0, A1, etc.).');
  }
};

// delay(ms)
Blockly.Blocks['delay_ms'] = {
  init: function() {
    this.appendValueInput('MS').setCheck('Number').appendField('delay ms');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#0ea5e9');
    this.setTooltip('Pausa en milisegundos.');
  }
};
