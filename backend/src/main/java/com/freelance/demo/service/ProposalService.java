package com.freelance.demo.service;

import com.freelance.demo.dto.ProposalResponseDTO;
import com.freelance.demo.entity.Job;
import com.freelance.demo.entity.Proposal;
import com.freelance.demo.entity.User;
import com.freelance.demo.repository.JobRepository;
import com.freelance.demo.repository.ProposalRepository;
import com.freelance.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.freelance.demo.service.NotificationService;
import com.freelance.demo.dto.ProposalRequest;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProposalService {

    @Autowired
    private ProposalRepository proposalRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    // CREATE PROPOSAL
    public Proposal createProposal(

            ProposalRequest request
    ) {

        String email =

                (String)

                        org.springframework.security.core.context
                                .SecurityContextHolder
                                .getContext()
                                .getAuthentication()
                                .getPrincipal();

        // FIND JOB
        Job job =

                jobRepository
                        .findById(
                                request.getJobId()
                        )
                        .orElseThrow(

                                () -> new RuntimeException(
                                        "Job not found"
                                )
                        );

        // FIND USER
        User user =

                userRepository
                        .findByEmail(email)
                        .orElseThrow(

                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );

        // CREATE PROPOSAL
        Proposal proposal =
                new Proposal();

        proposal.setJob(job);

        proposal.setFreelancer(user);

        proposal.setMessage(
                request.getMessage()
        );

        proposal.setBidAmount(
                request.getBidAmount()
        );

        proposal.setAccepted(false);

        boolean alreadyApplied =

                proposalRepository
                        .existsByJob_IdAndFreelancer_Email(

                                request.getJobId(),

                                email
                        );

        if (alreadyApplied) {

            throw new RuntimeException(
                    "Already applied to this job"
            );
        }


        // SAVE
        Proposal savedProposal =

                proposalRepository
                        .save(proposal);

        // NOTIFICATION
        notificationService
                .createNotification(

                        job.getPostedBy(),

                        "New proposal received for: "

                                + job.getTitle()
                );

        return savedProposal;
    }

    public List<Proposal> getProposalsForUser(
            String email,
            String role
    ) {

        // CLIENT
        if (role.equals("CLIENT")) {

            return proposalRepository
                    .findByJob_PostedBy_Email(email);
        }

        // FREELANCER
        return proposalRepository
                .findByFreelancer_Email(email);
    }

//    List<ProposalResponseDTO> getApplicantsByJob(Long jobId);

    public List<ProposalResponseDTO> getApplicantsByJob(Long jobId) {

        List<Proposal> proposals =
                proposalRepository.findByJobId(jobId);

        return proposals.stream().map(proposal -> {

            User freelancer = proposal.getFreelancer();

            ProposalResponseDTO dto =
                    new ProposalResponseDTO();

            dto.setProposalId(proposal.getId());

            dto.setProposalText(
                    proposal.getMessage()
            );

            dto.setStatus(
                    proposal.isAccepted()
                            ? "ACCEPTED"
                            : "PENDING"
            );

            dto.setBidAmount(
                    proposal.getBidAmount()
            );

            dto.setFreelancerId(
                    freelancer.getId()
            );

            dto.setFreelancerName(
                    freelancer.getName()
            );

            dto.setFreelancerEmail(
                    freelancer.getEmail()
            );

            dto.setFreelancerBio(
                    freelancer.getBio()
            );

            dto.setFreelancerTitle(
                    freelancer.getTitle()
            );

            dto.setFreelancerSkills(
                    freelancer.getSkills()
            );

            dto.setFreelancerProfileImage(
                    freelancer.getProfileImage()
            );

            return dto;

        }).collect(Collectors.toList());
    }


    public void rejectProposal(Long proposalId) {

        Proposal proposal =
                proposalRepository.findById(proposalId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Proposal not found"
                                )
                        );

        proposal.setAccepted(false);

        proposalRepository.save(proposal);
    }

}