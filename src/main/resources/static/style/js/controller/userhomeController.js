/**
 * Created by tanghao on 2017/5/13.
 */
myApp.controller('userhomeController', ['$scope', '$filter', '$routeParams','$route', function ($scope, $filter, $routeParams,$route) {
    $scope.doLogin=function () {
        console.log("login begin");
    };
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