package just.service.article;

import just.entity.Article;
import just.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;

/**
 * Created by yt on 2017/5/17.
 */
public interface ArticleRepository extends PagingAndSortingRepository<Article,Long> {

    Page<Article> findByUser(User user, Pageable pageable);
    

}
