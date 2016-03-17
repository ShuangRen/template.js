(function () {
    var  template = function (url,json,Fn) {
        request(url,function (text) {
            //reg = new RegExp(sb + '([^' + eb + ']+)' +'?' + eb, 'g'),
            var reg = /<%([^%>]+)?%>/g,
                regOut = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g,
                code = 'with(this){var r=[];\n',
                cursor = 0,
            //用于存储 item
            itemser = {},
            //用于匹配item的正则
                regStr = '',
                regItem;
            var add = function(line, js) {
                if(/@each/.test(line)) {
                    var sline = line.replace(/@each\s/, '').split(' as ');
                    sline.push(sline[1].split(' to ')[0].replace(/\s/,''), sline[1].split(' to ')[1].replace(/\s/,''));
                    code += 'for(var '+ sline[3] +' = 0; ' + sline[3] + ' < ' + sline[0] + '.length; ' + sline[3] + ' ++) {';
                    regStr += sline[2] + '|';
                    itemser[sline[2]] = {
                        'item' : sline[3],
                        'list' : sline[0]
                    };
                    regItem = new RegExp(regStr,'g');
                }else if((/(\S)/.test(line)) && itemser[line] && regItem && regItem.test(line)){
                    code += 'r.push(' + itemser[line]['list'].replace(/\s/,'') + '['+ itemser[line]['item'] +']);';
                }else if(/^\/each/.test(line)) {
                    code += '}';
                }else {
                    js? (code += line.match(regOut) ? line + '\n' : 'r.push(' + line + ');\n') :
                        (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
                }
                return add;
            }
            while(match = reg.exec(text)) {
                add(text.slice(cursor, match.index))(match[1], true);
                cursor = match.index + match[0].length;
            }
            add(text.substr(cursor, text.length - cursor));
            code += 'return r.join("");}';
            Fn&&Fn(new Function(code.replace(/[\r\t\n]/g, '')).apply(json));
        })
    };

    var request = function (url,Fn) {
        var XMLHttpReq = {
            getObj : function () { //创建XMLHttpRequest对象
                try {
                    return new ActiveXObject("Msxml2.XMLHTTP");//IE高版本创建XMLHTTP
                }
                catch(E) {
                    try {
                        return new ActiveXObject("Microsoft.XMLHTTP");//IE低版本创建XMLHTTP
                    }
                    catch(E) {
                        return new XMLHttpRequest();//兼容非IE浏览器，直接创建XMLHTTP对象
                    }
                }
            },
            ajax : function (url,Fn) {
                var o = XMLHttpReq.getObj();
                o.open("post", url, true);
                o.onreadystatechange = function () {XMLHttpReq.get(o,Fn)};
                o.send(null);
            },
            get : function (o,Fn) {
                if (o.readyState == 4) {
                    if (o.status == 200) {
                        var text = o.responseText;
                        //text = window.decodeURI(text);
                        Fn(text)
                    }
                }
            }
        };

        return XMLHttpReq.ajax(url,Fn);
    };

    window.t = {
        template : template
    }

    return t;
})();