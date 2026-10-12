package com.sims.dto;

import com.sims.model.StudentStatus;
import java.time.LocalDateTime;

public class VerificationResponseDto {

    private boolean verified;
    private String message;
    private String studentUuid;
    private String rollNumber;
    private String fullName;
    private String email;
    private String department;
    private String section;
    private String academicYear;
    private String bloodGroup;
    private Double cgpa;
    private Double attendancePercentage;
    private StudentStatus status;
    private LocalDateTime verifiedAt;

    public VerificationResponseDto() {
        this.verifiedAt = LocalDateTime.now();
    }

    public static VerificationResponseDto success(StudentDto student) {
        VerificationResponseDto dto = new VerificationResponseDto();
        dto.setVerified(true);
        dto.setMessage("Official Student Record Authenticated");
        dto.setStudentUuid(student.getStudentUuid());
        dto.setRollNumber(student.getRollNumber());
        dto.setFullName(student.getFirstName() + " " + student.getLastName());
        dto.setEmail(student.getEmail());
        dto.setDepartment(student.getDepartment());
        dto.setSection(student.getSection());
        dto.setAcademicYear(student.getAcademicYear());
        dto.setBloodGroup(student.getBloodGroup());
        dto.setCgpa(student.getCgpa());
        dto.setAttendancePercentage(student.getAttendancePercentage());
        dto.setStatus(student.getStatus());
        dto.setVerifiedAt(LocalDateTime.now());
        return dto;
    }

    public static VerificationResponseDto failure(String message) {
        VerificationResponseDto dto = new VerificationResponseDto();
        dto.setVerified(false);
        dto.setMessage(message);
        dto.setVerifiedAt(LocalDateTime.now());
        return dto;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getStudentUuid() {
        return studentUuid;
    }

    public void setStudentUuid(String studentUuid) {
        this.studentUuid = studentUuid;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getSection() {
        return section;
    }

    public void setSection(String section) {
        this.section = section;
    }

    public String getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(String academicYear) {
        this.academicYear = academicYear;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public Double getCgpa() {
        return cgpa;
    }

    public void setCgpa(Double cgpa) {
        this.cgpa = cgpa;
    }

    public Double getAttendancePercentage() {
        return attendancePercentage;
    }

    public void setAttendancePercentage(Double attendancePercentage) {
        this.attendancePercentage = attendancePercentage;
    }

    public StudentStatus getStatus() {
        return status;
    }

    public void setStatus(StudentStatus status) {
        this.status = status;
    }

    public LocalDateTime getVerifiedAt() {
        return verifiedAt;
    }

    public void setVerifiedAt(LocalDateTime verifiedAt) {
        this.verifiedAt = verifiedAt;
    }
}
