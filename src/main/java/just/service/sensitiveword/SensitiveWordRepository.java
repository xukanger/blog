package just.service.sensitiveword;

import just.entity.SensitiveWord;
import org.springframework.data.repository.PagingAndSortingRepository;

/**
 * Created by yt on 2017/5/8.
 */
public interface SensitiveWordRepository extends PagingAndSortingRepository<SensitiveWord,Long> {
}
