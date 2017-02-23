package rdw.reporting;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;
import rdw.utils.YamlPropertiesConfigurator;

@SpringBootApplication
@Import(YamlPropertiesConfigurator.class)
public class Application {
    
    public static void main(String[] args) {

        SpringApplication.run(Application.class, args);

    }
}