import React, { useState, useEffect } from 'react';
import { Gift } from '@/types';

interface UpdateGiftProps {
    id: number, 
    onUpdateGift: (updatedGift: Gift) => void, 
    onCancel: () => void 
}

const UpdateGift: React.FC<UpdateGiftProps> = ({ id, onUpdateGift, onCancel }) => {
  const [updatedGiftData, setUpdatedGiftData] = useState({
    nameReserver: '',
    isReserved: false,
  });

  useEffect(() => {
    // Fetch les données actuelles du cadeau pour les pré-remplir dans le formulaire
    const fetchGiftData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gift/${id}`);
        if (response.status === 200) {
          const giftData = await response.json();
          setUpdatedGiftData({
            nameReserver: giftData.nameReserver,
            isReserved: giftData.isReserved,
          });
        } else {
          console.error('Error fetching gift data:', response.status);
        }
      } catch (error) {
        console.error('Error fetching gift data:', error);
      }
    };

    fetchGiftData();
  }, [id]);

  const handleReservationFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gift/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          nameReserver: updatedGiftData.nameReserver,
          isReserved: updatedGiftData.isReserved,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const updatedGift = await response.json();
        console.log('Updated Gift:', updatedGift);
        // Appel de la fonction parent avec le cadeau mis à jour
        onUpdateGift(updatedGift);

        // Mise à jour locale des données
        setUpdatedGiftData({
            nameReserver: updatedGift.nameReserver,
            isReserved: updatedGift.isReserved,
        });
        
        // Masquer le formulaire après la mise à jour
        onCancel();
      } else {
        console.error('Error updating gift:', response.status);
      }
    } catch (error) {
      console.error('Error updating gift:', error);
    }
  };

  return (
    <div className="">
      <div className="">
        <h2 className="text-2xl font-bold mb-4 text-center text-white">Réserver ce cadeau</h2>
        <form onSubmit={handleReservationFormSubmit}>
          <div className="mb-4">
            <label htmlFor="nameReserver" className="block text-sm font-medium text-white">
              Nom du réservateur
            </label>
            <input
              type="text"
              id="nameReserver"
              name="nameReserver"
              value={updatedGiftData.nameReserver}
              onChange={(e) => setUpdatedGiftData({ ...updatedGiftData, nameReserver: e.target.value })}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="isReserved" className="block text-sm font-medium text-white">
              Confirmer la réservation
            </label>
            <input
              type="checkbox"
              id="isReserved"
              name="isReserved"
              checked={updatedGiftData.isReserved}
              onChange={(e) => setUpdatedGiftData({ ...updatedGiftData, isReserved: e.target.checked })}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="mr-4 p-2 text-black bg-white rounded-full h-full w-full"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="ml-4 p-2 h-full w-full text-white rounded-full bg-gradient-to-r from-red-400 to-red-600"
            >
              Réserver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateGift;