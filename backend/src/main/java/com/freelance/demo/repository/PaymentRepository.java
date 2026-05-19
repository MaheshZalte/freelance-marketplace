package com.freelance.demo.repository;

import com.freelance.demo.entity.Payment;
import com.freelance.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PaymentRepository
        extends JpaRepository<Payment, Long> {


    List<Payment> findByContract_Client_Email(
            String email
    );

    List<Payment> findByContract_Freelancer_Email(
            String email
    );

    @Query("""
            
            SELECT SUM(p.amount)
            
            FROM Payment p
            
            WHERE p.contract.freelancer = :user
            
            """)
    Double getTotalEarningsByFreelancer(

            @Param("user")
            User user
    );
}