package com.razoragent.config;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${spring.datasource.url}")
    private String rawUrl;

    @Value("${spring.datasource.username:}")
    private String username;

    @Value("${spring.datasource.password:}")
    private String password;

    @Value("${spring.datasource.driver-class-name:org.postgresql.Driver}")
    private String driverClassName;

    @Bean
    @Primary
    public DataSource dataSource(DataSourceProperties properties) {
        String processedUrl = rawUrl;
        
        // Auto-fix URL if user passed postgresql:// instead of jdbc:postgresql://
        if (processedUrl != null && processedUrl.startsWith("postgresql://")) {
            log.info("Converting postgresql:// connection string to JDBC format jdbc:postgresql://");
            processedUrl = "jdbc:" + processedUrl;
        }

        // If URL contains embedded username:password@ host format (e.g. jdbc:postgresql://user:pass@host/db)
        if (processedUrl != null && processedUrl.contains("@") && processedUrl.startsWith("jdbc:postgresql://")) {
            try {
                String prefix = "jdbc:postgresql://";
                String rest = processedUrl.substring(prefix.length());
                if (rest.contains("@")) {
                    String userPassPart = rest.substring(0, rest.indexOf("@"));
                    String hostAndDbPart = rest.substring(rest.indexOf("@") + 1);
                    
                    if (userPassPart.contains(":")) {
                        String[] userPass = userPassPart.split(":", 2);
                        if (username == null || username.isBlank()) {
                            username = userPass[0];
                        }
                        if (password == null || password.isBlank()) {
                            password = userPass[1];
                        }
                    }
                    processedUrl = prefix + hostAndDbPart;
                }
            } catch (Exception e) {
                log.warn("Failed to parse embedded user:pass from JDBC URL: {}", e.getMessage());
            }
        }

        log.info("Initializing HikariDataSource with JDBC URL: {}", processedUrl.replaceAll("password=.*", "password=***"));

        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setJdbcUrl(processedUrl);
        if (username != null && !username.isBlank()) dataSource.setUsername(username);
        if (password != null && !password.isBlank()) dataSource.setPassword(password);
        if (processedUrl != null && processedUrl.contains("h2")) {
            dataSource.setDriverClassName("org.h2.Driver");
        } else {
            dataSource.setDriverClassName(driverClassName);
        }
        
        return dataSource;
    }
}
