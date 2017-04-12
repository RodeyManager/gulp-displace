/**
 * Created by Rodey on 2017/4/5.
 */
var fs          = require('fs'),
    util        = require('util'),
    through2    = require('through2'),
    PluginError = require('gulp-util').PluginError;

var PLUGIN_NAME = 'gulp-displace';

//获取文件内容
function getFileContent(file){
    if(!fs.existsSync(file)) return '';
    return fs.readFileSync(file, { encoding: 'utf8' });
}

function placeString(content, options){
    var search = options.search,
        result = options.result;

    if(search instanceof RegExp){
        content = content.replace(search, function(){
            return 'function' === typeof result ? result.apply(null, arguments) : result;
        });
    }else{
        content = content.replace(search, 'function' === typeof result ? result() : result);
    }
    return content;

}

var displace = function(options){
    var option = util._extend({
        search: null,
        result: null
    }, options || {});
    return through2.obj(function(file, enc, next){

        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Stream content is not supported'));
            return next(null, file);
        }

        if (file.isBuffer()) {
            try {
                var content = getFileContent(file.path) || file.contents.toString('utf8') || '';
                content = placeString(content, option);
                console.log(content);
                file.contents = new Buffer(content);
            }
            catch (err) {
                this.emit('error', new PluginError(PLUGIN_NAME, ''));
            }
        }
        this.push(file);
        return next();

    });

};

module.exports = displace;