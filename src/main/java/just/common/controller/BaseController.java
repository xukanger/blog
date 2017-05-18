package just.common.controller;


import just.common.editor.DateEditor;
import just.common.editor.StringEditor;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;

import java.util.Date;

/**
 * 控制器支持类
 *
 */
public abstract class BaseController {


    /**
     * 初始化数据绑定
     * 1. 将所有传递进来的String进行HTML编码，防止XSS攻击
     * 2. 将字段中Date类型转换为String类型
     *
     * @param binder the binder
     */
    @InitBinder
    protected void initBinder(WebDataBinder binder) {
        // String类型转换，将所有传递进来的String进行HTML编码，防止XSS攻击
        binder.registerCustomEditor(String.class, new StringEditor());
        // Date 类型转换
        binder.registerCustomEditor(Date.class, new DateEditor());
    }




}
