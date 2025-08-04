package com.pregnancyapp.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/**
 * 发送验证码请求DTO
 * 
 * @author PregnancyApp Team
 */
@Data
@Schema(description = "发送验证码请求")
public class SendCodeRequest {

    @Schema(description = "手机号", example = "13800138000")
    @NotBlank(message = "手机号不能为空")
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    private String phone;

    @Schema(description = "验证码类型：register-注册，login-登录，reset-重置密码", example = "register")
    @NotBlank(message = "验证码类型不能为空")
    @Pattern(regexp = "^(register|login|reset)$", message = "验证码类型不正确")
    private String type;
}