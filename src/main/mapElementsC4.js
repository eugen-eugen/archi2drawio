const {
    addFontSizeToStyle,
    escX,
    effectiveFillColor,
    effectiveFontColor,
    handleBendPoints,
    createConnectorWithTopic,
    createConnector,
    getAbsoluteBendpoints,
    getDiagramBoundaries,
    getBoundaryLabelPosition,
    getAbsBounds,
} = require("./todrawio-isyfact-functions.js");

const {
    createElementWithLink,
    createIsyFactElement,
    createElementWithoutLink,
} = require("./todrawio-isyfact-elements.js");

const { c4ElemMap, c4TypeMap, c4RelMap } = require("./constants.js");

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
    const parents = $(e).parents();
    const values = parents.prop("mappingType", true);
    if (values === null) return undefined;
    console.log("values ", values);
    const types = new Set(values);

    if (types.size === 0) {
        return undefined;
    } else if (types.size === 1) {
        return Array.from(types)[0];
    } else {
        throw new Error("Conflicting mappingType values found in ancestors: " + Array.from(types).join(", "));
    }
}
function mapElementsC4(fw, element, parent, diagram) {
    $(element)
        .children()
        .each(function (e) {
            let parentElements = $(e).parent();

            let newId = e.id;
            let c4Name = escX(e.label && e.label.trim() !== "" ? e.label : e.text ? e.text : e.name || "");
            let c4Description = escX(e.documentation || "");
            let archiType = handleType(e);

            // Check if parent element has property "port"
            let parentHasPort = false;
            parentElements.each(function (p) {
                if (typeof p.prop === "function" && p.prop().includes("port")) {
                    console.log("Element is port: " + e);
                    parentHasPort = true;
                    portName = p.prop("port") || c4Name;
                    c4Name = "";
                    return false; // Break the loop
                }
            });

            let c4Type, baseStyle;
            if (parentHasPort) {
                c4Type = "port";
                baseStyle = c4ElemMap.get("port");
            } else {
                // Determine c4Type: use property if present, else from map, else default
                mType = mappingType(e);
                c4Type =
                    mType !== "if" && typeof e.prop === "function" && e.prop("c4Type") && e.prop("c4Type").trim() !== ""
                        ? e.prop("c4Type")
                        : c4TypeMap.get(archiType) || c4TypeMap.get("default");

                // If c4Type is set, try to use it to lookup in c4ElemMap first
                baseStyle =
                    typeof c4ElemMap.get(c4Type) !== "undefined"
                        ? c4ElemMap.get(c4Type)
                        : c4ElemMap.get(archiType) || c4ElemMap.get("default");
            }
            let style = baseStyle;

            // --- If template does not contain fontColor/fillColor, use Archi element color ---
            var fontColor = effectiveFontColor(e);
            if (!/fontColor=/.test(baseStyle)) {
                style += `fontColor=${fontColor};`;
            }
            if (!/fillColor=/.test(baseStyle)) {
                style += `fillColor=${effectiveFillColor(e)};`;
            }

            // --- Add opacity if present ---
            if (typeof e.opacity !== "undefined" && e.opacity !== null) {
                let opacity = Math.round((e.opacity / 255) * 100);
                style = style + `opacity=${opacity};`;
            }

            // --- Add fontSize based on element size ---
            style = addFontSizeToStyle(style, e);

            // --- Add link attribute if present ---
            let linkValue = "";
            let hasLink = false;
            if (typeof e.prop === "function") {
                linkValue = e.prop("link");
                if (linkValue && linkValue.trim() !== "") {
                    hasLink = true;
                }
            }
            //*** Map shapes ***

            if (e.prop("ifType")) {
                createIsyFactElement(newId, c4Name, c4Description, parent, e, fw);
            } else if (typeof baseStyle !== "undefined") {
                if (hasLink) {
                    createElementWithLink(newId, c4Name, c4Type, c4Description, style, parent, e, linkValue, fw);
                } else {
                    createElementWithoutLink(newId, c4Name, c4Type, c4Description, style, parent, e, fw);
                }
            } else {
                //*** Map relationships ***
                let relStyle = c4RelMap.get(archiType) || c4RelMap.get("default");
                if (typeof relStyle !== "undefined") {
                    let entryExit = routeConnections ? handleEntryExit(e) : null;
                    // Check for "topic" property
                    let topic = typeof e.prop === "function" && e.prop("topic") && e.prop("topic").trim();
                    if (topic) {
                        createConnectorWithTopic(
                            topic,
                            newId,
                            c4Name,
                            c4Type,
                            c4Description,
                            relStyle,
                            parent,
                            e,
                            entryExit,
                            fw
                        );
                    } else {
                        let bendPoints = routeConnections ? handleBendPoints(e) : "";
                        createConnector(
                            newId,
                            c4Name,
                            c4Type,
                            c4Description,
                            relStyle,
                            parent,
                            e,
                            entryExit,
                            bendPoints,
                            fw
                        );
                    }
                } else {
                    console.log("Not Found: " + e.id + "," + e.type + "\n");
                }
            }
            if (parentHasPort) {
                diagramBoundaries = getDiagramBoundaries($(diagram));
                console.log("bounds: " + JSON.stringify(getAbsBounds(e)));
                boundaryLabelPosition = getBoundaryLabelPosition(diagramBoundaries, getAbsBounds(e), 100, 50);

                const text = `<mxCell id="${e.id}-label" value="${
                    portName || c4Name
                }" style="text;strokeColor=none;align=center;fillColor=none;html=1;verticalAlign=middle;whiteSpace=wrap;rounded=0;" vertex="1" parent="1">
                <mxGeometry x="${boundaryLabelPosition.x}" y="${
                    boundaryLabelPosition.y
                }" width="100" height="50" as="geometry" /></mxCell>
                `;
                fw.write(text);
            }
            // Recursively process children
            mapElementsC4(fw, e, newId, diagram);
        });
}

module.exports = { mapElementsC4 };
