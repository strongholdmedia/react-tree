# @dorgaren/react-vs-tree

[![npm](https://img.shields.io/npm/v/@dorgaren/react-vs-tree.svg?style=flat-square)](https://www.npmjs.com/package/@dorgaren/react-vs-tree)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/strongholdmedia/react-vs-tree/master/LICENSE.txt)

> A simple tree view control to be used with React
>
> This has been forked from [Jake Zatecky's React Checkbox Tree](https://www.npmjs.com/package/react-checkbox-tree).
> I also bumped the version quite somewhat.
> The reason for this primarily is that I need this to undergo _serious_ changes in a _very short time frame_.
> This is the reason for the renaming as well - the idea is to make the checkboxes completely optional.
>
> Should you have any problems about the above, please let me know.
> Should one need any new feature (provided that _they will manifest_) in the original package, feel free to re-integrate / merge / pull / whatnot.
>
> This component has been tested to work with _ES5_, _plain JS_ (that is, no JSX) and _Preact_.
> These possibilities are considered to be important and maintained.

## Usage

### Installation

Install the library using yarn:

```
yarn add @dorgaren/react-vs-tree
```

Using npm:

```
npm install --save @dorgaren/react-vs-tree
```

> **Note** &ndash; This library makes use of [Font Awesome](http://fontawesome.io/) styles and expects them to be loaded in the browser.
> If you don't have it, nor plan to use it, please be sure to provide your own `icons` elements.


### Include CSS

For your convenience, the library's styles can be consumed utilizing one of the following files:

* `node_modules/@dorgaren/react-vs-tree/lib/react-vs-tree.css`
* `node_modules/@dorgaren/react-vs-tree/src/less/react-vs-tree.less`
* `node_modules/@dorgaren/react-vs-tree/src/scss/react-vs-tree.scss`

Either include one of these files in your stylesheets or utilize a CSS loader:

``` javascript
import '@dorgaren/react-vs-tree/lib/react-vs-tree.css';
```


### Render Component

A quick usage example is included below.
Note that the react-vs-tree component is [controlled](https://facebook.github.io/react/docs/forms.html#controlled-components).
In other words, it is stateless.
You must update its `checked` and/or `expanded` properties whenever a change occurs.

***NOTE: from version 2.1.0 onwards, providing `nodes` as an object with e.g. ids
as keys instead of a flat array is supported.***

``` jsx
import React from "react";
import Tree from "react-vs-tree";

const nodes = [{
    value: 1,
    label: "Mars",
    children: [
        { value: 12, label: "Phobos" },
        { value: 13, label: "Deimos" },
    ]
}];

class Widget extends React.Component
{
    state = {
        checked: [],
        expanded: [],
    };

    render()
    {
        return (
            <Tree
                nodes={nodes}
                checked={this.state.checked}
                expanded={this.state.expanded}
                onCheck={checked => this.setState({ checked })}
                onExpand={expanded => this.setState({ expanded })}
            />
        );
    }
}
```

All node objects **must** have a unique `value`. This value is serialized into the `checked` and `expanded` arrays and is also used for performance optimizations.

#### Changing the Default Icons

By default, **react-vs-tree** uses Font Awesome for the various icons that appear in the tree. To change the defaults, simply pass in the `icons` property and override the defaults. Note that you can override as many or as little icons as you like:

``` jsx
<Tree
    ...
    icons={{
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
    }}
/>
```

If you are using the [`react-fontawesome`](https://github.com/FortAwesome/react-fontawesome) library, you can also directly substitute those icons:

``` jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

...

<Tree
    ...
    icons={{
        check: <FontAwesomeIcon className="rt-icon rt-icon-check" icon="check-square" />,
        uncheck: <FontAwesomeIcon className="rt-icon rt-icon-uncheck" icon={['fas', 'square']} />,
        halfCheck: <FontAwesomeIcon className="rt-icon rt-icon-half-check" icon="check-square" />,
        expandClose: <FontAwesomeIcon className="rt-icon rt-icon-expand-close" icon="chevron-right" />,
        expandOpen: <FontAwesomeIcon className="rt-icon rt-icon-expand-open" icon="chevron-down" />,
        expandAll: <FontAwesomeIcon className="rt-icon rt-icon-expand-all" icon="plus-square" />,
        collapseAll: <FontAwesomeIcon className="rt-icon rt-icon-collapse-all" icon="minus-square" />,
        parentClose: <FontAwesomeIcon className="rt-icon rt-icon-parent-close" icon="folder" />,
        parentOpen: <FontAwesomeIcon className="rt-icon rt-icon-parent-open" icon="folder-open" />,
        leaf: <FontAwesomeIcon className="rt-icon rt-icon-leaf-close" icon="file" />
    }}
/>
```

### Properties

| Property             | Type     | Description                                                                                                            | Default     |
| -------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------- | ----------- |
| `nodes`              | array    | **Required**. Specifies the tree nodes and their children.                                                             |             |
| `checked`            | array    | An array of checked node values.                                                                                       | `[]`        |
| `disabled`           | bool     | If true, the component will be disabled and nodes cannot be checked.                                                   | `false`     |
| `expandDisabled`     | bool     | If true, the ability to expand nodes will be disabled.                                                                 | `false`     |
| `expandOnClick`      | bool     | If true, nodes will be expanded by clicking on labels. Requires a non-empty `onClick` function.                        | `false`     |
| `icons`              | object   | An object containing the mappings for the various icons and their components. See **Changing the Default Icons**.      | `{ ... }`   |
| `id`                 | string   | A string to be used for the HTML ID of the rendered tree and its nodes.                                                | `null`      |
| `expanded`           | array    | An array of expanded node values.                                                                                      | `[]`        |
| `labelProp`          | string   | The name for the "label" property for nodes, now configurable                                                          | `"label"`   |
| `valueProp`          | string   | The name for the "value" property for nodes, now configurable                                                          | `"value"`   |
| `lang`               | object   | An object containing the language mappings for the various text elements.                                              | `{ ... }`   |
| `name`               | string   | Optional name for the hidden `<input>` element.                                                                        | `undefined` |
| `nameAsArray`        | bool     | If true, the hidden `<input>` will encode its values as an array rather than a joined string.                          | `false`     |
| `nativeCheckboxes`   | bool     | If true, native browser checkboxes will be used instead of pseudo-checkbox icons.                                      | `false`     |
| `noCascade`          | bool     | If true, toggling a parent node will **not** cascade its check state to its children.                                  | `false`     |
| `onlyLeafCheckboxes` | bool     | If true, checkboxes will only be shown for leaf nodes.                                                                 | `false`     |
| `optimisticToggle`   | bool     | If true, toggling a partially-checked node will select all children. If false, it will deselect.                       | `true`      |
| `showCheckboxes`     | bool     | If true, checkboxes are displayed by default to be able to select any node, leaf or not                                | `true`      |
| `showExpandAll`      | bool     | If true, buttons for expanding and collapsing all parent nodes will appear in the tree.                                | `false`     |
| `showNodeIcon`       | bool     | If true, each node will show a parent or leaf icon.                                                                    | `true`      |
| `showNodeTitle`      | bool     | If true, the `label` of each node will become the `title` of the resulting DOM node. Overridden by `node.title`.       | `false`     |
| `onCheck`            | function | onCheck handler: `function(checked, targetNode) {}`                                                                    | `() => {}`  |
| `onClick`            | function | onClick handler: `function(targetNode) {}`. If set, `onClick` will be called when a node's label has been clicked.     | `() => {}`  |
| `onExpand`           | function | onExpand handler: `function(expanded, targetNode) {}`                                                                  | `() => {}`  |

#### `onCheck` and `onExpand`

#### Node Properties

Individual nodes within the `nodes` property can have the following structure:

| Property       | Type   | Description                              | Default |
| -------------- | ------ | ---------------------------------------- | ------- |
| `label`        | mixed  | **Required**. The node's label           |         |
| `value`        | mixed  | **Required**. The node's value           |         |
| `children`     | array  | An array of child nodes                  | `null`  |
| `className`    | string | A className to add to the node           | `null`  |
| `disabled`     | bool   | Whether the node should be disabled      | `false` |
| `icon`         | mixed  | A custom icon for the node               | `null`  |
| `showCheckbox` | bool   | Whether the node should show a checkbox  | `true`  |
| `title`        | string | A custom `title` attribute for the node  | `null`  |
