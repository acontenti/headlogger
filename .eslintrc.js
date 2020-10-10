module.exports = {
	root: false,
	env: {
		browser: true,
		node: true
	},
	parserOptions: {
		parser: "babel-eslint"
	},
	extends: [
		"@nuxtjs",
		"plugin:nuxt/recommended"
	],
	plugins: [],
	// add your custom rules here
	rules: {
		indent: "off",
		"no-tabs": "off",
		semi: "off",
		quotes: "off",
		"object-curly-spacing": "off",
		"space-before-function-paren": "off",
		"no-throw-literal": "off",
		"padded-blocks": "off",
		"no-useless-return": "warn",
		"no-mixed-spaces-and-tabs": "warn",
		"vue/max-attributes-per-line": "off",
		"arrow-parens": "off"
	}
};
