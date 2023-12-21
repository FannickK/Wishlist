import { Gift } from "@/types";

const URL= `${process.env.NEXT_PUBLIC_API_URL}/gift`;

const getGifts = async (listId?: number): Promise<Gift[]> => {
  const res = await fetch(URL);
  return res.json();
};

export default getGifts;