package just.VO;

/**
 * Created by yt on 2017/4/30.
 */
public class JSONResult {

    private Integer status;

    private String message;

    private Object result;

    public JSONResult(Integer status, String message, Object result) {
        this.status = status;
        this.message = message;
        this.result = result;
    }

    public static JSONResult fillResultString(Integer status, String message, Object result){

        return new JSONResult(status,message,result);
    }
}
