package com.freelance.demo.controller;

import com.freelance.demo.dto.ProposalResponseDTO;
import com.freelance.demo.entity.Proposal;
import com.freelance.demo.repository.ProposalRepository;
import com.freelance.demo.service.ProposalService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.freelance.demo.dto.ProposalRequest;

@RestController
@RequestMapping("/api/proposals")
public class ProposalController {

    @Autowired
    private ProposalService proposalService;

    @Autowired
    private ProposalRepository proposalRepository;

    // APPLY TO JOB
    @PostMapping

    @PreAuthorize("hasAuthority('FREELANCER')")

    public Proposal apply(

            @RequestBody
            ProposalRequest request
    ) {

        return proposalService
                .createProposal(request);
    }

    // GET PROPOSALS OF JOB


    @GetMapping

    public List<Proposal> getProposalsForUser() {

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

        return proposalService
                .getProposalsForUser(
                        email,
                        role
                );
    }

    @GetMapping("/job/{jobId}")

    public List<Proposal>
    getProposalsByJob(

            @PathVariable
            Long jobId
    ) {

        return proposalRepository
                .findByJob_Id(
                        jobId
                );
    }

    @GetMapping("/job/{jobId}/applicants")
    public ResponseEntity<List<ProposalResponseDTO>>
    getApplicantsByJob(
            @PathVariable Long jobId
    ) {

        return ResponseEntity.ok(
                proposalService.getApplicantsByJob(jobId)
        );
    }

    @PutMapping("/{proposalId}/reject")
    public ResponseEntity<String> rejectProposal(
            @PathVariable Long proposalId
    ) {

        proposalService.rejectProposal(proposalId);

        return ResponseEntity.ok(
                "Proposal rejected"
        );
    }


}