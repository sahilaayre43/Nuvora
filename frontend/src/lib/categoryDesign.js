import {
  Armchair,
  BookOpen,
  Camera,
  Footprints,
  Grid2X2,
  Headphones,
  Monitor,
  Shirt,
  Sparkles,
  Watch,
} from 'lucide-react';

const designs = [
  {
    matches: ['audio', 'headphone', 'speaker', 'sound'],
    icon: Headphones,
    bg: 'bg-violet-100',
    color: 'text-violet-600',
  },
  {
    matches: ['furniture', 'sofa', 'chair', 'home decor'],
    icon: Armchair,
    bg: 'bg-emerald-100',
    color: 'text-emerald-600',
  },
  {
    matches: ['camera', 'photography'],
    icon: Camera,
    bg: 'bg-amber-100',
    color: 'text-amber-600',
  },
  {
    matches: ['footwear', 'shoe', 'sneaker'],
    icon: Footprints,
    bg: 'bg-rose-100',
    color: 'text-rose-600',
  },
  {
    matches: ['clothing', 'clothes', 'fashion', 'apparel'],
    icon: Shirt,
    bg: 'bg-pink-100',
    color: 'text-pink-600',
  },
  {
    matches: ['electronics', 'electronic', 'gadget', 'computer', 'laptop'],
    icon: Monitor,
    bg: 'bg-sky-100',
    color: 'text-sky-600',
  },
  {
    matches: ['accessories', 'accessory', 'watch', 'jewelry'],
    icon: Watch,
    bg: 'bg-orange-100',
    color: 'text-orange-600',
  },
  {
    matches: ['beauty', 'cosmetic', 'skincare'],
    icon: Sparkles,
    bg: 'bg-fuchsia-100',
    color: 'text-fuchsia-600',
  },
  {
    matches: ['book', 'stationery'],
    icon: BookOpen,
    bg: 'bg-indigo-100',
    color: 'text-indigo-600',
  },
];

export const getCategoryDesign = (name = '') => {
  const normalizedName = name.trim().toLowerCase();
  return designs.find((design) =>
    design.matches.some((match) => normalizedName.includes(match))
  ) || {
    icon: Grid2X2,
    bg: 'bg-blue-100',
    color: 'text-blue-600',
  };
};
