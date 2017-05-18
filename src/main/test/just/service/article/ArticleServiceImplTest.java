package just.service.article;

import just.VO.cons.Status;
import just.entity.Article;
import just.service.user.AuthService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Date;

/**
 * Created by yt on 2017/5/18.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
public class ArticleServiceImplTest {


    @Autowired
    ArticleService articleService;

    @Autowired
    AuthService authService;


    @Test
    public void findByUser() throws Exception {
        PageRequest pageRequest = new PageRequest(1,10);
        Page<Article> user = articleService.findByUser(authService.get((long) 1), pageRequest);

    }

    @Test
    public void createArticle() throws Exception {
        Article article = new Article();
        article.setCoin(1);
        article.setUser(authService.get((long) 1));
        article.setContent("fgsaigfsiagisfua");
        article.setStatus(Status.RECOMMENDED);
        article.setPublishDate(new Date());
        articleService.createArticle(article);


    }

    @Test
    public void modifyArticle() throws Exception {
        Article article = new Article();
        article.setContent("godblessme");
        article.setId((long) 2);
        articleService.modifyArticle(article);
    }

}