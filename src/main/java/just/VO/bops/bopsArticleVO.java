package just.VO.bops;

import just.VO.cons.Status;

import java.util.Date;

/**
 * Created by llf on 2017/5/2.
 * 用于后台的文章展示
 */
public class BopsArticleVO {

    private Long id;
    private String title;//标题
    /**
     * @see Status
     * */
    private Status status;
    private Date publishDate;
    private String author;
    private Integer number;

    private Integer coin;

    public Integer getCoin() {
        return coin;
    }

    public void setCoin(Integer coin) {
        this.coin = coin;
    }

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
}
