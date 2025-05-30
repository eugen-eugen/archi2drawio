p = require("fast-xml-parser");
xmlBuilder = new p.XMLBuilder({
   
    attributesGroupName: false,
    ignoreAttributes: false,
    attributeNamePrefix: "",
    format: true,
});

console.log(xmlBuilder.build({e:{a: {f: "bc"}}}))

xmlBuilder = new p.XMLBuilder({
   
    attributesGroupName: true,
    ignoreAttributes: false,
    attributeNamePrefix: "",
    format: true,
});

console.log(xmlBuilder.build({e:{a: {f: "bc"}}}))
