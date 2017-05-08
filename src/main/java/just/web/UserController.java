package just.web;

import com.google.common.collect.Lists;
import just.entity.User;
import just.service.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Created by yt on 2017/5/1.
 */
@RestController
@RequestMapping("/users")
//@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    @Autowired
    private UserRepository repository;

    @RequestMapping(method = RequestMethod.GET)
    public List<User> getUsers() {
        return Lists.newArrayList(repository.findAll());
    }


}