import React, { useState } from 'react';
import { Image } from '@/types';

const URL = `${process.env.NEXT_PUBLIC_API_URL}/image`;

interface CreateImageProps {
  onCreateImage: (newImage: Image) => void;
  onCancel: () => void;
}

const CreateImage: React.FC<CreateImageProps> = ({ onCreateImage, onCancel }) => {
  const [newImageData, setNewImageData] = useState({
    giftId: parseInt((window.location.href).split('/gift/')[1]),
    files: [] as File[],
  });

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('giftId', newImageData.giftId.toString());
      newImageData.files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch(URL, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const newImage = await response.json();
        onCreateImage(newImage);
        onCancel();
      } else {
        console.error('Error creating image:', response.status);
      }
    } catch (error) {
      console.error('Error creating image:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files) as File[];
      setNewImageData({ ...newImageData, files: newFiles });
    }
  };

  return (
    <div className="">
      <div className="">
        <h2 className="text-2xl font-bold mb-4 text-center text-white">Nouvelle Image</h2>
        <form onSubmit={handleFormSubmit} encType="multipart/form-data">
          <div className="mb-4 text-white">
            <label htmlFor="files" className="block text-sm font-medium text-white">
              Sélectionnez des fichiers
            </label>
            <input
              type="file"
              id="files"
              name="files"
              onChange={handleFileChange}
              multiple
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-white"
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

export default CreateImage;
  
