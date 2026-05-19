import API from "./api";

export const createProposal = async (proposalData) => {
  const response = await API.post(
    "/proposals",

    proposalData,
  );

  return response.data;
};

export const getProposals = async () => {
  const response = await API.get("/proposals");

  return response.data;
};

export const getProposalsByJob = async (jobId) => {
  const response = await API.get(`/proposals/job/${jobId}`);

  return response.data;
};

export const getMyProposals =
  async () => {

    const response =
      await API.get(
        "/proposals"
      );

    return response.data;
};

export const getApplicantsByJob = async (jobId) => {

  const response = await API.get(
    `/proposals/job/${jobId}/applicants`
  );

  return response.data;
};

export const rejectProposal = async (
  proposalId,
) => {

  const response = await API.put(
    `/proposals/${proposalId}/reject`,
  );

  return response.data;
};
