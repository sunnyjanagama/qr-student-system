package com.sims.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "scan_logs")
public class ScanLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id")
    private Long studentId;

    @Column(name = "student_roll_number", length = 50)
    private String studentRollNumber;

    @Column(name = "student_name", length = 120)
    private String studentName;

    @Column(name = "scanned_by_username", length = 50)
    private String scannedByUsername;

    @Column(name = "scan_purpose", length = 50)
    private String scanPurpose = "VERIFICATION";

    @Column(name = "verification_status", length = 20)
    private String verificationStatus = "VALID";

    @Column(name = "scanned_at", nullable = false)
    private LocalDateTime scannedAt;

    public ScanLog() {
    }

    public ScanLog(Long studentId, String studentRollNumber, String studentName, String scannedByUsername, String scanPurpose, String verificationStatus) {
        this.studentId = studentId;
        this.studentRollNumber = studentRollNumber;
        this.studentName = studentName;
        this.scannedByUsername = scannedByUsername;
        this.scanPurpose = scanPurpose;
        this.verificationStatus = verificationStatus;
        this.scannedAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.scannedAt == null) {
            this.scannedAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentRollNumber() {
        return studentRollNumber;
    }

    public void setStudentRollNumber(String studentRollNumber) {
        this.studentRollNumber = studentRollNumber;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getScannedByUsername() {
        return scannedByUsername;
    }

    public void setScannedByUsername(String scannedByUsername) {
        this.scannedByUsername = scannedByUsername;
    }

    public String getScanPurpose() {
        return scanPurpose;
    }

    public void setScanPurpose(String scanPurpose) {
        this.scanPurpose = scanPurpose;
    }

    public String getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(String verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public LocalDateTime getScannedAt() {
        return scannedAt;
    }

    public void setScannedAt(LocalDateTime scannedAt) {
        this.scannedAt = scannedAt;
    }
}
