//*****************************************************************************
// Color and style constants for C4 and Archi elements
//*****************************************************************************

const junctionAndColor = "#000000";
const junctionOrColor = "#ffffff";

const c4ContainerStyle =
  "rounded=1;whiteSpace=wrap;html=1;labelBackgroundColor=none;fillColor=#23A2D9;fontColor=#ffffff;align=center;arcSize=10;strokeColor=#0E7DAD;metaEdit=1;resizable=1;points=[[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0.25,0],[1,0.5,0],[1,0.75,0],[0.75,1,0],[0.5,1,0],[0.25,1,0],[0,0.75,0],[0,0.5,0],[0,0.25,0]];";
const c4SystemStyle =
  "rounded=1;whiteSpace=wrap;html=1;labelBackgroundColor=none;fillColor=#1061B0;fontColor=#ffffff;align=center;arcSize=10;strokeColor=#0D5091;metaEdit=1;resizable=1;points=[[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0.25,0],[1,0.5,0],[1,0.75,0],[0.75,1,0],[0.5,1,0],[0.25,1,0],[0,0.75,0],[0,0.5,0],[0,0.25,0]];";
const c4PersonStyle =
  "html=1;dashed=0;whiteSpace=wrap;fillColor=#083F75;strokeColor=#06315C;fontColor=#ffffff;shape=mxgraph.c4.person2;align=center;metaEdit=1;points=[[0.5,0,0],[1,0.5,0],[1,0.75,0],[0.75,1,0],[0.5,1,0],[0.25,1,0],[0,0.75,0],[0,0.5,0]];resizable=1;";
const c4SystemScopeBoundary =
  "rounded=1;whiteSpace=wrap;html=1;dashed=1;arcSize=20;fillColor=#dae8fc;strokeColor=#6c8ebf;labelBackgroundColor=none;align=left;verticalAlign=bottom;labelBorderColor=none;spacingTop=0;spacing=10;dashPattern=8 4;metaEdit=1;rotatable=0;perimeter=rectanglePerimeter;labelPadding=0;allowArrows=0;connectable=0;expand=0;recursiveResize=0;editable=1;pointerEvents=0;absoluteArcSize=1;points=[[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0.25,0],[1,0.5,0],[1,0.75,0],[0.75,1,0],[0.5,1,0],[0.25,1,0],[0,0.75,0],[0,0.5,0],[0,0.25,0]];strokeWidth=3;fontColor=#004C99;";
const c4SolidRelStyle =
  "endArrow=blockThin;html=1;fontColor=#404040;strokeWidth=2;endFill=1;strokeColor=#828282;metaEdit=1;endSize=14;startSize=14;jumpStyle=arc;jumpSize=16;rounded=0;align=right;exitPerimeter=0;elbow=vertical;";
const c4DashedRelStyle =
  "endArrow=blockThin;html=1;fontColor=#404040;strokeWidth=1;endFill=1;strokeColor=#828282;elbow=vertical;metaEdit=1;endSize=14;startSize=14;jumpStyle=arc;jumpSize=16;rounded=0;dashed=1;dashPattern=8 8;";
const c4SolidNondirectedRelStyle =
  "endArrow=none;html=1;fontColor=#404040;strokeWidth=1;endFill=1;strokeColor=#828282;elbow=vertical;metaEdit=1;endSize=14;startSize=14;jumpStyle=arc;jumpSize=16;rounded=0";

const c4ElemMap = new Map([
  // Archi type                draw.io C4 style
  ["Systemverbund", c4SystemStyle],
  ["Person", c4PersonStyle],
  ["business-actor", c4PersonStyle],
  ["application-component", c4SystemStyle],
  ["application-service", c4SystemStyle],
  ["application-interface", c4SystemStyle],
  ["business-role", c4PersonStyle],
  ["business-process", c4ContainerStyle],
  ["business-object", c4ContainerStyle],
  ["data-object", c4ContainerStyle],
  ["node", c4ContainerStyle],
  ["device", c4ContainerStyle],
  ["artifact", c4ContainerStyle],
  ["technology-interface", c4ContainerStyle],
  ["technology-service", c4ContainerStyle],
  ["technology-collaboration", c4ContainerStyle],
  ["technology-event", c4ContainerStyle],
  ["technology-function", c4ContainerStyle],
  ["technology-interaction", c4ContainerStyle],
  ["technology-process", c4ContainerStyle],
  ["application-collaboration", c4ContainerStyle],
  ["application-event", c4ContainerStyle],
  ["application-function", c4ContainerStyle],
  ["application-interaction", c4ContainerStyle],
  ["application-process", c4ContainerStyle],
  ["grouping", c4SystemScopeBoundary],
  ["location", c4SystemScopeBoundary],
  ["diagram-model-note", "shape=card;whiteSpace=wrap;html=1;direction=west;"],
  [
    "junction_or",
    "ellipse;html=1;verticalLabelPosition=bottom;fontColor=" +
      junctionAndColor +
      "labelBackgroundColor=" +
      junctionOrColor +
      ";verticalAlign=top;fillColor=" +
      junctionOrColor,
  ],
  [
    "junction_and",
    "ellipse;html=1;verticalLabelPosition=bottom;fontColor=" +
      junctionOrColor +
      "labelBackgroundColor=" +
      junctionAndColor +
      ";verticalAlign=top;fillColor=" +
      junctionAndColor,
  ],
  ["archimate-diagram-model", c4ContainerStyle],
  ["diagram-model-group", c4SystemScopeBoundary],
  ["port", "rounded=0;whiteSpace=wrap;html=1;strokeColor=#23445D;"],
]);

const c4TypeMap = new Map([
  ["business-actor", "Person"],
  ["application-component", "System"],
  ["application-service", "System"],
  ["application-interface", "Interface"],
  ["business-role", "Person"],
  ["business-process", "System"],
  ["business-object", "Container"],
  ["data-object", "Container"],
  ["node", "Container"],
  ["device", "Container"],
  ["artifact", "Container"],
  ["technology-interface", "System"],
  ["technology-service", "System"],
  ["technology-collaboration", "Container"],
  ["technology-event", "Container"],
  ["technology-function", "Container"],
  ["technology-interaction", "Container"],
  ["technology-process", "Container"],
  ["application-collaboration", "Container"],
  ["application-event", "Container"],
  ["application-function", "Container"],
  ["application-interaction", "Container"],
  ["application-process", "System"],
  ["grouping", "SystemScopeBoundary"],
  ["location", "SystemScopeBoundary"],
  ["diagram-model-note", "Container"],
  ["diagram-model-group", "SystemScopeBoundary"],
  ["junction_and", "Junction"],
  ["junction_or", "Junction"],
  ["archimate-diagram-model", "Container"],
  ["port", "port"],
  ["default", "Element"],
]);

const c4RelMap = new Map([
  ["association-relationship", c4SolidNondirectedRelStyle],
  ["diagram-model-connection", c4SolidNondirectedRelStyle],
  ["serving-relationship", c4SolidRelStyle],
  ["realization-relationship", c4DashedRelStyle],
  ["triggering-relationship", c4SolidRelStyle],
  ["flow-relationship", c4DashedRelStyle],
  ["access-relationship", c4SolidRelStyle],
  // ["composition-relationship", "endArrow=diamondThin;html=1;startFill=1;"],
  // ["aggregation-relationship", "endArrow=diamondThin;html=1;startFill=0;"],
  ["specialization-relationship", c4SolidRelStyle],
  ["assignment-relationship", c4SolidRelStyle],
  // ["default",                  "endArrow=block;html=1;endFill=1;"]
]);

module.exports = {
  c4ContainerStyle,
  c4SystemStyle,
  c4PersonStyle,
  c4SystemScopeBoundary,
  c4SolidRelStyle,
  c4DashedRelStyle,
  c4SolidNondirectedRelStyle,
  c4ElemMap,
  c4TypeMap,
  c4RelMap,
};
