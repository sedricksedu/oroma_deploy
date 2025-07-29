import { Event } from "./shared/schema";

export const sampleEvents: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: "Dwog Pacu Cultural Competition Finals",
    description: "The grand finale of the annual Dwog Pacu competition featuring youth from across Lango region showcasing poetry, music, and traditional dance.",
    date: new Date('2025-02-15'),
    location: "Mayor's Gardens, Lira City",
    category: "Culture",
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop"
  },
  {
    title: "Northern Uganda Agricultural Trade Fair",
    description: "A three-day exhibition showcasing modern farming techniques, agricultural products, and connecting farmers with buyers and suppliers.",
    date: new Date('2025-02-20'),
    location: "Lira Agricultural Institute",
    category: "Agriculture",
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop"
  },
  {
    title: "Lango Music Festival",
    description: "Celebrating traditional and contemporary Lango music with performances by local and regional artists, workshops, and cultural exhibitions.",
    date: new Date('2025-03-01'),
    location: "Lira Municipal Stadium",
    category: "Music",
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format&fit=crop"
  },
  {
    title: "Health Awareness Campaign - Kitgum",
    description: "Free health screenings, immunization drives, and health education focusing on malaria prevention, nutrition, and maternal health.",
    date: new Date('2025-02-28'),
    location: "Kitgum District Hospital",
    category: "Health",
    featured: false,
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&auto=format&fit=crop"
  },
  {
    title: "Youth Skills Development Workshop",
    description: "Training workshops in digital literacy, entrepreneurship, and vocational skills for young people across West Nile region.",
    date: new Date('2025-03-10'),
    location: "Arua Technical Institute",
    category: "Education",
    featured: false,
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop"
  },
  {
    title: "Peace and Reconciliation Dialogue",
    description: "Community dialogue sessions bringing together traditional leaders, youth, and women groups to discuss sustainable peace initiatives.",
    date: new Date('2025-03-05'),
    location: "Lira Cultural Center",
    category: "Community",
    featured: false,
    imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop"
  }
];