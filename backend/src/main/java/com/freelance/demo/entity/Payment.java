package com.freelance.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // CONTRACT RELATION
    @OneToOne
    @JoinColumn(name = "contract_id")
    private Contract contract;

    private String razorpayOrderId;

    private String razorpayPaymentId;

    private Double amount;

    private String status; // CREATED, SUCCESS, FAILED
}