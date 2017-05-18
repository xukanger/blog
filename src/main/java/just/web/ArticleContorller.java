package just.web;

import just.VO.JSONResult;
import just.VO.blogarticle.ArticleDetailVO;
import just.common.controller.BaseController;
import just.common.util.BeanHelper;
import just.entity.Article;
import just.service.article.ArticleService;
import just.service.user.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by yt on 2017/5/18.
 */
@RestController
@RequestMapping("/article")
public class ArticleContorller extends BaseController{

    AuthService authService;

    ArticleService articleService;

    @Autowired
    public ArticleContorller(AuthService authService, ArticleService articleService) {
        this.authService = authService;
        this.articleService = articleService;
    }

    @PostMapping("/modify")
    public JSONResult modify(Article article){
        articleService.modifyArticle(article);
        return JSONResult.getSuccessMessage(true);
    }

    @PostMapping("/new")
    public JSONResult create(Article article){
        articleService.createArticle(article);
        return JSONResult.getSuccessMessage(true);
    }

    @GetMapping("/list/user/{userid}/page/{page}/size/{size}")
    public JSONResult list(@PathVariable("userid") Long userid,
                           @PathVariable("page") int page,
                           @PathVariable("size") int size){
        Pageable pageRequest = PageRequest.of(page,size);
        Page<Article> articles =
                articleService.findByUser(authService.get(userid), pageRequest);
        List<ArticleDetailVO> articleDetailVOS = articles.stream().map(article -> {
            ArticleDetailVO articleDetailVO = new ArticleDetailVO();
            BeanHelper.copyPropertiesIgnoreNull(article, articleDetailVO);
            return articleDetailVO;
        }).collect(Collectors.toList());
        return JSONResult.getSuccessMessage(articleDetailVOS);
    }

    @PostMapping("/delete/{id}")
    public JSONResult delete(@PathVariable("id") String id){
        return JSONResult.getSuccessMessage(true);
    }

}
