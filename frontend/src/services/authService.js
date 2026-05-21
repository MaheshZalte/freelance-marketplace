import API from "./api";

// ==============================
// REGISTER USER
// ==============================
export const registerUser = async (userData) => {
  try {
    const formattedData = {
      ...userData,

      role: userData.role.toUpperCase(),

      // STRING ONLY
      skills: userData.skills,
    };

    console.log("REGISTER REQUEST =", formattedData);

    const response = await API.post("/auth/register", formattedData);

    return response.data;
  } catch (error) {
    console.log("REGISTER ERROR =", error.response);

    throw error;
  }
};

// ==============================
// LOGIN USER
// ==============================
export const loginUser = async (loginData) => {
  try {
    console.log("LOGIN REQUEST =", loginData);

    const response = await API.post("/auth/login", loginData);

    console.log("LOGIN RESPONSE =", response.data);

    // SAVE TOKEN
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    // SAVE USER
    if (response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    console.log("LOGIN ERROR =", error.response);

    throw error;
  }
};

// ==============================
// UPDATE ONLINE STATUS
// ==============================
export const updateOnlineStatus = async (online) => {
  try {
    console.log("UPDATE STATUS =", online);

    const response = await API.put(`/users/status?online=${online}`);

    console.log("STATUS RESPONSE =", response.data);

    return response.data;
  } catch (error) {
    console.log("STATUS ERROR =", error.response);

    throw error;
  }
};
