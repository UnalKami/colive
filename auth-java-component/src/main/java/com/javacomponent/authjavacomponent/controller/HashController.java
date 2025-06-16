package com.javacomponent.authjavacomponent.controller;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/hash")
public class HashController {

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @GetMapping("/{rawPassword}")
    public String hashPassword(@PathVariable String rawPassword) {
        return encoder.encode(rawPassword);
    }
}
