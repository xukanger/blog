/**
 * Created by tanghao on 2017/5/8.
 */
$(function(){
    var errorHtml = function (message) {
        return "<span class='login-error'>"+message+"</span>";
    };
    var passHtml = "<span class='login-pass'>验证通过</span>";

    //验证
    var ajaxBlur =[
        {id:'#username',url:'/examine/duplicate/username/'},
        {id:'#nickname',url:'/examine/sensitive/username/'},
        {id:'#password',url:''},
        {id:'#passwordOK',url:''},
        {id:'#email',url:''},
        {id:'#invit',url:'/verify/'}
    ];
    ajaxBlur.forEach(function(e,i,a){
        ajaxProp(e.id,e.url)
    });
    function ajaxProp(id,url){
        //异步验证
        $(id).blur(function () {
            var val = $(this).val();
            var parent = $(this).parent('.form-group');
            var error = parent.find('span.login-error');
            var pass = parent.find('span.login-pass');
            if(val.trim() ==''){
                if(error.length>0){
                    return
                }else {
                    pass.remove();
                    parent.append(errorHtml("不能为空"));
                }
            }else {
                if(url !=''){
                    $.post(url+val,function (post) {
                        if(post.result){
                            //post 通过
                            if(pass.length>0){
                                return
                            }else {
                                error.remove();
                                parent.append(passHtml)
                            }
                            console.log('post:'+ url +' val+'+val);

                        }else{
                            error.remove();
                            pass.remove();
                            parent.append(errorHtml(post.message));
                        }
                    });

                }
                if(id == '#password'){
                    if( val.trim().length >= 6 && val.trim().length <=12){
                        error.remove();
                        pass.remove();
                        parent.append(errorHtml("密码要在6-12位之间！"));
                    }else {
                        error.remove();
                        pass.remove();
                        parent.append(passHtml);
                    }
                }
                if(id == '#passwordOK' && $('#password').val().trim() !=''){
                    if(val.trim() != $('#password').val().trim()){
                        error.remove();
                        pass.remove();
                        parent.append(errorHtml("两次密码不一致！"));
                    }else {
                        error.remove();
                        pass.remove();
                        parent.append(passHtml);
                    }
                }
                if(id == '#email'){
                    var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
                    if(re.test($('#email').val().trim())){
                        error.remove();
                        pass.remove();
                        parent.append(passHtml)
                    }else {
                        error.remove();
                        pass.remove();
                        parent.append(errorHtml("请输入正确的邮箱格式！"));
                    }
                }
            }
        })
    }
    $("#code-image").on('click',function (e) {
        alert("123")
    });
    function getImage() {
        $.post("/captcha-image",function (reslut) {

        });
    }
});


