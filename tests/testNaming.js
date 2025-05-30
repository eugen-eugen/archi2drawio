const fs = require('fs');
const path = require('path');

// Import unEscX from functions script
const { unEscX } = require('../src/main/todrawio-isyfact-functions.js');

// Import other functions from the library file
const {
    adjustIds2,
    positioning2,
    naming2
} = require('../src/main/todrawio-isyfact-isyfactlib.js');

// Import xmlParser and xmlBuilder from fxp.cjs
const p = require('../src/lib/fxp.cjs');
const xmlParser = new p.XMLParser({
    ignoreAttributes: false,
    processEntities: true,
    attributeNamePrefix: ""
});
const xmlBuilder = new p.XMLBuilder({
    arrayNodeName: "mxCell",
    attributesGroupName: false,
    ignoreAttributes: false,
    attributeNamePrefix: ""
});

const input = `&lt;mxCell id=\"0\"/&gt;&lt;mxCell id=\"1\" parent=\"0\"/&gt;&lt;mxCell id=\"2\" value=\"«Geschäftsanwendung»&amp;lt;br&amp;gt;&amp;lt;b&amp;gt;Geschäftsanwendung&amp;lt;/b&amp;gt;\" style=\"html=1;dropTarget=0;strokeColor=#7197BD;fillColor=#99CCFF;\" vertex=\"1\" parent=\"1\"&gt;&lt;mxGeometry width=\"180\" height=\"90\" as=\"geometry\"/&gt;&lt;/mxCell&gt;&lt;mxCell id=\"3\" value=\"\" style=\"shape=component;jettyWidth=8;jettyHeight=4;fillColor=none;\" vertex=\"1\" parent=\"2\"&gt;&lt;mxGeometry x=\"1\" width=\"20\" height=\"20\" relative=\"1\" as=\"geometry\"&gt;&lt;mxPoint x=\"-27\" y=\"7\" as=\"offset\"/&gt;&lt;/mxGeometry&gt;&lt;/mxCell&gt;`;

// Expected: only the root mxCell's mxGeometry gets x and y
const x = 42, y = 99;
const adjustedInput = adjustIds2(xmlParser.parse(unEscX(input)), "parent1"); // Adjust IDs to ensure the parent is set correctly
const positionedInput = positioning2(adjustedInput, x, y, "parent1");
const namedInput = naming2(positionedInput, "Nomen est Omen", "Beschreibung des Elements", "parent1");

console.log("Result:\n" + JSON.stringify(namedInput, 0, 3));
console.log("Adjusted mxCell:\n" + xmlBuilder.build(namedInput.mxCell));
