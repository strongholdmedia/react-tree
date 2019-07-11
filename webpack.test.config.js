const path = require("path");

module.exports = {
    mode: "development",
    output: {
        filename: "index.js",
        libraryTarget: "umd",
        library: "ReactTree",
    },
    resolve: {
        alias: {
            "react-tree": path.resolve(__dirname, "src/js/Tree"),
        },
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                loader: "babel-loader",
            },
        ],
    },
};
