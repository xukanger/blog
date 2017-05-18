package just.service.article;

import just.entity.Article;
import just.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Created by yt on 2017/5/17.
 */
public interface ArticleService {

    Page<Article> findByUser(User user, Pageable page);

    Article createArticle(Article article);

    void modifyArticle(Article article);

    Page<Article> list(Pageable pageable);

    void delete(Article article);
}
