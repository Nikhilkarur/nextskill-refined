package com.nextskill.repository;

import com.nextskill.model.Roadmap;
import com.nextskill.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoadmapRepository extends JpaRepository<Roadmap, Long> {
    List<Roadmap> findByUser(User user);

    // Robust queries that traverse relationships by user email
    List<Roadmap> findByUserEmailOrderByCreatedAtAsc(String email);
    Optional<Roadmap> findTopByUserEmailOrderByCreatedAtDesc(String email);
    long countByUserEmail(String email);
}
