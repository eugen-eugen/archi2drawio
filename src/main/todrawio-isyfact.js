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
const { escX, getDiagramBoundaries } = require("./todrawio-isyfact-functions.js");

const { readDrawioLibraryJson } = require("./todrawio-isyfact-isyfactlib.js");

const { c4ElemMap } = require("./constants.js");

const { buildDiagramXml } = require("./todrawio-isyfact-diagram.js");

const { getParameter } = require("./params.js");

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

var theViews = $(selection).filter("archimate-diagram-model");

if (theViews.size() === 0) {
    theViews = $("archimate-diagram-model").filter(function (v) {
        return typeof v.prop === "function" && v.prop("Drawio:View:Tag") === "publish";
    });
}

if (theViews.size() > 0) {
    const defaultFileName = theViews.size() === 1 ? `${model.name}_${theViews.first().name}_C4` : model.name;

    const paramFile = getParameter("drawioOutputFile");
    const fileName =
        paramFile ||
        window.promptSaveFile({
            title: `Draw.io filename for ${theViews.size()} view(s)`,
            filterExtensions: ["*.drawio"],
            fileName: defaultFileName,
        });

    if (fileName) {
        const date = new Date();
        const timeISOString = date.toISOString();

        var fw = new OutputStreamWriter(new FileOutputStream(fileName, false));
        const header = `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="" modified="${timeISOString}" agent="Archi" etag="${model.name}" type="device">
`;
        fw.write(header);

        theViews.each(function (view) {
            buildDiagramXml(fw, view);
        });

        var footer = `</mxfile>
`;
        fw.write(footer);
        fw.close();
        console.log(`Done exporting ${theViews.size()} view(s) to draw.io (C4 shapes)`);
    }
} else {
    console.log("No view selected");
}
