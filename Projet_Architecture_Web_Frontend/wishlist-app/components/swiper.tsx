"use client";

import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";

import Card from './card';
import getLists from '@/actions/get-lists';
import { List } from '@/types';
import CreateList from '@/actions/create-list';
import LoadingSpinner from './loading-spinner';


const SwiperComponent = () => {
    const [lists, setLists] = useState<List[]>([]); // État pour stocker les données de l'API
    const [loading, setLoading] = useState(true); // État pour gérer le chargement
    const [showForm, setShowForm] = useState(false); // État pour afficher le formulaire
    const [hasLists, setHasLists] = useState(false); // État pour afficher le message s'il n'y a pas de liste
    const [filter, setFilter] = useState<string>(''); // État pour gérer le filtre

    useEffect(() => {
        const fetchData = async () => {
        try {
            const data = await getLists();
            setLists(data);
            setHasLists(data.length > 0);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
        };

        fetchData();
    }, []);

    const handleCreateList = () => {
        // Affiche le formulaire lorsqu'on clique sur le bouton
        setShowForm(true);
    };

    const handleCreateListSuccess = async (newList: List) => {
        // Rafraîchir la liste après la création
        const updatedLists = await getLists();
        setLists(updatedLists);
        setHasLists(updatedLists.length > 0);
        // Masquer le formulaire
        setShowForm(false);
    };

    const handleCancelForm = () => {
        // Masquer le formulaire en cas d'annulation
        setShowForm(false);
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newFilter = event.target.value;
        setFilter(newFilter);
        sortLists(newFilter);
    };

    const sortLists = (filter: string) => {
        let sortedLists = [...lists];

        if (filter === 'alphabetical') {
            sortedLists.sort((a, b) => a.name.localeCompare(b.name));
        } else if (filter === 'reverse-alphabetical') {
            sortedLists.sort((a, b) => b.name.localeCompare(a.name));
        } else if (filter === 'expiration-date') {
            sortedLists.sort((a, b) => new Date(a.date_fin).getTime() - new Date(b.date_fin).getTime());
        }

        setLists(sortedLists);
    };

    if (loading) {
        <LoadingSpinner />
    }

    return (
        <div className="max-w-screen-xl px-4 md:px-8 mx-auto py-16 relative">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl font-bold">Listes</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 text-white rounded-full bg-gradient-to-r from-green-400 to-green-600"
                >
                    + Nouvelle Liste
                </button>
                <label htmlFor="sort" className="ml-4 text-gray-600">Trier par :</label>
                    <select
                        id="sort"
                        name="sort"
                        value={filter}
                        onChange={handleFilterChange}
                        className="px-2 py-1 border rounded-md ml-2"
                    >
                        <option value="">Tous</option>
                        <option value="alphabetical">Alphabétique (croissant)</option>
                        <option value="reverse-alphabetical">Alphabétique (décroissant)</option>
                        <option value="expiration-date">Date d'expiration</option>
                    </select>
            </div>
            {showForm && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black p-8 z-50 rounded-md shadow-lg flex items-center justify-center">
                    <CreateList onCreateList={handleCreateListSuccess} onCancel={handleCancelForm} />
                </div>
            )}
            {!hasLists ? (
                <div className="text-center">
                Il n'y a pas encore de liste crée. Cliquez sur le bouton pour en créer une.
                </div>
            ) : (
                <Swiper
                effect={ 'coverflow' }
                grabCursor={ false }
                centeredSlides={ true }
                loop={ true }
                slidesPerView={ 'auto' }
                coverflowEffect={{
                rotate: 0,
                stretch: 0,
                depth: 100,
                modifier: 2.5,
                slideShadows: false
                }}
                pagination={{el: '.swiper-pagination', clickable: true}}
                navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
                }}
                modules={[EffectCoverflow, Pagination, Navigation]}
                className={`h-208 py-8 relative ${showForm ? 'blur-5 z-10' : ''}`}
                >
                    {lists.map((list, index) => (
                    <SwiperSlide key={index} className="swiper-slide w-96 h-96 pb-20 relative">
                        <div className="w-full h-full rounded-8">
                            <Card listData={list} />
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

export default SwiperComponent;