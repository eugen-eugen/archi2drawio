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
const {
  getAbsoluteBendpoints,
  escX
} = require('./todrawio-isyfact-functions.js');



const {
  readDrawioLibraryJson
} = require('./todrawio-isyfact-isyfactlib.js');

const {
    c4ElemMap,
} = require('./constants.js');

const { mapElementsC4 } = require('./mapElementsC4.js');


const routeConnections = true;


//*****************************************************************************
// Utility functions (escX, getAbsoluteBendpoints, etc.) remain unchanged
//*****************************************************************************

/*
 * Author: Pedro Duque
 * Version: 0.2
 * Date: 2022-12-19
 *
 * PURPOSE:
 * This script exports an Archimate view to imported into draw.io (aka diagrams.net).
 *
 * USAGE:
 * - Select a view in Archi
 * - Export the view into the selected file
 * - Open or import the file in Draw.io
 * - Adjust as necessary
 *
 * NOTES:
 * - Nested shapes will have their relationships represented as transparent lines!
 * - properties names will be curated: spaces converted to _
 * - Doesn't support duplicated properties
 *
 * LIMITATIONS:
 * - Relationships routing in Archi doesn't reflect on draw.io 100%
 * - No support for specialization
 * - Some shapes not supported
 * - No support for labels
 * 
 * TODO's:
 * - All alternative shapes support
 * - Better error/exception handling
 * - automate the import process
 * 
 * CREDITS AND INSPIRATION:
 * smileham / Export View to Markdown (https://gist.github.com/smileham/578bbbb88dc0ed5a1403f3b98711ec25)
 * christhearchitect / ImportDrawio (https://gist.github.com/christhearchitect/ee35ab560d2d42773a5a982b5e240452)
 * xmayeur / jArchi library with functions to manage relationship layout in views (https://gist.github.com/xmayeur/bbe80af3d09706b34848b4bbfaa71103)
 *
 * CHANGE LOG:
 * - v0.2: support for utf8, bendpoints, custom shape styles and format.
 * - v0.1: initial version
 */

//*****************************************************************************
// CONFIGURATION
//*****************************************************************************

const useAlternativeShapes=false;  //if true the script will be sensible to alternative shapes defined. Otherwise it will use the default shape.




const styleAlign = new Map ([
		[1, 'left'],
		[2, 'center'],
		[4, 'right'] 
]);

const stylePosition = new Map ([
		[0, 'top'],
		[1, 'middle'],
		[2, 'bottom'] 
]);

const styleFontStyle = new Map ([
		["normal", 0],
		["bold", 1],
		["italic", 2],
		["bolditalic", 3] 
]);

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
    var theXML="";
	propNames=[];
    for (var i=0; i<theProperties.length;i++){
		if (propNames.includes(theProperties[i])) {
			propName=theProperties[i].replace(/ /g, "_").replace(/\n/g,"").replace(/\r/g,"");
			propValue=escX(element.prop(theProperties[i]))
			theXML+=` ${propName}="${propValue}"`;
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

function handleType(e) {
	var type;
	switch (e.type) {
		case "access-relationship":
			switch (e.concept.accessType) {
				case "access":
					type="access-relationship";
					break;
				case "read":
					type="access-relationship_read";
					break;
				case "write":
					type="access-relationship_write";
					break;
				case "readwrite":
					type="access-relationship_readwrite";
					break;
			}
			break;
		case "junction":
			switch (e.concept.junctionType) {
				case "and":
					type="junction_and";
					break;
				case "or":
					type="junction_or";
					break;
			}
			break;
		default:
			type=e.type;
			break;
	}
	return type;
}

//*****************************************************************************
//
// modify the style string by replacing or adding a new property and its value
// to it.
//
//*****************************************************************************

function handleStyle(style, name, newValue) {
	if (style.includes(name+"=")) {
		return style.replace(new RegExp(`;${name}=[^;]*;`),`;${name}=${newValue};`);
	} else {
		return style+`${name}=${newValue};`;
	}
}

//*****************************************************************************
//
// If alternative shapes are defined, use them. Otherwise use default shapes.
//
//*****************************************************************************

function handleAlternativeShapes(e,style) {
	if (e.figureType==1) {
		switch (e.type) {
			case "business-actor":
				style=handleStyle(style,"shape","mxgraph.archimate3.actor");
				break;
		}
		return style;
	}
}

//*****************************************************************************
//
// Copy the shape custom styles to the style string
//
//*****************************************************************************

function copyStyle(e, style) {
	if (e.fillColor!==null) {
		style=handleStyle(style, "fillColor", e.fillColor);
	}
	if (e.fontColor !==null) {
		style=handleStyle(style, "fontColor", e.fontColor);
	}
	if (e.fontName !==null) {
		style=handleStyle(style, "fontFamily", e.fontName); //Probably wrong
	}
	if (e.fontSize !==null) {
		style=handleStyle(style, "fontSize", e.fontSize);
	}
	if (e.fontStyle !==null) {
		style=handleStyle(style, "fontStyle", styleFontStyle.get(e.fontStyle));
	}
	if (e.lineColor !==null) {
		style=handleStyle(style, "strokeColor", e.lineColor);
	}	
	if (e.textAlignment !==null) {
		style=handleStyle(style, "align", styleAlign.get(e.textAlignment));
	}
	if (e.textPosition !==null) {
		style=handleStyle(style, "verticalAlign", stylePosition.get(e.textPosition));
	}
	if (useAlternativeShapes) {
		style=handleAlternativeShapes(e,style);
	}
	return style;
}

//*****************************************************************************
//
// Handle Bendpoint coordinates, Entry and Exit points
//
//*****************************************************************************
function getAbsCoords(e) {
	let coords={ x:e.bounds.x, y:e.bounds.y, w:e.bounds.width, h:e.bounds.height };
	let ancestors=$(e).parents();
	ancestors.forEach(p => {
		//This validation is not correct. It should be an easier way to check if its a shape!
		if (typeof c4ElemMap.get(handleType(p))!=='undefined' && p.bounds) {
			coords.x += p.bounds.x;
			coords.y += p.bounds.y;
		}
	});
	return coords;
}


function handleEntryExit(e) {
    let result = { exit: "", entry: "" };
    if (e.getRelativeBendpoints().length > 0 && typeof e.source.bounds !== 'undefined' && typeof e.target.bounds != 'undefined') {
        let bps = getAbsoluteBendpoints(e);

        let s = getAbsCoords(e.source);
        let exitX, exitY, entryX, entryY;

        if (bps[0].x <= s.x) {
            exitX = 0;
        } else if (s.x + s.w <= bps[0].x) {
            exitX = 1;
        } else {
            exitX = 1.0 * (bps[0].x - s.x) / s.w;
        }
        if (bps[0].y <= s.y) {
            exitY = 0;
        } else if (s.y + s.h <= bps[0].y) {
            exitY = 1;
        } else {
            exitY = 1.0 * (bps[0].y - s.y) / s.h;
        }

        let t = getAbsCoords(e.target);
        let n = bps.length - 1;
        if (bps[n].x <= t.x) {
            entryX = 0;
        } else if (t.x + t.w <= bps[n].x) {
            entryX = 1;
        } else {
            entryX = (bps[n].x - t.x) / t.w;
        }
        if (bps[n].y <= t.y) {
            entryY = 0;
        } else if (t.y + t.h <= bps[n].y) {
            entryY = 1;
        } else {
            entryY = (bps[n].y - t.y) / t.h;
        }

        result.exit = `exitX=${exitX};exitY=${exitY};`;
        result.entry = `entryX=${entryX};entryY=${entryY};`;
    }
    return result;
}


// **********************************************************************
// Main flow (C4 version)
// ********************************************************************** 
 
console.log("Starting to export view to draw.io (C4 shapes)");
const archiPrefs = Java.type('com.archimatetool.editor.ArchiPlugin').PREFERENCES;
console.log("Default color for Application Component: " + archiPrefs.getString('folderColour_Business'));


var OutputStreamWriter = Java.type("java.io.OutputStreamWriter");
var FileOutputStream = Java.type("java.io.FileOutputStream");
var StandardCharsets = Java.type("java.nio.charset.StandardCharsets");

var theView = $(selection).filter("archimate-diagram-model").first();
var isyfactlib = readDrawioLibraryJson(__DIR__+'IsyFact.drawiolib.xml');
console.log("IsyFact library loaded"+" ("+isyfactlib.length+" elements)");



if (theView) {

    const fileName = window.promptSaveFile({
        title: `Draw.io filename for view ${theView.name}`,
        filterExtensions: ["*.drawio"],
        fileName: `${model.name}_${theView.name}_C4`,
    });
  
    if(fileName) {
        const date = new Date();
        const timeISOString = date.toISOString();
        
        var fw = new OutputStreamWriter(new FileOutputStream(fileName, false), StandardCharsets.UTF_8);
        const header = 
`<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="" modified="${timeISOString}" agent="Archi" etag="${model.name}" type="device">
    <diagram id="${theView.id}" name="${escX(theView.name)}">
        <mxGraphModel dx="2302" dy="697" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169" math="0" shadow="0">
            <root>
                <mxCell id="0" />
                <mxCell id="1" parent="0" />
`;
        fw.write(header);

        mapElementsC4(fw, theView, "1");

        var footer =
`			</root>
        </mxGraphModel>
    </diagram>
</mxfile>
`;
        fw.write(footer)
        fw.close();
        console.log("Done exporting view to draw.io (C4 shapes)");
    }

} else {
    console.log("No view selected")
}