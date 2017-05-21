/**
 * Created by tanghao on 2017/5/6.
 * 配置前端路由及其他全局配置
 */
var myApp = angular.module('myApp',['ngRoute','myApp.service']);
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
            .when('/articleDetails',{
                templateUrl:'articleDetails.html',
                controller:'articleDetailsController'
            })
            .otherwise({redirectTo:'/'});
    }]);
myApp.controller('appController', ['$scope', '$filter', '$routeParams','$route', 'userService','articleService',function ($scope, $filter, $routeParams,$route,userService,articleService) {
    $scope.isLogin = false;
    //TODO:抽取方法，页面间跳转使用
    var token = getCookie("Authorization");
    console.dir(token);
    if(token!=""){
        userService.getSelf().then(function (data) {
            console.dir(data);
            $scope.self = data.result;
            $scope.isLogin = true;
        },function (data) {
            if(data.status == "403"){
                console.log("access denied");
                return;
            }
        })
    }

    $scope.user={
        "username":'',
        "password":'',
    };
    $scope.self={

    };
    $scope.articles=[
        {

        }
    ];

    $scope.doLogin=function () {
        console.log("login begin");
        userService.login($scope.user).then(function (data) {
                console.dir(data);
                if(data){
                    setCookie("token",data);//FIXME
                    console.log("login success");
                    $scope.isLogin = true;
                }
            },
            function (reason) {
                console.dir(reason);
                if(reason.status == "403"){
                    console.log("access denied");
                    return;
                }
            }
        );
    };


    function getCookie(name)
    {
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");

        if(arr=document.cookie.match(reg))

            return unescape(arr[2]);
        else
            return null;
    }

    var newArticleListArry = [
        {id:1,title:'lol攻略',heat:10},
        {id:2,title:'lol出装',heat:200},
        {id:3,title:'lol天赋',heat:3200}
    ]
    var ArticleListArry = [
        {id:1,title:'lol攻略',heat:10,comment:20,text:'lol攻略我也不知道是啥',cover:'/style/img/blogImg/vn.jpg',month:1,day:01},
        {id:2,title:'lol出装',heat:200,comment:20,text:'lol出装，6草鞋',cover:'/style/img/blogImg/wuqi.jpg',month:2,day:31},
        {id:3,title:'lol天赋',heat:3200,comment:20,text:'lol天赋是啥能吃吗',cover:'/style/img/blogImg/bg1.jpg',month:3,day:21}
    ]
    $scope.newArticleListArry = newArticleListArry;
    $scope.ArticleListArry = ArticleListArry;
}]);

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
/**/
    $('body').on('click','#userPanelPreview i.glyphicon-pencil',function () {
        $('#userPanelPreview').addClass('hide')
        $('#userPanel').addClass('userPanelEd')
        $('#userPanelEdit').removeClass('hide')
    })
    $('body').on('click','#giveupEdit',function () {
        $('#userPanelPreview').removeClass('hide')
        $('#userPanel').removeClass('userPanelEd')
        $('#userPanelEdit').addClass('hide')
    })

})