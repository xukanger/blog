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
    private List<CommentVO> comments;//评论，按照评论日期先后倒序排序



}
