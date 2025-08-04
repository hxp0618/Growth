package com.pregnancyapp.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 登录响应DTO
 * 
 * @author PregnancyApp Team
 */
@Data
@Schema(description = "登录响应")
public class LoginResponse {

    @Schema(description = "用户ID")
    private Long userId;

    @Schema(description = "手机号")
    private String phone;

    @Schema(description = "昵称")
    private String nickname;

    @Schema(description = "头像URL")
    private String avatarUrl;

    @Schema(description = "性别：1-男，2-女")
    private Integer gender;

    @Schema(description = "性别名称")
    private String genderName;

    @Schema(description = "角色类型")
    private String roleType;

    @Schema(description = "角色类型名称")
    private String roleTypeName;

    @Schema(description = "访问令牌")
    private String accessToken;

    @Schema(description = "令牌类型")
    private String tokenType = "Bearer";

    @Schema(description = "令牌过期时间")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime expiresAt;

    @Schema(description = "家庭信息")
    private FamilyInfo familyInfo;

    @Schema(description = "孕期信息")
    private PregnancyInfo pregnancyInfo;

    @Schema(description = "权限列表")
    private List<String> permissions;

    /**
     * 家庭信息
     */
    @Data
    @Schema(description = "家庭信息")
    public static class FamilyInfo {
        @Schema(description = "家庭ID")
        private Long familyId;

        @Schema(description = "家庭名称")
        private String familyName;

        @Schema(description = "家庭角色")
        private String familyRole;

        @Schema(description = "邀请码")
        private String inviteCode;

        @Schema(description = "家庭成员数量")
        private Integer memberCount;

        @Schema(description = "加入时间")
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime joinedAt;
    }

    /**
     * 孕期信息
     */
    @Data
    @Schema(description = "孕期信息")
    public static class PregnancyInfo {
        @Schema(description = "预产期")
        @JsonFormat(pattern = "yyyy-MM-dd")
        private String dueDate;

        @Schema(description = "当前孕周")
        private Integer currentWeek;

        @Schema(description = "当前孕周天数")
        private Integer currentDay;

        @Schema(description = "孕期状态")
        private String pregnancyStatus;

        @Schema(description = "胎儿性别")
        private String babyGender;

        @Schema(description = "胎儿昵称")
        private String babyName;

        @Schema(description = "距离预产期天数")
        private Integer daysToDue;
    }
}