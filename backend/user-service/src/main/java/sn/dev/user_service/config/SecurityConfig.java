package sn.dev.user_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .authorizeHttpRequests(auth -> auth
                // User endpoints
                .requestMatchers("/api/users/me").authenticated()
                .requestMatchers("/api/users/{id}").authenticated()
                // Watchlist endpoints
                .requestMatchers("/api/users/watchlist/**").authenticated()
                // Social endpoints
                .requestMatchers("/api/users/follow/**").authenticated()
                .requestMatchers("/api/users/following/**").authenticated()
                .requestMatchers("/api/users/followers/**").authenticated()
                .anyRequest().permitAll()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(Customizer.withDefaults())
            )
            .build();
    }
}
