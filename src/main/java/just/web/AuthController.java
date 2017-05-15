package just.web;

import com.google.code.kaptcha.Producer;
import just.VO.JSONResult;
import just.VO.bloguser.NewUserVO;
import just.VO.jwt.JwtAuthenticationRequest;
import just.VO.jwt.JwtAuthenticationResponse;
import just.common.controller.BaseController;
import just.common.util.CookieUtil;
import just.service.auth.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ResourceLoader;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.imageio.ImageIO;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@RestController
public class AuthController extends BaseController{

    @Value("${jwt.header}")
    private String tokenHeader;

    @Value("${jwt.expiration}")
    private Long expiration;

    private final AuthService authService;

    private final Producer captchaProducer;

    private final RedisTemplate<String,String> redisTemplate;

    private final ResourceLoader resourceLoader;

    @Autowired
    public AuthController(AuthService authService, Producer captchaProducer, RedisTemplate<String, String> redisTemplate, ResourceLoader resourceLoader) {
        this.authService = authService;
        this.captchaProducer = captchaProducer;
        this.redisTemplate = redisTemplate;
        this.resourceLoader = resourceLoader;
    }


    /*
     *获取token登录
     */
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

    /*
     *刷新token
     */
    @RequestMapping(value = "/refresh", method = RequestMethod.GET)
    public ResponseEntity<?> refreshAndGetAuthenticationToken(
            HttpServletRequest request, HttpServletResponse response) {
        String token = CookieUtil.getCookie(request,tokenHeader);
        String refreshedToken = authService.refresh(token);
        if(refreshedToken == null) {
            return ResponseEntity.badRequest().body(null);
        } else {
            addAuthCookie(response,refreshedToken);
            return ResponseEntity.ok(new JwtAuthenticationResponse(refreshedToken));
        }
    }

    /*
     *注册
     */
    @RequestMapping(value = "/auth/register", method = RequestMethod.POST)
    public JSONResult register(@RequestBody @Valid NewUserVO addedUser,
                               @CookieValue("captchaCode") String captchaCode) {
        String correctCode = redisTemplate.opsForValue().get(captchaCode);
        if(correctCode==null)
            return JSONResult.fillResultString(null,"验证码失效",false);
        else if(!correctCode.equals(addedUser.getCode()))
            return JSONResult.fillResultString(null,"验证码错误",false);
        else if(authService.register(addedUser.VO2Entity())!=null)
            return JSONResult.fillResultString(null,"成功",true);
        else
            return JSONResult.fillResultString(null,"注册失败",false);
    }




    /*
     *先检测用户名敏感词，再检测用户名重复
     */
    @RequestMapping(value = "/examine/duplicate/username/{username}", method = RequestMethod.POST)
    public JSONResult checkUsernameDuplicate(@PathVariable String username){
        if(authService.isDataSensitive(username))
            return JSONResult.fillResultString(null,"有敏感词",false);
        if(authService.isUsernameDuplicate(username))
            return JSONResult.fillResultString(null,"用户名重复",false);
        else
            return JSONResult.fillResultString(null,"成功",true);
    }

    /*
     *检测用户名敏感度
     */
    @RequestMapping(value = "/examine/sensitive/username/{username}", method = RequestMethod.POST)
    public JSONResult checkUsernameSensitive(@PathVariable String username){
        if(authService.isDataSensitive(username))
            return JSONResult.fillResultString(null,"有敏感词",false);
        else
            return JSONResult.fillResultString(null,"成功",true);
    }

    /*
     *图形验证码
     */
    @RequestMapping(value = "/captcha-image")
    public ModelAndView getKaptchaImage(HttpServletRequest request,
                                        HttpServletResponse response) throws IOException {
        response.setDateHeader("Expires", 0);
        response.setHeader("Cache-Control",
                "no-store, no-cache, must-revalidate");
        response.addHeader("Cache-Control", "post-check=0, pre-check=0");
        response.setHeader("Pragma", "no-cache");
        response.setContentType("image/jpeg");

        String capText = captchaProducer.createText();
        try {
            String uuid= UUID.randomUUID().toString();
            redisTemplate.opsForValue().set(uuid, capText,60, TimeUnit.SECONDS);
            Cookie cookie = new Cookie("captchaCode",uuid);
            response.addCookie(cookie);
        } catch (Exception e) {
            e.printStackTrace();
        }
        BufferedImage bi = captchaProducer.createImage(capText);
        ServletOutputStream out = response.getOutputStream();
        ImageIO.write(bi, "jpg", out);
        try {
            out.flush();
        } finally {
            out.close();
        }
        return null;
    }
    /*
     *检验验证码
     */
    @RequestMapping(value = "/verify/{code}" , method = RequestMethod.POST)
    public JSONResult verifyCode(@PathVariable String code,
                             @CookieValue("captchaCode") String captchaCode){
        String correctCode = redisTemplate.opsForValue().get(captchaCode);
        if(correctCode==null)
            return JSONResult.fillResultString(null,"验证码失效",false);
        else if(correctCode.equals(code))
            return JSONResult.fillResultString(null,"验证码正确",true);
        else
            return JSONResult.fillResultString(null,"验证码错误",false);
    }



    private void addAuthCookie(HttpServletResponse response,String token){
        CookieUtil.addCookie(response,tokenHeader,token,Math.toIntExact(expiration));
    }


}
