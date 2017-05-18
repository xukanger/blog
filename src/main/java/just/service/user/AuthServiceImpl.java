package just.service.user;

import just.VO.bloguser.ModifyUserVO;
import just.common.util.BeanHelper;
import just.common.util.JwtTokenUtil;
import just.common.util.SensitivewordEngine;
import just.entity.User;
import just.service.jwt.JwtUser;
import just.service.sensitiveword.SensitiveWordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    private AuthenticationManager authenticationManager;
    private UserDetailsService userDetailsService;
    private JwtTokenUtil jwtTokenUtil;
    private UserRepository userRepository;
    private SensitiveWordRepository sensitiveWordRepository;


    @Value("${jwt.tokenHead}")
    private String tokenHead;

    @Autowired
    public AuthServiceImpl(
            AuthenticationManager authenticationManager,
            UserDetailsService userDetailsService,
            JwtTokenUtil jwtTokenUtil,
            UserRepository userRepository,
            SensitiveWordRepository sensitiveWordRepository) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtTokenUtil = jwtTokenUtil;
        this.userRepository = userRepository;
        this.sensitiveWordRepository = sensitiveWordRepository;
    }

    @Override
    public User register(User userToAdd) {
        final String username = userToAdd.getUsername();
        if(userRepository.findByUsername(username)!=null) {
            return null;
        }
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        final String rawPassword = userToAdd.getPassword();
        userToAdd.setPassword(encoder.encode(rawPassword));
        userToAdd.setLastPasswordResetDate(new Date());
        userToAdd.setRole("ROLE_USER");
        return userRepository.save(userToAdd);
    }

    @Override
    public String login(String username, String password) {
        UsernamePasswordAuthenticationToken upToken = new UsernamePasswordAuthenticationToken(username, password);
        // Perform the security
        final Authentication authentication = authenticationManager.authenticate(upToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Reload password post-security so we can generate token
        final UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        final String token = jwtTokenUtil.generateToken(userDetails);
        return token;
    }

    @Override
    public String refresh(String oldToken) {
        final String token = oldToken.substring(tokenHead.length());
        String username = jwtTokenUtil.getUsernameFromToken(token);
        JwtUser user = (JwtUser) userDetailsService.loadUserByUsername(username);
        if (jwtTokenUtil.canTokenBeRefreshed(token, user.getLastPasswordResetDate())){
            return jwtTokenUtil.refreshToken(token);
        }
        return null;
    }

    @Transactional
    @Override
    public void modify(ModifyUserVO modifiedUser) {
        User user = userRepository.findUserById(modifiedUser.getId());
        String password = modifiedUser.getPassword();
        if(password!=null){
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            modifiedUser.setPassword(encoder.encode(password));
        }
        BeanHelper.copyPropertiesIgnoreNull(modifiedUser,user);
    }

    @Override
    public User get(Long id) {
        return userRepository.findUserById(id);
    }

    @Override
    public User get(String username) {
        return userRepository.findByUsername(username);
    }


    @Override
    public boolean isUsernameDuplicate(String username) {
        return userRepository.findByUsername(username) != null;
    }

    @Override
    public boolean isDataSensitive(String data) {
        return SensitivewordEngine.
                sensitiveWordMap != null
                &&
                SensitivewordEngine.
                        isContaintSensitiveWord(data, SensitivewordEngine.minMatchTYpe);

    }
}
