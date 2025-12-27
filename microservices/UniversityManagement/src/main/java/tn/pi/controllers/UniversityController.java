package tn.pi.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.pi.entities.University;
import tn.pi.services.UniversityService;

import java.util.List;

@RestController
@RequestMapping("/api/university")
public class UniversityController {

    @Autowired
    private UniversityService universityService;

    @GetMapping
    public ResponseEntity<List<University>> getAllUniversities() {
        List<University> universities = universityService.getAllUniversities();
        return ResponseEntity.ok(universities);
    }

    @GetMapping("/{id}")
    public ResponseEntity<University> getUniversityById(@PathVariable Long id) {
        University university = universityService.getUniversityById(id);
        if (university != null) {
            return ResponseEntity.ok(university);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<University> createUniversity(@RequestBody University university) {
        University createdUniversity = universityService.createUniversity(university);
        return ResponseEntity.ok(createdUniversity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<University> updateUniversity(
            @PathVariable Long id,
            @RequestBody University university) {
        University updatedUniversity = universityService.updateUniversity(id, university);
        if (updatedUniversity != null) {
            return ResponseEntity.ok(updatedUniversity);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUniversity(@PathVariable Long id) {
        boolean deleted = universityService.deleteUniversity(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}