package com.freelance.demo.controller;

import com.freelance.demo.entity.Contract;
import com.freelance.demo.repository.ContractRepository;
import com.freelance.demo.service.ContractService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contracts")
public class ContractController {

    @Autowired
    private ContractService contractService;

    @Autowired
    private ContractRepository
            contractRepository;

    @PostMapping("/{proposalId}")
    @PreAuthorize("hasAuthority('CLIENT')")
    public Contract createContract(
            @PathVariable Long proposalId
    ) {
        String email = (String)
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal();

        return contractService.createContract(
                proposalId,
                email
        );
    }

//    @GetMapping
//    public List<Contract> getAllContracts() {
//
//        return contractService.getAllContracts();
//    }

    @GetMapping

    public List<Contract> getContractsForUser() {

        String email = (String)
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal();

        String role =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getAuthorities()
                        .iterator()
                        .next()
                        .getAuthority();

        return contractService
                .getContractsForUser(
                        email,
                        role
                );
    }

    @GetMapping("/{id}")

    public Contract
    getContractById(

            @PathVariable
            Long id
    ) {

        return contractRepository
                .findById(id)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Contract not found"
                        )
                );
    }


    @PutMapping("/{contractId}/complete")

    public Contract completeContract(

            @PathVariable
            Long contractId
    ) {

        return contractService
                .completeContract(
                        contractId
                );
    }


}
