const { escX } = require("./todrawio-isyfact-functions.js");
const { mapElementsC4 } = require("./mapElementsC4.js");

function buildDiagramXml(fw, theView) {
    fw.write('    <diagram id="' + theView.id + '-diagram" name="' + escX(theView.name) + '">\n');
    fw.write(
        '        <mxGraphModel dx="2302" dy="697" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169" math="0" shadow="0">\n',
    );
    fw.write("            <root>\n");
    fw.write('                <mxCell id="0" />\n');
    fw.write('                <mxCell id="' + theView.id + '" parent="0" />\n');

    mapElementsC4(fw, theView, theView);

    fw.write("            </root>\n");
    fw.write("        </mxGraphModel>\n");
    fw.write("    </diagram>\n");
}

module.exports = { buildDiagramXml };
