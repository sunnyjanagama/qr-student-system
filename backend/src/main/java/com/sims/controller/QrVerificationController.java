package com.sims.controller;

import com.sims.dto.StudentDto;
import com.sims.dto.VerificationResponseDto;
import com.sims.model.ScanLog;
import com.sims.model.User;
import com.sims.repository.ScanLogRepository;
import com.sims.service.AuthService;
import com.sims.service.QrCodeGeneratorService;
import com.sims.service.StudentService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/qr")
public class QrVerificationController {

    private final StudentService studentService;
    private final QrCodeGeneratorService qrCodeGeneratorService;
    private final ScanLogRepository scanLogRepository;
    private final AuthService authService;

    public QrVerificationController(StudentService studentService,
                                   QrCodeGeneratorService qrCodeGeneratorService,
                                   ScanLogRepository scanLogRepository,
                                   AuthService authService) {
        this.studentService = studentService;
        this.qrCodeGeneratorService = qrCodeGeneratorService;
        this.scanLogRepository = scanLogRepository;
        this.authService = authService;
    }

    @GetMapping("/verify/{input}")
    public ResponseEntity<VerificationResponseDto> verifyStudent(@PathVariable String input) {
        String cleanUuid = input.trim();
        // If input contains a URL like .../verify/STU-XYZ, extract the token
        if (cleanUuid.contains("/verify/")) {
            cleanUuid = cleanUuid.substring(cleanUuid.lastIndexOf("/verify/") + 8);
        }

        try {
            StudentDto student;
            // Attempt lookup by UUID first, then fallback to roll number
            try {
                student = studentService.getStudentByUuid(cleanUuid);
            } catch (Exception e) {
                student = studentService.getStudentByRollNumber(cleanUuid);
            }

            VerificationResponseDto response = VerificationResponseDto.success(student);

            // Log this verification
            User currentUser = authService.getCurrentUser();
            String verifier = currentUser != null ? currentUser.getUsername() : "PUBLIC_SCANNER";

            ScanLog scanLog = new ScanLog(
                    student.getId(),
                    student.getRollNumber(),
                    student.getFirstName() + " " + student.getLastName(),
                    verifier,
                    "QR_VERIFICATION",
                    "VALID"
            );
            scanLogRepository.save(scanLog);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Log failed scan attempt
            User currentUser = authService.getCurrentUser();
            String verifier = currentUser != null ? currentUser.getUsername() : "PUBLIC_SCANNER";

            ScanLog failedLog = new ScanLog(
                    null,
                    cleanUuid,
                    "Unknown / Unverified",
                    verifier,
                    "QR_VERIFICATION",
                    "INVALID"
            );
            scanLogRepository.save(failedLog);

            return ResponseEntity.ok(VerificationResponseDto.failure("No registered student found for code: " + cleanUuid));
        }
    }

    @GetMapping("/student/{id}/image")
    public ResponseEntity<byte[]> getStudentQrImage(@PathVariable Long id) {
        try {
            StudentDto student = studentService.getStudentById(id);
            String payload = student.getQrCodePayload();
            if (payload == null || payload.isEmpty()) {
                payload = qrCodeGeneratorService.buildVerificationUrl(student.getStudentUuid());
            }

            byte[] qrImage = qrCodeGeneratorService.generateQrCodePng(payload, 350, 350);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"qr_" + student.getRollNumber() + ".png\"")
                    .contentType(MediaType.IMAGE_PNG)
                    .body(qrImage);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/log-scan")
    public ResponseEntity<?> logManualScan(@RequestBody Map<String, String> payload) {
        String studentIdStr = payload.get("studentId");
        String rollNumber = payload.get("rollNumber");
        String studentName = payload.get("studentName");
        String purpose = payload.getOrDefault("purpose", "ATTENDANCE");
        String status = payload.getOrDefault("status", "VALID");

        User currentUser = authService.getCurrentUser();
        String verifier = currentUser != null ? currentUser.getUsername() : "STAFF";

        Long studentId = (studentIdStr != null && !studentIdStr.isEmpty()) ? Long.parseLong(studentIdStr) : null;

        ScanLog scanLog = new ScanLog(
                studentId,
                rollNumber,
                studentName,
                verifier,
                purpose,
                status
        );
        ScanLog saved = scanLogRepository.save(scanLog);

        return ResponseEntity.ok(saved);
    }
}
