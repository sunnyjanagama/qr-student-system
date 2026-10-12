package com.sims.repository;

import com.sims.model.ScanLog;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScanLogRepository extends JpaRepository<ScanLog, Long> {
    List<ScanLog> findTop15ByOrderByScannedAtDesc();
    List<ScanLog> findByStudentIdOrderByScannedAtDesc(Long studentId, Pageable pageable);
}
