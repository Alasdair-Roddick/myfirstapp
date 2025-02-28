const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts = [...config.resolver.sourceExts, "cjs"];

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("metro-react-native-babel-transformer"),
};

module.exports = config;
