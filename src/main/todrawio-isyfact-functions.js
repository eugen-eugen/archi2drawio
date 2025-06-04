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

function createConnector(newId, c4Name, c4Type, c4Description, relStyle, parent, e, entryExit, bendPoints, fw) {
    let label = c4RelLabel(c4Name, "", c4Description);
    let linkAttr = "";
    if (typeof e.prop === "function") {
        let linkValue = e.prop("link");
        if (linkValue && linkValue.trim() !== "") {
            linkAttr = ` link="${escX(linkValue)}"`;
        }
    }
    let newElem = `<mxCell style="${
        relStyle + (entryExit ? entryExit.exit + entryExit.entry : "")
    }" edge="1" parent="${parent}" source="${e.source.id}" target="${e.target.id}">
        <mxGeometry width="160" relative="1" as="geometry">
        ${bendPoints}
        </mxGeometry>
    </mxCell>
`;
    let newObj = `				<object id="${newId}" c4Name="${c4Name}" c4Description="${c4Description}" c4Type="${c4Type}" label="${label}" placeholders="1" tooltip="${c4Tooltip(
        c4Name,
        c4Type,
        c4Description
    )}"${linkAttr}>
        ${newElem}
    </object>
`;
    fw.write(newObj);
}

function handleBendPoints(e) {
    var xml = "";
    if (e.getRelativeBendpoints() != null) {
        xml += '<Array as="points">\n';
        var bps = getAbsoluteBendpoints(e);
        for (let p = 0; p < bps.length; p++) {
            xml += '<mxPoint x="' + bps[p].x + '" y="' + bps[p].y + '" />\n';
        }
        xml += "</Array>\n";
    }
    return xml;
}

function getAbsoluteBendpoints(conn) {
    let abps = [];
    conn.getRelativeBendpoints().forEach((bp) => {
        let x = bp.startX + conn.source.bounds.x + conn.source.bounds.width / 2;
        let y = bp.startY + conn.source.bounds.y + conn.source.bounds.height / 2;
        // add x/y offset of the embedding objects
        $(conn.source)
            .parents()
            .forEach((p) => {
                try {
                    x += p.bounds.x;
                    y += p.bounds.y;
                } catch (e) {}
            });

        let abp = {
            x: x,
            y: y,
        };

        abps.push(abp);
    });
    return abps;
}

function createConnectorWithTopic(topic, newId, c4Name, c4Type, c4Description, relStyle, parent, e, entryExit, fw) {
    // Determine the position for the Topic element
    let topicId = newId + "_topic";
    let topicLabel = topic;
    let topicStyle =
        "shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=15;fillColor=#FF9999;strokeColor=#A15F5F;align=center;verticalAlign=middle;fontFamily=Helvetica;fontSize=12;fontColor=default;textDirection=ltr;direction=south;";

    // Get source and target coordinates
    let src = e.source.bounds;
    let tgt = e.target.bounds;

    // Helper to get center of a bounds object
    function center(b) {
        return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
    }

    // Use getAbsoluteBendpoints to get bend points as JS objects
    let bendArr = getAbsoluteBendpoints(e);

    let topicX,
        topicY,
        bends1 = [],
        bends2 = [];
    if (bendArr.length > 0) {
        // Use the middle bend point
        let midIdx = Math.floor(bendArr.length / 2);
        topicX = bendArr[midIdx].x;
        topicY = bendArr[midIdx].y;
        // Remove this point from the bend points for the two new connectors
        bends1 = bendArr.slice(0, midIdx);
        bends2 = bendArr.slice(midIdx + 1);
    } else {
        // No bend points: place topic in the middle between source and target
        let c1 = center(src);
        let c2 = center(tgt);
        topicX = (c1.x + c2.x) / 2;
        topicY = (c1.y + c2.y) / 2;
        bends1 = [];
        bends2 = [];
    }

    // Helper to convert bends array to XML
    function bendsToXml(bends) {
        if (!bends.length) return "";
        let arr = bends.map((pt) => `<mxPoint x="${pt.x}" y="${pt.y}"/>`).join("");
        return `<Array as="points">${arr}</Array>`;
    }
    var bendPoints1 = bendsToXml(bends1);
    var bendPoints2 = bendsToXml(bends2);

    // Create the Topic element
    let topicElem = `   <object id="${topicId}" label="${topicLabel}">
        <mxCell style="${topicStyle}" vertex="1" parent="${parent}">
            <mxGeometry x="${topicX - 30}" y="${topicY - 30}" width="60 pt" height="35 pt" as="geometry" />
        </mxCell>
    </object>
`;

    fw.write(topicElem);

    // Connector from source to Topic
    let label1 = c4RelLabel(c4Name, "", c4Description);
    let newElem1 = `<mxCell style="${
        relStyle + (entryExit ? entryExit.exit : "")
    }" edge="1" parent="${parent}" source="${e.source.id}" target="${topicId}">
        <mxGeometry width="160" relative="1" as="geometry">
        ${bendPoints1}
        </mxGeometry>
    </mxCell>
`;
    let newObj1 = `   <object id="${newId}_1" c4Name="${c4Name}" c4Description="${c4Description}" c4Type="${c4Type}" label="${label1}" placeholders="1" tooltip="${c4Tooltip(
        c4Name,
        c4Type,
        c4Description
    )}">
        ${newElem1}
    </object>
`;
    fw.write(newObj1);

    // Connector from Topic to target
    let label2 = c4RelLabel(c4Name, "", c4Description);
    let newElem2 = `<mxCell style="${
        relStyle + (entryExit ? entryExit.entry : "")
    }" edge="1" parent="${parent}" source="${topicId}" target="${e.target.id}">
        <mxGeometry width="160" relative="1" as="geometry">
        ${bendPoints2}
        </mxGeometry>
    </mxCell>
`;
    let newObj2 = `   <object id="${newId}_2" c4Name="${c4Name}" c4Description="${c4Description}" c4Type="${c4Type}" label="${label2}" placeholders="1" tooltip="${c4Tooltip(
        c4Name,
        c4Type,
        c4Description
    )}">
        ${newElem2}
    </object>
`;
    fw.write(newObj2);
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
        .replace(/'/g, "&apos;");
}
function unEscX(xml) {
    return xml
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, "&");
}

const colorFactory = () => Java.type("com.archimatetool.editor.ui.ColorFactory");

function effectiveFillColor(e) {
    if (e.fillColor) {
        return e.fillColor;
    }
    var method = e.class.getDeclaredMethod("getEObject");
    method.setAccessible(true);
    eObject = method.invoke(e);
    color = colorFactory().getDefaultFillColor(eObject); // get the color

    return colorFactory().convertColorToString(color);
}

function effectiveFontColor(e) {
    if (e.fontColor) {
        return e.fontColor;
    }
    var method = e.class.getDeclaredMethod("getEObject");
    method.setAccessible(true);
    var eObject = method.invoke(e);
    var color = colorFactory().getDefaultFontColor(eObject); // get the font color

    return colorFactory().convertColorToString(color);
}

/**
 * Recursively calculates the absolute bounds of an element.
 * Each element must have a .bounds property ({x, y, width, height}) and may have a .parent property.
 * @param {object} e - The element with .bounds and optional .parent
 * @returns {{x: number, y: number, width: number, height: number}}
 */
function getAbsBounds(e) {
    let absX = (e.bounds && e.bounds.x) || 0;
    let absY = (e.bounds && e.bounds.y) || 0;
    let width = (e.bounds && e.bounds.width) || 0;
    let height = (e.bounds && e.bounds.height) || 0;
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

module.exports = {
    addFontSizeToStyle,
    isExternElement,
    setShapeColor,
    createConnector,
    handleBendPoints,
    getAbsoluteBendpoints,
    createConnectorWithTopic,
    c4ObjLabel,
    c4RelLabel,
    c4Tooltip,
    escX,
    effectiveFillColor,
    effectiveFontColor,
    unEscX,
    getDiagramBoundaries,
    getBoundaryLabelPosition,
    getAbsBounds,
};
