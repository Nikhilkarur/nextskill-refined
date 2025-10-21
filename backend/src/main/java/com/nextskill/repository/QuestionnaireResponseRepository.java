package com.nextskill.repository;

import com.nextskill.model.QuestionnaireResponse;
import com.nextskill.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionnaireResponseRepository extends JpaRepository<QuestionnaireResponse, Long> {
    List<QuestionnaireResponse> findByUser(User user);
}
