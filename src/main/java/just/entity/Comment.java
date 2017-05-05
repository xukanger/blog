package just.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.util.Date;

/**
 * Created by yt on 2017/5/4.
 */
@Entity
public class Comment {

    @Id
    @GeneratedValue
    Long id;

    private Date date;//评论日期
    private String comment;
    //private User commenter;
    //private List<Comment> childComments;

}
