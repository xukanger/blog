package just.common.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

/**
 * Web 工具类
 *
 * @author zhangxd
 */
public final class WebUtils {

    /**
     * 文件临时存储路径
     */
    private static final String TEMP_FILE_PATH = "/tmp";

    private WebUtils() {
        throw new IllegalAccessError("Utility class");
    }

    /**
     * 文件类型转换
     *
     * @param file MultipartFile
     * @return File file
     */
    public static File transfer(MultipartFile file) throws IOException {
        File upFile = new File(new File(TEMP_FILE_PATH), file.getOriginalFilename());
        file.transferTo(upFile);

        return upFile;
    }



    /**
     * 获取当前登录者对象
     *
     * @param <T> the type parameter
     * @return the current 4    user
     */
    @SuppressWarnings("unchecked")
    public static <T extends UserDetails> T getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (T) authentication.getPrincipal();
    }

}
