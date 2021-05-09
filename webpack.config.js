var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

    target: 'web',
    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        modules: ["src", "node_modules"],
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".js", ".jsx", ".ts", ".tsx"]
    },

    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader"
                    }
                ]
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ]
    },

    plugins: [new HtmlWebpackPlugin()]
};