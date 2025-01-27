package com.sena.LCDSena.interfaces;

import org.springframework.data.jpa.repository.JpaRepository;
import com.sena.LCDSena.model.Files;

public interface FileRepository extends JpaRepository<Files, Long>{
    Files findByName(String name);
}
