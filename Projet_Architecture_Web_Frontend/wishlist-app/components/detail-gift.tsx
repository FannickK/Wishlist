"use client";

import { TypeAnimation } from 'react-type-animation';

const GiftDetailHeader = () => {
    return (
        <div className="mx-auto py-10">
            <h1 className="text-black mb-4 text-6xl font-extrabold text-center">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Bienvenue sur la page des{" "}</span>
                <TypeAnimation
                    sequence={[
                        'détails',
                        1000, 
                        'cadeaux',
                        1000,  
                    ]}
                    wrapper="span"
                    speed={50}
                    repeat={Infinity}
                />
            </h1>
        </div>
    );
}

export default GiftDetailHeader;