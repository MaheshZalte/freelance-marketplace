package com.freelance.demo.repository;

import com.freelance.demo.entity.Contract;
import com.freelance.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ContractRepository extends JpaRepository<Contract, Long> {

    List<Contract> findByClient_Email(
            String email
    );

    List<Contract> findByFreelancer_Email(
            String email
    );

    Long countByClient_Email(
            String email
    );

    Long countByFreelancer_Email(
            String email
    );

    long countByClient(User user);

    long countByFreelancer(User user);
}