package com.freelance.demo.service;

import com.freelance.demo.entity.*;
import com.freelance.demo.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContractService {

    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private ProposalRepository proposalRepository;

    @Autowired
    private UserRepository userRepository;

    public Contract createContract(
            Long proposalId,
            String clientEmail
    ) {

        // GET PROPOSAL
        Proposal proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new RuntimeException("Proposal not found"));

        // CREATE CONTRACT
        Contract contract = new Contract();

        contract.setProposal(proposal);

        contract.setJob(proposal.getJob());

        contract.setFreelancer(proposal.getFreelancer());

        if (!proposal.getJob()
                .getPostedBy()
                .getEmail()
                .equals(clientEmail)) {
            throw new RuntimeException("You can only accept proposals for your own jobs");
        }

        User client = userRepository.findByEmail(clientEmail)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        contract.setClient(client);

        contract.setAmount(proposal.getBidAmount());

        contract.setStatus("ACTIVE");

        proposal.setAccepted(true);

        proposalRepository.save(proposal);

        return contractRepository.save(contract);
    }

//    public List<Contract> getAllContracts() {
//
//        return contractRepository.findAll();
//    }

    public List<Contract> getContractsForUser(
            String email,
            String role
    ) {

        if (role.equals("CLIENT")) {

            return contractRepository
                    .findByClient_Email(email);
        }

        return contractRepository
                .findByFreelancer_Email(email);
    }

    public Contract completeContract(

            Long contractId
    ) {

        Contract contract =

                contractRepository
                        .findById(contractId)
                        .orElseThrow(

                                () -> new RuntimeException(
                                        "Contract not found"
                                )
                        );

        contract.setStatus(
                "COMPLETED"
        );

        return contractRepository
                .save(contract);
    }
}
