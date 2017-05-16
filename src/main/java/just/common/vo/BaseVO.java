package just.common.vo;

import just.common.entity.BaseEntity;
import org.springframework.beans.BeanUtils;

/**
 * Created by yt on 2017/5/12.
 */
public abstract class BaseVO<VO extends BaseVO,Entity extends BaseEntity> {

    public abstract Entity VO2Entity();

    public VO Entity2VO(Entity entity){
        BeanUtils.copyProperties(entity,this);
        return (VO) this;
    }
}
