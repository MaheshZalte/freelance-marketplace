package com.freelance.demo.repository;

import com.freelance.demo.entity.Proposal;
import com.freelance.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProposalRepository extends JpaRepository<Proposal, Long> {

    List<Proposal>
    findByJob_Id(
            Long jobId
    );

    Long countByFreelancer_Email(
            String email
    );

    List<Proposal>
    findByJob_PostedBy_Email(
            String email
    );

    long countByFreelancer(User user);

    List<Proposal>
    findByFreelancer_Email(
            String email
    );

    boolean existsByJob_IdAndFreelancer_Email(
            Long jobId,
            String email
    );


    List<Proposal> findByJobId(Long jobId);

//    boolean existsByJobIdAndFreelancerId(
//            Long jobId,
//            Long freelancerId
//    );


}