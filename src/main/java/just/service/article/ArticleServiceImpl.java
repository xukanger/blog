package just.service.article;

import just.common.util.BeanHelper;
import just.entity.Article;
import just.entity.User;
import just.service.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Optional;

/**
 * Created by yt on 2017/5/18.
 */
@Transactional
@Service
public class ArticleServiceImpl implements ArticleService {

    private ArticleRepository articleRepository;

    private UserRepository userRepository;

    @Autowired
    public ArticleServiceImpl(ArticleRepository articleRepository, UserRepository userRepository) {
        this.articleRepository = articleRepository;
        this.userRepository = userRepository;
    }



    @Override
    public Page<Article> findByUser(User user, Pageable page) {
        return articleRepository.findByUser(user,page);
    }

    @Override
    public Article createArticle(Article article) {
        return articleRepository.save(article);
    }

    @Override
    public void modifyArticle(Article article) {
        Optional<Article> oldArticle = articleRepository.findById(article.getId());
        oldArticle.ifPresent((x)->{
            BeanHelper.copyPropertiesIgnoreNull(article,x);
        });

    }

    @Override
    public Page<Article> list(Pageable pageable) {
        return articleRepository.findAll(pageable);
    }

    @Override
    public void delete(Article article) {
        articleRepository.delete(article);
    }


}
