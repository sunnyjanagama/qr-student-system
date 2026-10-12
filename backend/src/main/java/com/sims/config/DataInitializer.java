package com.sims.config;

import com.sims.model.Role;
import com.sims.model.ScanLog;
import com.sims.model.Student;
import com.sims.model.StudentStatus;
import com.sims.model.User;
import com.sims.repository.ScanLogRepository;
import com.sims.repository.StudentRepository;
import com.sims.repository.UserRepository;
import com.sims.service.QrCodeGeneratorService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final ScanLogRepository scanLogRepository;
    private final PasswordEncoder passwordEncoder;
    private final QrCodeGeneratorService qrService;

    public DataInitializer(UserRepository userRepository,
                           StudentRepository studentRepository,
                           ScanLogRepository scanLogRepository,
                           PasswordEncoder passwordEncoder,
                           QrCodeGeneratorService qrService) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.scanLogRepository = scanLogRepository;
        this.passwordEncoder = passwordEncoder;
        this.qrService = qrService;
    }

    @Override
    public void run(String... args) {
        // Seed default Admin
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User(
                    "admin",
                    "admin@college.edu",
                    passwordEncoder.encode("admin123"),
                    "System Administrator",
                    Role.ROLE_ADMIN
            );
            userRepository.save(admin);
        }

        // Seed default Faculty
        if (!userRepository.existsByUsername("faculty")) {
            User faculty = new User(
                    "faculty",
                    "faculty@college.edu",
                    passwordEncoder.encode("faculty123"),
                    "Prof. Sarah Jenkins",
                    Role.ROLE_FACULTY
            );
            userRepository.save(faculty);
        }

        // Seed initial students if table is empty
        if (studentRepository.count() == 0) {
            seedStudent("21CS101", "Aarav", "Sharma", "aarav.sharma@college.edu", "+91 98765 43210",
                    "Computer Science & Engineering", "A", "4th Year (2021-2025)", LocalDate.of(2003, 5, 14),
                    "O+", "Rajesh Sharma", "+91 98765 00001", "42 Tech Park Avenue, Bengaluru", 8.85, 94.5, StudentStatus.ACTIVE);

            seedStudent("22EC204", "Ananya", "Iyer", "ananya.iyer@college.edu", "+91 98111 22334",
                    "Electronics & Communication", "B", "3rd Year (2022-2026)", LocalDate.of(2004, 8, 22),
                    "A+", "Venkatesh Iyer", "+91 98111 00002", "15 Temple Street, Chennai", 9.15, 96.0, StudentStatus.ACTIVE);

            seedStudent("23AI310", "Rohan", "Verma", "rohan.verma@college.edu", "+91 99222 33445",
                    "Artificial Intelligence & Data Science", "A", "2nd Year (2023-2027)", LocalDate.of(2005, 1, 10),
                    "B+", "Sunil Verma", "+91 99222 00003", "88 Cyber City, Hyderabad", 8.40, 89.2, StudentStatus.ACTIVE);

            seedStudent("22ME402", "Priya", "Nair", "priya.nair@college.edu", "+91 97333 44556",
                    "Mechanical Engineering", "A", "3rd Year (2022-2026)", LocalDate.of(2004, 11, 30),
                    "AB+", "K. Unnikrishnan Nair", "+91 97333 00004", "20 Lakeview Enclave, Kochi", 7.92, 91.0, StudentStatus.ACTIVE);

            seedStudent("21IT505", "Dev", "Patel", "dev.patel@college.edu", "+91 96444 55667",
                    "Information Technology", "C", "4th Year (2021-2025)", LocalDate.of(2003, 3, 19),
                    "O-", "Mahesh Patel", "+91 96444 00005", "102 SG Highway, Ahmedabad", 8.65, 87.5, StudentStatus.ACTIVE);

            seedStudent("20CS088", "Sneha", "Kulkarni", "sneha.kulkarni@college.edu", "+91 95555 66778",
                    "Computer Science & Engineering", "B", "Graduated (Batch 2024)", LocalDate.of(2002, 7, 25),
                    "A-", "Anand Kulkarni", "+91 95555 00006", "77 Shivaji Nagar, Pune", 9.40, 98.2, StudentStatus.GRADUATED);

            // Seed sample scan logs
            scanLogRepository.save(new ScanLog(1L, "21CS101", "Aarav Sharma", "faculty", "CAMPUS_ENTRY", "VALID"));
            scanLogRepository.save(new ScanLog(2L, "22EC204", "Ananya Iyer", "admin", "LIBRARY_CHECKOUT", "VALID"));
            scanLogRepository.save(new ScanLog(3L, "23AI310", "Rohan Verma", "faculty", "LAB_ATTENDANCE", "VALID"));
        }
    }

    private void seedStudent(String roll, String first, String last, String email, String phone,
                            String dept, String sec, String year, LocalDate dob, String blood,
                            String guardian, String guardianPhone, String address, double cgpa,
                            double att, StudentStatus status) {
        Student s = new Student();
        s.setRollNumber(roll);
        s.setFirstName(first);
        s.setLastName(last);
        s.setEmail(email);
        s.setPhone(phone);
        s.setDepartment(dept);
        s.setSection(sec);
        s.setAcademicYear(year);
        s.setDateOfBirth(dob);
        s.setBloodGroup(blood);
        s.setGuardianName(guardian);
        s.setGuardianPhone(guardianPhone);
        s.setAddress(address);
        s.setCgpa(cgpa);
        s.setAttendancePercentage(att);
        s.setStatus(status);

        String uuid = "STU-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
        s.setStudentUuid(uuid);

        String payload = qrService.buildVerificationUrl(uuid);
        s.setQrCodePayload(payload);
        s.setQrCodeBase64(qrService.generateQrCodeBase64(payload, 300, 300));
        s.setCreatedAt(LocalDateTime.now());
        s.setUpdatedAt(LocalDateTime.now());

        studentRepository.save(s);
    }
}
