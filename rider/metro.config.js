const { withNativeWind } = require("nativewind/metro");
const { getDefaultConfig } = require("@expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

// Custom changes
defaultConfig.resolver.sourceExts.push("cjs");
defaultConfig.resolver.unstable_enablePackageExports = false;

// Wrap with NativeWind
module.exports = withNativeWind(defaultConfig, { input: "./global.css" });
