var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin")
var TextWebpackPlugin = require("extract-text-webpack-plugin")

HtmlWebpackPlugin.prototype.generateAssetTags__ = HtmlWebpackPlugin.prototype.generateAssetTags;
HtmlWebpackPlugin.prototype.generateAssetTags = function(args){
	args.js = args.js.map(function(js){
		return js.substr(args.publicPath.length);
	})
	return this.generateAssetTags__.apply(this,arguments);
}
var path = require("path")
var glob = require("glob")

var entry = {};
glob.sync("./src/entry/**/index.js").forEach(function(src){
	entry[getEntryKey(src)] = src;
})
var plugins = glob.sync("./src/entry/**/index.html").map(function(src){
	console.log(getEntryKey(src),Math.random())
	return new HtmlWebpackPlugin({
		filename : src.replace("src",""),
		template : src,
		title : src,
		hash:true,
		cache:true,
		chunks : [getEntryKey(src),"common.js"]
	})
	
});
module.exports = {
	entry  : entry,
	output : {
		filename : "[name].js",
		path     : path.join(__dirname,"./dist")
	},
	plugins : [
		new webpack.optimize.CommonsChunkPlugin({name:"common.js"})
	].concat(plugins)
}

function getEntryKey(src){
	return src.substr(6).replace(/\.\w+/,"");
}