import API from "./api";

// REGISTER
export const registerUser = async (userData) => {

  const response = await API.post(
    "/auth/register",
    userData
  );

  return response.data;
};

// LOGIN
export const loginUser = async (loginData) => {

  const response = await API.post(
    "/auth/login",
    loginData
  );

  return response.data;
};

export const updateOnlineStatus =
  async (online) => {

    const response =
      await API.put(

        `/users/online?online=${online}`
      );

    return response.data;
};