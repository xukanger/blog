package just.VO.blogarticle;

import just.VO.bloguser.SimpleUserVO;

import java.util.Date;

/**
 * Created by llf on 2017/5/2.
 */
public class SimpleCommentVO {
    private Long id;
    private Date date;//评论日期
    private String comment;
    private SimpleUserVO commenter;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public SimpleUserVO getCommenter() {
        return commenter;
    }

    public void setCommenter(SimpleUserVO commenter) {
        this.commenter = commenter;
    }
}
