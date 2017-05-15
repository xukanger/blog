/**
 * Created by tanghao on 2017/5/8.
 */
$(function(){
    var errorHtml = function (message) {
        return "<span class='login-error'>"+message+"</span>";
    };
    var passHtml = "<span class='login-pass'>验证通过</span>";
    var userVO ={
        "username":"",
        "password":"",
        "nickname":"",
        "mailbox":"",
        "portrait":"",
        "code":""
    };
    //验证
    var ajaxBlur =[
        {id:'#username',url:'/examine/duplicate/username/',pass:false},
        {id:'#nickname',url:'/examine/sensitive/username/',pass:false},
        {id:'#password',url:'',pass:false},
        {id:'#passwordOK',url:'',pass:false},
        {id:'#email',url:'',pass:false},
        {id:'#invit',url:'/verify/',pass:false}
    ];
    ajaxBlur.forEach(function(e,i,a){
        ajaxProp(e.id,e.url)
    });

    $("#regbtn").click(function () {
        doRegister()
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
                                parent.append(passHtml);
                                if(id=='#username')
                                {
                                    ajaxBlur[0].pass = true;
                                }
                                if(id=='#nickname')
                                {
                                    ajaxBlur[1].pass = true;
                                }
                                if(id=='#invit')
                                {
                                    ajaxBlur[5].pass = true;
                                }

                            }
                            console.log('post:'+ url +' val+'+val);

                        }else{
                            error.remove();
                            pass.remove();
                            parent.append(errorHtml(post.message));
                            if(id=='#username')
                            {
                                ajaxBlur[0].pass = false;
                            }
                            if(id=='#nickname')
                            {
                                ajaxBlur[1].pass = false;
                            }
                            if(id=='#invit')
                            {
                                ajaxBlur[5].pass = false;
                            }
                        }
                    });

                }
                if(id == '#password'){
                    if( val.trim().length <= 6 && val.trim().length >=12){
                        error.remove();
                        pass.remove();
                        parent.append(errorHtml("密码要在6-12位之间！"));
                        ajaxBlur[2].pass = false;
                    }else {
                        error.remove();
                        pass.remove();
                        parent.append(passHtml);
                        ajaxBlur[2].pass = true;
                    }
                }
                if(id == '#passwordOK' && $('#password').val().trim() !=''){
                    if(val.trim() != $('#password').val().trim()){
                        error.remove();
                        pass.remove();
                        parent.append(errorHtml("两次密码不一致！"));
                        ajaxBlur[3].pass = false;
                    }else {
                        error.remove();
                        pass.remove();
                        parent.append(passHtml);
                        ajaxBlur[3].pass = true;
                    }
                }
                if(id == '#email'){
                    var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
                    if(re.test($('#email').val().trim())){
                        error.remove();
                        pass.remove();
                        parent.append(passHtml);
                        ajaxBlur[4].pass = true;
                    }else {
                        error.remove();
                        pass.remove();
                        parent.append(errorHtml("请输入正确的邮箱格式！"));
                        ajaxBlur[4].pass = false;
                    }
                }
            }
        })
    }

    function doRegister(){
        var reg = $("#regbtn");
        var passLength = 0;
        ajaxBlur.forEach(function(e,i,a){
           if(!e.pass){
               trip.error('注册信息有误')
               return;
           }else {
               passLength++
           }
        });
        if(passLength == ajaxBlur.length){
            userVO.username =  $("#username").val();
            userVO.nickname =  $("#nickname").val();
            userVO.password = $("#password").val();
            userVO.mailbox = $("#email").val();
            userVO.code = $("#invit").val();
            $.ajax({
                url : "/auth/register",
                type : "POST",
                data : JSON.stringify(userVO), //转JSON字符串
                dataType: 'json',
                contentType:'application/json;charset=UTF-8', //contentType很重要
                success : function(result) {
                    trip.success('注册成功')
                }
            });
        }
    }
    var trip ={
        error:function (title) {
            $('#trip').removeClass('success').addClass('error')
            this._fun(title)
        },
        success:function (title) {
            $('#trip').removeClass('error').addClass('success')
            this._fun(title)
        },
        _fun:function (title) {
            $('#trip').text(title)
            $('#trip').show(500,function () {
                setTimeout(function () {
                    $('#trip').hide()
                }, 2000);
            })
        }
    }
});


