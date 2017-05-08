package just.service.user;

import just.entity.User;
import org.springframework.data.repository.PagingAndSortingRepository;

/**
 * Created by yt on 2017/5/1.
 */
public interface UserRepository extends PagingAndSortingRepository<User,Long> {

    User findUserById(Long id);

    User findByUsername(String username);


}