package com.pregnancyapp.config;

import cn.dev33.satoken.interceptor.SaInterceptor;
import cn.dev33.satoken.router.SaRouter;
import cn.dev33.satoken.stp.StpUtil;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * SA-Token权限认证配置
 * 
 * @author PregnancyApp Team
 */
@Configuration
public class SaTokenConfig implements WebMvcConfigurer {

    /**
     * 注册SA-Token拦截器，打开注解式鉴权功能
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 注册 Sa-Token 拦截器，校验规则为 StpUtil.checkLogin() 登录校验。
        registry.addInterceptor(new SaInterceptor(handle -> {
            // 指定一条 match 规则
            SaRouter
                // 拦截所有路由
                .match("/**")
                // 排除登录相关接口
                .notMatch("/auth/login", "/auth/register", "/auth/send-code")
                // 排除静态资源
                .notMatch("/static/**", "/favicon.ico")
                // 排除API文档
                .notMatch("/doc.html", "/webjars/**", "/v3/api-docs/**", "/swagger-resources/**")
                // 排除健康检查
                .notMatch("/actuator/**", "/health")
                // 排除公开接口
                .notMatch("/public/**")
                // 执行认证函数
                .check(r -> StpUtil.checkLogin());
        })).addPathPatterns("/**");
    }
}