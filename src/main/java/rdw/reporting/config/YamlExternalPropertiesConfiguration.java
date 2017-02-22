package rdw.reporting.config;

import org.springframework.beans.factory.config.YamlPropertiesFactoryBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.core.io.Resource;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

/**
 * Created on 2/22/17.
 */
@Configuration
public class YamlExternalPropertiesConfiguration {
    @Bean
    public static PropertySourcesPlaceholderConfigurer properties(ApplicationContext applicationContext) {
        List<Properties> props = new ArrayList<>();
        try {
            Resource[] resources = applicationContext.getResources("classpath*:**.sql.yml");
            PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer = new PropertySourcesPlaceholderConfigurer();
            YamlPropertiesFactoryBean yaml = new YamlPropertiesFactoryBean();
            for (Resource res : resources) {
                yaml.setResources(res);
                props.add(yaml.getObject());
            }
            propertySourcesPlaceholderConfigurer.setPropertiesArray(props.toArray(new Properties[props.size()]));
            return propertySourcesPlaceholderConfigurer;
        }
        catch(IOException e) {
            throw new RuntimeException(e);
        }
    }
}
