import API from "./api";

// SEND MESSAGE
export const sendMessage =
  async (messageData) => {

    const response =
      await API.post(

        "/messages",

        messageData
      );

    return response.data;
};

// GET MESSAGES
export const getMessages =
  async (contractId) => {

    const response =
      await API.get(

        `/messages/${contractId}`
      );

    return response.data;
};

export const getConversations =
  async () => {

    const response =
      await API.get(

        "/messages/conversations"
      );

    return response.data;
};

export const markMessagesAsRead =
  async (senderId) => {

    const response =
      await API.put(

        `/messages/read?senderId=${senderId}`
      );

    return response.data;
};

export const uploadChatFile =
  async (formData) => {

    const response =
      await API.post(

        "/messages/upload",

        formData,

        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response.data;
};