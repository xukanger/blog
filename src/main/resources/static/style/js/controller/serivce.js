/**
 * Created by tanghao on 2017/5/13.
 */
/*接口管理JS*/
var myAppServie = angular.module('myApp.service', []);

myAppServie.factory('userService', ['$http', '$q', function($http, $q) {
    return {
        login:function(user){
            var deferred = $q.defer();
            $http.post('/auth', user).success(
                function(response){
                    if(response){
                        deferred.resolve(response);
                    }else{
                        deferred.reject(response);
                    }
                }
            ).error(function (reason) {
                deferred.reject(reason);
                console.dir(reason);
            });
            return deferred.promise;
        },
        getSelf:function () {
            var deferred = $q.defer();
            $http.get('/user/details').success(
                function(response){
                    if(response){
                        deferred.resolve(response);
                    }else{
                        deferred.reject(response);
                    }
                }
            ).error(function (reason) {
                deferred.reject(reason);
                console.dir(reason);
            });
            return deferred.promise;
        }
    }
}]);

myAppServie.factory('articleService', ['$http', '$q', function($http, $q) {
    return {
        getArticles:function(){
            var deferred = $q.defer();
            $http.post('/article/list/user/').success(
                function(response){
                    if(response){
                        deferred.resolve(response);
                    }else{
                        deferred.reject(response);
                    }
                }
            ).error(function (reason) {
                deferred.reject(reason);
                console.dir(reason);
            });
            return deferred.promise;
        }

    };

}]);