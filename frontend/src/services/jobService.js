import API from "./api";

// GET ALL JOBS
export const getAllJobs = async () => {

  const response = await API.get("/jobs");

  return response.data;
};

export const getJobById = async (jobId) => {
  const response = await API.get(`/jobs/${jobId}`);

  return response.data;
};

// create a job
export const createJob = async (jobData) => {

  const response = await API.post(
    "/jobs",
    jobData
  );

  return response.data;
};

export const getJobs = async (

  page = 0,

  size = 6,

  search = "",

  budget = "all",

  sort = ""
) => {

  const response =
    await API.get(

      `/jobs?page=${page}&size=${size}&search=${search}&budget=${budget}&sort=${sort}`
    );

  return response.data;
};


export const toggleJobStatus =
  async (jobId) => {

    const response =
      await API.put(

        `/jobs/${jobId}/toggle`
      );

    return response.data;
};