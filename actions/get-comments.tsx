import { Comment } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/comments`;

const getComments = async (): Promise<Comment[]> => {
  const res = await fetch(URL);
  return res.json();
};

export default getComments;