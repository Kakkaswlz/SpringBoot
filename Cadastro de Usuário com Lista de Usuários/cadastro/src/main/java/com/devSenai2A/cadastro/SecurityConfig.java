package com.devSenai2A.cadastro;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
http
.csrf(csrf -> csrf.disable())
.cors(cors -> {}) //importante CORS (Cross-Origin Resource Sharing) é uma regra de segurança do navegador.
.authorizeHttpRequests(auth -> auth
   //.requestMatchers(HttpMethod.OPTIONS, "/usuarios/**").permitAll()
   .requestMatchers(HttpMethod.DELETE, "/usuarios/**").permitAll()
   .requestMatchers(HttpMethod.PUT, "/usuarios/**").permitAll()
.requestMatchers("/usuarios/**", "/login/**").permitAll()
.anyRequest().authenticated()
);

return http.build();
}


// Bean do BCryptPasswordEncoder para criptografar e validar senhas
@Bean
public BCryptPasswordEncoder passwordEncoder() {
return new BCryptPasswordEncoder();
}
}