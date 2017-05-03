package just.VO.blogarticle;

import just.VO.cons.Status;

import java.util.Date;

/**
 * Created by llf on 2017/5/2.
 */
public class ListArticleVO {
    private Long id;
    private String title;//标题
    /**
     * @see Status
     * */
    private Status status;//文章状态
    private String imgPath;//封面图片
    private String brief;//文章简述
    private Date publishDate;//发表日期
    private String author;//作者
    private Integer number;//阅读数
    private Integer coin;//打赏数

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

    public String getImgPath() {
        return imgPath;
    }

    public void setImgPath(String imgPath) {
        this.imgPath = imgPath;
    }

    public String getBrief() {
        return brief;
    }

    public void setBrief(String brief) {
        this.brief = brief;
    }

    public Date getPublishDate() {
        return publishDate;
    }

    public void setPublishDate(Date publishDate) {
        this.publishDate = publishDate;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
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
}
