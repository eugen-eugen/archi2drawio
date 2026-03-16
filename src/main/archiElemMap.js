/**
 * archiElemMap.js
 * ArchiMate element/relationship to draw.io style mappings
 */

const strategyColor = "#F5DEAA";
const motivationColor = "#CCCCFF";
const businessColor = "#ffff99";
const applicationColor = "#99ffff";
const technologyColor = "#AFFFAF";
const physicalColor = "#AFFFAF";
const implementationColor = "#FFE0E0";
const implementationColorL = "#E0FFE0";
const groupingColor = "";
const locationColor = "#FFB973";
const junctionAndColor = "#000000";
const junctionOrColor = "#ffffff";

const archiElemMap = new Map([
    //   Archi type                   draw.io
    //   ---------------------------  ------------------

    // STRATEGY
    [
        "capability",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            strategyColor +
            ";shape=mxgraph.archimate3.application;appType=capability;archiType=rounded;",
    ],
    [
        "course-of-action",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            strategyColor +
            ";shape=mxgraph.archimate3.application;appType=course;archiType=rounded;",
    ],
    [
        "resource",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            strategyColor +
            ";shape=mxgraph.archimate3.application;appType=resource;archiType=square;",
    ],

    //MOTIVATION
    [
        "stakeholder",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            motivationColor +
            ";shape=mxgraph.archimate3.application;appType=role;archiType=oct;",
    ],
    [
        "driver",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            motivationColor +
            ";shape=mxgraph.archimate3.application;appType=driver;archiType=oct;",
    ],
    [
        "goal",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            motivationColor +
            ";shape=mxgraph.archimate3.application;appType=goal;archiType=oct;",
    ],
    ["meaning", "shape=cloud;html=1;whiteSpace=wrap;fillColor=" + motivationColor + ";"],
    [
        "outcome",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            motivationColor +
            ";shape=mxgraph.archimate3.application;appType=outcome;archiType=oct;",
    ],
    [
        "principle",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            motivationColor +
            ";shape=mxgraph.archimate3.application;appType=principle;archiType=oct;",
    ],
    [
        "requirement",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            motivationColor +
            ";shape=mxgraph.archimate3.application;appType=requirement;archiType=oct;",
    ],
    [
        "assessment",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            motivationColor +
            ";shape=mxgraph.archimate3.application;appType=assess;archiType=oct;",
    ],
    ["value", "shape=ellipse;html=1;whiteSpace=wrap;fillColor=" + motivationColor + ";perimeter=ellipsePerimeter;"],
    [
        "constraint",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            motivationColor +
            ";shape=mxgraph.archimate3.application;appType=constraint;archiType=oct;",
    ],
    //	["value-stream",              "NOTSUPPORTED",   motivationColor],  // not supported by draw.io at this time...

    // BUSINESS
    [
        "business-actor",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            businessColor +
            ";shape=mxgraph.archimate3.application;appType=actor;archiType=square;",
    ],
    [
        "business-collaboration",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            businessColor +
            ";shape=mxgraph.archimate3.application;appType=collab;archiType=square;",
    ],
    [
        "business-event",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            businessColor +
            ";shape=mxgraph.archimate3.application;appType=event;archiType=rounded;",
    ],
    [
        "business-function",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            businessColor +
            ";shape=mxgraph.archimate3.application;appType=func;archiType=rounded;",
    ],
    [
        "business-interaction",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            businessColor +
            ";shape=mxgraph.archimate3.application;appType=interaction;archiType=rounded;",
    ],
    [
        "business-interface",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            businessColor +
            ";shape=mxgraph.archimate3.application;appType=interface;archiType=square;",
    ],
    [
        "business-object",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            businessColor +
            ";shape=mxgraph.archimate3.businessObject;overflow=fill;",
    ],
    [
        "business-process",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            businessColor +
            ";shape=mxgraph.archimate3.application;appType=proc;archiType=rounded;",
    ],
    [
        "business-role",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            businessColor +
            ";shape=mxgraph.archimate3.application;appType=role;archiType=square;",
    ],
    [
        "business-service",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            businessColor +
            ";shape=mxgraph.archimate3.application;appType=serv;archiType=rounded;",
    ],
    [
        "product",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" + businessColor + ";shape=mxgraph.archimate3.product;",
    ],
    [
        "contract",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" + businessColor + ";shape=mxgraph.archimate3.contract;",
    ],
    [
        "representation",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            businessColor +
            ";shape=mxgraph.archimate3.representation;",
    ],

    //APPLICATION
    [
        "application-collaboration",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            applicationColor +
            ";shape=mxgraph.archimate3.application;appType=collab;archiType=square",
    ],
    [
        "application-component",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            applicationColor +
            ";shape=mxgraph.archimate3.application;appType=comp;archiType=square",
    ],
    [
        "application-event",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            applicationColor +
            ";shape=mxgraph.archimate3.application;appType=event;archiType=rounded",
    ],
    [
        "application-function",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            applicationColor +
            ";shape=mxgraph.archimate3.application;appType=func;archiType=rounded",
    ],
    [
        "application-interaction",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            applicationColor +
            ";shape=mxgraph.archimate3.application;appType=interaction;archiType=rounded",
    ],
    [
        "application-interface",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            applicationColor +
            ";shape=mxgraph.archimate3.application;appType=interface;archiType=square",
    ],
    [
        "application-process",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            applicationColor +
            ";shape=mxgraph.archimate3.application;appType=proc;archiType=rounded",
    ],
    [
        "application-service",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            applicationColor +
            ";shape=mxgraph.archimate3.application;appType=serv;archiType=rounded",
    ],
    [
        "data-object",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            applicationColor +
            ";shape=mxgraph.archimate3.businessObject;overflow=fill",
    ],

    //TECHNOLOGY
    [
        "artifact",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            technologyColor +
            ";shape=mxgraph.archimate3.application;appType=artifact;archiType=square;",
    ],
    [
        "communication-network",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            technologyColor +
            ";shape=mxgraph.archimate3.application;appType=netw;archiType=square;",
    ],
    [
        "device",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" + technologyColor + ";shape=mxgraph.archimate3.device;",
    ],
    [
        "system-software",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            technologyColor +
            ";shape=mxgraph.archimate3.application;appType=sysSw;archiType=square;",
    ],
    [
        "technology-collaboration",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            technologyColor +
            ";shape=mxgraph.archimate3.application;appType=collab;archiType=square;",
    ],
    [
        "technology-event",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            technologyColor +
            ";shape=mxgraph.archimate3.application;appType=event;archiType=rounded",
    ],
    [
        "technology-function",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            technologyColor +
            ";shape=mxgraph.archimate3.application;appType=func;archiType=rounded;",
    ],
    [
        "technology-interaction",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            technologyColor +
            ";shape=mxgraph.archimate3.application;appType=interaction;archiType=rounded;",
    ],
    [
        "technology-interface",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            technologyColor +
            ";shape=mxgraph.archimate3.application;appType=interface;archiType=square;",
    ],
    [
        "technology-process",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            technologyColor +
            ";shape=mxgraph.archimate3.application;appType=proc;archiType=rounded;",
    ],
    [
        "technology-service",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            technologyColor +
            ";shape=mxgraph.archimate3.application;appType=serv;archiType=rounded",
    ],
    [
        "node",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" + technologyColor + ";shape=mxgraph.archimate3.node;",
    ],
    [
        "path",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            technologyColor +
            ";shape=mxgraph.archimate3.application;appType=path;archiType=square;",
    ],

    //PHYSICAL
    [
        "distribution-network",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            physicalColor +
            ";shape=mxgraph.archimate3.application;appType=distribution;archiType=square;",
    ],
    [
        "equipment",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            physicalColor +
            ";shape=mxgraph.archimate3.tech;techType=equipment;",
    ],
    [
        "facility",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            physicalColor +
            ";shape=mxgraph.archimate3.tech;techType=facility;",
    ],
    [
        "material",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            physicalColor +
            ";shape=mxgraph.archimate3.application;appType=material;archiType=square;",
    ],

    //IMPLEMENTATION
    [
        "deliverable",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            implementationColor +
            ";shape=mxgraph.archimate3.deliverable;",
    ],
    [
        "work-package",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            implementationColor +
            ";shape=mxgraph.archimate3.application;archiType=rounded;",
    ],
    [
        "gap",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" + implementationColorL + ";shape=mxgraph.archimate3.gap;",
    ],
    [
        "plateau",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            implementationColorL +
            ";shape=mxgraph.archimate3.tech;techType=plateau;",
    ],
    [
        "implementation-event",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            implementationColor +
            ";shape=mxgraph.archimate3.application;appType=event;archiType=rounded;",
    ],

    //COMPOSITE
    [
        "location",
        "html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            locationColor +
            ";shape=mxgraph.archimate3.application;appType=location;archiType=square;",
    ],
    [
        "grouping",
        "mxgraph.archimate3.application;appType=grouping;spacingTop=10;tabWidth=100;tabHeight=25;tabPosition=left;html=1;dashed=1;",
    ],

    //JUNCTION
    [
        "junction_and",
        "ellipse;html=1;verticalLabelPosition=bottom;labelBackgroundColor=" +
            junctionAndColor +
            ";verticalAlign=top;fillColor=strokeColor",
    ],
    [
        "junction_or",
        "ellipse;html=1;verticalLabelPosition=bottom;labelBackgroundColor=" +
            junctionOrColor +
            ";verticalAlign=top;fillColor=" +
            junctionOrColor,
    ],

    //VISUAL
    ["diagram-model-group", "rounded=0;whiteSpace=wrap;html=1;"],
    ["diagram-model-note_dogear", "shape=card;whiteSpace=wrap;html=1;direction=west;"],
    ["diagram-model-note_rect", "rounded=0;whiteSpace=wrap;html=1;"],
    ["diagram-model-note_none", "rounded=0;whiteSpace=wrap;html=1;strokeColor=none;"],
]);

const archiRelMap = new Map([
    //   Archi type                   draw.io
    //   ---------------------------  ------------------
    ["access-relationship", "html=1;endArrow=none;elbow=vertical;dashed=1;startFill=0;dashPattern=1 4;rounded=0;"],
    [
        "access-relationship_read",
        "html=1;startArrow=open;endArrow=none;elbow=vertical;startFill=0;dashed=1;dashPattern=1 4;rounded=0;",
    ], //verificar!
    ["access-relationship_write", "html=1;endArrow=open;elbow=vertical;endFill=0;dashed=1;dashPattern=1 4;rounded=0;"], //verificar!
    [
        "access-relationship_readwrite",
        "html=1;endArrow=open;elbow=vertical;endFill=0;dashed=1;startArrow=open;startFill=0;dashPattern=1 4;rounded=0;",
    ],
    [
        "aggregation-relationship",
        "html=1;startArrow=diamondThin;startFill=0;elbow=vertical;startSize=10;endArrow=none;rounded=0;",
    ],
    [
        "assignment-relationship",
        "endArrow=block;html=1;endFill=1;startArrow=oval;startFill=1;elbow=vertical;rounded=0;",
    ],
    ["association-relationship", "html=1;endArrow=none;elbow=vertical;rounded=0;"],
    [
        "composition-relationship",
        "html=1;startArrow=diamondThin;startFill=1;elbow=vertical;startSize=10;endArrow=none;rounded=0;",
    ],
    ["flow-relationship", "html=1;endArrow=block;dashed=1;elbow=vertical;endFill=1;dashPattern=6 4;rounded=0;"],
    ["influence-relationship", ""],
    ["realization-relationship", "html=1;endArrow=block;elbow=vertical;endFill=0;dashed=1;rounded=0;"],
    ["serving-relationship", "html=1;endArrow=open;elbow=vertical;endFill=1;rounded=0;"],
    ["specialization-relationship", "endArrow=block;html=1;endFill=0;elbow=vertical;rounded=0;"],
    ["triggering-relationship", "html=1;endArrow=block;dashed=0;elbow=vertical;endFill=1;rounded=0;"],

    //VISUAL
    ["diagram-model-connection", "html=1;endArrow=none;elbow=vertical;rounded=0;"],
]);

const styleAlign = new Map([
    [1, "left"],
    [2, "center"],
    [4, "right"],
]);

const stylePosition = new Map([
    [0, "top"],
    [1, "middle"],
    [2, "bottom"],
]);

const styleFontStyle = new Map([
    ["normal", 0],
    ["bold", 1],
    ["italic", 2],
    ["bolditalic", 3],
]);

module.exports = { archiElemMap, archiRelMap, styleAlign, stylePosition, styleFontStyle };
