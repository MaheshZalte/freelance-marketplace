import API from "./api";

// Fetch a freelancer profile by user id.
// Assumes there is a backend endpoint like: GET /api/users/{id}/profile
export const getFreelancerPublicProfile = async (userId) => {
  const response = await API.get(`/users/${userId}/profile`);
  return response.data;
};

