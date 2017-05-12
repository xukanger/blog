package just.common.vo;

import org.springframework.beans.BeanUtils;

/**
 * Created by yt on 2017/5/12.
 */
public abstract class BaseVO<VO extends BaseVO,Entity> {

    public abstract Entity VO2Entity();

    public void VO2Entity(Entity entity) {
        BeanUtils.copyProperties(this,entity);
    }

    public void VO2Entity(Entity entity,String[]ignorePro){
        BeanUtils.copyProperties(this,entity,ignorePro);
    }

    public VO Entity2VO(Entity entity){
        BeanUtils.copyProperties(entity,this);
        return (VO) this;
    }
}
