/**
 * Created by tanghao on 2017/5/14.
 */
myApp.controller('writearticleController', ['$scope', '$filter', '$routeParams','$route', function ($scope, $filter, $routeParams,$route) {
    var ue = UE.getEditor('editor', {
        initialContent: "",
        autoHeightEnabled:false,
        autoFloatEnabled:true,
        initialFrameWidth:750,
        initialFrameHeight:500,
        wordCount:false,
        'paragraph':{'p':'正文', 'h1':'标题 1', 'h2':'标题 2', 'h3':'标题 3', 'h4':'标题 4'},
    });

    ue.ready(function(){
        ue.focus();
    });

}]);

