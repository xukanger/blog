/**
 * Created by tanghao on 2017/5/13.
 */
myApp.controller('homeController', ['$scope', '$filter', '$routeParams', '$route','userService','articleService',function ($scope, $filter, $routeParams,$route,userService,articleService) {

    $scope.isLogin = false;
    //TODO:抽取方法，页面间跳转使用
    var token = getCookie("token");
    if(token!=""){
        userService.login(token).then(function (data) {
                console.dir(data);
                if(data){
                    token = data;
                    $scope.isLogin = true;//其他页面需要根据登录状况判断是否要转回登录页面
                    setCookie("token",token);//FIXME
                    console.log("login success");

                }
            },
            function (reason) {
                console.dir(reason);
                if(reason.status == "403"){
                    console.log("token invalid");
                    return;
                }
            }
        );
    }

    $scope.user={
        "username":'',
        "password":'',
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

    function setCookie(name,value)
    {
        var Days = 7;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days*24*60*60*1000);
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
    }

    function getCookie(name)
    {
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");

        if(arr=document.cookie.match(reg))

            return unescape(arr[2]);
        else
            return null;
    }

}]);
