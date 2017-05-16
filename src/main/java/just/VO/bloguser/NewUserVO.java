package just.VO.bloguser;

import just.common.vo.BaseVO;
import just.entity.User;
import org.hibernate.validator.constraints.NotBlank;
import org.springframework.beans.BeanUtils;

import javax.validation.constraints.NotNull;

/**
 * Created by llf on 2017/5/2.
 * 用户类，用于注册
 */
public class NewUserVO extends BaseVO<NewUserVO,User> {

    @NotNull
    @NotBlank
    private String username;

    @NotNull
    @NotBlank
    private String password;

    private String nickname;//昵称

    private String mailbox;//邮箱

    @NotNull
    @NotBlank
    private String code;

    @Override
    public User VO2Entity(){
        User newUser = new User();
        BeanUtils.copyProperties(this,newUser);
        return newUser;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getMailbox() {
        return mailbox;
    }

    public void setMailbox(String mailbox) {
        this.mailbox = mailbox;
    }

}
