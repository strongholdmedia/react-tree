import React from "react";
import Tree from "react-tree";

const nodes = [
    {
        value: "/app",
        label: "app",
        children: [
            {
                value: "/app/Http",
                label: "Http",
                children: [
                    {
                        value: "/app/Http/Controllers",
                        label: "Controllers",
                        children: [{
                            value: "/app/Http/Controllers/WelcomeController.js",
                            label: "WelcomeController.js",
                        }],
                    },
                    {
                        value: "/app/Http/routes.js",
                        label: "routes.js",
                    },
                ],
            },
            {
                value: "/app/Providers",
                label: "Providers",
                children: [{
                    value: "/app/Http/Providers/EventServiceProvider.js",
                    label: "EventServiceProvider.js",
                }],
            },
        ],
    },
    {
        value: "/config",
        label: "config",
        children: [
            {
                value: "/config/app.js",
                label: "app.js",
            },
            {
                value: "/config/database.js",
                label: "database.js",
            },
        ],
    },
    {
        value: "/public",
        label: "public",
        children: [
            {
                value: "/public/assets/",
                label: "assets",
                children: [{
                    value: "/public/assets/style.css",
                    label: "style.css",
                }],
            },
            {
                value: "/public/index.html",
                label: "index.html",
            },
        ],
    },
    {
        value: "/.env",
        label: ".env",
    },
    {
        value: "/.gitignore",
        label: ".gitignore",
    },
    {
        value: "/README.md",
        label: "README.md",
    },
];

class ExpandAllExample extends React.Component {
    state = {
        checked: [
            "/app/Http/Controllers/WelcomeController.js",
            "/app/Http/routes.js",
            "/public/assets/style.css",
            "/public/index.html",
            "/.gitignore",
        ],
        expanded: [
            "/app",
        ],
    };

    constructor(props) {
        super(props);

        this.onCheck = this.onCheck.bind(this);
        this.onExpand = this.onExpand.bind(this);
    }

    onCheck(checked) {
        this.setState({ checked });
    }

    onExpand(expanded) {
        this.setState({ expanded });
    }

    render() {
        const { checked, expanded } = this.state;

        return (
            <div className="expand-all-container">
                <Tree
                    checked={checked}
                    expanded={expanded}
                    nodes={nodes}
                    showExpandAll
                    onCheck={this.onCheck}
                    onExpand={this.onExpand}
                />
            </div>
        );
    }
}

export default ExpandAllExample;
