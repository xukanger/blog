package just.web;

import com.google.code.kaptcha.Producer;
import just.VO.JSONResult;
import just.VO.bloguser.ModifyUserVO;
import just.VO.bloguser.SimpleUserVO;
import just.common.controller.BaseController;
import just.common.util.WebUtils;
import just.entity.User;
import just.service.auth.AuthService;
import just.service.jwt.JwtUser;
import just.service.storge.StorageFileNotFoundException;
import just.service.storge.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.util.UUID;

/**
 * Created by yt on 2017/5/1.
 */
@RestController
@RequestMapping("/user")
//@PreAuthorize("hasRole('ADMIN')")
public class UserController extends BaseController{

    private final AuthService authService;

    private final Producer captchaProducer;

    private final RedisTemplate<String,String> redisTemplate;

    private StorageService storageService;

    @Autowired
    public UserController(AuthService authService, Producer captchaProducer, RedisTemplate<String, String> redisTemplate, StorageService storageService) {
        this.authService = authService;
        this.captchaProducer = captchaProducer;
        this.redisTemplate = redisTemplate;
        this.storageService = storageService;
    }

    /*
     *修改用户
     */
    @RequestMapping(value = "/modify", method = RequestMethod.POST)
    public JSONResult modify(@RequestBody @Valid ModifyUserVO modifiedUser) {
        authService.modify(modifiedUser);
        return JSONResult.fillResultString(null,"成功",true);
    }

    /*
     *get用户自身
     * 树形结构尚未搞定
     */
    //TODO
    @RequestMapping(value = "/details", method = RequestMethod.GET)
    public JSONResult get() {
        UserDetails userDetails = WebUtils.getCurrentUser();
        if(userDetails instanceof JwtUser){
            User user = authService.get(((JwtUser) userDetails).getId());
            SimpleUserVO simpleUserVO = new SimpleUserVO();
            return JSONResult.fillResultString(null,"成功",simpleUserVO.Entity2VO(user));
        }else{
            return JSONResult.fillResultString(null,"未登录",null);
        }

    }

    /*
     *simple get用户
     */
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public JSONResult simpleGet(@PathVariable("id") Long id) {
        User user = authService.get(id);
        if(user==null)return JSONResult.fillResultString(null,"不存在",null);
        SimpleUserVO simpleUserVO = new SimpleUserVO();
        return JSONResult.fillResultString(null,"成功",simpleUserVO.Entity2VO(user));
    }

    /*
     *上传用户头像
     */
    @PostMapping(value = "/upload/headImage")
    public JSONResult uploadHeadImage(@RequestParam("file") MultipartFile file){
        String uuid = UUID.randomUUID().toString().replaceAll("-","");
        UserDetails userDetails = WebUtils.getCurrentUser();
        ModifyUserVO modifyUserVO = new ModifyUserVO();
        modifyUserVO.setId(((JwtUser) userDetails).getId());
        String fileName = file.getOriginalFilename();
        String prefix=fileName.substring(fileName.lastIndexOf("."));
        modifyUserVO.setPortrait(uuid+prefix);
        authService.modify(modifyUserVO);


        storageService.store(file,"headImage/"+uuid+prefix);

        return JSONResult.fillResultString(null,"成功",true);
    }

    /*
     *获取用户头像
     */
    @GetMapping(value = "/headImage")
    public String getHeadImage(HttpServletResponse response) throws IOException {
        UserDetails userDetails = WebUtils.getCurrentUser();
        if(userDetails instanceof JwtUser) {
            User user = authService.get(((JwtUser) userDetails).getId());
            Path path = storageService.load("headImage/" + user.getPortrait());
            File imageFile = path.toFile();
            ServletOutputStream os = response.getOutputStream();
            InputStream is = new FileInputStream(imageFile);
            response.setContentType("image/jpeg");
            byte[] buf = new byte[8192];
            int c = 0;
            while ((c = is.read(buf, 0, buf.length)) > 0) {
                os.write(buf, 0, c);
                os.flush();
            }
            os.close();
            is.close();
        }
        return null;
    }


    @ExceptionHandler(StorageFileNotFoundException.class)
    public ResponseEntity handleStorageFileNotFound(StorageFileNotFoundException exc) {
        return ResponseEntity.notFound().build();
    }

}