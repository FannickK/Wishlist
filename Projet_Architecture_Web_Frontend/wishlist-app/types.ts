export interface List {
    id: number;
    name: string;
    author: string;
    date_debut: Date;
    date_fin: Date;
    isExpired: boolean;
    gifts: Gift[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Gift {
    id: number;
    name: string;
    description: string;
    price: number;
    images: Image[];
    isReserved: boolean;
    nameReserver: string;
    dateReservation: Date;
    listId: number;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Image {
    id: number;
    gift: Gift;
    giftId: number;
    filename: string;
    createdAt: Date;
    updatedAt: Date;
  }
  