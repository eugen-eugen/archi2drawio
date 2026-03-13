function addFontSizeToStyle(style, e) {
    let fontSize = e.bounds && e.bounds.width > 240 && e.bounds.height > 120 ? 16 : 11;
    // Remove any existing fontSize setting
    style = style.replace(/fontSize=\d+;/, "");
    style += `fontSize=${fontSize};`;
    return style;
}

function isExternElement(e) {
    // Returns true if any parent folder of element e has the name "extern" (case-insensitive)
    let parents = $(e.concept).parents();
    for (let i = 0; i < parents.length; i++) {
        if (parents[i].type === "folder" && parents[i].name && parents[i].name.toLowerCase() === "extern") {
            return true;
        }
    }
    return false;
}

function setShapeColor(style, element) {
    // If the element is extern and has c4Type=Person, set fillColor to #6b6477

    if (isExternElement(element) && !element.fillColor) {
        let isPerson = false;
        if (typeof element.prop === "function") {
            let c4TypeProp = element.prop("c4Type");
            if (c4TypeProp && c4TypeProp.trim().toLowerCase() === "person") {
                isPerson = true;
            }
        }
        // Remove any existing fillColor
        style = style.replace(/fillColor=[^;]*;/g, "");
        style += isPerson ? "fillColor=#6b6477;" : "fillColor=#8C8496;";
    } else {
        // For non-extern elements, use the original fillColor and fontColor from Archi element if present
        if (element.fillColor) {
            style = style.replace(/fillColor=[^;]*;/g, "");
            style += `fillColor=${element.fillColor};`;
        }
        if (element.fontColor) {
            style = style.replace(/fontColor=[^;]*;/g, "");
            style += `fontColor=${element.fontColor};`;
        }
    }
    return style;
}

function createConnector(
    newId,
    c4Name,
    c4Type,
    c4Description,
    relStyle,
    parent,
    e,
    entryExit,
    bendPoints,
    labelPosition,
) {
    let label = c4RelLabel(c4Name, "", c4Description);
    let linkAttr = "";
    if (typeof e.prop === "function") {
        let linkValue = e.prop("link");
        if (linkValue && linkValue.trim() !== "") {
            linkAttr = ` link="${escX(linkValue)}"`;
        }
    }
    let labelPosAttr = labelPosition ? ` x="${labelPosition.x}" y="${labelPosition.y}"` : "";
    console.log("The textposition :", e.textPosition);
    let newElem = `<mxCell style="${
        relStyle + (entryExit ? entryExit.exit + entryExit.entry : "")
    }" edge="1" parent="${parent}" source="${e.source.id}" target="${e.target.id}">
        <mxGeometry${labelPosAttr} width="160" relative="1" as="geometry">
        ${bendPoints}
        </mxGeometry>
    </mxCell>
`;
    let newObj = `				<object id="${newId}" c4Name="${c4Name}" c4Description="${c4Description}" c4Type="${c4Type}" label="${label}" placeholders="1" tooltip="${c4Tooltip(
        c4Name,
        c4Type,
        c4Description,
    )}"${linkAttr}>
        ${newElem}
    </object>
`;
    return newObj;
}

function handleBendPoints(e) {
    var xml = "";
    xml += '<Array as="points">\n';
    var bps = getAbsoluteBendpoints(e);
    for (let p = 0; p < bps.length; p++) {
        xml += '<mxPoint x="' + bps[p].x + '" y="' + bps[p].y + '" />\n';
    }
    xml += "</Array>\n";
    return xml;
}

function mostCommonPoint(bound1, bound2) {
    let xs = [bound1.x, bound1.x + bound1.width, bound2.x, bound2.x + bound2.width].sort((a, b) => a - b);
    let ys = [bound1.y, bound1.y + bound1.height, bound2.y, bound2.y + bound2.height].sort((a, b) => a - b);
    return {
        x: (xs[1] + xs[2]) / 2,
        y: (ys[1] + ys[2]) / 2,
    };
}

function getAbsoluteBendpoints(conn) {
    let abps = [];
    let bendpoints = Java.from(conn.getRelativeBendpoints());
    let totalBendpoints = bendpoints.length;

    let sb = getAbsBounds(conn.source.bounds, conn.source);
    let tb = getAbsBounds(conn.target.bounds, conn.target);

    if (totalBendpoints === 0) {
        abps.push(mostCommonPoint(sb, tb));
        return abps;
    }

    let sourceCenterX = sb.x + sb.width / 2;
    let sourceCenterY = sb.y + sb.height / 2;
    let targetCenterX = tb.x + tb.width / 2;
    let targetCenterY = tb.y + tb.height / 2;

    bendpoints.forEach((bp, index) => {
        let weight = (index + 1) / (totalBendpoints + 1);

        let sourceX = (sourceCenterX + bp.startX) * (1 - weight);
        let sourceY = (sourceCenterY + bp.startY) * (1 - weight);

        let targetX = (targetCenterX + bp.endX) * weight;
        let targetY = (targetCenterY + bp.endY) * weight;

        let abp = {
            x: Math.round(sourceX + targetX),
            y: Math.round(sourceY + targetY),
        };

        abps.push(abp);
    });
    return abps;
}

function c4ObjLabel(c4Name, c4Type, c4Description, fontColor) {
    // List of well-known C4 types
    const wellKnownC4Types = ["Person", "System", "Container", "Component", "Database", "extern", "Software System"];
    let showTypeAndDesc = wellKnownC4Types.map((t) => t.toLowerCase()).includes((c4Type || "").toLowerCase());

    let label = `<font style=""><b>%c4Name%</b></font>`;
    if (showTypeAndDesc) {
        label += `<div><font style="font-size: 11px">[%c4Type%]</font></div>`;
        if (c4Description && c4Description.trim() !== "") {
            label += `<br><div><font style="font-size: 11px"><font color="${fontColor}">%c4Description%</font></div>`;
        }
    }
    return escX(label);
}
function c4RelLabel(c4Name, c4Type, c4Description) {
    // Compose the label and escape XML meta characters for attribute value
    label = `<font style=""><b>%c4Name%</b></font>`;
    return escX(label);
}
function c4Tooltip(c4Name, c4Type, c4Description) {
    // Compose the label and escape XML meta characters for attribute value
    return c4Description ? "%c4Description%" : "no description";
}

function escX(s) {
    // Decode the string
    var decodedString = unescape(encodeURIComponent(s));

    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;")
        .replace(/\n/g, "&#10;");
}
function unEscX(xml) {
    return xml
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#10;/g, "\n")
        .replace(/&amp;/g, "&");
}

function effectiveFillColor(e) {
    if (e.fillColor) {
        return e.fillColor;
    }
    // Use a hardcoded default color if not set
    return "#cccccc";
}

function effectiveFontColor(e) {
    if (e.fontColor) {
        return e.fontColor;
    }
    // Use a hardcoded default font color
    return "#404040";
}

/**
 * Recursively calculates the absolute bounds of an element.
 * Each element must have a .bounds property ({x, y, width, height}) and may have a .parent property.
 * @param {object} e - The element with .bounds and optional .parent
 * @returns {{x: number, y: number, width: number, height: number}}
 */
function getAbsBounds(bounds, e) {
    let absX = (bounds && bounds.x) || 0;
    let absY = (bounds && bounds.y) || 0;
    let width = (bounds && bounds.width) || 0;
    let height = (bounds && bounds.height) || 0;
    $(e)
        .parents()
        .each((current) => {
            absX += (current.bounds && current.bounds.x) || 0;
            absY += (current.bounds && current.bounds.y) || 0;
        });
    return { x: absX, y: absY, width, height };
}

/**
 * Calculates the bounding rectangle (top-left and bottom-right) that contains all elements,
 * including all children's bounds recursively. Child bounds are relative to parent and must be accumulated.
 * @param {object} elements - Collection with each(e) function, each e has bounds: {x, y, width, height}
 * @returns {{currentBounds: {topLeft: {x: number, y: number}, bottomRight: {x: number, y: number}}} | undefined}
 */
function getDiagramBoundaries(elements) {
    let topLeft = { x: Infinity, y: Infinity };
    let bottomRight = { x: -Infinity, y: -Infinity };

    function processElement(e, offsetX = 0, offsetY = 0) {
        const absX = offsetX + (e.bounds ? e.bounds.x : 0);
        const absY = offsetY + (e.bounds ? e.bounds.y : 0);
        if (e.bounds) {
            const x1 = absX;
            const y1 = absY;
            const x2 = absX + e.bounds.width;
            const y2 = absY + e.bounds.height;
            if (x1 < topLeft.x) topLeft.x = x1;
            if (y1 < topLeft.y) topLeft.y = y1;
            if (x2 > bottomRight.x) bottomRight.x = x2;
            if (y2 > bottomRight.y) bottomRight.y = y2;
            // Process children with updated offset
        }
        if (typeof $(e).children === "function") {
            const children = $(e).children();

            if (children && typeof children.each === "function") {
                children.each((child) => processElement(child, absX, absY));
            }
        }
    }

    elements.each((e) => processElement(e, 0, 0));

    if (!isFinite(topLeft.x) || !isFinite(topLeft.y) || !isFinite(bottomRight.x) || !isFinite(bottomRight.y)) {
        return undefined;
    }
    return {
        topLeft,
        bottomRight,
    };
}

/**
 * Calculates the best position for a label near an anchor element, avoiding overlap,
 * and placing it towards the nearest diagram boundary.
 * @param {{currentBounds: {topLeft: {x: number, y: number}, bottomRight: {x: number, y: number}}}} diagramBoundaries
 * @param {{x: number, y: number, width: number, height: number}} anchorBounds
 * @param {number} labelWidth
 * @param {number} labelHeight
 * @returns {{x: number, y: number}}
 */
function getBoundaryLabelPosition(diagramBoundaries, anchorBounds, labelWidth, labelHeight) {
    const { topLeft, bottomRight } = diagramBoundaries;
    // Center of anchor
    const anchorCenterX = anchorBounds.x + anchorBounds.width / 2;
    const anchorCenterY = anchorBounds.y + anchorBounds.height / 2;

    // Distances to each boundary (absolute values)
    const distTop = Math.abs(anchorBounds.y - topLeft.y);
    const distBottom = Math.abs(bottomRight.y - (anchorBounds.y + anchorBounds.height));
    const distLeft = Math.abs(anchorBounds.x - topLeft.x);
    const distRight = Math.abs(bottomRight.x - (anchorBounds.x + anchorBounds.width));

    // Find the minimum distance
    const minDist = Math.min(distTop, distBottom, distLeft, distRight);

    let labelX, labelY;

    if (minDist === distTop) {
        // Place label above anchor
        labelX = anchorCenterX - labelWidth / 2;
        labelY = anchorBounds.y - labelHeight - 4;
    } else if (minDist === distBottom) {
        // Place label below anchor
        labelX = anchorCenterX - labelWidth / 2;
        labelY = anchorBounds.y + anchorBounds.height + 4;
    } else if (minDist === distLeft) {
        // Place label to the left of anchor
        labelX = anchorBounds.x - labelWidth - 4;
        labelY = anchorCenterY - labelHeight / 2;
    } else {
        // Place label to the right of anchor
        labelX = anchorBounds.x + anchorBounds.width + 4;
        labelY = anchorCenterY - labelHeight / 2;
    }

    return { x: labelX, y: labelY };
}
function getPortPosition(diagramBoundaries, newSize, element) {
    const { topLeft, bottomRight } = diagramBoundaries;
    const elementAbs = getAbsBounds(element.bounds, element);
    console.log("element abs:", JSON.stringify(elementAbs));
    // Center of port
    const portCenterX = elementAbs.x + elementAbs.width / 2;
    const portCenterY = elementAbs.y + elementAbs.height / 2;

    // Distances to each boundary (absolute values)
    const distTop = Math.abs(portCenterY - topLeft.y);
    const distBottom = Math.abs(bottomRight.y - portCenterY);
    const distLeft = Math.abs(portCenterX - topLeft.x);
    const distRight = Math.abs(bottomRight.x - portCenterX);

    // Find the minimum distance
    const minDist = Math.min(distTop, distBottom, distLeft, distRight);
    console.log(element, distTop, distBottom, distLeft, distRight);

    let dX = (dY = 0);
    if (minDist === distTop) {
        // Place port so its center is on the top boundary
        dY = elementAbs.y - (topLeft.y - elementAbs.height / 2);
    } else if (minDist === distBottom) {
        // Place port so its center is on the bottom boundary
        dY = elementAbs.y - (bottomRight.y - elementAbs.height / 2);
    } else if (minDist === distLeft) {
        // Place port so its center is on the left boundary
        dX = elementAbs.x + elementAbs.width / 2 - topLeft.x;
    } else {
        // Place port so its center is on the right boundary
        dX = elementAbs.x - (bottomRight.x - elementAbs.width / 2);
    }

    return {
        x: element.bounds.x - dX + (elementAbs.width - newSize.width) / 2,
        y: element.bounds.y - dY + (elementAbs.height - newSize.height) / 2,
    };
}

function getAbsoluteLabelPosition(conn) {
    if (conn.textPosition === 0) {
        return { x: -0.9, y: 0 };
    }
    if (conn.textPosition === 2) {
        return { x: 0.9, y: 0 };
    }

    let absBendPoints = getAbsoluteBendpoints(conn);

    let sb = getAbsBounds(conn.source.bounds, conn.source);
    let tb = getAbsBounds(conn.target.bounds, conn.target);
    let bps = absBendPoints;

    function clamp(val, min, max) {
        return val <= min ? 0 : val >= max ? 1 : (val - min) / (max - min);
    }

    let exitX = clamp(bps[0].x, sb.x, sb.x + sb.width);
    let exitY = clamp(bps[0].y, sb.y, sb.y + sb.height);
    let last = bps[bps.length - 1];
    let entryX = clamp(last.x, tb.x, tb.x + tb.width);
    let entryY = clamp(last.y, tb.y, tb.y + tb.height);

    let sourcePoint = { x: sb.x + exitX * sb.width, y: sb.y + exitY * sb.height };
    let targetPoint = { x: tb.x + entryX * tb.width, y: tb.y + entryY * tb.height };

    let n = absBendPoints.length;
    let labelIndex;

    if (n % 2 === 1) {
        labelIndex = Math.floor(n / 2);
    } else {
        labelIndex = n / 2 - 0.5;
    }

    let path = [sourcePoint, ...absBendPoints, targetPoint];
    let distances = [0];
    for (let i = 1; i < path.length; i++) {
        let dx = path[i].x - path[i - 1].x;
        let dy = path[i].y - path[i - 1].y;
        distances.push(distances[i - 1] + Math.sqrt(dx * dx + dy * dy));
    }
    let totalLength = distances[distances.length - 1];

    let labelDist;
    if (Number.isInteger(labelIndex)) {
        labelDist = distances[labelIndex + 1];
    } else {
        let i1 = Math.floor(labelIndex);
        let i2 = Math.ceil(labelIndex);
        labelDist = (distances[i1 + 1] + distances[i2 + 1]) / 2;
    }

    let ratio = totalLength > 0 ? labelDist / totalLength : 0.5;
    return { x: (ratio - 0.5) * 2, y: 0 };
}

function portName(child, c4Name) {
    let parentElements = $(child).parent();
    parentElements.each(function (p) {
        port = undefined;
        if (typeof p.prop === "function" && p.prop().includes("port")) {
            port = p.prop("port") || c4Name;
            return false; // Break the loop
        }
    });
    return port;
}

module.exports = {
    addFontSizeToStyle,
    isExternElement,
    setShapeColor,
    createConnector,
    handleBendPoints,
    getAbsoluteBendpoints,
    mostCommonPoint,
    c4ObjLabel,
    c4RelLabel,
    c4Tooltip,
    escX,
    effectiveFillColor,
    effectiveFontColor,
    unEscX,
    getDiagramBoundaries,
    getBoundaryLabelPosition,
    getPortPosition,
    getAbsBounds,
    getAbsoluteLabelPosition,
    portName,
};
