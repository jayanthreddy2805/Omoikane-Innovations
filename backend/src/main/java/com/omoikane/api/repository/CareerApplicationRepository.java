package com.omoikane.api.repository;

import com.omoikane.api.entity.CareerApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CareerApplicationRepository extends JpaRepository<CareerApplication, Long> {
    List<CareerApplication> findAllByOrderByCreatedAtDesc();
}
