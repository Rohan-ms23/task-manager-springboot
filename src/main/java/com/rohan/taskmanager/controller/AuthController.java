package com.rohan.taskmanager.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.rohan.taskmanager.entity.User;
import com.rohan.taskmanager.service.UserService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService service;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return service.register(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody User user) {

        boolean success =
                service.login(
                        user.getEmail(),
                        user.getPassword());

        return success
                ? "Login Success"
                : "Invalid Credentials";
    }
}