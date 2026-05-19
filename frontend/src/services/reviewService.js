import API from "./api";

export const createReview =
  async (

    contractId,

    reviewData

  ) => {

    const response =
      await API.post(

        `/reviews/${contractId}`,

        reviewData
      );

    return response.data;
};

export const getMyReviews =
  async () => {

    const response =
      await API.get(
        "/reviews"
      );

    return response.data;
};