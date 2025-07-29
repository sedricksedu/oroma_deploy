import { News } from "./shared/schema";

export const sampleNewsArticles: Omit<News, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: "Lango Cultural Festival Celebrates Heritage in Lira",
    excerpt: "The annual Lango Cultural Festival showcased traditional dances, crafts, and storytelling, bringing together communities across Northern Uganda.",
    content: `The vibrant Lango Cultural Festival held in Lira City over the weekend drew thousands of participants and visitors from across Northern Uganda and beyond. The three-day celebration highlighted the rich cultural heritage of the Lango people through traditional music, dance, and storytelling.

Traditional dance groups performed the iconic Atekere dance, with participants dressed in colorful traditional attire. Local artisans displayed their crafts including pottery, basket weaving, and traditional jewelry making techniques passed down through generations.

Elder Grace Akello, a respected cultural leader, emphasized the importance of preserving Lango traditions for future generations. "Our culture is our identity. Through festivals like these, we ensure our children and grandchildren understand their roots," she said.

The festival also featured local cuisine, with traditional dishes like malakwang, boo, and other Lango delicacies prepared by community women's groups. Local musicians performed throughout the event, blending traditional and contemporary sounds.

Lira Mayor Joseph Okello praised the festival's role in promoting cultural tourism and community unity. The event is expected to become an annual celebration, further establishing Lira as a cultural hub in Northern Uganda.`,
    author: "Sarah Lamuno",
    category: "Culture",
    featured: true,
    publishedAt: new Date('2025-01-26').toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop"
  },
  {
    title: "Lira University Partners with Local Farmers for Agricultural Innovation",
    excerpt: "A new partnership aims to boost agricultural productivity in Northern Uganda through research and modern farming techniques.",
    content: `Lira University has launched an innovative partnership with local farmers across Northern Uganda to enhance agricultural productivity through modern farming techniques and research-based solutions.

The initiative, supported by the Ministry of Agriculture, focuses on introducing drought-resistant crop varieties and sustainable farming practices to help farmers adapt to changing climate conditions.

Dr. Margaret Ochola, Director of Agricultural Research at Lira University, explained that the program will train farmers in modern irrigation techniques, soil management, and integrated pest management. "We are combining traditional knowledge with scientific research to create sustainable solutions for our farming communities," she said.

The partnership includes demonstration farms in Lira, Kitgum, and Arua districts, where farmers can learn new techniques and access improved seeds. Local farmer associations have welcomed the initiative, noting the potential for increased yields and income.

James Okot, a farmer from Anaka subcounty, shared his experience: "The new techniques have already improved my cassava and maize production. This knowledge is helping us feed our families better and sell surplus in the market."

The program is expected to reach 5,000 farmers across the region within the next two years, with plans to expand to include livestock management and value addition training.`,
    author: "David Okello",
    category: "Agriculture",
    featured: true,
    publishedAt: new Date('2025-01-25').toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop"
  },
  {
    title: "New Health Center Opens in Kitgum District",
    excerpt: "The state-of-the-art health facility will serve over 50,000 residents in rural Kitgum, improving access to quality healthcare.",
    content: `A new state-of-the-art health center was officially opened in Kitgum District yesterday, marking a significant milestone in improving healthcare access for rural communities in Northern Uganda.

The facility, constructed with support from the Ministry of Health and international partners, will serve over 50,000 residents across 15 villages in the region. It features modern medical equipment, a maternity ward, and specialized units for treating common tropical diseases.

Dr. Florence Ayaa, the facility's Medical Superintendent, expressed optimism about the impact on community health. "This center will significantly reduce the distance families travel for medical care. We now have the capacity to handle emergency cases and provide comprehensive healthcare services," she said.

The health center is staffed with qualified nurses, midwives, and clinical officers, with visiting specialists scheduled weekly. A well-equipped laboratory and pharmacy ensure patients can receive complete treatment on-site.

Local Council Chairman Peter Opiyo thanked the government and partners for the investment. "For too long, our people had to travel long distances to access quality healthcare. This facility brings hope and will save many lives in our community."

The opening ceremony was attended by district officials, community leaders, and hundreds of residents who celebrated the new development with traditional songs and dances.`,
    author: "Grace Akello",
    category: "Health",
    featured: true,
    publishedAt: new Date('2025-01-24').toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&auto=format&fit=crop"
  },
  {
    title: "Youth Skills Training Program Launches in Arua",
    excerpt: "The program aims to equip young people with technical skills in carpentry, tailoring, and technology to reduce unemployment.",
    content: `A comprehensive youth skills training program was launched in Arua yesterday, aimed at equipping young people across West Nile with practical skills to enhance their employability and entrepreneurship opportunities.

The six-month program, implemented in partnership with local technical institutes, will train 500 youth in various trades including carpentry, welding, tailoring, computer literacy, and agricultural processing.

Minister of Youth and Sports, Hon. Sarah Nyakato, who presided over the launch, emphasized the government's commitment to youth empowerment. "This program addresses the critical need for skilled labor while providing our young people with opportunities to build sustainable livelihoods," she said.

The training facility in Arua town features modern workshops and computer labs. Participants will receive certificates recognized by national standards, increasing their chances of formal employment or starting their own businesses.

Twenty-two-year-old participant Mary Driku expressed her excitement: "I've always wanted to learn tailoring. This program gives me hope for a better future and the ability to support my family."

Local business leaders have pledged to provide internships and job opportunities for program graduates. The initiative is part of a broader national strategy to reduce youth unemployment and promote economic development in Northern Uganda.`,
    author: "John Odongo",
    category: "Education",
    featured: false,
    publishedAt: new Date('2025-01-23').toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop"
  },
  {
    title: "Northern Uganda Peace Marathon Promotes Unity",
    excerpt: "Hundreds of runners from across the region participated in the annual marathon celebrating peace and reconciliation.",
    content: `The annual Northern Uganda Peace Marathon drew over 800 participants from across the region, celebrating the journey of peace and reconciliation in areas once affected by conflict.

The 21-kilometer race started from Lira town center and wound through scenic routes showcasing the region's natural beauty and recovery progress. Participants included professional athletes, students, and community members of all ages.

Winner of the men's category, Stephen Okello from Lira, completed the race in 1 hour and 8 minutes. "This marathon represents our shared commitment to peace and development. Running together shows we are united," he said after receiving his prize.

The women's category was won by Rebecca Ayaa from Kitgum, who emphasized the importance of involving women in peace-building efforts. "When women participate in such events, it shows that peace is everyone's responsibility," she noted.

The marathon, now in its fifth year, has become a symbol of the region's transformation from conflict to peace. Participants wore t-shirts with messages of unity and hope, while local musicians provided entertainment at various points along the route.

District leaders used the occasion to highlight ongoing development projects and encourage continued collaboration among communities. The event raised funds for education scholarships for vulnerable children in the region.`,
    author: "Michael Opio",
    category: "Sports",
    featured: false,
    publishedAt: new Date('2025-01-22').toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop"
  }
];