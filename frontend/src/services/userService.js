import API from "./api";

export const getProfile = async () => {

  const response =
    await API.get("/users/me");

  return response.data;
};

export const updateProfile = async (
  userData
) => {

  const response =
    await API.put(
      "/users/me",
      userData
    );

  return response.data;
};


export const updateOnlineStatus =
  async (online) => {

    const response =
      await API.put(

        `/users/status?online=${online}`
      );

    return response.data;
};