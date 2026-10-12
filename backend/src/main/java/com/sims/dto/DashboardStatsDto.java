package com.sims.dto;

import com.sims.model.ScanLog;
import java.util.List;
import java.util.Map;

public class DashboardStatsDto {

    private long totalStudents;
    private long activeStudents;
    private long graduatedStudents;
    private Double averageCgpa;
    private Double averageAttendance;
    private Map<String, Long> departmentDistribution;
    private Map<String, Long> statusDistribution;
    private List<ScanLog> recentScans;

    public DashboardStatsDto() {
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getActiveStudents() {
        return activeStudents;
    }

    public void setActiveStudents(long activeStudents) {
        this.activeStudents = activeStudents;
    }

    public long getGraduatedStudents() {
        return graduatedStudents;
    }

    public void setGraduatedStudents(long graduatedStudents) {
        this.graduatedStudents = graduatedStudents;
    }

    public Double getAverageCgpa() {
        return averageCgpa;
    }

    public void setAverageCgpa(Double averageCgpa) {
        this.averageCgpa = averageCgpa;
    }

    public Double getAverageAttendance() {
        return averageAttendance;
    }

    public void setAverageAttendance(Double averageAttendance) {
        this.averageAttendance = averageAttendance;
    }

    public Map<String, Long> getDepartmentDistribution() {
        return departmentDistribution;
    }

    public void setDepartmentDistribution(Map<String, Long> departmentDistribution) {
        this.departmentDistribution = departmentDistribution;
    }

    public Map<String, Long> getStatusDistribution() {
        return statusDistribution;
    }

    public void setStatusDistribution(Map<String, Long> statusDistribution) {
        this.statusDistribution = statusDistribution;
    }

    public List<ScanLog> getRecentScans() {
        return recentScans;
    }

    public void setRecentScans(List<ScanLog> recentScans) {
        this.recentScans = recentScans;
    }
}
