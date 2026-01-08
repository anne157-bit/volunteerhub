// lib/data.ts

// This interface matches your OpportunityCard expectation
export interface Opportunity {
  id: number;
  title: string;
  organization: string;
  city: string;
  type: string;
  description: string;
  date: string;
  location?: string;     // Optional: for detail page
  requirements?: string[]; // Optional: for detail page
}

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: 1,
    title: "Beach Cleanup Drive",
    organization: "Green Earth Initiative",
    city: "Mumbai",
    type: "Environment",
    description: "Join us for a morning cleanup at Juhu Beach. Gloves and bags provided. Help us keep our oceans clean! We will meet at the main entrance near the Ramada Plaza.",
    date: "Sat, Jan 24",
    location: "Juhu Beach, Mumbai", 
    requirements: ["Gloves (provided)", "Water bottle", "Sunscreen"]
  },
  {
    id: 2,
    title: "Math Tutor for Kids",
    organization: "TeachForIndia",
    city: "Pune",
    type: "Education",
    description: "Looking for volunteers to teach basic mathematics to students in grades 5-8. Weekend commitment required.",
    date: "Starts Feb 1",
    location: "Ganeshkhind Road, Pune",
    requirements: ["Basic Math proficiency", "Patience"]
  },
  {
    id: 3,
    title: "Food Distribution",
    organization: "Feeding Delhi",
    city: "Delhi",
    type: "Community",
    description: "Help pack and distribute food packets to homeless shelters across South Delhi. Transport provided.",
    date: "Every Sunday",
    location: "South Ex, Delhi",
    requirements: ["Ability to lift 5kg", "Team player"]
  },
  {
    id: 4,
    title: "Animal Shelter Assistant",
    organization: "Paws & Care",
    city: "Pune",
    type: "Animal Welfare",
    description: "Assist with walking dogs, cleaning kennels, and socializing cats at our shelter in Baner.",
    date: "Flexible",
    location: "Baner, Pune",
    requirements: ["Love for animals", "Tetanus shot"]
  },
  {
    id: 5,
    title: "Tech Mentor for Seniors",
    organization: "Silver Surfers",
    city: "Mumbai",
    type: "Technology",
    description: "Teach basic smartphone usage and safety to senior citizens. Patience required!",
    date: "Weekends",
    location: "Bandra West",
    requirements: ["Smartphone knowledge", "Hindi/English fluency"]
  },
  {
    id: 6,
    title: "Tree Plantation Drive",
    organization: "Green Delhi",
    city: "Delhi",
    type: "Environment",
    description: "We aim to plant 500 saplings this weekend. Bring a shovel if you have one!",
    date: "Sun, Jan 25",
    location: "Lodhi Garden area",
    requirements: ["Comfortable shoes"]
  },
  {
    id: 7,
    title: "Graphic Design Volunteer",
    organization: "Art for All",
    city: "Remote",
    type: "Design",
    description: "Help us design social media posts for our upcoming fundraising campaign. Can be done from anywhere.",
    date: "Project-based",
    location: "Remote",
    requirements: ["Canva or Adobe tools", "Creative eye"]
  },
  {
    id: 8,
    title: "Marathon Water Station",
    organization: "Pune Running Club",
    city: "Pune",
    type: "Event",
    description: "Hand out water and energy drinks to runners during the annual Pune Half Marathon.",
    date: "Sun, Feb 10",
    location: "University Circle",
    requirements: ["Energy!", "Available 5am-10am"]
  },
];