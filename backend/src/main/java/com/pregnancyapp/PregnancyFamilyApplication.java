package com.pregnancyapp;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * 孕期家庭协作应用启动类
 * 
 * @author PregnancyApp Team
 * @version 1.0.0
 */
@SpringBootApplication
@MapperScan("com.pregnancyapp.mapper")
@EnableTransactionManagement
@EnableAsync
@EnableScheduling
public class PregnancyFamilyApplication {

    public static void main(String[] args) {
        SpringApplication.run(PregnancyFamilyApplication.class, args);
        System.out.println("\n" +
                "  ____                                                   _                \n" +
                " |  _ \\ _ __ ___  __ _ _ __   __ _ _ __   ___ _   _        / \\   _ __  _ __  \n" +
                " | |_) | '__/ _ \\/ _` | '_ \\ / _` | '_ \\ / __| | | |      / _ \\ | '_ \\| '_ \\ \n" +
                " |  __/| | |  __/ (_| | | | | (_| | | | | (__| |_| |     / ___ \\| |_) | |_) |\n" +
                " |_|   |_|  \\___|\\__, |_| |_|\\__,_|_| |_|\\___|\\__, |    /_/   \\_\\ .__/| .__/ \n" +
                "                 |___/                       |___/              |_|   |_|    \n" +
                "\n" +
                "孕期家庭协作应用后端服务启动成功！\n" +
                "API文档地址: http://localhost:8080/api/doc.html\n");
    }
}