global.$ = (ee) => {
    return {
        each: (f) => {
            ee.forEach(f);
        },
        children: () => {
            return ee.children;
        },
    };
};

const { expect } = require("chai");
const { getDiagramBoundaries } = require("../src/main/todrawio-isyfact-functions");

function makeElement(x, y, width, height, children = []) {
    return {
        bounds: { x, y, width, height },
        children: children,
    };
}

function makeElementOnlyChildren(children = []) {
    return {
        children: children,
    };
}

describe("getDiagramBoundaries", () => {
    it("returns correct bounds for single element", () => {
        const elements = [makeElement(10, 20, 100, 200)];

        const result = getDiagramBoundaries($(elements));

        expect(result).to.deep.equal({
            topLeft: { x: 10, y: 20 },
            bottomRight: { x: 110, y: 220 },
        });
    });

    it("returns correct bounds for multiple elements", () => {
        const elements = [makeElement(10, 20, 100, 200), makeElement(50, 60, 50, 50), makeElement(-10, 5, 20, 10)];
        const result = getDiagramBoundaries($(elements));
        expect(result).to.deep.equal({
            topLeft: { x: -10, y: 5 },
            bottomRight: { x: 110, y: 220 },
        });
    });

    it("returns correct bounds with nested children", () => {
        const child = makeElement(-1, 5, 10, 10);
        const parent = makeElement(20, 30, 40, 40, $([child]));
        const elements = [parent];
        const result = getDiagramBoundaries($(elements));
        // child absolute position: x=25, y=35, x2=35, y2=45
        expect(result).to.deep.equal({
            topLeft: { x: 19, y: 30 },
            bottomRight: { x: 60, y: 70 },
        });
    });
    it("returns correct bounds with only nested children", () => {
        const child = makeElement(5, 5, 10, 10);
        const parent = makeElementOnlyChildren($([child]));
        const elements = [parent];
        const result = getDiagramBoundaries($(elements));
        // child absolute position: x=25, y=35, x2=35, y2=45
        expect(result).to.deep.equal({
            topLeft: { x: 5, y: 5 },
            bottomRight: { x: 15, y: 15 },
        });
    });
    it("returns undefined for empty elements", () => {
        const elements = [];
        const result = getDiagramBoundaries($(elements));
        expect(result).to.be.undefined;
    });
});
