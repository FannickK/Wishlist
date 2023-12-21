import { List } from "@/types";

const getSingleList = async (id: number): Promise<List> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/list/${id}`);
        if (response.status === 200) {
            const listData = await response.json();
            return listData as List;
        }else {
            console.error('Error fetching list data:', response.status);
            throw new Error('Error fetching list data');
        }
    } catch (error) {
        console.error('Error fetching list data:', error);
        throw error;
    }
};

export default getSingleList;