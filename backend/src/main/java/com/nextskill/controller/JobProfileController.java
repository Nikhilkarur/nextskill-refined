package com.nextskill.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/job-profiles")
public class JobProfileController {

    @GetMapping
    public ResponseEntity<List<String>> listRoles() {
        return ResponseEntity.ok(List.of(
                "software-engineer",
                "data-scientist",
                "data-engineer",
                "product-manager",
                "ux-designer",
                "devops-engineer"
        ));
    }
}
