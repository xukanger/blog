package just.web;

import just.VO.JSONResult;
import just.VO.jwt.JwtAuthenticationRequest;
import just.VO.jwt.JwtAuthenticationResponse;
import just.entity.User;
import just.service.auth.AuthService;
import just.util.CookieUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RestController
public class AuthController {
    @Value("${jwt.header}")
    private String tokenHeader;

    @Value("${jwt.expiration}")
    private Long expiration;

    @Autowired
    private AuthService authService;

    //获取token登录
    @RequestMapping(value = "/auth", method = RequestMethod.POST)
    public ResponseEntity<?> createAuthenticationToken(
            @RequestBody JwtAuthenticationRequest authenticationRequest,
            HttpServletResponse response) throws AuthenticationException {
        final String token = authService.login(authenticationRequest.getUsername(),
                authenticationRequest.getPassword());
        // Return the token
        addAuthCookie(response,token);
        return ResponseEntity.ok(new JwtAuthenticationResponse(token));
    }

    //刷新token
    @RequestMapping(value = "refresh", method = RequestMethod.GET)
    public ResponseEntity<?> refreshAndGetAuthenticationToken(
            HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        String token = CookieUtil.getCookie(request,tokenHeader);
        String refreshedToken = authService.refresh(token);
        if(refreshedToken == null) {
            return ResponseEntity.badRequest().body(null);
        } else {
            addAuthCookie(response,refreshedToken);
            return ResponseEntity.ok(new JwtAuthenticationResponse(refreshedToken));
        }
    }

    //注册
    @RequestMapping(value = "/auth/register", method = RequestMethod.POST)
    public User register(@RequestBody User addedUser) throws AuthenticationException {
        return authService.register(addedUser);
    }

    @RequestMapping(value = "/examine/duplicate/username/{username}", method = RequestMethod.POST)
    public String checkUsernameDuplicate(@PathVariable String username){
        if(authService.isUsernameDuplicate(username))
            return JSONResult.fillResultString(null,"用户名重复",false);
        else
            return JSONResult.fillResultString(null,"成功",true);
    }

    @RequestMapping(value = "/examine/sensitive/username/{username}", method = RequestMethod.POST)
    public String checkUsernameSensitive(@PathVariable String username){
        if(authService.isDataSensitive(username))
            return JSONResult.fillResultString(null,"有敏感词",false);
        else
            return JSONResult.fillResultString(null,"成功",true);
    }

    private void addAuthCookie(HttpServletResponse response,String token){
        CookieUtil.addCookie(response,tokenHeader,token,Math.toIntExact(expiration));
    }


}
