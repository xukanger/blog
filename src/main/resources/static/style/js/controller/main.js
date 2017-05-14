/**
 * Created by tanghao on 2017/5/6.
 * 配置前端路由及其他全局配置
 */
var myApp = angular.module('myApp',['ngRoute'])
myApp.config(['$routeProvider',function($routeProvider){
        $routeProvider.when('/',{
                templateUrl:'home.html',
                controller:'homeController'
            })
            .when('/userhome',{
                templateUrl:'userhome.html',
                controller:'userhomeController'
            })
            .when('/message',{
                templateUrl:'message.html',
                controller:'messageController'
            })
            .when('/writearticle',{
                templateUrl:'writearticle.html',
                controller:'writearticleController'
            })
            .otherwise({redirectTo:'/'});
    }]);
// myApp.controller('homeController', ['$scope', '$filter', '$routeParams', '$route',function ($scope, $filter, $routeParams,$route) {
//
// }]);
// myApp.controller('userhomeController', ['$scope', '$filter', '$routeParams','$route', function ($scope, $filter, $routeParams,$route) {
//
// }]);
// myApp.controller('messageController', ['$scope', '$filter', '$routeParams','$route', function ($scope, $filter, $routeParams,$route) {
//
// }]);
//
$(function () {
/*
* 滚动翻转
* */
window.onscroll=function () {
    lazyArticle()
}
// lazyArticle()
function lazyArticle() {
    var modelArr = document.getElementsByClassName('articleModel')
    var getClient = getClient()
    // console.log(getClient)
    // console.log(modelArr)

    for (var i = 0; i < modelArr.length; i++) {
        var modelClient = getSubClient(modelArr[i])
        var JQe = $(modelArr[i])
        var bol = intens(modelClient, getClient)
        if (bol) {
            // console.log(1)
            JQe.addClass('aos-animate')
        } else {
            // console.log(2)
            JQe.removeClass('aos-animate')
        }
    }
    // 返回浏览器的可视区域位置

    function getClient() {
        var l, t, w, h;
        l = document.documentElement.scrollLeft || document.body.scrollLeft;
        t = document.documentElement.scrollTop || document.body.scrollTop;
        w = document.documentElement.clientWidth;
        h = document.documentElement.clientHeight;
        return {left: l, top: t, width: w, height: h};
    }

    // 返回待加载资源位置
    function getSubClient(p) {
        var l = 0, t = 0, w, h;
        w = p.offsetWidth;
        h = p.offsetHeight;
        while (p.offsetParent) {
            l += p.offsetLeft;
            t += p.offsetTop;
            p = p.offsetParent;
        }
        return {left: l, top: t, width: w, height: h};
    }

    function intens(rec1, rec2) {
        var lc1, lc2, tc1, tc2, w1, h1;
        lc1 = rec1.left + rec1.width / 2;
        lc2 = rec2.left + rec2.width / 2;
        tc1 = rec1.top + rec1.height / 2;
        tc2 = rec2.top + rec2.height / 2;
        w1 = (rec1.width + rec2.width) / 2;
        h1 = (rec1.height + rec2.height) / 2;
        return Math.abs(lc1 - lc2) < w1 && Math.abs(tc1 - tc2) < h1;
        // (rec2.top - rec2.height)
    }
}
})