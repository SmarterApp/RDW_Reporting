package rdw.reporting.config.data;


import org.springframework.boot.autoconfigure.jdbc.DataSourceBuilder;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

import javax.sql.DataSource;

/**
 * Configuration for DataSources.  Queries
 */
@Configuration
public class DataSourceConfiguration {

    @Bean(name = "queryDataSource")
    @ConfigurationProperties(prefix = "spring.datasource")
    public DataSource queriesDataSource() {
        return DataSourceBuilder
                .create()
                .build();
    }

    @Bean(name = "queryJdbcTemplate")
    public NamedParameterJdbcTemplate queryJdbcTemplate() {
        return new NamedParameterJdbcTemplate(queriesDataSource());
    }

}