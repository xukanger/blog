package just.VO.blogarticle;

import just.VO.bloguser.SimpleUserVO;

import java.util.Date;
import java.util.List;

/**
 * Created by llf on 2017/5/2.
 * 评论类
 */
public class CommentVO {
    private Long id;
    private Date date;//评论日期
    private String comment;
    private SimpleUserVO commenter;
    private List<CommentVO> childComments;

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public List<CommentVO> getChildComments() {
        return childComments;
    }

    public void setChildComments(List<CommentVO> childComments) {
        this.childComments = childComments;
    }
}
