package com.pregnancyapp.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 用户实体类
 * 
 * @author PregnancyApp Team
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("users")
@Schema(description = "用户信息")
public class User implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "用户ID")
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    @Schema(description = "手机号")
    @TableField("phone")
    private String phone;

    @Schema(description = "昵称")
    @TableField("nickname")
    private String nickname;

    @Schema(description = "头像URL")
    @TableField("avatar_url")
    private String avatarUrl;

    @Schema(description = "性别：1-男，2-女")
    @TableField("gender")
    private Integer gender;

    @Schema(description = "生日")
    @TableField("birthday")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate birthday;

    @Schema(description = "角色类型：pregnant-孕妇，partner-伴侣，grandparent-祖父母，family-其他家庭成员")
    @TableField("role_type")
    private String roleType;

    @Schema(description = "状态：1-正常，0-禁用")
    @TableField("status")
    private Integer status;

    @Schema(description = "最后登录时间")
    @TableField("last_login_time")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime lastLoginTime;

    @Schema(description = "创建时间")
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @Schema(description = "更新时间")
    @TableField(value = "updated_at", fill = FieldFill.INSERT_UPDATE)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    // 非数据库字段
    @Schema(description = "家庭角色")
    @TableField(exist = false)
    private String familyRole;

    @Schema(description = "家庭ID")
    @TableField(exist = false)
    private Long familyId;

    @Schema(description = "权限列表")
    @TableField(exist = false)
    private String permissions;

    /**
     * 角色类型枚举
     */
    public enum RoleType {
        PREGNANT("pregnant", "孕妇"),
        PARTNER("partner", "伴侣"),
        GRANDPARENT("grandparent", "祖父母"),
        FAMILY("family", "其他家庭成员");

        private final String code;
        private final String name;

        RoleType(String code, String name) {
            this.code = code;
            this.name = name;
        }

        public String getCode() {
            return code;
        }

        public String getName() {
            return name;
        }

        public static RoleType fromCode(String code) {
            for (RoleType type : values()) {
                if (type.code.equals(code)) {
                    return type;
                }
            }
            return null;
        }
    }

    /**
     * 性别枚举
     */
    public enum Gender {
        MALE(1, "男"),
        FEMALE(2, "女");

        private final Integer code;
        private final String name;

        Gender(Integer code, String name) {
            this.code = code;
            this.name = name;
        }

        public Integer getCode() {
            return code;
        }

        public String getName() {
            return name;
        }

        public static Gender fromCode(Integer code) {
            for (Gender gender : values()) {
                if (gender.code.equals(code)) {
                    return gender;
                }
            }
            return null;
        }
    }

    /**
     * 用户状态枚举
     */
    public enum Status {
        DISABLED(0, "禁用"),
        ENABLED(1, "正常");

        private final Integer code;
        private final String name;

        Status(Integer code, String name) {
            this.code = code;
            this.name = name;
        }

        public Integer getCode() {
            return code;
        }

        public String getName() {
            return name;
        }

        public static Status fromCode(Integer code) {
            for (Status status : values()) {
                if (status.code.equals(code)) {
                    return status;
                }
            }
            return null;
        }
    }

    /**
     * 判断是否为孕妇
     */
    public boolean isPregnant() {
        return RoleType.PREGNANT.getCode().equals(this.roleType);
    }

    /**
     * 判断是否为伴侣
     */
    public boolean isPartner() {
        return RoleType.PARTNER.getCode().equals(this.roleType);
    }

    /**
     * 判断是否为祖父母
     */
    public boolean isGrandparent() {
        return RoleType.GRANDPARENT.getCode().equals(this.roleType);
    }

    /**
     * 判断是否启用
     */
    public boolean isEnabled() {
        return Status.ENABLED.getCode().equals(this.status);
    }

    /**
     * 获取性别名称
     */
    public String getGenderName() {
        Gender genderEnum = Gender.fromCode(this.gender);
        return genderEnum != null ? genderEnum.getName() : "";
    }

    /**
     * 获取角色类型名称
     */
    public String getRoleTypeName() {
        RoleType roleTypeEnum = RoleType.fromCode(this.roleType);
        return roleTypeEnum != null ? roleTypeEnum.getName() : "";
    }

    /**
     * 获取状态名称
     */
    public String getStatusName() {
        Status statusEnum = Status.fromCode(this.status);
        return statusEnum != null ? statusEnum.getName() : "";
    }
}