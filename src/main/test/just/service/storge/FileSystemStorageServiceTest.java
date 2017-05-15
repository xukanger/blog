package just.service.storge;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import static org.junit.Assert.*;

/**
 * Created by yt on 2017/5/15.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
public class FileSystemStorageServiceTest {

    @Autowired
    StorageService storageService;

    @Test
    public void init() throws Exception {
        storageService.init();
    }

}