package com.freelance.demo.service;

import com.freelance.demo.entity.Contract;
import com.freelance.demo.entity.Payment;
import com.freelance.demo.repository.ContractRepository;
import com.freelance.demo.repository.PaymentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ContractRepository contractRepository;

    public Payment savePayment(
            Long contractId,
            String orderId,
            String paymentId,
            Double amount
    ) {

        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found"));

        Payment payment = new Payment();

        payment.setContract(contract);

        payment.setRazorpayOrderId(orderId);

        payment.setRazorpayPaymentId(paymentId);

        payment.setAmount(amount);

        payment.setStatus("SUCCESS");

        return paymentRepository.save(payment);
    }

    public void markContractPaid(Long contractId) {

        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found"));

        contract.setStatus("PAID");

        contractRepository.save(contract);
    }

//    public List<Payment> getAllPayments() {
//
//        return paymentRepository.findAll();
//    }

    public List<Payment> getPaymentsForUser(
            String email,
            String role
    ) {

        if (role.equals("CLIENT")) {

            return paymentRepository
                    .findByContract_Client_Email(
                            email
                    );
        }

        return paymentRepository
                .findByContract_Freelancer_Email(
                        email
                );
    }
}