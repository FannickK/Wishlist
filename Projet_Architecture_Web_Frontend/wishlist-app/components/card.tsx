import { List, Gift } from "@/types";
import getGifts from "@/actions/get-gifts";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

interface CardProps {
    listData: List;
}

const Card: React.FC<CardProps> = ({ listData }) => {
    const { name, author, date_debut, date_fin, isExpired, gifts } = listData;
    const router = useRouter();

    // Gestion de la redirection vers la page de détails de la liste
    const handleClick = () => {
        router.push(`/list/${listData.id}`);
    };

    // Fonction pour formater une date
    const formatDate = (date: Date | string) => {
        const parsedDate = typeof date === 'string' ? new Date(date) : date;

        // Vérifie si parsedDate est une date valide
        if (isNaN(parsedDate.getTime())) {
            return 'Date invalide';
        }

        return new Intl.DateTimeFormat('fr-FR').format(parsedDate);
    };

    // Fonction pour récupérer les cadeaux de la liste selectionnée
    const fetchGifts = async () => {
        try {
            const giftsData = await getGifts();
            return giftsData.filter(gift => gift.listId === listData.id);
        } catch (error) {
            console.error('Error fetching gifts data:', error);
            return [];
        }
    };
    

    const [fetchedGifts, setFetchedGifts] = useState<Gift[]>([]);

    // Utilisation de useEffect pour charger les cadeaux lorsque le composant est monté
    useEffect(() => {
        const loadGifts = async () => {
            const giftsResult = await fetchGifts();
            setFetchedGifts(giftsResult);
        };

        loadGifts();
    },[]); // recharge les cadeaux lorsque l'ID de la liste change

    return (
        <div onClick={handleClick} className="max-w-md mx-auto bg-white shadow-md rounded-md cursor-pointer">
            <div className="px-6 py-4">
                <h2 className="text-xl font-semibold mb-2">{name}</h2>
                <p className="text-black">Auteur : {author}</p>
                <p className="text-gray-600">Date de début : {formatDate(date_debut)}</p>
                <p className="text-gray-600">Date de fin : {formatDate(date_fin)}</p>
                <p className={`text-lg ${isExpired ? 'text-red-500' : 'text-green-500'}`}>
                    {isExpired ? 'Non valide' : 'Valide'}
                </p>
            </div>
            <div className="px-6 py-4">
                {fetchedGifts.length > 0 ? (
                    <>
                        <h3 className="text-lg font-semibold mb-2">Cadeaux dans cette liste :</h3>
                        <ul className="list-disc pl-5">
                            {fetchedGifts.map((gift, index) => (
                                <li key={index} className="mb-2">{gift.name}</li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <p className="text-gray-600">Aucun cadeau dans cette liste</p>
                )}
            </div>
        </div>
    );    
};

export default Card;
