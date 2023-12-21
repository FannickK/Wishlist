import { List } from "@/types";

const URL= `${process.env.NEXT_PUBLIC_API_URL}/list`;

const getLists = async (): Promise<List[]> => {
  const res = await fetch(URL);
  return res.json();
};

export default getLists;