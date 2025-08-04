package com.pregnancyapp.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

/**
 * 注册请求DTO
 * 
 * @author PregnancyApp Team
 */
@Data
@Schema(description = "注册请求")
public class RegisterRequest {

    @Schema(description = "手机号", example = "13800138000")
    @NotBlank(message = "手机号不能为空")
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    private String phone;

    @Schema(description = "验证码", example = "123456")
    @NotBlank(message = "验证码不能为空")
    @Pattern(regexp = "^\\d{6}$", message = "验证码格式不正确")
    private String verifyCode;

    @Schema(description = "昵称", example = "小雨妈妈")
    @NotBlank(message = "昵称不能为空")
    private String nickname;

    @Schema(description = "角色类型：pregnant-孕妇，partner-伴侣，grandparent-祖父母，family-其他家庭成员", example = "pregnant")
    @NotBlank(message = "角色类型不能为空")
    @Pattern(regexp = "^(pregnant|partner|grandparent|family)$", message = "角色类型不正确")
    private String roleType;

    @Schema(description = "性别：1-男，2-女", example = "2")
    private Integer gender;

    @Schema(description = "邀请码（加入家庭时需要）", example = "ABC12345")
    private String inviteCode;
}