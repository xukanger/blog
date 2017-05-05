package just.entity;

import just.VO.cons.Status;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.util.Date;

/**
 * Created by yt on 2017/5/2.
 */
@Entity
public class Article {

    @Id
    @GeneratedValue
    private Long id;

    private Integer thumbUpCount;

    //@OneToMany
    //private User user;

    private Status status;

    private String tilte;

    private Date publishDate;//发表日期

    private Integer number;//阅读数

    private Integer coin;//打赏数

    private String content;//博文内容


}
