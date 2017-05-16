package just.VO.bloguser;

import just.common.vo.BaseVO;
import just.entity.User;
import org.springframework.beans.BeanUtils;

import javax.validation.constraints.NotNull;

/**
 * Created by llf on 2017/5/2.
 */
public class ModifyUserVO extends BaseVO<ModifyUserVO,User>{
    @NotNull
    private Long id;

    private String portrait;//头像地址


    private String password;


    private String nickname;//昵称

    public String getPortrait() {
        return portrait;
    }

    public void setPortrait(String portrait) {
        this.portrait = portrait;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    @Override
    public User VO2Entity() {
        User user = new User();
        BeanUtils.copyProperties(this,user);
        return user;
    }
}
