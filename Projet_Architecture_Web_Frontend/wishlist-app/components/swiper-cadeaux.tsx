"use client";

import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Gift, List } from '@/types';
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

import getGifts from '@/actions/get-gifts';
import getSingleList from '@/actions/get-single-list';
import CreateGift from '@/actions/create-gift';

import CardCadeau from './card-cadeaux';
import LoadingSpinner from './loading-spinner';

const SwiperCadeauComponent = () => {
    const [loading, setLoading] = useState(true); // État pour gérer le chargement
    const [showForm, setShowForm] = useState(false);
    const [hasGifts, setHasGifts] = useState(false);
    const getInitialFilterValue = () => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('filter') || '';
        }
        return '';
    };
    const [filter, setFilter] = useState<string>(getInitialFilterValue); // État pour gérer le filtre
    const [currentList, setCurrentList] = useState<List | null>(null); // État pour gérer la liste selectionnée
    const [fetchedGifts, setFetchedGifts] = useState<Gift[]>([]); // État pour stocker les données de l'API
    const router = useRouter();

    //gestion des etats pour le filtre
    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newFilter = event.target.value;
        console.log('Nouveau filtre :', newFilter);
        setFilter(newFilter);

        // Mettre à jour l'URL avec la nouvelle valeur du filtre
        const currentURL = window.location.href;
        const updatedURL = `${currentURL.split('?')[0]}?filter=${newFilter}`;
        window.history.replaceState({ path: updatedURL }, '', updatedURL);

        // Rafraîchir la page pour appliquer le filtre
        window.location.reload();

    };
    
    // Fonction pour récupérer les cadeaux de la liste selectionnée en fonction du filtre
    const fetchGifts = async () => {
        try {
            const giftsData = await getGifts();
            let filteredGifts = giftsData.filter(gift => gift.listId === parseInt((window.location.href).split('/list/')[1]));
            
            // Utilisation de la version fonctionnelle de filter pour s'assurer de la dernière valeur de l'état
            const currentFilter = filter; 
            console.log('Filtre actuel :', currentFilter);

            // Appliquer le filtre
            if (currentFilter === 'reserved') {
                filteredGifts = filteredGifts.filter(gift => gift.isReserved);
                console.log('Gifts after reserved filter:', filteredGifts);
            } else if (currentFilter === 'available') {
                filteredGifts = filteredGifts.filter(gift => !gift.isReserved);
            } else if (currentFilter === 'price-asc') {
                filteredGifts = filteredGifts.sort((a, b) => a.price - b.price);
            } else if (currentFilter === 'price-desc') {
                filteredGifts = filteredGifts.sort((a, b) => b.price - a.price);
            } else if (currentFilter === 'date-reservation-asc') {
                // Trier par date de réservation par ordre croissant pour les cadeaux réservés
                filteredGifts = filteredGifts.filter(gift => gift.isReserved).sort((a, b) => new Date(a.dateReservation).getTime() - new Date(b.dateReservation).getTime());
            } else if (currentFilter === 'date-reservation-desc') {
                // Trier par date de réservation par ordre décroissant pour les cadeaux réservés
                filteredGifts = filteredGifts.filter(gift => gift.isReserved).sort((a, b) => new Date(b.dateReservation).getTime() - new Date(a.dateReservation).getTime());
            }

            console.log('Gifts after filter:', filteredGifts);
            return filteredGifts;
        } catch (error) {
            console.error('Error fetching gifts data:', error);
            return [];
        }
    };

    useEffect(() => {
        const fetchData = async () => {
        try {
            const giftsResult = await fetchGifts();
            setFetchedGifts(giftsResult);
            setHasGifts(giftsResult.length > 0);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
        };

        fetchData();
    }, [filter]);

    const handleCreateGift = () => {
        // Affiche le formulaire lorsqu'on clique sur le bouton
        setShowForm(true);
    };

    const handleCreateGiftSuccess = async (newGift: Gift) => {
        // Rafraîchir la liste après la création
        const updatedGifts = await fetchGifts();
        setFetchedGifts(updatedGifts);
        setHasGifts(updatedGifts.length > 0);
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

    const handleSuppressionListe = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/list/${parseInt((window.location.href).split('/list/')[1])}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                // Redirige l'utilisateur vers la page d'accueil
                window.location.href = '/';
            } else {
                console.error('Error deleting list:', response.status);
            }
        } catch (error) {
            console.error('Error deleting list:', error);
        }
    };


    // Récupération des données de la liste selectionnée
    const fetchListData = async () => {
        try {
            const listData = await getSingleList(parseInt((window.location.href).split('/list/')[1]));
            return listData;
        } catch (error) {
            console.error('Error fetching list data:', error);
            throw error;
        }
    };

    useEffect(() => {
        const loadListData = async () => {
            try {
                const listData = await fetchListData();
                setCurrentList(listData);
            } catch (error) {
                console.error('Error loading list data:', error);
            }
        };

        loadListData();
    }, []);

    return (
        <div className="max-w-screen-xl px-4 md:px-8 mx-auto py-16 relative">
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={() => router.push('/')} // Rediriger vers la page d'accueil
                    className="px-4 py-2 text-white rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center space-x-2"
                >
                    <FontAwesomeIcon icon={faHome} />
                    <span>Listes</span>
                </button>
                <h1 className="text-4xl font-bold">Cadeaux</h1>
                <button
                    onClick={handleSuppressionListe}
                    className="px-4 py-2 text-white rounded-full bg-gradient-to-r from-red-400 to-red-600"
                >
                    Supprimer la liste
                </button>
                <button
                    onClick={() => setShowForm(true)}
                    disabled={currentList?.isExpired}
                    className="px-4 py-2 text-white rounded-full bg-gradient-to-r from-green-400 to-green-600"
                >
                    + Nouveau cadeau
                </button>
                {/* Ajout d'un sélecteur déroulant pour le filtre */}
                <label htmlFor="filter" className="text-gray-600">Filtrer par :</label>
                <select
                    id="filter"
                    name="filter"
                    value={filter}
                    onChange={handleFilterChange}
                    className="px-2 py-1 border rounded-md"
                >
                    <option value="">Tous</option>
                    <option value="reserved">Réservés</option>
                    <option value="available">Disponibles</option>
                    <option value="price-asc">Prix croissant</option>
                    <option value="price-desc">Prix décroissant</option>
                    <option value="date-reservation-asc">Date réservation croissante</option>
                    <option value="date-reservation-desc">Date réservation décroissante</option>
                </select>
            </div>
            {showForm && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black p-8 z-50 rounded-md shadow-lg flex items-center justify-center">
                    <CreateGift onCreateGift={handleCreateGiftSuccess} onCancel={handleCancelForm} />
                </div>
            )}
            {!hasGifts ? (
                <div className="text-center">
                    <p>Cette liste n'a pas encore de cadeaux. Cliquez sur le bouton pour en ajouter.</p>
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
                {fetchedGifts.map((gift, index) => {
                    console.log('Mapped gift at index', index, ':', gift);
                    return (
                        <SwiperSlide key={index} className="swiper-slide w-96 h-96 pb-20 relative">
                            <div className="w-full h-full rounded-8">
                                <CardCadeau giftData={gift} />
                            </div>
                        </SwiperSlide>
                    );
                })}
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

export default SwiperCadeauComponent;