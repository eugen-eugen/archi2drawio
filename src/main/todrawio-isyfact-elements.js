const {
    readDrawioLibraryJson,
    getGraphObject,
    adjustIds2,
    positioning2,
    naming2,
} = require("./todrawio-isyfact-isyfactlib.js");
const {
    c4ObjLabel,
    c4Tooltip,
    effectiveFontColor,
    setShapeColor,
    escX,
    unEscX,
} = require("./todrawio-isyfact-functions.js");

const isyfactlib = () => readDrawioLibraryJson();
function createElementWithLink(newId, c4Name, c4Type, c4Description, style, parent, e, linkValue, fw) {
    // Group id and main object id
    let groupId = `${newId}_group`;
    let mainObjId = `${newId}`;

    // Main element
    style = setShapeColor(style, e);
    var newElem = `<mxCell style="${style}" vertex="1" parent="${groupId}">
        <mxGeometry x="0" y="0" width="${e.bounds.width}" height="${e.bounds.height}" as="geometry" />
    </mxCell>
`;
    let label = c4ObjLabel(c4Name, c4Type, c4Description, effectiveFontColor(e));
    var mainObj = `			<object id="${mainObjId}" c4Name="${c4Name}" c4Description="${c4Description}" c4Type="${c4Type}" label="${label}" placeholders="1" tooltip="${c4Tooltip(
        c4Name,
        c4Type,
        c4Description
    )}" link="${escX(linkValue)}">
        ${newElem}
    </object>
`;

    // Link icon element
    let iconSize = 24;
    let iconX = e.bounds.width - iconSize;
    let iconY = 0;
    let linkIconObj = `           <object id="${newId}_linkicon" label="" link="${escX(linkValue)}">
        <mxCell style="shape=mxgraph.ios7.misc.link;html=1;aspect=fixed;fillColor=#4CDA64;strokeColor=#000000;" vertex="1" parent="${groupId}">
            <mxGeometry x="${iconX}" y="${iconY}" width="${iconSize}" height="${iconSize}" as="geometry" />
        </mxCell>
    </object>
`;

    // Group element
    let groupObj = `           <object id="${groupId}" label="">
        <mxCell vertex="1" style="group" connectable="0" parent="${parent}">
            <mxGeometry x="${e.bounds.x}" y="${e.bounds.y}" width="${e.bounds.width}" height="${e.bounds.height}" as="geometry" />
        </mxCell>	
    </object>
`;

    // Write group, then children (order: group, main, icon)
    fw.write(groupObj);
    fw.write(mainObj);
    fw.write(linkIconObj);
}
function createIsyFactElement(newId, name, description, parent, e, fw) {
    let ifType = e.prop("ifType");
    let graphObject = getGraphObject(isyfactlib(), ifType).xml;
    console.log("e.id:" + e.id);
    const adjusted = adjustIds2(xmlParser.parse(unEscX(graphObject)), parent, e.id);
    const positioned = positioning2(adjusted, e.bounds.x, e.bounds.y, parent);
    const named = naming2(positioned, name);

    let label = c4ObjLabel(name, ifType, description, effectiveFontColor(e));
    var mainObj = xmlBuilder.build(named.mxGraphModel.root);

    fw.write(mainObj);
}
function createElementWithoutLink(newId, c4Name, c4Type, c4Description, style, parent, e, fw) {
    // Main element (no link)
    console.log("createElementWithoutLink: " + c4Name + "" + c4Type + " " + c4Description);
    style = setShapeColor(style, e);
    var newElem = `<mxCell style="${style}" vertex="1" parent="${parent}">
        <mxGeometry x="${e.bounds.x}" y="${e.bounds.y}" width="${e.bounds.width}" height="${e.bounds.height}" as="geometry" />
    </mxCell>
`;
    let label = c4ObjLabel(c4Name, c4Type, c4Description, effectiveFontColor(e));
    var mainObj = `			<object id="${newId}" c4Name="${c4Name}" c4Description="${c4Description}" c4Type="${c4Type}" label="${label}" placeholders="1" tooltip="${c4Tooltip(
        c4Name,
        c4Type,
        c4Description
    )}">
        ${newElem}
    </object>
`;

    fw.write(mainObj);
}

// Add this at the end of the file to export all functions

module.exports = {
    createElementWithLink,
    createIsyFactElement,
    createElementWithoutLink,
};
