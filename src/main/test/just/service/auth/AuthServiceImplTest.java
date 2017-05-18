package just.service.auth;

import just.entity.User;
import just.service.user.AuthService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * Created by 55217 on 2017/5/15.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
public class AuthServiceImplTest {

    @Autowired
    AuthService authService;

    @Test
    public void testRegister(){
        User user = new User();
        user.setUsername("yt");
        user.setPassword("123");
        user.setMailbox("123@qq.com");
        authService.register(user);
    }

}