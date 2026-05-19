import API from "./api";

export const uploadProfileImage = async (formData) => {
  const response = await API.post(
    "/profile/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

