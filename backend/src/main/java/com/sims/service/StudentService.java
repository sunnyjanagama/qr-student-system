package com.sims.service;

import com.sims.dto.StudentDto;
import com.sims.model.Student;
import com.sims.model.StudentStatus;
import com.sims.repository.StudentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.StringWriter;
import java.util.List;
import java.util.UUID;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final QrCodeGeneratorService qrCodeGeneratorService;

    public StudentService(StudentRepository studentRepository, QrCodeGeneratorService qrCodeGeneratorService) {
        this.studentRepository = studentRepository;
        this.qrCodeGeneratorService = qrCodeGeneratorService;
    }

    public Page<StudentDto> searchStudents(String query, String department, StudentStatus status, Pageable pageable) {
        return studentRepository.searchStudents(query, department, status, pageable)
                .map(this::mapToDto);
    }

    public StudentDto getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + id));
        return mapToDto(student);
    }

    public StudentDto getStudentByUuid(String uuid) {
        Student student = studentRepository.findByStudentUuid(uuid)
                .orElseThrow(() -> new RuntimeException("Student not found with UUID: " + uuid));
        return mapToDto(student);
    }

    public StudentDto getStudentByRollNumber(String rollNumber) {
        Student student = studentRepository.findByRollNumber(rollNumber)
                .orElseThrow(() -> new RuntimeException("Student not found with Roll Number: " + rollNumber));
        return mapToDto(student);
    }

    @Transactional
    public StudentDto createStudent(StudentDto dto) {
        if (studentRepository.existsByRollNumber(dto.getRollNumber())) {
            throw new IllegalArgumentException("Roll number already exists: " + dto.getRollNumber());
        }

        if (studentRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + dto.getEmail());
        }

        Student student = new Student();
        mapDtoToEntity(dto, student);

        // Generate unique UUID and QR code
        String uuid = "STU-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
        student.setStudentUuid(uuid);

        String qrPayload = qrCodeGeneratorService.buildVerificationUrl(uuid);
        student.setQrCodePayload(qrPayload);
        student.setQrCodeBase64(qrCodeGeneratorService.generateQrCodeBase64(qrPayload, 300, 300));

        Student saved = studentRepository.save(student);
        return mapToDto(saved);
    }

    @Transactional
    public StudentDto updateStudent(Long id, StudentDto dto) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + id));

        if (!student.getRollNumber().equalsIgnoreCase(dto.getRollNumber()) &&
                studentRepository.existsByRollNumber(dto.getRollNumber())) {
            throw new IllegalArgumentException("Roll number already exists: " + dto.getRollNumber());
        }

        if (!student.getEmail().equalsIgnoreCase(dto.getEmail()) &&
                studentRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + dto.getEmail());
        }

        mapDtoToEntity(dto, student);

        // Ensure QR code is present
        if (student.getQrCodeBase64() == null || student.getQrCodeBase64().isEmpty()) {
            String qrPayload = qrCodeGeneratorService.buildVerificationUrl(student.getStudentUuid());
            student.setQrCodePayload(qrPayload);
            student.setQrCodeBase64(qrCodeGeneratorService.generateQrCodeBase64(qrPayload, 300, 300));
        }

        Student updated = studentRepository.save(student);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new RuntimeException("Student not found with ID: " + id);
        }
        studentRepository.deleteById(id);
    }

    @Transactional
    public StudentDto regenerateQrCode(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + id));

        String qrPayload = qrCodeGeneratorService.buildVerificationUrl(student.getStudentUuid());
        student.setQrCodePayload(qrPayload);
        student.setQrCodeBase64(qrCodeGeneratorService.generateQrCodeBase64(qrPayload, 350, 350));

        return mapToDto(studentRepository.save(student));
    }

    public String exportStudentsCsv() {
        List<Student> students = studentRepository.findAll();
        StringWriter writer = new StringWriter();
        writer.append("ID,UUID,Roll Number,First Name,Last Name,Email,Phone,Department,Section,Academic Year,CGPA,Attendance %,Status\n");

        for (Student s : students) {
            writer.append(String.format("\"%d\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"\n",
                    s.getId(),
                    s.getStudentUuid(),
                    escapeCsv(s.getRollNumber()),
                    escapeCsv(s.getFirstName()),
                    escapeCsv(s.getLastName()),
                    escapeCsv(s.getEmail()),
                    escapeCsv(s.getPhone() != null ? s.getPhone() : ""),
                    escapeCsv(s.getDepartment()),
                    escapeCsv(s.getSection() != null ? s.getSection() : ""),
                    escapeCsv(s.getAcademicYear() != null ? s.getAcademicYear() : ""),
                    s.getCgpa() != null ? s.getCgpa().toString() : "",
                    s.getAttendancePercentage() != null ? s.getAttendancePercentage().toString() : "",
                    s.getStatus() != null ? s.getStatus().name() : ""
            ));
        }

        return writer.toString();
    }

    private String escapeCsv(String val) {
        if (val == null) return "";
        return val.replace("\"", "\"\"");
    }

    private void mapDtoToEntity(StudentDto dto, Student student) {
        student.setRollNumber(dto.getRollNumber());
        student.setFirstName(dto.getFirstName());
        student.setLastName(dto.getLastName());
        student.setEmail(dto.getEmail());
        student.setPhone(dto.getPhone());
        student.setDepartment(dto.getDepartment());
        student.setSection(dto.getSection());
        student.setAcademicYear(dto.getAcademicYear());
        student.setDateOfBirth(dto.getDateOfBirth());
        student.setBloodGroup(dto.getBloodGroup());
        student.setGuardianName(dto.getGuardianName());
        student.setGuardianPhone(dto.getGuardianPhone());
        student.setAddress(dto.getAddress());
        student.setCgpa(dto.getCgpa());
        student.setAttendancePercentage(dto.getAttendancePercentage());
        student.setStatus(dto.getStatus() != null ? dto.getStatus() : StudentStatus.ACTIVE);
    }

    public StudentDto mapToDto(Student student) {
        StudentDto dto = new StudentDto();
        dto.setId(student.getId());
        dto.setStudentUuid(student.getStudentUuid());
        dto.setRollNumber(student.getRollNumber());
        dto.setFirstName(student.getFirstName());
        dto.setLastName(student.getLastName());
        dto.setEmail(student.getEmail());
        dto.setPhone(student.getPhone());
        dto.setDepartment(student.getDepartment());
        dto.setSection(student.getSection());
        dto.setAcademicYear(student.getAcademicYear());
        dto.setDateOfBirth(student.getDateOfBirth());
        dto.setBloodGroup(student.getBloodGroup());
        dto.setGuardianName(student.getGuardianName());
        dto.setGuardianPhone(student.getGuardianPhone());
        dto.setAddress(student.getAddress());
        dto.setCgpa(student.getCgpa());
        dto.setAttendancePercentage(student.getAttendancePercentage());
        dto.setStatus(student.getStatus());
        dto.setQrCodeBase64(student.getQrCodeBase64());
        dto.setQrCodePayload(student.getQrCodePayload());
        return dto;
    }
}
