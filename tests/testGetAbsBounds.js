$ = (e) => {
    return {
        parents: () => {
            return $(e.p);
        },
        each: (f) => {
            e.forEach(f);
        },
    };
};

function makeElement(x, y, width, height, p = []) {
    return {
        bounds: { x, y, width, height },
        p: p,
    };
}

const { expect } = require("chai");
const { getAbsBounds } = require("../src/main/todrawio-isyfact-functions");

describe("getAbsBounds", () => {
    it("returns the same bounds if there is no parent", () => {
        const element = makeElement(10, 20, 100, 200, []);

        const result = getAbsBounds(element);
        expect(result).to.deep.equal({ x: 10, y: 20, width: 100, height: 200 });
    });

    it("accumulates multiple levels of parents", () => {
        const element = makeElement(1, 2, 10, 20, [makeElement(3, 4, 0, 0, []), makeElement(5, 6, 0, 0, [])]);
        const result = getAbsBounds(element);
        expect(result).to.deep.equal({ x: 9, y: 12, width: 10, height: 20 });
    });

    it("accumulates multiple levels of parents", () => {
        const element = makeElement(1, 2, 10, 20, [
            makeElement(3, 4, 0, 0, []),
            makeElement(undefined, undefined, 0, 0, []),
        ]);
        const result = getAbsBounds(element);
        expect(result).to.deep.equal({ x: 4, y: 6, width: 10, height: 20 });
    });
});
