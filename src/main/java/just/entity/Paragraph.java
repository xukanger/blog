package just.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;

/**
 * Created by yt on 2017/5/2.
 */
@Entity
public class Paragraph {

    @Id
    @GeneratedValue
    Long id;

    String content;

    Integer seenCount;

    Integer thumbUpCount;

    @OneToMany
    User user;

}
