package just.service.comment;

import just.entity.Comment;
import org.springframework.data.repository.PagingAndSortingRepository;

/**
 * Created by yt on 2017/5/17.
 */
public interface CommentRepository extends PagingAndSortingRepository<Comment,Long> {
    

    
}
