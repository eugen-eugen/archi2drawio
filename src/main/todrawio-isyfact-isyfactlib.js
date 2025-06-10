const p = require("fast-xml-parser");
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

function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function getMxCells(obj) {
    if (obj.mxGraphModel && obj.mxGraphModel.root && Array.isArray(obj.mxGraphModel.root.mxCell)) {
        return obj.mxGraphModel.root.mxCell;
    } else if (Array.isArray(obj.mxCell)) {
        return obj.mxCell;
    } else {
        throw new Error("Unsupported JSON structure for mxCell operations");
    }
}
let mergedLibs = [];
function readDrawioLibraryJson() {
    if (mergedLibs.length === 0) {
        let libs = [];
        try {
            libs = [require("../../data/IsyFact.drawiolib.xml"), require("../../data/c4.drawiolib.xml")];
        } catch (e) {
            // Fallback for dev mode
            const fs = require("fs");
            const path = require("path");
            libs = [
                fs.readFileSync(path.join(__dirname, "../../data/IsyFact.drawiolib.xml"), "utf8"),
                fs.readFileSync(path.join(__dirname, "../../data/c4.drawiolib.xml"), "utf8"),
            ];
        }
        libs.forEach((drawioLibXml) => {
            let sb = drawioLibXml;
            // Extract content between <mxlibrary> and </mxlibrary>
            var match = sb.match(/<mxlibrary>([\s\S]*?)<\/mxlibrary>/);
            if (!match) {
                throw new Error("No <mxlibrary>...</mxlibrary> section found in " + pathname);
            }
            var jsonText = match[1].trim();
            // Parse the JSON content
            mergedLibs = mergedLibs.concat(JSON.parse(jsonText));
        });
    }
    return mergedLibs;
}

function getGraphObject(lib, title) {
    for (let i = 0; i < lib.length; i++) {
        if (lib[i].title === title) {
            let obj = Object.assign({}, lib[i]); // clone to avoid mutating original
            let matches = obj.xml.match(/&lt;mxCell[\s\S]*?&lt;\/mxCell&gt;/g);
            if (!matches) {
                return obj;
            }
            obj.mxCell = matches ? matches.join("\n") : "";
            return obj;
        }
    }
    return {
        title,
        xml: `&lt;mxGraphModel&gt;&lt;root&gt;&lt;mxCell id="0"/&gt;&lt;mxCell id="1" parent="0"/&gt;&lt;mxCell id="2" value="${title}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#cccccc;strokeColor=#000000;" vertex="1" parent="1"&gt;&lt;mxGeometry width="120" height="60" as="geometry"/&gt;&lt;/mxCell&gt;&lt;/root&gt;&lt;/mxGraphModel&gt;`,
        mxCell: `&lt;mxCell id="2" value="${title}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#cccccc;strokeColor=#000000;" vertex="1" parent="1"&gt;&lt;mxGeometry width="120" height="60" as="geometry"/&gt;&lt;/mxCell&gt;`,
    };
}

function adjustIds2(jsonObj, parentId, elementId) {
    // Deep clone the input object to avoid mutation

    let obj = deepClone(jsonObj);

    // 1. Collect all cells in a flat array (works for mxGraphModel/root/mxCell[])
    let cells = [];
    if (obj.mxGraphModel && obj.mxGraphModel.root && Array.isArray(obj.mxGraphModel.root.mxCell)) {
        cells = obj.mxGraphModel.root.mxCell;
    } else if (Array.isArray(obj.mxCell)) {
        cells = obj.mxCell;
    } else {
        throw new Error("Unsupported JSON structure for adjustIds2 " + JSON.stringify(obj));
    }

    // 2. Build a map for easy lookup
    let idMap = {};
    cells.forEach((c) => {
        idMap[c.id] = c;
    });

    // 3. Find root cells (those WITHOUT a parent property)
    let rootCells = cells.filter((c) => c.parent === "1");
    if (rootCells.length === 0) throw new Error("No root cell found");

    // 4. Assign new ids recursively
    let newIdMap = {};
    function randomId() {
        return Math.random().toString(36).substr(2, 10);
    }
    function assignIds(currentId, newId, parentNewId) {
        let cell = idMap[currentId];
        if (!cell) return;
        newIdMap[currentId] = { newId: newId, newParent: parentNewId };
        // Find children (by parent attribute)
        let children = cells.filter((c) => c.parent === currentId);
        for (let i = 0; i < children.length; i++) {
            assignIds(children[i].id, newId + "-" + i, newId);
        }
    }

    // 5. Start from each root cell (can be more than one)
    let rootId = elementId;
    for (let r = 0; r < rootCells.length; r++) {
        assignIds(rootCells[r].id, rootId + (rootCells.length > 1 ? "-" + r : ""), parentId);
    }

    // 6. Apply new ids and parents
    cells.forEach((c) => {
        let newIds = newIdMap[c.id];
        if (newIds) {
            c.id = newIds.newId;
            if ("parent" in c) {
                c.parent = newIds.newParent;
            }
        }
    });

    // 7. Remove cells with original id "0" or "1"
    if (obj.mxGraphModel && obj.mxGraphModel.root && Array.isArray(obj.mxGraphModel.root.mxCell)) {
        obj.mxGraphModel.root.mxCell = obj.mxGraphModel.root.mxCell.filter((c) => c.id !== "0" && c.id !== "1");
    } else if (Array.isArray(obj.mxCell)) {
        obj.mxCell = obj.mxCell.filter((c) => c.id !== "0" && c.id !== "1");
    }

    return obj;
}

function positioning2(jsonObj, x, y, parentId) {
    let obj = deepClone(jsonObj);
    let cells = getMxCells(obj);
    cells.forEach((cell) => {
        if (cell.parent === parentId && cell.mxGeometry) {
            cell.mxGeometry.x = x;
            cell.mxGeometry.y = y;
        }
    });
    return obj;
}

function naming2(dom, name) {
    let obj = deepClone(dom);
    let cells = getMxCells(obj);

    // Regex to match value like: «something»<br><b>something-else</b>
    const valueRegex = /^«[^»]+»<br><b>[^<]*<\/b>$/;
    // Regex to match plain text (no special characters)
    const plainTextRegex = /^[a-zA-Z0-9 _-]+$/;

    cells.forEach((cell) => {
        if (typeof cell.value === "string") {
            if (valueRegex.test(cell.value)) {
                // Replace the part inside <b>...</b> with the new name
                cell.value = cell.value.replace(/(<b>)[^<]*(<\/b>)/, `$1${name}$2`);
            } else if (plainTextRegex.test(cell.value)) {
                // If value is plain text, replace it entirely
                cell.value = name;
            }
        }
    });

    return obj;
}

function sizing2(jsonObj, width, height, parentId) {
    let obj = deepClone(jsonObj);
    let cells = getMxCells(obj);

    // Find first-level cells (direct children of parentId)
    let firstLevelCells = cells.filter((cell) => cell.parent === parentId && cell.mxGeometry);

    // Store original sizes and calculate ratios
    let ratios = {};
    firstLevelCells.forEach((cell) => {
        const origWidth = Number(cell.mxGeometry.width) || 1;
        const origHeight = Number(cell.mxGeometry.height) || 1;
        ratios[cell.id] = {
            x: width / origWidth,
            y: height / origHeight,
            origWidth,
            origHeight,
        };
        // Set new size for first-level cell
        cell.mxGeometry.width = width;
        cell.mxGeometry.height = height;
    });

    // Recursively resize children according to their first-level ancestor's ratio
    function resizeChildren(parentCell, ratioX, ratioY) {
        cells.forEach((child) => {
            if (child.parent === parentCell.id && child.mxGeometry) {
                // Skip resizing if mxGeometry.relative == 1
                if (child.mxGeometry.relative === 1 || child.mxGeometry.relative === "1") {
                    return;
                }

                // Scale geometry, converting to number if needed
                if (child.mxGeometry.x !== undefined) child.mxGeometry.x = Number(child.mxGeometry.x) * ratioX;
                if (child.mxGeometry.y !== undefined) child.mxGeometry.y = Number(child.mxGeometry.y) * ratioY;
                if (child.mxGeometry.width !== undefined)
                    child.mxGeometry.width = Number(child.mxGeometry.width) * ratioX;
                if (child.mxGeometry.height !== undefined)
                    child.mxGeometry.height = Number(child.mxGeometry.height) * ratioY;
                // Recursively process further children
                resizeChildren(child, ratioX, ratioY);
            }
        });
    }

    // For each first-level cell, resize its children
    firstLevelCells.forEach((cell) => {
        const ratioX = ratios[cell.id].x;
        const ratioY = ratios[cell.id].y;
        resizeChildren(cell, ratioX, ratioY);
    });

    return obj;
} // Add this at the end of the file to export all functions

function coloring2(jsonObj, fillColor, fontColor, opacity) {
    let obj = deepClone(jsonObj);
    let cells = getMxCells(obj);

    cells.forEach((cell) => {
        if (typeof cell.style === "string" && /fillColor=[^;]*;?/.test(cell.style)) {
            // Remove any existing fillColor, fontColor, and opacity
            let style = cell.style
                .replace(/fillColor=[^;]*;?/g, "")
                .replace(/fontColor=[^;]*;?/g, "")
                .replace(/opacity=[^;]*;?/g, "");
            // Add new fillColor and fontColor at the end
            style += `fillColor=${fillColor};fontColor=${fontColor};`;
            // Add opacity if provided
            if (opacity !== undefined && opacity !== null && opacity !== false) {
                style += `opacity=${opacity};`;
            }
            cell.style = style;
        }
    });

    return obj;
}

module.exports = {
    readDrawioLibraryJson,
    getGraphObject,
    adjustIds2,
    positioning2,
    naming2,
    sizing2,
    coloring2,
    xmlBuilder,
    xmlParser,
};
