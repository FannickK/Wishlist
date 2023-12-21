import React, { useState } from 'react';
import { List } from '@/types';

const URL = `${process.env.NEXT_PUBLIC_API_URL}/list`;

interface CreateListProps {
  onCreateList: (newList: List) => void;
  onCancel: () => void;
}

const CreateList: React.FC<CreateListProps> = ({ onCreateList, onCancel }) => {
  const [newListData, setNewListData] = useState({
    name: '',
    author: '',
    date_debut: '',
    date_fin: '',
    isExpired: false,
    gifts: [],
  });

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newListData),
      });

      if (response.status === 200) {
        const newList = await response.json();
        // Appel de la fonction parent avec la nouvelle liste
        onCreateList(newList);
        // Masquer le formulaire après la création
        onCancel();
      } else {
        console.error('Error creating list:', response.status);
      }
    } catch (error) {
      console.error('Error creating list:', error);
    }
  };

  return (
    <>
        <div className="">
        <div className="">
            <h2 className="text-2xl font-bold mb-4 text-center text-white">Nouvelle Liste</h2>
            <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-white">
                Nom de la liste
                </label>
                <input
                type="text"
                id="name"
                name="name"
                value={newListData.name}
                onChange={(e) => setNewListData({ ...newListData, name: e.target.value })}
                className="mt-1 p-2 w-full border rounded-md"
                required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="author" className="block text-sm font-medium text-white">
                Nom de l'auteur
                </label>
                <input
                type="text"
                id="author"
                name="author"
                value={newListData.author}
                onChange={(e) => setNewListData({ ...newListData, author: e.target.value })}
                className="mt-1 p-2 w-full border rounded-md"
                required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="date_debut" className="block text-sm font-medium text-white">
                Date de début
                </label>
                <input
                type="date"
                id="date_debut"
                name="date_debut"
                value={newListData.date_debut}
                onChange={(e) => setNewListData({ ...newListData, date_debut: e.target.value })}
                className="mt-1 p-2 w-full border rounded-md"
                required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="date_fin" className="block text-sm font-medium text-white">
                Date de fin
                </label>
                <input
                type="date"
                id="date_fin"
                name="date_fin"
                value={newListData.date_fin}
                onChange={(e) => setNewListData({ ...newListData, date_fin: e.target.value })}
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
    </>
  );
};

export default CreateList;
