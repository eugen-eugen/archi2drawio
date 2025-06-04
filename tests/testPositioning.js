const fs = require("fs");
const path = require("path");
const { expect } = require("chai");

// Import unEscX from functions script
const { unEscX } = require("../src/main/todrawio-isyfact-functions.js");

// Import other functions from the library file
const { adjustIds2, positioning2 } = require("../src/main/todrawio-isyfact-isyfactlib.js");

// Import xmlParser and xmlBuilder from fxp.cjs
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
});

describe("positioning2", () => {
    it("sets x and y only on the root mxCell's mxGeometry", () => {
        const input = `&lt;mxCell id=\"0\"/&gt;&lt;mxCell id=\"1\" parent=\"0\"/&gt;&lt;mxCell id=\"2\" value=\"«Geschäftsanwendung»&amp;lt;br&amp;gt;&amp;lt;b&amp;gt;Geschäftsanwendung&amp;lt;/b&amp;gt;\" style=\"html=1;dropTarget=0;strokeColor=#7197BD;fillColor=#99CCFF;\" vertex=\"1\" parent=\"1\"&gt;&lt;mxGeometry width=\"180\" height=\"90\" as=\"geometry\"/&gt;&lt;/mxCell&gt;&lt;mxCell id=\"3\" value=\"\" style=\"shape=component;jettyWidth=8;jettyHeight=4;fillColor=none;\" vertex=\"1\" parent=\"2\"&gt;&lt;mxGeometry x=\"1\" width=\"20\" height=\"20\" relative=\"1\" as=\"geometry\"&gt;&lt;mxPoint x=\"-27\" y=\"7\" as=\"offset\"/&gt;&lt;/mxGeometry&gt;&lt;/mxCell&gt;`;
        const x = 42,
            y = 99;
        const adjustedInput = adjustIds2(xmlParser.parse(unEscX(input)), "parent1", "4711");
        const result = positioning2(adjustedInput, x, y, "parent1");

        // Find the mxCell with parent "parent1" (should be the root/main cell)
        const rootCells = result.mxGraphModel?.root?.mxCell || result.mxCell;
        const mainCell = Array.isArray(rootCells) ? rootCells.find((cell) => cell.parent === "parent1") : rootCells;

        expect(mainCell).to.exist;
        expect(mainCell.mxGeometry).to.exist;
        expect(mainCell.mxGeometry.x).to.equal(x);
        expect(mainCell.mxGeometry.y).to.equal(y);

        // All other mxCells should not have x/y set on their mxGeometry (except if already present)
        if (Array.isArray(rootCells)) {
            rootCells.forEach((cell) => {
                if (cell !== mainCell && cell.mxGeometry && cell.mxGeometry.as === "geometry") {
                    if (cell.mxGeometry.x !== undefined || cell.mxGeometry.y !== undefined) {
                        // Only allowed if it was already present (e.g., relative geometry)
                        expect(cell.mxGeometry.x).to.not.equal(x);
                        expect(cell.mxGeometry.y).to.not.equal(y);
                    }
                }
            });
        }
    });
});
