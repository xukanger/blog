/**
 * Created by tanghao on 2017/5/8.
 */
// ;(function () {
    var errerHtml = '<span class="login-errer">不能为空</span>'
    var passHtml = '<span class="login-pass">验证通过</span>'
    //验证
    var ajaxBlur =[
        {id:'#username',url:'异步url'},
        {id:'#name',url:'异步url'},
        {id:'#password',url:''},
        {id:'#passwordOK',url:''},
        {id:'#email',url:''}
    ]
    ajaxBlur.forEach(function(e,i,a){
        ajaxProp(e.id,e.url)
    })
    function ajaxProp(id,url){
        //异步验证
        $(id).blur(function () {
            var val = $(this).val()
            var parent = $(this).parent('.form-group')
            var errer = parent.find('span.login-errer')
            var pass = parent.find('span.login-pass')
            if(val.trim() ==''){
                if(errer.length>0){
                    return
                }else {
                    pass.remove()
                    parent.append(errerHtml)
                }
            }else {
                if(url !=''){
                    var post = true//post 请求验证
                    if(post){
                        //post 通过
                        if(pass.length>0){
                            return
                        }else {
                            errer.remove()
                            parent.append(passHtml)
                        }
                        console.log('post:'+url+';val+'+val)

                    }else{
                        errer.remove()
                        pass.remove()
                        parent.append(errerHtml)
                    }
                }
                if(id == '#password'){
                    if( val.trim().length > 6){
                        errer.remove()
                        pass.remove()
                        parent.append('<span class="login-errer">密码不能少于6位</span>')
                    }else {
                        errer.remove()
                        pass.remove()
                        parent.append(passHtml)
                    }
                }
                if(id == '#passwordOK' && $('#password').val().trim() !=''){
                    if(val.trim() != $('#password').val().trim()){
                        errer.remove()
                        pass.remove()
                        parent.append('<span class="login-errer">密码请保持一致</span>')
                    }else {
                        errer.remove()
                        pass.remove()
                        parent.append(passHtml)
                    }
                }
                if(id == '#email'){
                    var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
                    if(re.test($('#email').val().trim())){
                        errer.remove()
                        pass.remove()
                        parent.append(passHtml)
                    }else {
                        errer.remove()
                        pass.remove()
                        parent.append('<span class="login-errer">请输入正确的邮箱格式</span>')
                    }
                }
            }
        })
    }
// })();