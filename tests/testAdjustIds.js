const { expect } = require("chai");
const { unEscX } = require("../src/main/todrawio-isyfact-functions.js");
const { adjustIds2 } = require("../src/main/todrawio-isyfact-isyfactlib.js");
const p = require("../src/lib/fxp.cjs");

const xmlParser = new p.XMLParser({
    ignoreAttributes: false,
    processEntities: true,
    attributeNamePrefix: "",
});
const xmlBuilder = new p.XMLBuilder({
    arrayNodeName: "mxCell",
    attributesGroupName: false,
    ignoreAttributes: false,
    attributeNamePrefix: "",
    format: true,
});

describe("adjustIds2", () => {
    it("adjusts ids and parent ids in nested mxCell structure", () => {
        const input2 = `&lt;mxGraphModel&gt;&lt;root&gt;&lt;mxCell id=\"0\"/&gt;&lt;mxCell id=\"1\" parent=\"0\"/&gt;&lt;mxCell id=\"2\" value=\"«Anwendungskomponente»&amp;lt;br&amp;gt;&amp;lt;b&amp;gt;ANK_Anwendungskomponente&amp;lt;/b&amp;gt;\" style=\"html=1;dropTarget=0;strokeColor=#CD5038;fillColor=#FF9900;\" vertex=\"1\" parent=\"1\"&gt;&lt;mxGeometry width=\"180\" height=\"90\" as=\"geometry\"/&gt;&lt;/mxCell&gt;&lt;mxCell id=\"3\" value=\"\" style=\"shape=component;jettyWidth=8;jettyHeight=4;fillColor=none;strokeColor=#000000;\" vertex=\"1\" parent=\"2\"&gt;&lt;mxGeometry x=\"1\" width=\"20\" height=\"20\" relative=\"1\" as=\"geometry\"&gt;&lt;mxPoint x=\"-27\" y=\"7\" as=\"offset\"/&gt;&lt;/mxGeometry&gt;&lt;/mxCell&gt;&lt;/root&gt;&lt;/mxGraphModel&gt;`;
        const expectedParentId = "parent";
        const expectedMainId = "4711";

        const jsonObj = xmlParser.parse(unEscX(input2));
        const result = adjustIds2(jsonObj, expectedParentId, expectedMainId);

        // Check that the root mxCell parent is set to expectedParentId
        const rootCells = result.mxGraphModel.root.mxCell;
        // Find the main cell (id should be replaced with expectedMainId)
        const mainCell = rootCells.find
            ? rootCells.find((cell) => cell.id === expectedMainId)
            : rootCells.filter((cell) => cell.id === expectedMainId)[0];

        expect(mainCell).to.exist;
        expect(mainCell.parent).to.equal(expectedParentId);

        // Optionally, check that all ids are unique and replaced as expected
        const allIds = rootCells.map((cell) => cell.id);
        expect(new Set(allIds).size).to.equal(allIds.length);
    });
});
