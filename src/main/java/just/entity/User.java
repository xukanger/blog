package just.entity;

import just.common.entity.BaseEntity;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

/**
 * Created by yt on 2017/4/29.
 */
@Entity
@Table(name = "t_user")
public class User extends BaseEntity{

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String nickname;

    private String portrait;

    @Column(nullable = false)
    private String password;

    private String mailbox;

    private Date lastPasswordResetDate;

    private String role;//角色

    private List<Article> articles;//文章

    private List<Comment> comments;//评论

    private Integer coin;//硬币

    private List<User> concern;//我关注对象

    private List<User> concerned;//关注我的对象

    public User() {
    }


    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getPortrait() {
        return portrait;
    }

    public void setPortrait(String portrait) {
        this.portrait = portrait;
    }

    public String getMailbox() {
        return mailbox;
    }

    public void setMailbox(String mailbox) {
        this.mailbox = mailbox;
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

    public Date getLastPasswordResetDate() {
        return lastPasswordResetDate;
    }

    public void setLastPasswordResetDate(Date lastPasswordResetDate) {
        this.lastPasswordResetDate = lastPasswordResetDate;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    @OneToMany(
            mappedBy="user",
            cascade = {CascadeType.PERSIST, CascadeType.MERGE},
            targetEntity=Article.class,
            fetch=FetchType.LAZY
    )
    public List<Article> getArticles() {
        return articles;
    }

    public void setArticles(List<Article> articles) {
        this.articles = articles;
    }

    @OneToMany(
            mappedBy="commenter",
            cascade = {CascadeType.PERSIST, CascadeType.MERGE},
            targetEntity=Comment.class,
            fetch=FetchType.LAZY
    )
    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

    public Integer getCoin() {
        return coin;
    }

    public void setCoin(Integer coin) {
        this.coin = coin;
    }

    @ManyToMany(fetch = FetchType.LAZY,cascade = {CascadeType.PERSIST, CascadeType.MERGE}, mappedBy = "concerned")
    public List<User> getConcern() {
        return concern;
    }

    public void setConcern(List<User> concern) {
        this.concern = concern;
    }

    @ManyToMany
    @JoinTable(
            name = "concern_concerned",
            joinColumns = {@JoinColumn(name = "concerned_id")},
            inverseJoinColumns = {@JoinColumn(name = "concern_id")}
    )
    public List<User> getConcerned() {
        return concerned;
    }

    public void setConcerned(List<User> concerned) {
        this.concerned = concerned;
    }
}
