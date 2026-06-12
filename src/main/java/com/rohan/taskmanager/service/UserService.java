package com.rohan.taskmanager.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.rohan.taskmanager.entity.User;
import com.rohan.taskmanager.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository repository;

    @Autowired
    private BCryptPasswordEncoder encoder;

    public User register(User user){

        user.setPassword(
                encoder.encode(user.getPassword()));

        return repository.save(user);
    }

    public boolean login(String email, String password) {

    User user =
            repository.findByEmail(email)
                    .orElse(null);

    if (user == null) {
        return false;
    }

    return encoder.matches(
            password,
            user.getPassword());
}
}