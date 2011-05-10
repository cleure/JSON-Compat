/**
* JSON Compatibility. For older browsers, it creates a JSON object with
* stringify and parse methods. This code was originally written by
* Brantley Harris, under the MIT License, and later adapted for this
* project.
*
* http://code.google.com/p/jquery-json/
**/
if (typeof(JSON) !== 'object') {
    var JSON = {};
    JSON.escapeable = /["\\\x00-\x1f\x7f-\x9f]/g; // "
    
    JSON.meta = {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"': '\\"',
        '\\': '\\\\'
    };
    
    JSON.quoteString = function(str) {
        if (str.match(this.escapeable)) {
            str = str.replace(this.escapeable, function(a) {
                var c = JSON.meta[a];
                if (typeof(c) === 'string') {return c;}
                
                c = a.charCodeAt();
                return '\\u00' + Math.floor(c / 16).toString(16)
                    + (c % 16).toString(16);
            });
        }
        
        return '"' + str + '"';
    };
        
    JSON.stringify = function(o) {
        var t = typeof(o);
        
        if (t === null) {return 'null';}
        if (t === 'undefined') {return undefined;}
        if (t === 'number' || t === 'boolean') {return o + '';}
        if (t === 'string') {return this.quoteString(o);}
        if (t === 'object') {
            if (typeof(o.toJSON) === 'function') {return this.stringify(o.toJSON());}
            if (o.constructor === Date) {
                var month = o.getUTCMonth() + 1;
                if (month < 10) {month = '0' + month;}

                var day = o.getUTCDate();
                if (day < 10) {day = '0' + day;}

                var year = o.getUTCFullYear();

                var hours = o.getUTCHours();
                if (hours < 10) {hours = '0' + hours;}

                var minutes = o.getUTCMinutes();
                if (minutes < 10) {minutes = '0' + minutes;}

                var seconds = o.getUTCSeconds();
                if (seconds < 10) {seconds = '0' + seconds;}

                var milli = o.getUTCMilliseconds();
                if (milli < 100) {milli = '0' + milli;}
                if (milli < 10) {milli = '0' + milli;}

                return '"' + year + '-' + month + '-' + day + 'T' + hours + ':'
                    + minutes + ':' + seconds + '.' + milli + 'Z"';
            }
            
            if (o.constructor === Array) {
                var ret = [];
                var i;
                for (i = 0; i < o.length; i++) {ret.push(this.stringify(o[i]) || 'null');}
                
                return '[' + ret.join(',') + ']';
            }
            
            var pairs = [];
            var k;
            for (k in o) { if (o.hasOwnProperty(k)) {
                var name;
                var type = typeof(k);

                if (type === 'number') {
                    name = '"' + k + '"';
                } else if (type === 'string') {
                    name = this.quoteString(k);
                } else {
                    // skip non-string or number keys
                    continue;
                }

                if (typeof(o[k]) === 'function') {
                    // skip pairs where the value is a function.
                    continue;
                }

                var val = this.stringify(o[k]);
                pairs.push(name + ':' + val);
            }}

			return '{' + pairs.join(', ') + '}';
        }
    };
        
    JSON.parse = function(src) {
        var filtered = src;
        filtered = filtered.replace(/\\["\\\/bfnrtu]/g, '@'); // "
        
        filtered = filtered.replace(
            /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']'); // "
        
        filtered = filtered.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
		if (/^[\],:{}\s]*$/.test(filtered)) {
            return eval('(' + src + ')');
        } else {
            throw new SyntaxError('Error parsing JSON, source is not valid.');
        }
    };
}