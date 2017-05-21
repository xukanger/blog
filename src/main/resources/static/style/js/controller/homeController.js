/**
 * Created by tanghao on 2017/5/13.
 */
myApp.controller('homeController', ['$scope', '$filter', '$routeParams', '$route','userService','articleService',function ($scope, $filter, $routeParams,$route,userService,articleService) {

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

}]);
