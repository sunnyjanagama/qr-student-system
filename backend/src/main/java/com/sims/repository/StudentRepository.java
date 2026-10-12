package com.sims.repository;

import com.sims.model.Student;
import com.sims.model.StudentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByStudentUuid(String studentUuid);

    Optional<Student> findByRollNumber(String rollNumber);

    Optional<Student> findByEmail(String email);

    boolean existsByRollNumber(String rollNumber);

    boolean existsByEmail(String email);

    @Query("SELECT s FROM Student s WHERE " +
           "(:query IS NULL OR :query = '' OR " +
           "LOWER(s.rollNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.email) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:department IS NULL OR :department = '' OR s.department = :department) AND " +
           "(:status IS NULL OR s.status = :status)")
    Page<Student> searchStudents(
            @Param("query") String query,
            @Param("department") String department,
            @Param("status") StudentStatus status,
            Pageable pageable
    );

    long countByStatus(StudentStatus status);

    @Query("SELECT s.department, COUNT(s) FROM Student s GROUP BY s.department")
    List<Object[]> countByDepartmentGrouped();

    @Query("SELECT s.status, COUNT(s) FROM Student s GROUP BY s.status")
    List<Object[]> countByStatusGrouped();

    @Query("SELECT AVG(s.cgpa) FROM Student s WHERE s.cgpa IS NOT NULL")
    Double calculateAverageCgpa();

    @Query("SELECT AVG(s.attendancePercentage) FROM Student s WHERE s.attendancePercentage IS NOT NULL")
    Double calculateAverageAttendance();
}
