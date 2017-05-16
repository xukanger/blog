/**
 * Created by tanghao on 2017/5/13.
 */
myApp.controller('homeController', ['$scope', '$filter', '$routeParams', '$route','userService','articleService',function ($scope, $filter, $routeParams,$route,userService,articleService) {

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
            alert(data);
        });
    };

}]);
