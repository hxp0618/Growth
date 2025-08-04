package com.pregnancyapp.common;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 响应状态码枚举
 * 
 * @author PregnancyApp Team
 */
@Getter
@AllArgsConstructor
public enum ResultCode {

    // 通用状态码
    SUCCESS(200, "操作成功"),
    ERROR(500, "操作失败"),
    PARAM_ERROR(400, "参数错误"),
    UNAUTHORIZED(401, "未授权"),
    FORBIDDEN(403, "禁止访问"),
    NOT_FOUND(404, "资源不存在"),
    METHOD_NOT_ALLOWED(405, "请求方法不允许"),
    CONFLICT(409, "资源冲突"),
    TOO_MANY_REQUESTS(429, "请求过于频繁"),

    // 用户相关状态码 (1000-1999)
    USER_NOT_FOUND(1001, "用户不存在"),
    USER_ALREADY_EXISTS(1002, "用户已存在"),
    USER_DISABLED(1003, "用户已被禁用"),
    PHONE_ALREADY_EXISTS(1004, "手机号已存在"),
    INVALID_PHONE(1005, "手机号格式不正确"),
    INVALID_PASSWORD(1006, "密码格式不正确"),
    PASSWORD_ERROR(1007, "密码错误"),
    OLD_PASSWORD_ERROR(1008, "原密码错误"),

    // 认证相关状态码 (2000-2999)
    LOGIN_REQUIRED(2001, "请先登录"),
    LOGIN_EXPIRED(2002, "登录已过期"),
    TOKEN_INVALID(2003, "Token无效"),
    VERIFY_CODE_ERROR(2004, "验证码错误"),
    VERIFY_CODE_EXPIRED(2005, "验证码已过期"),
    VERIFY_CODE_SEND_FAILED(2006, "验证码发送失败"),
    LOGIN_FAILED(2007, "登录失败"),
    LOGOUT_FAILED(2008, "退出登录失败"),

    // 家庭相关状态码 (3000-3999)
    FAMILY_NOT_FOUND(3001, "家庭不存在"),
    FAMILY_MEMBER_NOT_FOUND(3002, "家庭成员不存在"),
    FAMILY_MEMBER_EXISTS(3003, "用户已是家庭成员"),
    FAMILY_MEMBER_LIMIT_EXCEEDED(3004, "家庭成员数量已达上限"),
    INVALID_INVITE_CODE(3005, "邀请码无效"),
    INVITE_CODE_EXPIRED(3006, "邀请码已过期"),
    PERMISSION_DENIED(3007, "权限不足"),
    CANNOT_LEAVE_FAMILY(3008, "无法退出家庭"),

    // 孕期相关状态码 (4000-4999)
    PREGNANCY_INFO_NOT_FOUND(4001, "孕期信息不存在"),
    PREGNANCY_INFO_EXISTS(4002, "孕期信息已存在"),
    INVALID_DUE_DATE(4003, "预产期无效"),
    INVALID_PREGNANCY_WEEK(4004, "孕周无效"),
    PREGNANCY_STATUS_ERROR(4005, "孕期状态错误"),

    // 健康数据相关状态码 (5000-5999)
    HEALTH_DATA_NOT_FOUND(5001, "健康数据不存在"),
    CHECKUP_RECORD_NOT_FOUND(5002, "产检记录不存在"),
    INVALID_HEALTH_DATA(5003, "健康数据无效"),
    HEALTH_DATA_DUPLICATE(5004, "健康数据重复"),

    // 营养相关状态码 (6000-6999)
    FOOD_NOT_FOUND(6001, "食物不存在"),
    DIET_RECORD_NOT_FOUND(6002, "饮食记录不存在"),
    NUTRITION_TARGET_NOT_FOUND(6003, "营养目标不存在"),
    INVALID_NUTRITION_DATA(6004, "营养数据无效"),

    // 任务相关状态码 (7000-7999)
    TASK_NOT_FOUND(7001, "任务不存在"),
    TASK_ALREADY_ASSIGNED(7002, "任务已被分配"),
    TASK_ALREADY_COMPLETED(7003, "任务已完成"),
    TASK_CANNOT_ASSIGN(7004, "无法分配任务"),
    TASK_CANNOT_COMPLETE(7005, "无法完成任务"),

    // 通知相关状态码 (8000-8999)
    NOTIFICATION_NOT_FOUND(8001, "通知不存在"),
    NOTIFICATION_SEND_FAILED(8002, "通知发送失败"),
    NOTIFICATION_ALREADY_READ(8003, "通知已读"),

    // 内容相关状态码 (9000-9999)
    CONTENT_NOT_FOUND(9001, "内容不存在"),
    CONTENT_ACCESS_DENIED(9002, "内容访问被拒绝"),
    CONTENT_ALREADY_EXISTS(9003, "内容已存在"),

    // 文件相关状态码 (10000-10999)
    FILE_UPLOAD_FAILED(10001, "文件上传失败"),
    FILE_NOT_FOUND(10002, "文件不存在"),
    FILE_TYPE_NOT_SUPPORTED(10003, "文件类型不支持"),
    FILE_SIZE_EXCEEDED(10004, "文件大小超出限制"),
    FILE_DELETE_FAILED(10005, "文件删除失败"),

    // 系统相关状态码 (11000-11999)
    SYSTEM_ERROR(11001, "系统错误"),
    DATABASE_ERROR(11002, "数据库错误"),
    NETWORK_ERROR(11003, "网络错误"),
    SERVICE_UNAVAILABLE(11004, "服务不可用"),
    MAINTENANCE_MODE(11005, "系统维护中");

    private final Integer code;
    private final String message;
}