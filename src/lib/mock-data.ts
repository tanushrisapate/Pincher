// Mock data used across the app — replace with real API responses.
import { Sparkles, Palette, Star, TrendingUp } from "lucide-react";

export const aestheticPalette = [
  { name: "Champagne", hex: "#F4E4C9" },
  { name: "Blush", hex: "#E8C4C0" },
  { name: "Cocoa", hex: "#5A3E2B" },
  { name: "Ivory", hex: "#FAF6EE" },
  { name: "Sage", hex: "#B7C4A4" },
  { name: "Noir", hex: "#1A1614" },
];

export const celebrities = [
  { id: "1", name: "Zendaya", style: "Avant-garde Glam", img: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=400&q=80" },
  { id: "2", name: "Harry Styles", style: "Eclectic Romantic", img: "https://images.unsplash.com/photo-1492288991661-058aa541ff43?w=400&q=80" },
  { id: "3", name: "Rihanna", style: "Bold Streetwear", img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80" },
  { id: "4", name: "Timothée Chalamet", style: "Modern Minimalist", img: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&q=80" },
  { id: "5", name: "Bella Hadid", style: "90s Revival", img: "https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=400&q=80" },
  { id: "6", name: "A$AP Rocky", style: "Luxury Streetwear", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
];

export const stylePreferences = [
  "Minimalist", "Streetwear", "Old Money", "Coquette", "Y2K",
  "Cottagecore", "Dark Academia", "Avant-garde", "Boho", "Athleisure",
];

export const stats = [
  { label: "Predictions", value: 24, icon: Sparkles },
  { label: "Saved Looks", value: 58, icon: Star },
  { label: "Color Profiles", value: 6, icon: Palette },
  { label: "Style Score", value: 92, icon: TrendingUp },
];

export const recentPredictions = [
  { id: "p1", aesthetic: "Quiet Luxury", confidence: 94, palette: ["#F4E4C9", "#5A3E2B", "#FAF6EE"], img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80" },
  { id: "p2", aesthetic: "Coastal Romantic", confidence: 88, palette: ["#E8C4C0", "#B7C4A4", "#FAF6EE"], img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80" },
  { id: "p3", aesthetic: "Dark Academia", confidence: 91, palette: ["#1A1614", "#5A3E2B", "#A88B6A"], img: "https://images.unsplash.com/photo-1485518882345-15568b007407?w=600&q=80" },
];

export const galleryImages = [
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
  "https://images.unsplash.com/photo-1485518882345-15568b007407?w=600&q=80",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80",
  "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=600&q=80",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80",
];
