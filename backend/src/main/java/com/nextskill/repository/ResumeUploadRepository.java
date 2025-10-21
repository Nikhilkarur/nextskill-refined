package com.nextskill.repository;

import com.nextskill.model.ResumeUpload;
import com.nextskill.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResumeUploadRepository extends JpaRepository<ResumeUpload, Long> {
    List<ResumeUpload> findByUser(User user);
}
