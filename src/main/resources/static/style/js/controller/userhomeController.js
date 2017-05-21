/**
 * Created by tanghao on 2017/5/13.
 */
myApp.controller('userhomeController', ['$scope', '$filter', '$routeParams','$route', function ($scope, $filter, $routeParams,$route) {
    var newArticleListArry = [
        {id:1,title:'sdfa',heat:10000},
        {id:2,title:'lol出装',heat:200},
        {id:3,title:'lol天赋',heat:3200}
    ]
    $scope.newArticleListArry = newArticleListArry;
}]);