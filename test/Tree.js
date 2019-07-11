import React from "react";
import { shallow, mount } from "enzyme";
import { assert } from "chai";

import Tree from "../src/js/Tree";
import TreeNode from "../src/js/TreeNode";

describe("<Tree />", () =>
{
        describe("component", () =>
        {
            it("should render the react-tree container", () =>
            {
                const wrapper = shallow(
                    <Tree
                        nodes={ [] }
                        onCheck={ () => {} }
                        onExpand={ () => {} }
                    />,
                );

                assert.isTrue(wrapper.find(".react-tree").exists());
            });
        });

    describe("checked", () =>
    {
        it("should not throw an exception if it contains values that are not in the `nodes` property", () =>
        {
            const wrapper = shallow(
                <Tree
                    checked={ [ "neptune" ] }
                    nodes={ [ { value: "jupiter", label: "Jupiter" } ] }
                />,
            );

            assert.isTrue(wrapper.find(".react-tree").exists());
        });
    });

    describe("disabled", () =>
    {
        it("should add the class rt-disabled to the root", () =>
        {
            const wrapper = shallow(
                <Tree disabled nodes={ [] } />,
            );

            assert.isTrue(wrapper.find(".react-tree.rt-disabled").exists());
        });
    });

    describe("expanded", () =>
    {
        it("should not throw an exception if it contains values that are not in the `nodes` property", () =>
        {
            const wrapper = shallow(
                <Tree
                    expanded={ [ "mars" ] }
                    nodes={ [ { value: "jupiter", label: "Jupiter" } ] }
                />,
            );

            assert.isTrue(wrapper.find(".react-tree").exists());
        });
    });

    describe("icons", () =>
    {
        it("should pass the property directly to tree nodes", () =>
        {
            const wrapper = shallow(
                <Tree
                    icons={ { check: <span className="other-check" /> } }
                    nodes={ [ { value: "jupiter", label: "Jupiter" } ] }
                />,
            );

            assert.equal("other-check", shallow(
                wrapper.find(TreeNode).prop("icons").check,
            ).prop("className"));
        });

        it("should be merged in with the defaults when keys are missing", () =>
        {
            const wrapper = shallow(
                <Tree
                    icons={ { check: <span className="other-check" /> } }
                    nodes={ [ { value: "jupiter", label: "Jupiter" } ] }
                />,
            );

            assert.equal("rt-icon rt-icon-uncheck", shallow(
                wrapper.find(TreeNode).prop("icons").uncheck,
            ).prop("className"));
        });
    });

    describe("id", () =>
    {
        it("should pass the property directly to tree nodes", () =>
        {
            const wrapper = shallow(
                <Tree
                    id="my-awesome-id"
                    nodes={ [ { value: "jupiter", label: "Jupiter" } ] }
                />,
            );

            assert.equal("my-awesome-id", wrapper.find(TreeNode).prop("treeId"));
        });
    });

    describe("lang", () =>
    {
        it("should override default language values", () =>
        {
            const wrapper = shallow(
                <Tree
                    lang={ {
                        expandAll: "Expand it",
                        collapseAll: "Collapse it",
                        toggle: "Toggle it",
                    } }
                    nodes={ [] }
                    showExpandAll
                />,
            );

            assert.equal("Expand it", wrapper.find(".rt-option-expand-all").prop("title"));
        });
    });

    describe("nativeCheckboxes", () =>
    {
        it("should add the class rt-native-display to the root", () =>
        {
            const wrapper = shallow(
                <Tree nativeCheckboxes nodes={ [] } />,
            );

            assert.isTrue(wrapper.find(".react-tree.rt-native-display").exists());
        });
    });

    describe("nodes", () =>
    {
        it("should render the node\"s label", () =>
        {
            const wrapper = shallow(
                <Tree
                    nodes={ [ { value: "jupiter", label: "Jupiter" } ] }
                />,
            );

            assert.equal("Jupiter", wrapper.find(TreeNode).prop("label"));
        });

        it("should render the node\"s value", () =>
        {
            const wrapper = shallow(
                <Tree
                    nodes={ [ { value: "jupiter", label: "Jupiter" } ] }
                />,
            );

            assert.equal("jupiter", wrapper.find(TreeNode).prop("value"));
        });

        it("should render multiple nodes", () =>
        {
            const wrapper = shallow(
                <Tree
                    nodes={ [
                        { value: "jupiter", label: "Jupiter" },
                        { value: "saturn", label: "Saturn" },
                    ] }
                />,
            );

            assert.equal("jupiter", wrapper.find(TreeNode).at(0).prop("value"));
            assert.equal("saturn", wrapper.find(TreeNode).at(1).prop("value"));
        });

        it("should render node children", () =>
        {
            const wrapper = shallow(
                <Tree
                    nodes={ [
                        {
                            value: "jupiter",
                            label: "Jupiter",
                            children: [
                                { value: "io", label: "Io" },
                                { value: "europa", label: "Europa" },
                            ],
                        },
                    ] }
                />,
            );

            assert.deepEqual(
                wrapper.find(TreeNode).prop("children").props,
                { children: [null, null] },
            );
        });
    });

    describe("noCascade", () =>
    {
        it("should not toggle the check state of children when set to true", () =>
        {
            let actual = null;

            const wrapper = mount(
                <Tree
                    noCascade
                    nodes={ [
                        {
                            value: "jupiter",
                            label: "Jupiter",
                            children: [
                                { value: "io", label: "Io" },
                                { value: "europa", label: "Europa" },
                            ],
                        },
                    ] }
                    onCheck={ (checked) =>
                    {
                        actual = checked;
                    } }
                />
            );

            wrapper.find("TreeNode input[type=\"checkbox\"]").simulate("click");
            assert.deepEqual([ "jupiter" ], actual);
        });

        it("should toggle the check state of children when set to false", () =>
        {
            let actual = null;

            const wrapper = mount(
                <Tree
                    nodes={ [
                        {
                            value: "jupiter",
                            label: "Jupiter",
                            children: [
                                { value: "io", label: "Io" },
                                { value: "europa", label: "Europa" },
                            ],
                        },
                    ] }
                    onCheck={ (checked) => { actual = checked; } }
                />,
            );

            wrapper.find("TreeNode input[type=\"checkbox\"]").simulate("click");
            assert.deepEqual([ "io", "europa" ], actual);
        });
    });

    describe("nodeProps", () =>
    {
        describe("disabled", () =>
        {
            it("should disable the target node when set to true", () =>
            {
                const wrapper = shallow(
                    <Tree
                        nodes={ [
                            {
                                value: "jupiter",
                                label: "Jupiter",
                                disabled: true,
                                children: [
                                    { value: "europa", label: "Europa" },
                                ],
                            },
                        ] }
                    />,
                );

                assert.isTrue(wrapper.find(TreeNode).prop("disabled"));
            });

            it("should disable the child nodes when `noCascade` is false", () =>
            {
                const wrapper = shallow(
                    <Tree
                        expanded={ [ "jupiter" ] }
                        nodes={ [
                            {
                                value: "jupiter",
                                label: "Jupiter",
                                disabled: true,
                                children: [
                                    { value: "europa", label: "Europa" },
                                ],
                            },
                        ] }
                    />,
                );

                assert.isTrue(wrapper.find("TreeNode[value=\"europa\"]").prop("disabled"));
            });

            it("should NOT disable the child nodes when `noCascade` is true", () =>
            {
                const wrapper = shallow(
                    <Tree
                        expanded={ [ "jupiter" ] }
                        noCascade
                        nodes={ [
                            {
                                value: "jupiter",
                                label: "Jupiter",
                                disabled: true,
                                children: [
                                    { value: "europa", label: "Europa" },
                                ],
                            },
                        ] }
                    />,
                );

                assert.isFalse(wrapper.find("TreeNode[value=\"europa\"]").prop("disabled"));
            });

            // https://github.com/jakezatecky/react-checkbox-tree/issues/119
            it("should be able to change disabled state after the initial render", () =>
            {
                const wrapper = shallow(
                    <Tree
                        disabled
                        expanded={ [ "jupiter" ] }
                        nodes={ [
                            {
                                value: "jupiter",
                                label: "Jupiter",
                                children: [
                                    { value: "europa", label: "Europa" },
                                ],
                            },
                        ] }
                    />,
                );

                wrapper.setProps({ disabled: false });

                assert.isFalse(wrapper.find("TreeNode[value=\"europa\"]").prop("disabled"));
            });
        });
    });

    describe("onlyLeafCheckboxes", () =>
    {
        it("should only render show checkboxes for leaf nodes", () =>
        {
            const wrapper = mount(
                <Tree
                    expanded={ [ "jupiter" ] }
                    nodes={ [
                        {
                            value: "jupiter",
                            label: "Jupiter",
                            children: [
                                { value: "io", label: "Io" },
                                { value: "europa", label: "Europa" },
                            ],
                        },
                    ] }
                    onlyLeafCheckboxes
                />,
            );

            assert.isFalse(wrapper.find("TreeNode[value=\"jupiter\"]").prop("showCheckbox"));
            assert.isTrue(wrapper.find("TreeNode[value=\"io\"]").prop("showCheckbox"));
            assert.isTrue(wrapper.find("TreeNode[value=\"europa\"]").prop("showCheckbox"));
        });
    });

    describe("showExpandAll", () =>
    {
        it("should render the expand all/collapse all buttons", () =>
        {
            const wrapper = shallow(
                <Tree
                    nodes={ [ { value: "jupiter", label: "Jupiter" } ] }
                    showExpandAll
                />,
            );

            assert.isTrue(wrapper.find(".rt-options .rt-option-expand-all").exists());
            assert.isTrue(wrapper.find(".rt-options .rt-option-collapse-all").exists());
        });

        describe("expandAll", () =>
        {
            it("should add all parent nodes to the `expanded` array", () =>
            {
                let actualExpanded = null;
                const wrapper = shallow(
                    <Tree
                        nodes={[
                            {
                                value: "mercury",
                                label: "Mercury",
                            },
                            {
                                value: "mars",
                                label: "Mars",
                                children: [
                                    { value: "phobos", label: "Phobos" },
                                    { value: "deimos", label: "Deimos" },
                                ],
                            },
                            {
                                value: "jupiter",
                                label: "Jupiter",
                                children: [
                                    { value: "io", label: "Io" },
                                    { value: "europa", label: "Europa" },
                                ],
                            },
                        ]}
                        showExpandAll
                        onExpand={ (expanded) => { actualExpanded = expanded; } }
                    />
                );

                wrapper.find(".rt-option-expand-all").simulate("click");
                assert.deepEqual(["mars", "jupiter"], actualExpanded);
            });
        });

        describe("collapseAll", () =>
        {
            it("should remove all nodes from the `expanded` array", () =>
            {
                let actualExpanded = null;
                const wrapper = shallow(
                    <Tree
                        expanded={["mars", "jupiter"]}
                        nodes={[
                            {
                                value: "mercury",
                                label: "Mercury",
                            },
                            {
                                value: "mars",
                                label: "Mars",
                                children: [
                                    { value: "phobos", label: "Phobos" },
                                    { value: "deimos", label: "Deimos" },
                                ],
                            },
                            {
                                value: "jupiter",
                                label: "Jupiter",
                                children: [
                                    { value: "io", label: "Io" },
                                    { value: "europa", label: "Europa" },
                                ],
                            },
                        ]}
                        showExpandAll
                        onExpand={ (expanded) => { actualExpanded = expanded; } }
                    />,
                );

                wrapper.find(".rt-option-collapse-all").simulate("click");
                assert.deepEqual([], actualExpanded);
            });
        });
    });

    describe("showNodeTitle", () =>
    {
        it("should add `title` properties to a TreeNode from the `label` property when set", () =>
        {
            const wrapper = shallow(
                <Tree
                    nodes={[
                        {
                            value: "jupiter",
                            label: "Jupiter",
                        },
                    ]}
                    showNodeTitle
                />,
            );

            assert.equal("Jupiter", wrapper.find("TreeNode").prop("title"));
        });

        it("should prioritize the node `title` over the `label", () =>
        {
            const wrapper = shallow(
                <Tree
                    nodes={[
                        {
                            value: "jupiter",
                            label: "Jupiter",
                            title: "That Big Failed Star",
                        },
                    ]}
                    showNodeTitle
                />,
            );

            assert.equal("That Big Failed Star", wrapper.find("TreeNode").prop("title"));
        });
    });

    describe("onCheck", () =>
    {
        it("should add all children of the checked parent to the checked array", () =>
        {
            let actualChecked = null;

            const wrapper = mount(
                <Tree
                    nodes={[
                        {
                            value: "jupiter",
                            label: "Jupiter",
                            children: [
                                { value: "io", label: "Io" },
                                { value: "europa", label: "Europa" },
                            ],
                        },
                    ]}
                    onCheck={ (checked) => { actualChecked = checked; } }
                />,
            );

            wrapper.find("TreeNode input[type=\"checkbox\"]").simulate("click");
            assert.deepEqual(["io", "europa"], actualChecked);
        });

        it("should not add disabled children to the checked array", () =>
        {
            let actualChecked = null;

            const wrapper = mount(
                <Tree
                    nodes={[
                        {
                            value: "jupiter",
                            label: "Jupiter",
                            children: [
                                { value: "io", label: "Io", disabled: true },
                                { value: "europa", label: "Europa" },
                            ],
                        },
                    ]}
                    onCheck={ (checked) => { actualChecked = checked; } }
                />,
            );

            wrapper.find("TreeNode input[type=\"checkbox\"]").simulate("click");
            assert.deepEqual(["europa"], actualChecked);
        });

        it("should pass the node toggled as the second parameter", () =>
        {
            let actualNode = null;

            const wrapper = mount(
                <Tree
                    nodes={[
                        {
                            value: "jupiter",
                            label: "Jupiter",
                            children: [
                                { value: "io", label: "Io" },
                                { value: "europa", label: "Europa" },
                            ],
                        },
                    ]}
                    onCheck={ (checked, node) => { actualNode = node; } }
                />
            );

            wrapper.find("TreeNode input[type=\"checkbox\"]").simulate("click");
            assert.equal("jupiter", actualNode.value);
        });
    });

    describe("onClick", () =>
    {
        it("should pass the node clicked as the first parameter", () =>
        {
            let actualNode = null;

            const wrapper = mount(
                <Tree
                    nodes={[
                        {
                            value: "jupiter",
                            label: "Jupiter",
                            children: [
                                { value: "io", label: "Io" },
                                { value: "europa", label: "Europa" },
                            ],
                        },
                    ]}
                    onClick={ (node) => { actualNode = node; } }
                />
            );

            wrapper.find(".rt-node-clickable").simulate("click");
            assert.equal("jupiter", actualNode.value);
        });
    });

    describe("onExpand", () =>
    {
        it("should toggle the expansion state of the target node", () =>
        {
            let actualExpanded = null;

            const wrapper = mount(
                <Tree
                    nodes={[
                        {
                            value: "jupiter",
                            label: "Jupiter",
                            children: [
                                { value: "io", label: "Io" },
                                { value: "europa", label: "Europa" },
                            ],
                        },
                    ]}
                    onExpand={ (expanded) => { actualExpanded = expanded; } }
                />,
            );

            wrapper.find("TreeNode Button.rt-collapse-btn").simulate("click");
            assert.deepEqual(["jupiter"], actualExpanded);
        });

        it("should pass the node toggled as the second parameter", () =>
        {
            let actualNode = null;

            const wrapper = mount(
                <Tree
                    nodes={[
                        {
                            value: "jupiter",
                            label: "Jupiter",
                            children: [
                                { value: "io", label: "Io" },
                                { value: "europa", label: "Europa" },
                            ],
                        },
                    ]}
                    onExpand={ (expanded, node) => { actualNode = node; } }
                />,
            );

            wrapper.find("TreeNode Button.rt-collapse-btn").simulate("click");
            assert.equal("jupiter", actualNode.value);
        });
    });

    describe("handler.targetNode", () =>
    {
        it("should supply a variety of metadata relating to the target node", () =>
        {
            let checkNode = null;
            let expandNode = null;
            let clickNode = null;

            const getNodeMetadata = (node) =>
            {
                const {
                    value,
                    label,
                    isLeaf,
                    isParent,
                    treeDepth,
                    index,
                    parent: { value: parentValue },
                } = node;

                return {
                    value,
                    label,
                    isLeaf,
                    isParent,
                    treeDepth,
                    index,
                    parentValue,
                };
            };
            const wrapper = mount(
                <Tree
                    expanded={["jupiter"]}
                    nodes={[
                        {
                            value: "jupiter",
                            label: "Jupiter",
                            children: [
                                { value: "io", label: "Io" },
                                { value: "europa", label: "Europa" },
                            ],
                        },
                    ]}
                    onCheck={ (checked, node) => { checkNode = node; } }
                    onClick={ (node) => { clickNode = node; } }
                    onExpand={ (expanded, node) => { expandNode = node; } }
                />
            );

            const expectedLeafMetadata = {
                value: "io",
                label: "Io",
                isLeaf: true,
                isParent: false,
                treeDepth: 1,
                index: 0,
                parentValue: "jupiter",
            };

            const expectedParentMetadata = {
                value: "jupiter",
                label: "Jupiter",
                isLeaf: false,
                isParent: true,
                treeDepth: 0,
                index: 0,
                parentValue: undefined,
            };

            // onCheck
            wrapper.find("TreeNode").at(1).find("input[type=\"checkbox\"]").simulate("click");
            assert.deepEqual(expectedLeafMetadata, getNodeMetadata(checkNode));

            // onClick
            wrapper.find("TreeNode").at(1).find(".rt-node-clickable").simulate("click");
            assert.deepEqual(expectedLeafMetadata, getNodeMetadata(clickNode));

            // onExpand
            wrapper.find("TreeNode").at(0).find("Button.rt-collapse-btn").simulate("click");
            assert.deepEqual(expectedParentMetadata, getNodeMetadata(expandNode));
        });
    });
});
