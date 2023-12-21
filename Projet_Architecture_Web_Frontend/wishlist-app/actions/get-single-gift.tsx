import { Gift } from "@/types";

const getSingleGift = async (id: number): Promise<Gift> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gift/${id}`);
        if (response.status === 200) {
            const giftData = await response.json();
            return giftData as Gift;
        }else {
            console.error('Error fetching gift data:', response.status);
            throw new Error('Error fetching gift data');
        }
    } catch (error) {
        console.error('Error fetching gift data:', error);
        throw error;
    }
};

export default getSingleGift;
