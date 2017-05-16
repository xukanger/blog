package just.common.processor;

import just.service.storge.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

/**
 * Created by yt on 2017/5/15.
 */
@Component
public class InstantiationTracingBeanPostProcessor implements ApplicationListener<ContextRefreshedEvent> {

    final
    StorageService storageService;

    @Autowired
    public InstantiationTracingBeanPostProcessor(StorageService storageService) {
        this.storageService = storageService;
    }

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        if(event.getApplicationContext().getParent() == null){
            storageService.init();
        }
    }
}
