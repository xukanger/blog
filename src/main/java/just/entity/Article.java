package just.entity;

import just.VO.cons.Status;
import just.common.entity.BaseEntity;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

/**
 * Created by yt on 2017/5/2.
 */
@Entity
@Table(name = "t_article")
public class Article extends BaseEntity {

    private Status status;

    private String title;

    private Date publishDate;//发表日期

    private Integer number;//阅读数

    private Integer coin;//打赏数

    private String content;//博文内容


    private List<Comment> comments;


    private User user;

    @ManyToOne
    @JoinColumn(name="user_id")
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getTilte() {
        return title;
    }

    public void setTilte(String tilte) {
        this.title = tilte;
    }

    public Date getPublishDate() {
        return publishDate;
    }

    public void setPublishDate(Date publishDate) {
        this.publishDate = publishDate;
    }

    public Integer getNumber() {
        return number;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }

    public Integer getCoin() {
        return coin;
    }

    public void setCoin(Integer coin) {
        this.coin = coin;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @OneToMany(
            mappedBy="article",
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
}
