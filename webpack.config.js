/*
|	Commands
| 	npm run build 	-> to build on dist
| 	npm start 		-> to start the server
*/

// modules
const path 		= require('path');
const merge 	= require('webpack-merge');
const webpack 	= require('webpack');
const NpmInstallPlugin = require('npm-install-webpack-plugin');
// 
const TARGET 	= process.env.npm_lifecyle_event;
const PATHS 	= {
	app: 	path.join(__dirname,'app'),
	build: 	path.join(__dirname,'build')
};

process.env.BABEL_ENV = 'start';

const common = {
	entry: {
		app: PATHS.app,
	},
	// Add resolve.extensions.
	// '' is needed to allow imports without an extension.
	// Note the .'s before extensions as it will fail to match without!!!
	resolve: {
		extensions: ['','.js','.jsx']
	},
	output: {
		path: PATHS.build,
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{
				// Test expects a RegExp! Note the slashes
				test: /\.css$/,
				loaders: ['style','css'],
				// Include accepts either a path or an array of paths.
				include: PATHS.app
			},
			// Set up .jsx. This accepts js too thanks to RegExp
			{
				test: /\.jsx?$/,
				// Enabling caching for improved performance during development
				// it uses default OS directory by default. If you need something
				// more custom, pass a path to it. I.e., babel?cacheDirectory=<path>
				loaders: ['babel?cacheDirectory'],
				// Parse only app files! without this it will go through entire project.
				// In addition to being slow, that will most likely result in an error.
				include: PATHS.app
			}
		]
	}
};

// DEFAULT config
if(TARGET === 'start' || !TARGET) {
	module.exports = merge(common, {
		devtool: 'eval-source-map',
		devServer: {
			contentBase: PATHS.build,
			historyApiFallback: true,
			hot: true,
			inline: true,
			progress: true,
			stats: 'errors-only',
			host: process.env.HOST,
			port: process.env.PORT
		},
		plugins: [
			new webpack.HotModuleReplacementPlugin(),
			new NpmInstallPlugin({
				save: true // --save
			})
		]
	});
}
if(TARGET === 'build') {
	module.export = merge(common,{});
}
