const path = require('path');

// Import unEscX from functions script
const { unEscX } = require('../src/main/todrawio-isyfact-functions.js');

// Import adjustIds2 from library
const { adjustIds2 } = require('../src/main/todrawio-isyfact-isyfactlib.js');

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

// Test input: nested mxCell structure (escaped as in drawio lib)
const input2 = `&lt;mxGraphModel&gt;&lt;root&gt;&lt;mxCell id=\"0\"/&gt;&lt;mxCell id=\"1\" parent=\"0\"/&gt;&lt;mxCell id=\"2\" value=\"«Anwendungskomponente»&amp;lt;br&amp;gt;&amp;lt;b&amp;gt;ANK_Anwendungskomponente&amp;lt;/b&amp;gt;\" style=\"html=1;dropTarget=0;strokeColor=#CD5038;fillColor=#FF9900;\" vertex=\"1\" parent=\"1\"&gt;&lt;mxGeometry width=\"180\" height=\"90\" as=\"geometry\"/&gt;&lt;/mxCell&gt;&lt;mxCell id=\"3\" value=\"\" style=\"shape=component;jettyWidth=8;jettyHeight=4;fillColor=none;strokeColor=#000000;\" vertex=\"1\" parent=\"2\"&gt;&lt;mxGeometry x=\"1\" width=\"20\" height=\"20\" relative=\"1\" as=\"geometry\"&gt;&lt;mxPoint x=\"-27\" y=\"7\" as=\"offset\"/&gt;&lt;/mxGeometry&gt;&lt;/mxCell&gt;&lt;/root&gt;&lt;/mxGraphModel&gt;`;

const expectedParentId = "parent";

// Run test
const jsonObj = xmlParser.parse(unEscX(input2));
const result = adjustIds2(jsonObj, expectedParentId);
console.log("Result:\n" + JSON.stringify(result, 0, 3));
console.log("Adjusted mxCell:\n" + xmlBuilder.build(result.mxGraphModel.root));

