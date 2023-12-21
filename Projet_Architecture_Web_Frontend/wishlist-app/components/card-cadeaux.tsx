import { Image, Gift } from "@/types";
import getImages from "@/actions/get-images";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import UpdateGift from "@/actions/update-gift";

interface CardCadeauProps {
    giftData: Gift;
}

const CardCadeau: React.FC<CardCadeauProps> = ({ giftData }) => {
    const router = useRouter();
    const [showReservationForm, setShowReservationForm] = useState(false);
    const [updatedGiftData, setUpdatedGiftData] = useState<Gift>(giftData);

    const apiURL = process.env.NEXT_PUBLIC_API_URL || '';

    const onUpdateGift = (updatedGift: Gift) => {
        // Mettre à jour l'état avec les nouvelles données
        setUpdatedGiftData(updatedGift);
    };

    const openReservationForm = () => {
        setShowReservationForm(true);
    };

    const handleCancelReservationForm = () => {
        setShowReservationForm(false);
    };

    const handleUpdateGiftSuccess = async (updatedGift: Gift) => {
        try {
          // Mettre à jour l'état avec les nouvelles données du cadeau
          onUpdateGift(updatedGift);
          // Masquer le formulaire après la mise à jour
          handleCancelReservationForm();
          // rafraichir la page
          window.location.reload();
        } catch (error) {
          console.error('Error updating gift data:', error);
        }
    };
   
    // Gérez la redirection vers la page de détails du cadeau
    const handleClick = () => {
        router.push(`/gift/${giftData.id}`);
    };

    // Fonction pour formater un prix
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
    };

    // Fonction pour formater une date
    const formatDate = (date: Date | string) => {
        if (!date) {
            return 'Date invalide';
        }
        const parsedDate = typeof date === 'string' ? new Date(date) : date;

        // Vérifier si parsedDate est une date valide
        if (isNaN(parsedDate.getTime())) {
            return 'Date invalide';
        }

        return new Intl.DateTimeFormat('fr-FR').format(parsedDate);
    };

    // Fonction pour récupérer les images des cadeaux 
    const fetchImages = async () => {
        try {
            const imagesData = await getImages();
            return imagesData.filter(image => image.giftId === giftData.id);
        } catch (error) {
            console.error('Error fetching gifts data:', error);
            return [];
        }
    };

    const [fetchedImages, setFetchedImages] = useState<Image[]>([]);

    // Utilisation de useEffect pour charger les images lorsque le composant est monté
    useEffect(() => {
        const loadImages = async () => {
            const imagesResult = await fetchImages();
            setFetchedImages(imagesResult);
        };
        loadImages();
    }, [giftData.id]); // recharge les cadeaux lorsque l'ID de la liste change

    return (
        <div className="max-w-md mx-auto bg-white shadow-md rounded-md cursor-pointer">
            <div onClick={handleClick} className={`px-6 py-4 ${showReservationForm ? 'blur-5 z-10' : ''}`}>
                {fetchedImages.length > 0 ? (
                     <img src={`${apiURL}/uploads/${fetchedImages[0].filename}`} className="w-full h-48 object-cover mb-4" />
                ) : (
                    <p className="text-gray-600">Aucune image pour ce cadeau</p>
                )}
            </div>
            <div className={`px-6 py-4 ${showReservationForm ? 'blur-5 z-10' : ''}`}>
                <h2 className="text-xl font-semibold mb-2">{updatedGiftData.name}</h2>
                <p className="text-gray-600">{updatedGiftData.description}</p>
                <p className="text-gray-600">Prix : {formatPrice(updatedGiftData.price)}</p>
                <p className={`text-lg ${updatedGiftData.isReserved ? 'text-red-800' : 'text-green-500'}`}>
                    {updatedGiftData.isReserved 
                        ? `Réservé par : ${updatedGiftData.nameReserver} le :\n${formatDate(updatedGiftData.dateReservation)}` 
                        : 'Disponible pour réservation'}
                </p>
                {/* Bouton pour ouvrir le formulaire de réservation */}
                <button 
                    onClick={openReservationForm} 
                    disabled={updatedGiftData.isReserved}
                    className="h-full w-full text-white rounded-full bg-gradient-to-r from-red-400 to-red-600"
                >
                    Réserver
                </button>
            </div>
            {showReservationForm && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black p-8 z-50 rounded-md shadow-lg flex items-center justify-center">
                    <UpdateGift id={giftData.id} onUpdateGift={handleUpdateGiftSuccess} onCancel={handleCancelReservationForm}/>
                </div>
            )}
        </div>
    );    
};

export default CardCadeau;