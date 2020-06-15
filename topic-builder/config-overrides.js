const { injectBabelPlugin } = require("react-app-rewired");

module.exports = function override(config, env) {
    config.entry.unshift("react-hot-loader/patch");
    let babelLoader = config.module.rules
        .find(d => d.oneOf)
        .oneOf.find(d => d.loader && d.loader.indexOf("babel-loader") > -1);
    babelLoader.options = babelLoader.options || {};
    babelLoader.options.plugins = babelLoader.options.plugins || [];
    babelLoader.options.plugins.push("extract-hoc/babel");
    babelLoader.options.plugins.push("react-hot-loader/babel");

    config = injectBabelPlugin(
        [
            "import",
            { libraryName: "antd", libraryDirectory: "es", style: "css" }
        ],
        config
    );
    config.module.rules.push({
        test: /\.worker\.js$/,
        use: { loader: "worker-loader" }
    });
    return config;
};

/*{
  module: {
    rules: [
      {
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' }
      }
    ]
  }
}*/
