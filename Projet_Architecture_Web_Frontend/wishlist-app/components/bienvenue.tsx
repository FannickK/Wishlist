"use client";

import { TypeAnimation } from 'react-type-animation';

const Bienvenue = () => {
    return (
        <div className="mx-auto py-10">
            <h1 className="text-black mb-4 text-6xl font-extrabold text-center">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Bienvenue sur{" "}</span>
                <TypeAnimation
                    sequence={[
                        'Wishlist',
                        1000, 
                        'notre application de listes',
                        1000,  
                    ]}
                    wrapper="span"
                    speed={50}
                    repeat={Infinity}
                />
            </h1>
            <p className="text-[#3c3d3e] text-xl px-10">
                Wishlist est une application de liste de cadeaux. Elle permet de
                créer, modifier et supprimer des listes de cadeaux et de réserver 
                les cadeaux qui sont dans ces dernières.
            </p>
        </div>
    );
}

export default Bienvenue