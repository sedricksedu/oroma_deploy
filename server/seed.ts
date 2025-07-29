import { db } from "./db";
import { programs, news, events } from "./shared/schema";
import { randomUUID } from "crypto";
import { sampleNewsArticles } from "./sample-news";
import { sampleEvents } from "./sample-events";

// Seed data for Oroma TV
export async function seedDatabase() {
  console.log("Seeding database...");

  // Programs data - Top 10 Oroma TV Programs
  const programsData = [
    {
      title: "Northern Pulse",
      description: "A weekly flagship show covering key sectors across Northern Uganda — from agriculture and health to youth, education, and culture. It gives a platform to local voices and community-driven stories.",
      category: "Magazine",
      schedule: "Fridays 8:00 PM",
      imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Village Voices",
      description: "Community-focused stories highlighting real-life challenges and successes from rural areas. Features interviews with locals, leaders, and changemakers at the grassroots level.",
      category: "Documentary",
      schedule: "Sundays 7:00 PM",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "AgriFront",
      description: "A program dedicated to farming and agribusiness. Showcases innovative farmers, market trends, climate-smart practices, and agricultural education for rural development.",
      category: "Agriculture",
      schedule: "Wednesdays 6:30 PM",
      imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Youth Spotlight",
      description: "A vibrant platform for young people — featuring debates, talent showcases, tech, entrepreneurship, and discussions on education and leadership.",
      category: "Youth",
      schedule: "Saturdays 5:00 PM",
      imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Health Watch",
      description: "Covers vital health issues in the region, including maternal care, disease prevention, mental health, and hygiene. Includes expert interviews and community awareness drives.",
      category: "Health",
      schedule: "Tuesdays 7:30 PM",
      imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Cultural Beat",
      description: "Celebrates the rich cultural heritage of Northern Uganda. Features traditional dances, folklore, music, rituals, and language preservation segments.",
      category: "Culture",
      schedule: "Thursdays 8:00 PM",
      imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Business Zone",
      description: "Profiles local entrepreneurs, market vendors, women in business, and youth hustlers. Offers practical business advice and inspires economic empowerment.",
      category: "Business",
      schedule: "Mondays 6:00 PM",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Service Check",
      description: "Investigative and accountability journalism. Examines public service delivery, infrastructure, local governance, and allows citizens to ask questions to their leaders.",
      category: "News",
      schedule: "Sundays 9:00 PM",
      imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Faith & Family",
      description: "A values-based program featuring faith messages, family counseling, parenting tips, and social topics. Includes voices from churches, mosques, and cultural leaders.",
      category: "Religious",
      schedule: "Sundays 11:00 AM",
      imageUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Northern Vibes",
      description: "Entertainment-based show featuring music, comedy, artist interviews, and performance highlights. Supports and promotes local talent and creativity from Northern Uganda.",
      category: "Entertainment",
      schedule: "Saturdays 9:00 PM",
      imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    }
  ];

  // News data
  const newsData = [
    {
      title: "Lira District Launches New Water Project",
      excerpt: "A major water infrastructure project begins in Lira to improve access to clean water for rural communities.",
      content: "The Lira District Local Government in partnership with international donors has launched a comprehensive water project aimed at providing clean water access to over 50,000 residents in rural areas. The project includes drilling of boreholes, construction of water treatment facilities, and training of local technicians for maintenance.",
      category: "local",
      imageUrl: "/api/placeholder/600/400",
      published: true
    },
    {
      title: "Northern Uganda Agricultural Fair Set for Next Month",
      excerpt: "The annual agricultural fair will showcase innovations in farming and livestock management across the region.",
      content: "The Northern Uganda Agricultural Fair, scheduled for next month in Lira, will bring together farmers, agribusiness companies, and agricultural experts to showcase the latest innovations in farming techniques, crop varieties, and livestock management. The three-day event is expected to attract over 10,000 participants from across the region.",
      category: "agriculture",
      imageUrl: "/api/placeholder/600/400",
      published: true
    },
    {
      title: "Cultural Festival Celebrates Acholi Heritage",
      excerpt: "Traditional dances, music, and storytelling take center stage at the annual Acholi cultural festival.",
      content: "The vibrant Acholi cultural festival brought together thousands of people to celebrate the rich heritage of the Acholi people. The event featured traditional dances like Bwola and Larakaraka, local cuisine, and storytelling sessions that preserve and pass on cultural knowledge to younger generations.",
      category: "culture",
      imageUrl: "/api/placeholder/600/400",
      published: true
    }
  ];

  // Events data
  const eventsData = [
    {
      title: "Community Health Workshop",
      description: "Free health screening and education workshop for the community",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      location: "Oroma TV Studios, Lira",
      imageUrl: "/api/placeholder/400/300"
    },
    {
      title: "Annual Fundraising Gala",
      description: "Join us for our annual fundraising dinner to support local journalism",
      date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 month from now
      location: "Lira Grand Hotel",
      imageUrl: "/api/placeholder/400/300"
    }
  ];

  try {
    // Insert programs
    for (const program of programsData) {
      await db.insert(programs).values({
        id: randomUUID(),
        ...program
      });
    }
    console.log("Programs seeded successfully");

    // Insert authentic Northern Uganda news articles
    for (const article of sampleNewsArticles) {
      await db.insert(news).values({
        id: randomUUID(),
        ...article,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    console.log("News seeded successfully");

    // Insert authentic Northern Uganda events  
    for (const event of sampleEvents) {
      await db.insert(events).values({
        id: randomUUID(),
        ...event,
        date: typeof event.date === 'string' ? event.date : event.date.toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    console.log("Events seeded successfully");

    console.log("Database seeding completed!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().then(() => process.exit(0));
}