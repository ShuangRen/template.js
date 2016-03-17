/**
 * Created by yih8306 on 2016/3/15.
 */
var json = {
  'name' : ['小涛涛','小兵兵','小强强','小黄黄','小灵灵','小凤凤'],
  'age' : '20',
  'line' : {
        'num': [1,2,3,4],
        'age' : ['a', 'b', 'c' ,'d']
    }
};
t.template('./view/demo.html',json, function (str) {
    document.getElementsByTagName('body')[0].innerHTML = str;
});