/*
 * Author: Pedro Duque, adapted for C4 by GitHub Copilot
 * Version: 0.3-c4
 * Date: 2025-05-17
 *
 * PURPOSE:
 * This script exports an Archimate view to draw.io (diagrams.net) using C4 shapes.
 *
 * C4-specific:
 * - Uses C4 shapes for elements.
 * - Sets c4Name, c4Description, c4Type attributes.
 * - Sets label property to C4 style.
 */
const { escX } = require("./todrawio-isyfact-functions.js");

const { readDrawioLibraryJson } = require("./todrawio-isyfact-isyfactlib.js");

const { c4ElemMap } = require("./constants.js");

const { mapElementsC4 } = require("./mapElementsC4.js");

const useAlternativeShapes = false; //if true the script will be sensible to alternative shapes defined. Otherwise it will use the default shape.

//*****************************************************************************
/**
 * Get all bendpoints of the connection using absolute coordinates
 *
 * @param conn  -    visual conenction
 * @returns {*[]} - an array of bendpoints
 *
 * from: xmayeur / jArchi library with functions to manage relationship layout in views (https://gist.github.com/xmayeur/bbe80af3d09706b34848b4bbfaa71103)
 */
//*****************************************************************************

//*****************************************************************************
//
// generate an XML string representing the properties of the given element
//
//*****************************************************************************

function propertiesTable(element) {
    var theProperties = element.prop();
    var theXML = "";
    propNames = [];
    for (var i = 0; i < theProperties.length; i++) {
        if (propNames.includes(theProperties[i])) {
            propName = theProperties[i].replace(/ /g, "_").replace(/\n/g, "").replace(/\r/g, "");
            propValue = escX(element.prop(theProperties[i]));
            theXML += ` ${propName}="${propValue}"`;
            propNames.push(theProperties[i]);
        }
    }
    return theXML;
}

//*****************************************************************************
//
// 	deal with composed types
//
//*****************************************************************************

// **********************************************************************
// Main flow (C4 version)
// **********************************************************************

const archiPrefs = Java.type("com.archimatetool.editor.ArchiPlugin").PREFERENCES;

var OutputStreamWriter = Java.type("java.io.OutputStreamWriter");
var FileOutputStream = Java.type("java.io.FileOutputStream");
var StandardCharsets = Java.type("java.nio.charset.StandardCharsets");

var theView = $(selection).filter("archimate-diagram-model").first();
var isyfactlib = readDrawioLibraryJson(__DIR__ + "IsyFact.drawiolib.xml");

if (theView) {
    const fileName = window.promptSaveFile({
        title: `Draw.io filename for view ${theView.name}`,
        filterExtensions: ["*.drawio"],
        fileName: `${model.name}_${theView.name}_C4`,
    });

    if (fileName) {
        const date = new Date();
        const timeISOString = date.toISOString();
        var Charset = Java.type("java.nio.charset.Charset");
        console.log("Default charset: " + Charset.defaultCharset().name());

        var fw = new OutputStreamWriter(new FileOutputStream(fileName, false));
        const header = `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="" modified="${timeISOString}" agent="Archi" etag="${model.name}" type="device">
    <diagram id="${theView.id}" name="${escX(theView.name)}">
        <mxGraphModel dx="2302" dy="697" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169" math="0" shadow="0">
            <root>
                <mxCell id="0" />
                <mxCell id="1" parent="0" />
`;
        fw.write(header);

        mapElementsC4(fw, theView, "1");

        var footer = `			</root>
        </mxGraphModel>
    </diagram>
</mxfile>
`;
        fw.write(footer);
        fw.close();
        console.log("Done exporting view to draw.io (C4 shapes)");
    }
} else {
    console.log("No view selected");
}
