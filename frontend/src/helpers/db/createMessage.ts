import axios from "axios";
import getAuthorizationHeader from "../../utils/getAuthorizationHeader";
import toast from "react-hot-toast";

export default async function createMessage(formData: FormData) {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/messages/upload`,
      formData,
      {
        headers: {
          Authorization: getAuthorizationHeader(),
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const data = res.data;
    return data;
  } catch (error) {
    toast.error("Something went wrong while creating the message");
    return null;
  }
}
