package just.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

/**
 * Created by yt on 2017/5/8.
 */
@Entity
public class SensitiveWord {

    @Id
    @GeneratedValue
    private Long id;

    String content;

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
