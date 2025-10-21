package com.nextskill.repository;

import com.nextskill.model.Roadmap;
import com.nextskill.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoadmapRepository extends JpaRepository<Roadmap, Long> {
    List<Roadmap> findByUser(User user);
}
