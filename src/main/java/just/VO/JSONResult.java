package just.VO;

import org.json.JSONObject;

/**
 * Created by yt on 2017/4/30.
 */
public class JSONResult {
    public static String fillResultString(Integer status, String message, Object result){
        JSONObject jsonObject = new JSONObject(){{
            put("status", status);
            put("message", message);
            put("result", result);
        }};
        return jsonObject.toString();
    }
}
