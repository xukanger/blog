package just.VO.bloguser;


import just.common.vo.BaseVO;
import just.entity.User;

import java.util.List;

/**
 * Created by llf on 2017/5/2.
 * 用于个人信息展示和后台用户查询
 */
public class UserVO extends BaseVO<UserVO,User> {
    private Long id;
    private String username;//用户名
    private String nickname;//昵称
    private String mailbox;//邮箱
    private String portrait;//头像地址
    private List<SimpleUserVO> concern;//我关注的,全部
    private List<SimpleUserVO> concerned;//关注我的，全部

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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

    public String getPortrait() {
        return portrait;
    }

    public void setPortrait(String portrait) {
        this.portrait = portrait;
    }

    public List<SimpleUserVO> getConcern() {
        return concern;
    }

    public void setConcern(List<SimpleUserVO> concern) {
        this.concern = concern;
    }

    public List<SimpleUserVO> getConcerned() {
        return concerned;
    }

    public void setConcerned(List<SimpleUserVO> concerned) {
        this.concerned = concerned;
    }

    @Override
    public User VO2Entity() {
        throw new UnsupportedOperationException();
    }
}
