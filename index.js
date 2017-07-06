/**
 * Created by Rodey on 2017/4/5.
 */

'use strict';

const
    fs          = require('fs'),
    util        = require('util'),
    through2    = require('through2'),
    PluginError = require('gulp-util').PluginError;

const PLUGIN_NAME = 'gulp-displace';

function placeString(content, options){
    let search = options.search,
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
    let option = util._extend({
        search: null,
        result: null
    }, options || {});
    return through2.obj(function(file, enc, next){

        if(file.isNull()){
            return next(null, file);
        }

        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Stream content is not supported'));
            return next(null, file);
        }

        if (file.isBuffer()) {
            try {
                let content = file.contents.toString('utf8') || '';
                let discontent = placeString(content, option) || content;
                file.contents = new Buffer(discontent);
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