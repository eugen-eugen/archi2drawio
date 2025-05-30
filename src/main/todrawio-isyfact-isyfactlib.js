const p = require("fast-xml-parser");
xmlParser = new p.XMLParser({
  ignoreAttributes: false,
  processEntities: true,
  attributeNamePrefix: "",
});

xmlBuilder = new p.XMLBuilder({
  arrayNodeName: "mxCell",
  attributesGroupName: false,
  ignoreAttributes: false,
  attributeNamePrefix: "",
});

function readDrawioLibraryJson(filePath) {
  let drawioLibXml;
  try {
    drawioLibXml = require("../../data/IsyFact.drawiolib.xml");
  } catch (e) {
    console.log("Using fallback for drawio library XML:", e.message);
    // Fallback for dev mode
    const fs = require("fs");
    const path = require("path");
    drawioLibXml = fs.readFileSync(
      path.join(__dirname, "../../data/IsyFact.drawiolib.xml"),
      "utf8"
    );
  }
  sb = drawioLibXml;
  // Extract content between <mxlibrary> and </mxlibrary>
  var match = sb.match(/<mxlibrary>([\s\S]*?)<\/mxlibrary>/);
  if (!match) {
    throw new Error("No <mxlibrary>...</mxlibrary> section found.");
  }
  var jsonText = match[1].trim();
  console.log(JSON.parse(jsonText).length);
  // Parse the JSON content
  return JSON.parse(jsonText);
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
  return null; // Not found
}

function adjustIds2(jsonObj, parentId) {
  // Deep clone the input object to avoid mutation
  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  let obj = deepClone(jsonObj);

  // 1. Collect all cells in a flat array (works for mxGraphModel/root/mxCell[])
  let cells = [];
  if (
    obj.mxGraphModel &&
    obj.mxGraphModel.root &&
    Array.isArray(obj.mxGraphModel.root.mxCell)
  ) {
    cells = obj.mxGraphModel.root.mxCell;
  } else if (Array.isArray(obj.mxCell)) {
    cells = obj.mxCell;
  } else {
    throw new Error("Unsupported JSON structure for adjustIds2");
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
  let rootId = randomId();
  for (let r = 0; r < rootCells.length; r++) {
    assignIds(
      rootCells[r].id,
      rootId + (rootCells.length > 1 ? "-" + r : ""),
      parentId
    );
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
  if (
    obj.mxGraphModel &&
    obj.mxGraphModel.root &&
    Array.isArray(obj.mxGraphModel.root.mxCell)
  ) {
    obj.mxGraphModel.root.mxCell = obj.mxGraphModel.root.mxCell.filter(
      (c) => c.id !== "0" && c.id !== "1"
    );
  } else if (Array.isArray(obj.mxCell)) {
    obj.mxCell = obj.mxCell.filter((c) => c.id !== "0" && c.id !== "1");
  }

  return obj;
}

function positioning2(jsonObj, x, y, parentId) {
  // Deep clone to avoid mutation
  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
  let obj = deepClone(jsonObj);

  // Find all mxCell objects
  let cells = [];
  if (
    obj.mxGraphModel &&
    obj.mxGraphModel.root &&
    Array.isArray(obj.mxGraphModel.root.mxCell)
  ) {
    cells = obj.mxGraphModel.root.mxCell;
  } else if (Array.isArray(obj.mxCell)) {
    cells = obj.mxCell;
  } else {
    throw new Error("Unsupported JSON structure for positioning2");
  }

  // For each mxCell with parent == parentId, set x and y in its mxGeometry
  cells.forEach((cell) => {
    if (cell.parent === parentId && cell.mxGeometry) {
      cell.mxGeometry.x = x;
      cell.mxGeometry.y = y;
    }
  });

  return obj;
}

function naming2(dom, name) {
  // Deep clone to avoid mutation
  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
  let obj = deepClone(dom);

  // Find all mxCell objects
  let cells = [];
  if (
    obj.mxGraphModel &&
    obj.mxGraphModel.root &&
    Array.isArray(obj.mxGraphModel.root.mxCell)
  ) {
    cells = obj.mxGraphModel.root.mxCell;
  } else if (Array.isArray(obj.mxCell)) {
    cells = obj.mxCell;
  } else {
    throw new Error("Unsupported JSON structure for naming2");
  }

  // Regex to match value like: «something»<br><b>something-else</b>
  const valueRegex = /^«[^»]+»<br><b>[^<]*<\/b>$/;
  // Regex to match plain text (no special characters)
  const plainTextRegex = /^[a-zA-Z0-9 _-]+$/;

  cells.forEach((cell) => {
    if (typeof cell.value === "string") {
      console.log("naming:", name, "cell value:", cell.value);
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

// Add this at the end of the file to export all functions

module.exports = {
  readDrawioLibraryJson,
  getGraphObject,
  adjustIds2,
  positioning2,
  naming2,
};
