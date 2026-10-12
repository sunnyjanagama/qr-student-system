package com.sims.service;

import com.sims.dto.DashboardStatsDto;
import com.sims.model.StudentStatus;
import com.sims.repository.ScanLogRepository;
import com.sims.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    private final StudentRepository studentRepository;
    private final ScanLogRepository scanLogRepository;

    public AnalyticsService(StudentRepository studentRepository, ScanLogRepository scanLogRepository) {
        this.studentRepository = studentRepository;
        this.scanLogRepository = scanLogRepository;
    }

    public DashboardStatsDto getDashboardStats() {
        DashboardStatsDto stats = new DashboardStatsDto();

        stats.setTotalStudents(studentRepository.count());
        stats.setActiveStudents(studentRepository.countByStatus(StudentStatus.ACTIVE));
        stats.setGraduatedStudents(studentRepository.countByStatus(StudentStatus.GRADUATED));

        Double avgCgpa = studentRepository.calculateAverageCgpa();
        if (avgCgpa != null) {
            stats.setAverageCgpa(BigDecimal.valueOf(avgCgpa).setScale(2, RoundingMode.HALF_UP).doubleValue());
        } else {
            stats.setAverageCgpa(0.0);
        }

        Double avgAtt = studentRepository.calculateAverageAttendance();
        if (avgAtt != null) {
            stats.setAverageAttendance(BigDecimal.valueOf(avgAtt).setScale(1, RoundingMode.HALF_UP).doubleValue());
        } else {
            stats.setAverageAttendance(0.0);
        }

        // Department breakdown
        List<Object[]> deptList = studentRepository.countByDepartmentGrouped();
        Map<String, Long> deptMap = new LinkedHashMap<>();
        for (Object[] row : deptList) {
            if (row[0] != null) {
                deptMap.put((String) row[0], ((Number) row[1]).longValue());
            }
        }
        stats.setDepartmentDistribution(deptMap);

        // Status breakdown
        List<Object[]> statusList = studentRepository.countByStatusGrouped();
        Map<String, Long> statusMap = new LinkedHashMap<>();
        for (Object[] row : statusList) {
            if (row[0] != null) {
                statusMap.put(row[0].toString(), ((Number) row[1]).longValue());
            }
        }
        stats.setStatusDistribution(statusMap);

        // Recent Scans
        stats.setRecentScans(scanLogRepository.findTop15ByOrderByScannedAtDesc());

        return stats;
    }
}
