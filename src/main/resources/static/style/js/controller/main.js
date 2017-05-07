/**
 * Created by tanghao on 2017/5/6.
 * 配置前端路由及其他全局配置
 */
var myApp = angular.module('myApp',['ngRoute','ui.bootstrap'])
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
            .otherwise({redirectTo:'/'});
    }]);
myApp.controller('homeController', ['$scope', '$modal', '$filter', 'tips', '$routeParams', '$route',function ($scope, $modal, $filter, tips, $routeParams,$route) {

}]);
myApp.controller('userhomeController', ['$scope', '$modal', '$filter', 'tips', '$routeParams','$route', function ($scope, $modal, $filter, tips, $routeParams,$route) {

}]);
myApp.controller('messageController', ['$scope', '$modal', '$filter', 'tips', '$routeParams','$route', function ($scope, $modal, $filter, tips, $routeParams,$route) {

}]);