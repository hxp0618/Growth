package com.pregnancyapp.controller;

import cn.dev33.satoken.annotation.SaIgnore;
import cn.dev33.satoken.stp.StpUtil;
import com.pregnancyapp.common.Result;
import com.pregnancyapp.dto.request.LoginRequest;
import com.pregnancyapp.dto.request.RegisterRequest;
import com.pregnancyapp.dto.request.SendCodeRequest;
import com.pregnancyapp.dto.response.LoginResponse;
import com.pregnancyapp.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

/**
 * 认证控制器
 * 
 * @author PregnancyApp Team
 */
@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Validated
@Tag(name = "认证管理", description = "用户认证相关接口")
public class AuthController {

    private final AuthService authService;

    @SaIgnore
    @PostMapping("/send-code")
    @Operation(summary = "发送验证码", description = "发送短信验证码")
    public Result<Void> sendCode(@Valid @RequestBody SendCodeRequest request) {
        log.info("发送验证码请求: {}", request.getPhone());
        authService.sendVerifyCode(request.getPhone(), request.getType());
        return Result.success("验证码发送成功");
    }

    @SaIgnore
    @PostMapping("/register")
    @Operation(summary = "用户注册", description = "新用户注册")
    public Result<LoginResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("用户注册请求: {}", request.getPhone());
        LoginResponse response = authService.register(request);
        return Result.success("注册成功", response);
    }

    @SaIgnore
    @PostMapping("/login")
    @Operation(summary = "用户登录", description = "用户登录认证")
    public Result<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("用户登录请求: {}", request.getPhone());
        LoginResponse response = authService.login(request);
        return Result.success("登录成功", response);
    }

    @PostMapping("/logout")
    @Operation(summary = "用户退出", description = "用户退出登录")
    public Result<Void> logout() {
        Long userId = StpUtil.getLoginIdAsLong();
        log.info("用户退出登录: {}", userId);
        authService.logout(userId);
        return Result.success("退出成功");
    }

    @GetMapping("/info")
    @Operation(summary = "获取用户信息", description = "获取当前登录用户信息")
    public Result<LoginResponse> getUserInfo() {
        Long userId = StpUtil.getLoginIdAsLong();
        log.info("获取用户信息: {}", userId);
        LoginResponse response = authService.getUserInfo(userId);
        return Result.success(response);
    }

    @PostMapping("/refresh")
    @Operation(summary = "刷新Token", description = "刷新用户Token")
    public Result<LoginResponse> refreshToken() {
        Long userId = StpUtil.getLoginIdAsLong();
        log.info("刷新Token: {}", userId);
        LoginResponse response = authService.refreshToken(userId);
        return Result.success("Token刷新成功", response);
    }
}