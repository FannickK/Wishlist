import { Image } from "@/types";

const URL= `${process.env.NEXT_PUBLIC_API_URL}/image`;

const getImages = async (): Promise<Image[]> => {
  const res = await fetch(URL);
  return res.json();
};

export default getImages;