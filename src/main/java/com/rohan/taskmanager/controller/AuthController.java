package com.rohan.taskmanager.controller;

import com.rohan.taskmanager.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.rohan.taskmanager.entity.User;
import com.rohan.taskmanager.service.UserService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService service;

    @Autowired
    private JwtUtil jwtUtil;

@GetMapping("/token")
public String token() {

    return jwtUtil.generateToken(
            "test@gmail.com");
}

@PostMapping("/login")
public String login(@RequestBody User user) {

    boolean success =
            service.login(
                    user.getEmail(),
                    user.getPassword());

    if(success) {

        return jwtUtil.generateToken(
                user.getEmail());
    }

    return "Invalid Credentials";
}
}