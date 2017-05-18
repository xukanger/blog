package just.common.processor;

import com.google.common.collect.Lists;
import just.common.util.SensitiveWordInit;
import just.common.util.SensitivewordEngine;
import just.entity.SensitiveWord;
import just.service.sensitiveword.SensitiveWordRepository;
import just.service.storge.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * Created by yt on 2017/5/15.
 */
@Component
public class InstantiationTracingBeanPostProcessor implements ApplicationListener<ContextRefreshedEvent> {

    final
    StorageService storageService;

    final SensitiveWordRepository sensitiveWordRepository;

    @Autowired
    public InstantiationTracingBeanPostProcessor(StorageService storageService, SensitiveWordRepository sensitiveWordRepository) {
        this.storageService = storageService;
        this.sensitiveWordRepository = sensitiveWordRepository;
    }

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        if(event.getApplicationContext().getParent() == null){
            storageService.init();
            Iterable<SensitiveWord> iterable = sensitiveWordRepository.findAll();
            if(iterable == null) return;
            List<SensitiveWord> sensitiveWords = Lists.newArrayList();
            SensitiveWordInit sensitiveWordInit = new SensitiveWordInit();
            SensitivewordEngine.sensitiveWordMap = sensitiveWordInit.initKeyWord(sensitiveWords);
        }
    }
}
