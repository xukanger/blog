package just.VO.blogarticle;

import just.VO.bloguser.SimpleUserVO;
import just.VO.cons.Status;

import java.util.Date;
import java.util.List;

/**
 * Created by llf on 2017/5/2.
 * 文章详情
 */
public class ArticleDetailVO {
    private Long id;
    private String title;//标题
    /**
     * @see Status
     * */
    private Status status;//文章状态
    private Date publishDate;//发表日期
    private SimpleUserVO author;//作者
    private Integer number;//阅读数
    private Integer coin;//打赏数
    private String content;//博文内容

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Date getPublishDate() {
        return publishDate;
    }

    public void setPublishDate(Date publishDate) {
        this.publishDate = publishDate;
    }

    public SimpleUserVO getAuthor() {
        return author;
    }

    public void setAuthor(SimpleUserVO author) {
        this.author = author;
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

    public List<CommentVO> getComments() {
        return comments;
    }

    public void setComments(List<CommentVO> comments) {
        this.comments = comments;
    }

    private List<CommentVO> comments;//评论，按照评论日期先后倒序排序



}
