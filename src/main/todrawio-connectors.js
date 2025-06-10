const {
    escX,
    c4RelLabel,
    c4Tooltip,
    getAbsoluteBendpoints,
    getAbsBounds,
    unEscX,
} = require("./todrawio-isyfact-functions.js");
const {
    readDrawioLibraryJson,
    getGraphObject,
    adjustIds2,
    positioning2,
    sizing2,
    naming2,
    xmlBuilder,
    xmlParser,
} = require("./todrawio-isyfact-isyfactlib.js");

// Helper: constructTopicStyle
function constructTopicStyle(mappingType) {
    const defaultStyle = {
        xml: `&lt;mxGraphModel&gt;&lt;root&gt;&lt;mxCell id="0"/&gt;&lt;mxCell id="1" parent="0"/&gt;&lt;mxCell id="2" value="Topic" style="shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=15;rotation=90;fillColor=#FF9999;strokeColor=#A15F5F;align=center;verticalAlign=middle;fontFamily=Helvetica;fontSize=12;fontColor=default;textDirection=ltr;direction=south;" vertex="1" parent="1"&gt;&lt;mxGeometry width="60" height="35" as="geometry"/&gt;&lt;/mxCell&gt;&lt;/root&gt;&lt;/mxGraphModel&gt;`,
        w: 60,
        h: 35,
        aspect: "fixed",
        title: "Topic",
    };

    // Load IsyFact drawio library if not provided
    const lib = readDrawioLibraryJson();

    // Find the snippet with the name "Datestore"
    const snippet = mappingType === "if" ? getGraphObject(lib, "Datastore") : defaultStyle;
    if (!snippet || !snippet.xml) {
        throw new Error('IsyFact snippet "Datastore" not found in library.');
    }

    // Parse the snippet XML to JSON
    const snippetJson = xmlParser.parse(unEscX(snippet.xml));

    // Find the style with shape=datastore in the parsed JSON
    // Assume structure: mxGraphModel > root > mxCell (array or object)
    let mxCells = [];
    if (snippetJson.mxGraphModel && snippetJson.mxGraphModel.root && snippetJson.mxGraphModel.root.mxCell) {
        mxCells = Array.isArray(snippetJson.mxGraphModel.root.mxCell)
            ? snippetJson.mxGraphModel.root.mxCell
            : [snippetJson.mxGraphModel.root.mxCell];
    }
    let style = undefined;
    for (const cell of mxCells) {
        if (cell.style && typeof cell.style === "string" && cell.style.includes("shape=datastore")) {
            cell.style += "rotation=90";

            break;
        }
    }
    return snippetJson;
}

function createConnectorWithTopic(
    mappingType,
    topic,
    newId,
    c4Name,
    c4Type,
    c4Description,
    relStyle,
    parent,
    e,
    entryExit
) {
    // Determine the position for the Topic element
    let topicId = newId + "_topic";
    let topicLabel = topic;
    let topicStyle = constructTopicStyle(mappingType);

    // Get source and target coordinates
    let src = getAbsBounds(e.source.bounds, e.source);
    let tgt = getAbsBounds(e.target.bounds, e.target);

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
    adjusted = adjustIds2(topicStyle, parent, topicId);
    positioned = positioning2(adjusted, topicX - 30, topicY - 30, parent);
    sized = sizing2(positioned, 60, 60, parent);
    named = naming2(sized, topicLabel);

    let topicElem = xmlBuilder.build(named.mxGraphModel.root);

    // Connector from source to Topic
    let label1 = c4RelLabel(c4Name, "", c4Description);
    let newElem1 = `<mxCell style="${
        relStyle + (entryExit ? entryExit.exit : "")
    }" edge="1" parent="${parent}" source="${e.source.id}" target="${topicId}-1">
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

    // Connector from Topic to target
    let label2 = c4RelLabel(c4Name, "", c4Description);
    let newElem2 = `<mxCell style="${
        relStyle + (entryExit ? entryExit.entry : "")
    }" edge="1" parent="${parent}" source="${topicId}-1" target="${e.target.id}">
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
    return topicElem + newObj1 + newObj2;
}

module.exports = {
    createConnectorWithTopic,
};
