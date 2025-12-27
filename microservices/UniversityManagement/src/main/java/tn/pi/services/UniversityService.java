package tn.pi.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.pi.entities.University;
import tn.pi.repositories.UniversityRepository;

import java.util.List;

@Service
public class UniversityService {

    @Autowired
    private UniversityRepository universityRepository;

    public List<University> getAllUniversities() {
        return universityRepository.findAll();
    }

    public University getUniversityById(Long id) {
        return universityRepository.findById(id).orElse(null);
    }

    public University createUniversity(University university) {
        return universityRepository.save(university);
    }

    public University updateUniversity(Long id, University university) {
        if (universityRepository.existsById(id)) {
            university.setId(id);
            return universityRepository.save(university);
        }
        return null;
    }

    public boolean deleteUniversity(Long id) {
        if (universityRepository.existsById(id)) {
            universityRepository.deleteById(id);
            return true;
        }
        return false;
    }
}