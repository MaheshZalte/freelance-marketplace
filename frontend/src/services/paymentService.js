import API from "./api";

// CREATE ORDER
export const createOrder =
  async (data) => {

    const response =
      await API.post(

        "/payments/create-order",

        data
      );

    return response.data;
};

// VERIFY PAYMENT
export const verifyPayment = async (paymentData) => {

  const response = await API.post(
    "/payments/verify",
    paymentData
  );

  return response.data;
};

export const getAllPayments = async () => {

  const response = await API.get(
    "/payments"
  );

  return response.data;
};