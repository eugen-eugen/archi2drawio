const {
    addFontSizeToStyle,
    escX,
    effectiveFillColor,
    effectiveFontColor,
    handleBendPoints,
    createConnector,
    getAbsoluteBendpoints,
    getDiagramBoundaries,
    getBoundaryLabelPosition,
    getPortPosition,
    getAbsBounds,
    portName,
} = require("./todrawio-isyfact-functions.js");

const { createIsyFactElement, createC4Element, createLinkWrapper } = require("./todrawio-isyfact-elements.js");

const { c4ElemMap, c4TypeMap, c4RelMap } = require("./constants.js");
const { createConnectorWithTopic } = require("./todrawio-connectors.js");

const routeConnections = true;

//*****************************************************************************
//
// Handle Bendpoint coordinates, Entry and Exit points
//
//*****************************************************************************
function getAbsCoords(e) {
    let coords = { x: e.bounds.x, y: e.bounds.y, w: e.bounds.width, h: e.bounds.height };
    let ancestors = $(e).parents();
    ancestors.forEach((p) => {
        //This validation is not correct. It should be an easier way to check if its a shape!
        if (typeof c4ElemMap.get(handleType(p)) !== "undefined" && p.bounds) {
            coords.x += p.bounds.x;
            coords.y += p.bounds.y;
        }
    });
    return coords;
}

function handleEntryExit(e) {
    let result = { exit: "", entry: "" };
    if (
        e.getRelativeBendpoints().length > 0 &&
        typeof e.source.bounds !== "undefined" &&
        typeof e.target.bounds != "undefined"
    ) {
        let bps = getAbsoluteBendpoints(e);

        let s = getAbsCoords(e.source);
        let exitX, exitY, entryX, entryY;

        if (bps[0].x <= s.x) {
            exitX = 0;
        } else if (s.x + s.w <= bps[0].x) {
            exitX = 1;
        } else {
            exitX = (1.0 * (bps[0].x - s.x)) / s.w;
        }
        if (bps[0].y <= s.y) {
            exitY = 0;
        } else if (s.y + s.h <= bps[0].y) {
            exitY = 1;
        } else {
            exitY = (1.0 * (bps[0].y - s.y)) / s.h;
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

function handleType(e) {
    let type;
    switch (e.type) {
        case "access-relationship":
            switch (e.concept.accessType) {
                case "access":
                    type = "access-relationship";
                    break;
                case "read":
                    type = "access-relationship_read";
                    break;
                case "write":
                    type = "access-relationship_write";
                    break;
                case "readwrite":
                    type = "access-relationship_readwrite";
                    break;
            }
            break;
        case "junction":
            switch (e.concept.junctionType) {
                case "and":
                    type = "junction_and";
                    break;
                case "or":
                    type = "junction_or";
                    break;
            }
            break;
        default:
            type = e.type;
            break;
    }
    return type;
}

function mappingType(e) {
    const types = new Set();
    $(e)
        .parents()
        .each((p) => {
            console.log("parent: ", p);
            const newLocal = p.prop("mappingType", true);
            newLocal && types.add(...newLocal);
        });

    if (types.size === 0) {
        return undefined;
    } else if (types.size === 1) {
        return Array.from(types)[0];
    } else {
        throw new Error(
            "Conflicting mappingType values found in ancestors: (" + types.size + ")" + Array.from(types).join(", ")
        );
    }
}
function mapElementsC4(fw, element, diagram) {
    $(element)
        .children()
        .each(function (child) {
            parentId = element.id;

            let c4Name = escX(
                child.label && child.label.trim() !== "" ? child.label : child.text ? child.text : child.name || ""
            );
            let c4Description = escX(child.documentation || "");
            let archiType = handleType(child);

            // Check if parent element has property "port"
            let port = portName(child, c4Name);
            let bounds = child.bounds;
            let c4Type, baseStyle;
            if (port) {
                c4Type = "port";
                baseStyle = c4ElemMap.get("port");
                bounds = bounds4Port(getDiagramBoundaries($(diagram)), child);
            } else {
                // Determine c4Type: use property if present, else from map, else default
                mType = mappingType(child);
                c4Type =
                    mType !== "if" &&
                    typeof child.prop === "function" &&
                    child.prop("c4Type") &&
                    child.prop("c4Type").trim() !== ""
                        ? child.prop("c4Type")
                        : c4TypeMap.get(archiType) || c4TypeMap.get("default");

                // If c4Type is set, try to use it to lookup in c4ElemMap first
                baseStyle =
                    typeof c4ElemMap.get(c4Type) !== "undefined"
                        ? c4ElemMap.get(c4Type)
                        : c4ElemMap.get(archiType) || c4ElemMap.get("default");
            }

            // --- Add link attribute if present ---
            let linkValue = "";
            let shift = { x: 0, y: 0 };
            let hasLink = false;
            linkWrapper = undefined;
            linkValue = child.prop("link");

            if (linkValue && linkValue.trim() !== "") {
                hasLink = true;
                wrappedId = child.id + "_linkwrapper";
                shift = { x: bounds.x, y: bounds.y };
                linkWrapper = createLinkWrapper(wrappedId, parentId, bounds, linkValue);
                parentId = wrappedId;
            }
            //*** Map shapes ***
            drawioObj = "";
            if (child.prop("ifType") && !port) {
                drawioObj = createIsyFactElement(child.id, c4Name, c4Description, parentId, child, bounds, shift);
            } else if (typeof baseStyle !== "undefined") {
                drawioObj = createC4Element(child.id, c4Name, c4Type, c4Description, parentId, child, bounds, shift);
            } else {
                //*** Map relationships ***
                let relStyle = c4RelMap.get(archiType) || c4RelMap.get("default");
                console.log("archiType: ", archiType);
                if (typeof relStyle !== "undefined") {
                    let entryExit = routeConnections ? handleEntryExit(child) : null;
                    // Check for "topic" property
                    let topic = typeof child.prop === "function" && child.prop("topic") && child.prop("topic").trim();
                    if (topic) {
                        drawioObj = createConnectorWithTopic(
                            mappingType(child.source),
                            topic,
                            child.id,
                            c4Name,
                            c4Type,
                            c4Description,
                            relStyle,
                            parentId,
                            child,
                            entryExit,
                            fw
                        );
                    } else {
                        let bendPoints = routeConnections ? handleBendPoints(child) : "";
                        drawioObj = createConnector(
                            child.id,
                            c4Name,
                            c4Type,
                            c4Description,
                            relStyle,
                            parentId,
                            child,
                            entryExit,
                            bendPoints
                        );
                    }
                } else {
                }
            }
            portLabel = "";

            if (port) {
                diagramBoundaries = getDiagramBoundaries($(diagram));
                const labelWidth = 100;
                const labelHeight = 50;
                boundaryLabelPosition = getBoundaryLabelPosition(
                    diagramBoundaries,
                    getAbsBounds(bounds, child),
                    labelWidth,
                    labelHeight
                );

                portLabel = `<mxCell id="${child.id}-label" value="${
                    portName(child, c4Name) || c4Name
                }" style="text;strokeColor=none;align=center;fillColor=none;html=1;verticalAlign=middle;whiteSpace=wrap;rounded=0;" vertex="1" parent="${
                    diagram.id
                }">
                <mxGeometry x="${boundaryLabelPosition.x}" y="${
                    boundaryLabelPosition.y
                }" width="${labelWidth}" height="${labelHeight}" as="geometry" /></mxCell>
                `;
            }
            linkWrapper && fw.write(linkWrapper.groupObj);
            fw.write(drawioObj);
            linkWrapper && fw.write(linkWrapper.linkIconObj);
            portLabel && fw.write(portLabel);

            // Recursively process children
            mapElementsC4(fw, child, diagram);
        });
}

function bounds4Port(diagramBoundaries, port) {
    let newBounds = { x: 0, y: 0, width: 30, height: 30 };
    portPosition = getPortPosition(diagramBoundaries, { width: newBounds.width, height: newBounds.height }, port);
    newBounds.x = portPosition.x;
    newBounds.y = portPosition.y;
    return newBounds;
}

module.exports = { mapElementsC4 };
