
export enum AppLanguage {
  EN = 'en',
  HI = 'hi',
  TA = 'ta',
  TE = 'te',
  ML = 'ml'
}

export enum UserRole {
  GUEST = 'guest',
  SELLER = 'seller',
  BUYER = 'buyer',
  ADMIN = 'admin'
}

export interface SellerProfile {
  id: string;
  name: string;
  email?: string;
  village: string;
  district: string;
  craftType: string;
  experience: string;
  phone: string;
  profileImageUrl?: string;
  idType: 'PAN' | 'AADHAR';
  idNumber: string;
  isVerified: boolean;
  panStatus: 'pending' | 'verified' | 'rejected';
  portfolioEn: string;
  portfolioNative: string;
  language: AppLanguage;
  imageUrls: string[];
  tags?: string[];
}

export interface Product {
  id: string;
  sellerId: string;
  nameEn: string;
  nameNative: string;
  descriptionEn: string;
  descriptionNative: string;
  basePrice: number; // Amount the seller set
  markupPercent: number; // 5-8% platform fee
  price: number; // Final price shown to buyers (basePrice + markup)
  imageUrl: string;
  category: string;
  status: 'available' | 'sold' | 'pending';
  rating?: number;
}

export interface TranslationMap {
  [key: string]: {
    [lang in AppLanguage]: string;
  };
}
