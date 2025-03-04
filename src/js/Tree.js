import classNames from "classnames";
import isEqual from "lodash/isEqual";
import nanoid from "nanoid";
import PropTypes from "prop-types";
import React from "react";

import Button from "./Button";
import NodeModel from "./NodeModel";
import TreeNode from "./TreeNode";
import iconsShape from "./shapes/iconsShape";
import languageShape from "./shapes/languageShape";
import listShape from "./shapes/listShape";
import nodeShape from "./shapes/nodeShape";

class Tree extends React.Component
{
    static propTypes = {
        nodes: PropTypes.arrayOf(nodeShape).isRequired,

        checked: listShape,
        disabled: PropTypes.bool,
        expandDisabled: PropTypes.bool,
        expandOnClick: PropTypes.bool,
        useCheckboxes: PropTypes.bool,
        expanded: listShape,
        labelProp: PropTypes.string,
        valueProp: PropTypes.string,
        icons: iconsShape,
        id: PropTypes.string,
        lang: languageShape,
        name: PropTypes.string,
        nameAsArray: PropTypes.bool,
        nativeCheckboxes: PropTypes.bool,
        noCascade: PropTypes.bool,
        onlyLeafCheckboxes: PropTypes.bool,
        optimisticToggle: PropTypes.bool,
        showExpandAll: PropTypes.bool,
        showNodeIcon: PropTypes.bool,
        showNodeTitle: PropTypes.bool,
        onCheck: PropTypes.func,
        onClick: PropTypes.func,
        onExpand: PropTypes.func,
    };

    static defaultProps = {
        checked: [],
        disabled: false,
        expandDisabled: false,
        expandOnClick: false,
        useCheckboxes: true,
        expanded: [],
        valueProp: "value",
        labelProp: "label",
        icons: {
            check: <span className="rt-icon rt-icon-check" />,
            uncheck: <span className="rt-icon rt-icon-uncheck" />,
            halfCheck: <span className="rt-icon rt-icon-half-check" />,
            expandClose: <span className="rt-icon rt-icon-expand-close" />,
            expandOpen: <span className="rt-icon rt-icon-expand-open" />,
            expandAll: <span className="rt-icon rt-icon-expand-all" />,
            collapseAll: <span className="rt-icon rt-icon-collapse-all" />,
            parentClose: <span className="rt-icon rt-icon-parent-close" />,
            parentOpen: <span className="rt-icon rt-icon-parent-open" />,
            leaf: <span className="rt-icon rt-icon-leaf" />,
        },
        id: null,
        lang: {
            collapseAll: "Collapse all",
            expandAll: "Expand all",
            toggle: "Toggle",
        },
        name: undefined,
        nameAsArray: false,
        nativeCheckboxes: false,
        noCascade: false,
        onlyLeafCheckboxes: false,
        optimisticToggle: true,
        showExpandAll: false,
        showNodeIcon: true,
        showNodeTitle: false,
        onCheck: () => { },
        onClick: null,
        onExpand: () => { },
    };

    constructor(props)
    {
        super(props);

        const model = new NodeModel(props);
        model.flattenNodes(props.nodes);
        model.deserializeLists({
            checked: props.checked,
            expanded: props.expanded,
        });

        this.state = {
            id: props.id || `rt-${ nanoid(7) }`,
            model,
            prevProps: props,
        };

        this.onCheck = this.onCheck.bind(this);
        this.onExpand = this.onExpand.bind(this);
        this.onNodeClick = this.onNodeClick.bind(this);
        this.onExpandAll = this.onExpandAll.bind(this);
        this.onCollapseAll = this.onCollapseAll.bind(this);
    }

    // eslint-disable-next-line react/sort-comp
    static getDerivedStateFromProps(newProps, prevState)
    {
        const { model, prevProps } = prevState;
        const { disabled, id, nodes } = newProps;
        let newState = { ...prevState, prevProps: newProps };

        // Apply new properties to model
        model.setProps(newProps);

        // Since flattening nodes is an expensive task, only update when there is a node change
        if (!isEqual(prevProps.nodes, nodes)
            || prevProps.disabled !== disabled
        ) {
            model.flattenNodes(nodes);
        }

        if (id !== null) {
            newState = { ...newState, id };
        }

        model.deserializeLists({
            checked: newProps.checked,
            expanded: newProps.expanded,
        });

        return newState;
    }

    onCheck(nodeInfo)
    {
        const { noCascade, onCheck } = this.props;
        const model = this.state.model.clone();
        const node = model.getNode(nodeInfo.value);

        model.toggleChecked(nodeInfo, nodeInfo.checked, noCascade);
        onCheck(model.serializeList("checked"), { ...node, ...nodeInfo });
    }

    onExpand(nodeInfo)
    {
        const { onExpand } = this.props;
        const model = this.state.model.clone();
        const node = model.getNode(nodeInfo.value);

        model.toggleNode(nodeInfo.value, "expanded", nodeInfo.expanded);
        onExpand(model.serializeList("expanded"), { ...node, ...nodeInfo });
    }

    onNodeClick(nodeInfo)
    {
        const { onClick } = this.props;
        const { model } = this.state;
        const node = model.getNode(nodeInfo.value);

        onClick({ ...node, ...nodeInfo });
    }

    onExpandAll()
    {
        this.expandAllNodes();
    }

    onCollapseAll()
    {
        this.expandAllNodes(false);
    }

    expandAllNodes(expand = true)
    {
        const { onExpand } = this.props;

        onExpand(
            this
                .state
                .model
                .clone()
                .expandAllNodes(expand)
                .serializeList("expanded")
        );
    }

    determineShallowCheckState(node, noCascade)
    {
        const flatNode = this.state.model.getNode(node[this.props.valueProp]);

        if (flatNode.isLeaf || noCascade) { return flatNode.checked ? 1 : 0; }

        if (this.isEveryChildChecked(node)) { return 1; }

        if (this.isSomeChildChecked(node)) { return 2; }

        return 0;
    }

    isEveryChildChecked(node)
    {
        let children = Array.isArray(node.children)
            ? node.children
            : (typeof node.children === "object" && node.children !== null
                ? Object.values(node.children)
                : []
            );

        return children.every(child => this.state.model.getNode(child[this.props.valueProp]).checkState === 1);
    }

    isSomeChildChecked(node)
    {
        let children = Array.isArray(node.children)
            ? node.children
            : (typeof node.children === "object" && node.children !== null
                ? Object.values(node.children)
                : []
            );

        return children.some(child => this.state.model.getNode(child[this.props.valueProp]).checkState > 0);
    }

    renderTreeNodes(nodes, parent = { })
    {
        const {
            expandDisabled,
            expandOnClick,
            icons,
            lang,
            noCascade,
            onClick,
            useCheckboxes,
            onlyLeafCheckboxes,
            optimisticToggle,
            showNodeTitle,
            showNodeIcon
        } = this.props;

        const { id, model } = this.state;
        const { icons: defaultIcons } = Tree.defaultProps;

        const nodeList = Array.isArray(nodes)
            ? nodes
            : Object.values(nodes);

        const treeNodes = nodeList.map((node) => {
            const key = node[this.props.valueProp];
            const flatNode = model.getNode(node[this.props.valueProp]);
            const children = flatNode.isParent ? this.renderTreeNodes(node.children, node) : null;

            // Determine the check state after all children check states have been determined
            // This is done during rendering as to avoid an additional loop during the
            // deserialization of the `checked` property
            flatNode.checkState = this.determineShallowCheckState(node, noCascade);

            // Show checkbox only if checkboxes are enabled in general, AND
            // either this is a leaf node or showCheckbox is true
            const showCheckbox = useCheckboxes && (onlyLeafCheckboxes ? flatNode.isLeaf : flatNode.showCheckbox);

            // Render only if parent is expanded or if there is no root parent
            const parentExpanded = parent[this.props.valueProp] ? model.getNode(parent[this.props.valueProp]).expanded : true;

            if (!parentExpanded) { return null; }

            return (
                <TreeNode
                    key={ key }
                    checked={ flatNode.checkState }
                    className={ node.className }
                    disabled={ flatNode.disabled }
                    expandDisabled={ expandDisabled }
                    expandOnClick={ expandOnClick }
                    expanded={ flatNode.expanded }
                    icon={ node.icon }
                    icons={ { ...defaultIcons, ...icons } }
                    label={ node[this.props.labelProp] }
                    lang={ lang }
                    optimisticToggle={ optimisticToggle }
                    isLeaf={ flatNode.isLeaf }
                    isParent={ flatNode.isParent }
                    showCheckbox={ showCheckbox }
                    showNodeIcon={ showNodeIcon }
                    title={ showNodeTitle ? node.title || node[this.props.labelProp] : node.title }
                    treeId={ id }
                    value={ node[this.props.valueProp] }
                    onCheck={ this.onCheck }
                    onClick={ onClick && this.onNodeClick }
                    onExpand={ this.onExpand }
                >
                    { children }
                </TreeNode>
            );
        });

        return (
            <ol>
                { treeNodes }
            </ol>
        );
    }

    renderExpandAll()
    {
        const { icons: { expandAll, collapseAll }, lang, showExpandAll } = this.props;

        if (!showExpandAll) { return null; }

        return (
            <div className="rt-options">
                <Button
                    className="rt-option rt-option-expand-all"
                    title={lang.expandAll}
                    onClick={this.onExpandAll}
                    >
                    {expandAll}
                </Button>
                <Button
                    className="rt-option rt-option-collapse-all"
                    title={lang.collapseAll}
                    onClick={this.onCollapseAll}
                    >
                    {collapseAll}
                </Button>
            </div>
        );
    }

    renderHiddenInput()
    {
        const { name, nameAsArray } = this.props;

        if (name === undefined) { return null; }

        if (nameAsArray) { return this.renderArrayHiddenInput(); }

        return this.renderJoinedHiddenInput();
    }

    renderArrayHiddenInput()
    {
        const { checked, name: inputName } = this.props;

        return checked.map((value) => {
            const name = `${inputName}[]`;

            return <input key={ value } name={ name } type="hidden" value={ value } />;
        });
    }

    renderJoinedHiddenInput()
    {
        const { checked, name } = this.props;
        const inputValue = checked.join(",");

        return <input name={ name } type="hidden" value={ inputValue } />;
    }

    render()
    {
        const { disabled, nodes, nativeCheckboxes } = this.props;
        const treeNodes = this.renderTreeNodes(nodes);

        const className = classNames({
            "react-tree": true,
            "rt-disabled": disabled,
            "rt-native-display": nativeCheckboxes,
        });

        return (
            <div className={ className }>
                { this.renderExpandAll() }
                { this.renderHiddenInput() }
                { treeNodes }
            </div>
        );
    }
}

export default Tree;
