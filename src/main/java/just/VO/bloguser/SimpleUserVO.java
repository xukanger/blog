package just.VO.bloguser;

/**
 * Created by llf on 2017/5/2.
 * 只显示用户头像和名称
 */
public class SimpleUserVO {
    private Long id;
    private String portrait;//头像地址
    private String nickname;//昵称

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPortrait() {
        return portrait;
    }

    public void setPortrait(String portrait) {
        this.portrait = portrait;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }
}
