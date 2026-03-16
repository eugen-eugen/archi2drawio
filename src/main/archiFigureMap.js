/**
 * archiFigureMap.js
 * ArchiMate figure shapes (figureType === 1) mapped to draw.io styles.
 *
 * When an element has figureType === 1, these dedicated shapes are used
 * instead of the generic rectangular shapes from archiElemMap.
 */

const strategyColor = "#F5DEAA";
const motivationColor = "#CCCCFF";
const businessColor = "#ffff99";
const applicationColor = "#99ffff";
const technologyColor = "#AFFFAF";
const physicalColor = "#AFFFAF";
const implementationColor = "#FFE0E0";
const implementationColorL = "#E0FFE0";
const locationColor = "#FFB973";

const archiFigureMap = new Map([
    // STRATEGY
    [
        "capability",
        "shape=mxgraph.archimate3.capability;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" + strategyColor + ";",
    ],
    [
        "course-of-action",
        "shape=mxgraph.archimate3.courseOfAction;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            strategyColor +
            ";",
    ],
    [
        "resource",
        "shape=mxgraph.archimate3.resource;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" + strategyColor + ";",
    ],

    // MOTIVATION
    [
        "stakeholder",
        "shape=mxgraph.archimate3.role;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" + motivationColor + ";",
    ],
    [
        "driver",
        "shape=mxgraph.archimate3.driver;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" + motivationColor + ";",
    ],
    [
        "goal",
        "shape=mxgraph.archimate3.goal;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" + motivationColor + ";",
    ],
    [
        "outcome",
        "shape=mxgraph.archimate3.outcome;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" + motivationColor + ";",
    ],
    [
        "principle",
        "shape=mxgraph.archimate3.principle;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" + motivationColor + ";",
    ],
    [
        "requirement",
        "shape=mxgraph.archimate3.requirement;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            motivationColor +
            ";",
    ],
    [
        "assessment",
        "shape=mxgraph.archimate3.assessment;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            motivationColor +
            ";",
    ],
    [
        "constraint",
        "shape=mxgraph.archimate3.constraint;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            motivationColor +
            ";",
    ],

    // BUSINESS
    [
        "business-actor",
        "shape=mxgraph.archimate3.actor;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" + businessColor + ";",
    ],
    [
        "business-collaboration",
        "shape=mxgraph.archimate3.collaboration;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            businessColor +
            ";",
    ],
    [
        "business-event",
        "shape=mxgraph.archimate3.event;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" + businessColor + ";",
    ],
    [
        "business-function",
        "shape=mxgraph.archimate3.function;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" + businessColor + ";",
    ],
    [
        "business-interaction",
        "shape=mxgraph.archimate3.interaction;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" + businessColor + ";",
    ],
    [
        "business-interface",
        "shape=mxgraph.archimate3.interface;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" + businessColor + ";",
    ],
    [
        "business-object",
        "shape=mxgraph.archimate3.businessObject;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            businessColor +
            ";overflow=fill;",
    ],
    [
        "business-process",
        "shape=mxgraph.archimate3.process;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" + businessColor + ";",
    ],
    [
        "business-role",
        "shape=mxgraph.archimate3.role;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" + businessColor + ";",
    ],
    [
        "business-service",
        "shape=mxgraph.archimate3.service;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" + businessColor + ";",
    ],
    [
        "product",
        "shape=mxgraph.archimate3.product;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" + businessColor + ";",
    ],
    [
        "contract",
        "shape=mxgraph.archimate3.contract;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" + businessColor + ";",
    ],
    [
        "representation",
        "shape=mxgraph.archimate3.representation;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            businessColor +
            ";",
    ],

    // APPLICATION
    [
        "application-collaboration",
        "shape=mxgraph.archimate3.collaboration;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            applicationColor +
            ";",
    ],
    [
        "application-component",
        "shape=mxgraph.archimate3.component;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            applicationColor +
            ";",
    ],
    [
        "application-event",
        "shape=mxgraph.archimate3.event;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" + applicationColor + ";",
    ],
    [
        "application-function",
        "shape=mxgraph.archimate3.function;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" + applicationColor + ";",
    ],
    [
        "application-interaction",
        "shape=mxgraph.archimate3.interaction;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            applicationColor +
            ";",
    ],
    [
        "application-interface",
        "shape=mxgraph.archimate3.interface;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            applicationColor +
            ";",
    ],
    [
        "application-process",
        "shape=mxgraph.archimate3.process;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" + applicationColor + ";",
    ],
    [
        "application-service",
        "shape=mxgraph.archimate3.service;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" + applicationColor + ";",
    ],
    [
        "data-object",
        "shape=mxgraph.archimate3.businessObject;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            applicationColor +
            ";overflow=fill;",
    ],

    // TECHNOLOGY
    [
        "artifact",
        "shape=mxgraph.archimate3.artifact;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" + technologyColor + ";",
    ],
    [
        "communication-network",
        "shape=mxgraph.archimate3.network;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" + technologyColor + ";",
    ],
    [
        "device",
        "shape=mxgraph.archimate3.device;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" + technologyColor + ";",
    ],
    [
        "system-software",
        "shape=mxgraph.archimate3.systemSoftware;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            technologyColor +
            ";",
    ],
    [
        "technology-collaboration",
        "shape=mxgraph.archimate3.collaboration;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            technologyColor +
            ";",
    ],
    [
        "technology-event",
        "shape=mxgraph.archimate3.event;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" + technologyColor + ";",
    ],
    [
        "technology-function",
        "shape=mxgraph.archimate3.function;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" + technologyColor + ";",
    ],
    [
        "technology-interaction",
        "shape=mxgraph.archimate3.interaction;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            technologyColor +
            ";",
    ],
    [
        "technology-interface",
        "shape=mxgraph.archimate3.interface;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" + technologyColor + ";",
    ],
    [
        "technology-process",
        "shape=mxgraph.archimate3.process;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" + technologyColor + ";",
    ],
    [
        "technology-service",
        "shape=mxgraph.archimate3.service;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" + technologyColor + ";",
    ],
    [
        "node",
        "shape=mxgraph.archimate3.node;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" + technologyColor + ";",
    ],
    [
        "path",
        "shape=mxgraph.archimate3.path;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" + technologyColor + ";",
    ],

    // PHYSICAL
    [
        "distribution-network",
        "shape=mxgraph.archimate3.distribution;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            physicalColor +
            ";",
    ],
    [
        "equipment",
        "shape=mxgraph.archimate3.equipment;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" + physicalColor + ";",
    ],
    [
        "facility",
        "shape=mxgraph.archimate3.facility;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" + physicalColor + ";",
    ],
    [
        "material",
        "shape=mxgraph.archimate3.material;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" + physicalColor + ";",
    ],

    // IMPLEMENTATION
    [
        "deliverable",
        "shape=mxgraph.archimate3.deliverable;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            implementationColor +
            ";",
    ],
    [
        "work-package",
        "shape=mxgraph.archimate3.workPackage;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            implementationColor +
            ";",
    ],
    [
        "gap",
        "shape=mxgraph.archimate3.gap;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" + implementationColorL + ";",
    ],
    [
        "plateau",
        "shape=mxgraph.archimate3.plateau;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" +
            implementationColorL +
            ";",
    ],
    [
        "implementation-event",
        "shape=mxgraph.archimate3.event;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" + implementationColor + ";",
    ],

    // COMPOSITE
    [
        "location",
        "shape=mxgraph.archimate3.location;html=1;outlineConnect=0;whiteSpace=wrap;fillColor=" + locationColor + ";",
    ],
]);

module.exports = { archiFigureMap };
