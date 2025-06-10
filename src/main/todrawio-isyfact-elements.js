const {
    readDrawioLibraryJson,
    getGraphObject,
    adjustIds2,
    positioning2,
    naming2,
    sizing2,
    coloring2,
    xmlParser,
    xmlBuilder,
} = require("./todrawio-isyfact-isyfactlib.js");
const {
    c4ObjLabel,
    c4Tooltip,
    effectiveFontColor,
    effectiveFillColor,
    escX,
    unEscX,
    portName,
} = require("./todrawio-isyfact-functions.js");

const elementLib = () => readDrawioLibraryJson();
function createIsyFactElement(newId, name, description, parent, element, bounds, shift) {
    let ifType = element.prop("ifType");
    let graphObject = getGraphObject(elementLib(), ifType).xml;
    const adjusted = adjustIds2(xmlParser.parse(unEscX(graphObject)), parent, newId);
    const x = bounds.x - shift.x;
    const y = bounds.y - shift.y;
    const positioned = positioning2(adjusted, x, y, parent);
    const named = naming2(positioned, name);
    const sized = sizing2(named, bounds.width, bounds.height, parent);
    const colored = coloring2(sized, effectiveFillColor(element), effectiveFontColor(element), element.opacity);

    let label = c4ObjLabel(name, ifType, description, effectiveFontColor(element));
    var mainObj = xmlBuilder.build(colored.mxGraphModel.root);

    return mainObj;
}
function createC4Element(newId, c4Name, c4Type, c4Description, parent, element, bounds, shift) {
    let graphObject = getGraphObject(elementLib(), c4Type).xml;
    const adjusted = adjustIds2(xmlParser.parse(unEscX(graphObject)), parent, newId + "-cell");
    port = portName(element, c4Name);
    let x = bounds.x - shift.x;
    let y = bounds.y - shift.y;

    const positioned = positioning2(adjusted, x, y, parent);
    const named = naming2(positioned, port ? "" : c4Name);
    const sized = sizing2(named, bounds.width, bounds.height, parent);
    const colored = coloring2(sized, effectiveFillColor(element), effectiveFontColor(element), element.opacity);

    var newElem = xmlBuilder.build(colored.mxGraphModel.root);

    let label = c4ObjLabel(c4Name, c4Type, c4Description, effectiveFontColor(element));
    var mainObj = `			<object id="${newId}" c4Name="${c4Name}" c4Description="${c4Description}" c4Type="${c4Type}" label="${label}" placeholders="1" tooltip="${c4Tooltip(
        c4Name,
        c4Type,
        c4Description
    )}">
        ${newElem}
    </object>
`;
    return mainObj;
}

function createLinkWrapper(groupId, parent, bounds, link) {
    // Group element
    let groupObj = `           <object id="${groupId}" label="" link="${escX(link)}">
        <mxCell vertex="1" style="group" connectable="0" parent="${parent}">
            <mxGeometry x="${bounds.x}" y="${bounds.y}" width="${bounds.width}" height="${
        bounds.height
    }" as="geometry" />
        </mxCell>	
    </object>
`;

    // Link icon element
    let iconSize = 24;
    let iconX = 0;
    let iconY = 0;
    let linkIconObj = `           <object id="${groupId}_linkicon" label="" link="${escX(link)}">
        <mxCell style="shape=mxgraph.ios7.misc.link;html=1;aspect=fixed;fillColor=#4CDA64;strokeColor=#000000;" vertex="1" parent="${groupId}">
            <mxGeometry x="${iconX}" y="${iconY}" width="${iconSize}" height="${iconSize}" as="geometry" />
        </mxCell>
    </object>
`;

    return { groupObj: groupObj, linkIconObj: linkIconObj };
}

// Add this at the end of the file to export all functions

module.exports = {
    createIsyFactElement,
    createC4Element,
    createLinkWrapper,
};
