package just.service.user;


import just.VO.bloguser.ModifyUserVO;
import just.entity.User;

public interface AuthService {
    User register(User userToAdd);

    String login(String username, String password);

    String refresh(String oldToken);

    void modify(ModifyUserVO modifiedUser);

    User get(Long id);

    User get(String token);

    boolean isUsernameDuplicate(String username);

    boolean isDataSensitive(String data);


}
