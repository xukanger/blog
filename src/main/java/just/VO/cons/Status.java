package just.VO.cons;

/**
 * Created by llf on 2017/5/2.
 */
public enum Status {
     NORMAL("normal","普通"),
     RECOMMENDED("recommanded","被推荐"),
     DRAFT("draft","草稿");



     String name;

     String describe;

     Status(String name, String describe) {
          this.name = name;
          this.describe = describe;
     }
}

