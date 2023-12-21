"use client";

import React, { useState, useEffect } from 'react';

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import { Gift, Image } from '@/types';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";


import getImages from '@/actions/get-images';
import CreateImage from '@/actions/create-image';

import LoadingSpinner from './loading-spinner';

const SwiperImageComponent = () => {
    const [loading, setLoading] = useState(true); // État pour gérer le chargement
    const [showForm, setShowForm] = useState(false);
    const [hasImages, setHasImages] = useState(false);
    const router = useRouter();

    // Fonction pour récupérer les cadeaux de la liste selectionnée
    const fetchImages = async () => {
        try {
            const imagesData = await getImages();
            return imagesData.filter(image => image.giftId === parseInt((window.location.href).split('/gift/')[1]));
        } catch (error) {
            console.error('Error fetching gifts data:', error);
            return [];
        }
    };

    const [fetchedImages, setFetchedImages] = useState<Image[]>([]); // État pour stocker les données de l'API

    useEffect(() => {
        const fetchData = async () => {
        try {
            const imagesResult = await fetchImages();
            setFetchedImages(imagesResult);
            setHasImages(imagesResult.length > 0);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
        };

        fetchData();
    }, []);

    const handleCreateGift = () => {
        // Affiche le formulaire lorsqu'on clique sur le bouton
        setShowForm(true);
    };

    const handleCreateImageSuccess = async (newImage: Image) => {
        // Rafraîchir la liste après la création
        const updatedImages = await fetchImages();
        setFetchedImages(updatedImages);
        setHasImages(updatedImages.length > 0);
        // Masquer le formulaire
        setShowForm(false);
    };

    const handleCancelForm = () => {
        // Masquer le formulaire en cas d'annulation
        setShowForm(false);
    };

    if (loading) {
        <LoadingSpinner />
    }

    const handleSuppressionGift = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gift/${parseInt((window.location.href).split('/gift/')[1])}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                // Rediriger l'utilisateur vers la page d'accueil
                window.location.href = '/';
            } else {
                console.error('Error deleting gift:', response.status);
            }
        } catch (error) {
            console.error('Error deleting gift:', error);
        }
    };

    const handleSuppressionImage = async (imageId: number) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/image/${imageId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                // Rafraichir les images
                const updatedImages = await fetchImages();
                setFetchedImages(updatedImages);
                setHasImages(updatedImages.length > 0);
            } else {
                console.error('Error deleting image:', response.status);
            }
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    return (
        <div className="max-w-screen-xl px-4 md:px-8 mx-auto py-16 relative">
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={() => router.back()} // Retour à la page précédente
                    className="px-4 py-2 text-white rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center space-x-2"
                    >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    <span>Retour</span>
                </button>
                <h1 className="text-4xl font-bold">Images</h1>
                <button
                    onClick={handleSuppressionGift}
                    className="px-4 py-2 text-white rounded-full bg-gradient-to-r from-red-400 to-red-600"
                >
                    Supprimer le cadeau
                </button>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 text-white rounded-full bg-gradient-to-r from-green-400 to-green-600"
                >
                    + Nouvelle image
                </button>
            </div>
            {showForm && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black p-8 z-50 rounded-md shadow-lg flex items-center justify-center">
                    <CreateImage onCreateImage={handleCreateImageSuccess} onCancel={handleCancelForm} />
                </div>
            )}
            {!hasImages ? (
                <div className="text-center">
                Ce cadeau n'a pas encore d'images. Cliquez sur le bouton pour en ajouter.
                </div>
            ) : (
                <Swiper
                effect={'coverflow'}
                grabCursor={false}
                centeredSlides={true}
                loop={true}
                slidesPerView={'auto'}
                coverflowEffect={{
                    rotate: 0,
                    stretch: 0,
                    depth: 100,
                    modifier: 2.5,
                    slideShadows: false,
                }}
                pagination={{ el: '.swiper-pagination', clickable: true }}
                navigation={{
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }}
                modules={[EffectCoverflow, Pagination, Navigation]}
                className={`h-208 py-8 relative ${showForm ? 'blur-5 z-10' : ''}`}
                >
                {fetchedImages.map((image, index) => (
                    <SwiperSlide key={index} className="swiper-slide w-96 h-96 pb-20 relative">
                    <div className="w-full h-full rounded-8 flex flex-col items-center">
                        <img 
                            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${image.filename}`} 
                            className="object-cover pb-6 w-3/4 h-3/4" 
                        />
                        <div>
                            <button 
                                onClick={() => handleSuppressionImage(image.id)} 
                                className="px-4 py-2 text-white rounded-full bg-gradient-to-r from-red-400 to-red-600"
                            >
                                x Supprimer l'image
                            </button>
                        </div>
                    </div>
                    </SwiperSlide>
                ))}
                </Swiper>               
            )}
            <div className="relative bottom-8 flex items-center justify-center">
                <div className="swiper-button-prev bg-white w-14 h-14 rounded-full filter drop-shadow-md"></div>
                <div className="swiper-pagination relative w-60 bottom-4"></div>
                <div className="swiper-button-next bg-white w-14 h-14 rounded-full filter drop-shadow-md"></div>
            </div>
        </div>
    )
}

export default SwiperImageComponent;