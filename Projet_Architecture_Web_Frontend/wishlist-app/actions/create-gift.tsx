import React, { useState } from 'react';
import { Gift } from '@/types';


const URL = `${process.env.NEXT_PUBLIC_API_URL}/gift`;

interface CreateGiftProps {
  onCreateGift: (newGift: Gift) => void;
  onCancel: () => void;
}

const CreateGift: React.FC<CreateGiftProps> = ({ onCreateGift, onCancel }) => {
  const [newGiftData, setNewGiftData] = useState({
    listId: parseInt((window.location.href).split('/list/')[1]),
    name: '',
    description: '',
    price: '',
    isReserved: false,
  });

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
        const response = await fetch(URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newGiftData),
        });
  
        if (response.status === 200) {
          const newGift = await response.json();
          // Appel de la fonction parent avec la nouvelle liste
          onCreateGift(newGift);
          // Masquer le formulaire après la création
          onCancel();
        } else {
          console.error('Error creating gift:', response.status);
        }
      } catch (error) {
        console.error('Error creating gift:', error);
      }
    };  

  return (
    <div className="">
      <div className="">
        <h2 className="text-2xl font-bold mb-4 text-center text-white">Nouveau Cadeau</h2>
        <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-white">
                Nom du cadeau
                </label>
                <input
                type="text"
                id="name"
                name="name"
                value={newGiftData.name}
                onChange={(e) => setNewGiftData({ ...newGiftData, name: e.target.value })}
                className="mt-1 p-2 w-full border rounded-md"
                required
            />
            </div>
            <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-white">
                Description
                </label>
                <input
                type="text"
                id="description"
                name="description"
                value={newGiftData.description}
                onChange={(e) => setNewGiftData({ ...newGiftData, description: e.target.value })}
                className="mt-1 p-2 w-full border rounded-md"
                required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="price" className="block text-sm font-medium text-white">
                Prix
                </label>
                <input
                type="number"
                id="price"
                name="price"
                value={newGiftData.price}
                onChange={(e) => setNewGiftData({ ...newGiftData, price: e.target.value })}
                className="mt-1 p-2 w-full border rounded-md"
                required
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
                Créer
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGift;
