const { expect } = require("chai");
const { sizing2 } = require("../src/main/todrawio-isyfact-isyfactlib.js");

function makeCell(id, parent, mxGeometry, extra = {}) {
    return Object.assign({ id, parent, mxGeometry }, extra);
}

describe("sizing2", () => {
    it("resizes first-level cells and their children according to ratios", () => {
        // Structure: parent -> child1, child2 (child2 has its own child)
        const jsonObj = {
            mxGraphModel: {
                root: {
                    mxCell: [
                        makeCell("parent", "1", { width: 100, height: 100 }),
                        makeCell("child1", "parent", { x: 10, y: 10, width: 20, height: 20 }),
                        makeCell("child2", "parent", { x: 40, y: 40, width: 30, height: 30 }),
                        makeCell("grandchild", "child2", { x: 5, y: 5, width: 10, height: 10 }),
                    ],
                },
            },
        };

        // Resize parent to 200x300
        const result = sizing2(jsonObj, 200, 300, "1");
        const cells = result.mxGraphModel.root.mxCell;

        // Find cells by id
        const parent = cells.find(c => c.id === "parent");
        const child1 = cells.find(c => c.id === "child1");
        const child2 = cells.find(c => c.id === "child2");
        const grandchild = cells.find(c => c.id === "grandchild");

        // Parent should be resized
        expect(parent.mxGeometry.width).to.equal(200);
        expect(parent.mxGeometry.height).to.equal(300);

        // Ratio: x = 2, y = 3
        expect(child1.mxGeometry.x).to.equal(10 * 2);
        expect(child1.mxGeometry.y).to.equal(10 * 3);
        expect(child1.mxGeometry.width).to.equal(20 * 2);
        expect(child1.mxGeometry.height).to.equal(20 * 3);

        expect(child2.mxGeometry.x).to.equal(40 * 2);
        expect(child2.mxGeometry.y).to.equal(40 * 3);
        expect(child2.mxGeometry.width).to.equal(30 * 2);
        expect(child2.mxGeometry.height).to.equal(30 * 3);

        // Grandchild should be resized according to child2's ratio
        expect(grandchild.mxGeometry.x).to.equal(5 * 2);
        expect(grandchild.mxGeometry.y).to.equal(5 * 3);
        expect(grandchild.mxGeometry.width).to.equal(10 * 2);
        expect(grandchild.mxGeometry.height).to.equal(10 * 3);
    });

    it("skips resizing children with mxGeometry.relative == 1", () => {
        const jsonObj = {
            mxGraphModel: {
                root: {
                    mxCell: [
                        makeCell("parent", "1", { width: 100, height: 100 }),
                        makeCell("child", "parent", { x: 10, y: 10, width: 20, height: 20, relative: 1 }),
                    ],
                },
            },
        };

        const result = sizing2(jsonObj, 200, 300, "1");
        const cells = result.mxGraphModel.root.mxCell;
        const child = cells.find(c => c.id === "child");

        // Should not be resized
        expect(child.mxGeometry.x).to.equal(10);
        expect(child.mxGeometry.y).to.equal(10);
        expect(child.mxGeometry.width).to.equal(20);
        expect(child.mxGeometry.height).to.equal(20);
    });
});