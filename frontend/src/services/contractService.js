import API from "./api";

export const createContract = async (proposalId) => {

  const response = await API.post(
    `/contracts/${proposalId}`
  );

  return response.data;
};

export const getAllContracts = async () => {

  const response = await API.get(
    "/contracts"
  );

  return response.data;
};

export const
getContractById =
  async (id) => {

    const response =
      await API.get(

        `/contracts/${id}`
      );

    return response.data;
};


export const completeContract =
  async (contractId) => {

    const response =
      await API.put(

        `/contracts/${contractId}/complete`
      );

    return response.data;
};