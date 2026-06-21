import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle, Clock, ArrowLeft, ChevronRight, PlayCircle, Trophy, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { motion } from 'motion/react';

interface LessonContent {
  paragraphs: string[];
  table?: {
    headers: string[];
    rows: string[][];
  };
  graph?: {
    name: string;
    [key: string]: any;
  }[];
}

interface Lesson {
  id: string;
  title: string;
  type: string;
  duration: string;
  content: LessonContent;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

interface Course {
  id: string;
  title: string;
  duration: string;
  category: string;
  progress: number;
  description: string;
  lessons: Lesson[];
  quiz: QuizQuestion[];
}

const ACADEMY_DATA: Course[] = [
  {
    id: 'cc-101',
    title: 'Climate Change 101',
    duration: '15 min',
    category: 'Fundamentals',
    progress: 0,
    description: 'Understand the basic mechanisms of global warming and why it matters for India.',
    lessons: [
      { 
        id: 'cc-101-l1', 
        title: 'The Greenhouse Effect', 
        type: 'Reading', 
        duration: '3 min', 
        content: { 
          paragraphs: [
            "The greenhouse effect is a natural process that warms the Earth's surface. When the Sun's energy reaches the Earth's atmosphere, some of it is reflected back to space and some is absorbed and re-radiated by greenhouse gases.",
            "Greenhouse gases include water vapor, carbon dioxide, methane, nitrous oxide, ozone and some artificial chemicals such as CFCs. Carbon dioxide is the most significant human-contributed gas.",
            "Without this natural effect, Earth's average temperature would be around -18°C. However, human activities like burning fossil fuels have amplified this effect beyond natural levels."
          ], 
          table: { 
            headers: ["Gas", "Source", "Relative Potency"], 
            rows: [["CO2", "Fossil Fuels", "1"], ["CH4", "Livestock/Waste", "28"], ["N2O", "Agriculture", "265"]] 
          }, 
          graph: [{ name: '1850', value: 280 }, { name: '1950', value: 310 }, { name: '2023', value: 420 }] 
        } 
      },
      { 
        id: 'cc-101-l2', 
        title: 'Impact in India', 
        type: 'Video', 
        duration: '3 min', 
        content: { 
          paragraphs: [
            "India is highly vulnerable to climate change. The monsoon pattern, which supports 60% of Indian agriculture, is becoming increasingly volatile, with intense rainfall followed by long dry spells.",
            "Average temperatures across India have risen by 0.7°C since 1901. This leads to more frequent heatwaves affecting health and labor productivity in North and Central India.",
            "Coastal communities are seeing an increase in the frequency and intensity of severe cyclonic storms in the Arabian Sea."
          ],
          table: {
            headers: ["Region", "Primary Risk", "Severity"],
            rows: [["Himalayas", "Glacial Melt", "High"], ["Indo-Gangetic Plain", "Heat Stress", "Critical"], ["Mumbai/Kolkata", "Sea Level Rise", "High"]]
          }
        } 
      },
      { 
        id: 'cc-101-l3', 
        title: 'Sea Level Rise', 
        type: 'Reading', 
        duration: '3 min', 
        content: { 
          paragraphs: [
            "Thermal expansion of seawater and the melting of land-based ice (glaciers and ice sheets) are the primary drivers of rising sea levels globally.",
            "By 2050, several major Indian coastal cities could face annual flooding risks. This displaces millions and salinizes freshwater sources near the coast.",
            "Mangroves and salt marshes act as natural barriers, but many are being lost to coastal development."
          ],
          graph: [{ name: '1900', value: 0 }, { name: '1950', value: 10 }, { name: '2020', value: 25 }]
        } 
      },
      { 
        id: 'cc-101-l4', 
        title: 'Glacial Melting', 
        type: 'Reading', 
        duration: '3 min', 
        content: { 
          paragraphs: [
            "The Third Pole (Himalayas) holds the largest amount of snow and ice outside the Arctic and Antarctic. These glaciers feed major Asian rivers including the Indus, Ganga, and Brahmaputra.",
            "Accelerated melting creates 'Glacial Lake Outburst Floods' (GLOFs), which are catastrophic for local populations.",
            "Long-term, as glaciers shrink, the dry-season flow of these rivers will decrease, causing severe water stress for hundreds of millions of people downstream."
          ]
        } 
      },
      { 
        id: 'cc-101-l5', 
        title: 'Policy & Adaptation', 
        type: 'Summary', 
        duration: '3 min', 
        content: { 
          paragraphs: [
            "Adaptation involves adjusting to actual or expected future climate. In India, this includes building sea walls, developing drought-resistant crops, and improving water storage.",
            "Mitigation means reducing the intensity of radiative forcing. India's commitment to 500GW of non-fossil fuel energy by 2030 is a huge step in this direction.",
            "Individual actions, multiplied by billions, are essential to holding the warming below 1.5 degrees Celsius."
          ] 
        } 
      }
    ],
    quiz: [
      { question: "What is the primary greenhouse gas emitted by humans?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"], correctIndex: 1 },
      { question: "How much has India's average temperature risen since 1901?", options: ["0.1°C", "2.5°C", "0.7°C", "5.0°C"], correctIndex: 2 },
      { question: "Which mountain range is often called the 'Third Pole'?", options: ["Andes", "Himalayas", "Alps", "Rockies"], correctIndex: 1 },
      { question: "What is 'Mitigation' in climate terms?", options: ["Building sea walls", "Changing crops", "Reducing gas emissions", "Moving cities"], correctIndex: 2 },
      { question: "The Greenhouse Effect is a...", options: ["Artificial problem", "Natural process", "Myth", "New discovery"], correctIndex: 1 }
    ]
  },
  {
    id: 'carbon-cycle',
    title: 'The Carbon Cycle',
    duration: '20 min',
    category: 'Science',
    progress: 0,
    description: 'Learn how carbon moves through the Earth system and how humans have disrupted it.',
    lessons: [
      { 
        id: 'ccycle-l1', 
        title: 'Photosynthesis', 
        type: 'Reading', 
        duration: '4 min', 
        content: { 
          paragraphs: [
            "Carbon cycle is the process by which carbon travels from the atmosphere into organisms and the Earth and then back into the atmosphere.",
            "Plants take carbon dioxide from the air and use it to make food. This process is called photosynthesis. The carbon becomes part of the plant.",
            "When the plant dies, its carbon is returned to the soil. Over millions of years, this carbon can become fossil fuels."
          ],
          graph: [{ name: 'Jan', value: 412 }, { name: 'May', value: 418 }, { name: 'Sep', value: 410 }]
        } 
      },
      { id: 'ccycle-l2', title: 'Ocean Absorption', type: 'Reading', duration: '4 min', content: { paragraphs: ["The world's largest carbon sink is the ocean. It absorbs about 25% of the CO2 humans release into the atmosphere.", "This absorption causes ocean acidification, making it harder for corals and shellfish to survive."] } },
      { id: 'ccycle-l3', title: 'Fossil Fuels', type: 'Reading', duration: '4 min', content: { paragraphs: ["Carbon trapped for millions of years is released when we burn coal, oil, and gas. This adds 'new' carbon to the active cycle.", "This rapid release is the main cause of the current climate crisis."] } },
      { id: 'ccycle-l4', title: 'Deforestation', type: 'Video', duration: '4 min', content: { paragraphs: ["Cutting down forests releases stored carbon and removes the trees that would otherwise absorb CO2.", "Large scale land use change accounts for about 10% of total human carbon emissions."] } },
      { id: 'ccycle-l5', title: 'Carbon Budget', type: 'Analysis', duration: '4 min', content: { paragraphs: ["The 'Carbon Budget' is the amount of CO2 we can still emit while keeping global warming below a certain limit (like 1.5°C).", "At current emission rates, we will exhaust this budget in less than a decade."] } }
    ],
    quiz: [
      { question: "What process do plants use to absorb CO2?", options: ["Respiration", "Photosynthesis", "Combustion", "Erosion"], correctIndex: 1 },
      { question: "What is the largest carbon sink on Earth?", options: ["Forests", "Oceans", "Atmosphere", "Ice caps"], correctIndex: 1 },
      { question: "How does deforestation affect the carbon cycle?", options: ["Increases CO2 absorption", "Decreases CO2 in air", "Releases stored carbon", "No effect"], correctIndex: 2 },
      { question: "What is ocean acidification primarily caused by?", options: ["Plastic waste", "Oil spills", "CO2 absorption", "Solar radiation"], correctIndex: 2 },
      { question: "Fossil fuels are formed over...", options: ["Days", "Years", "Millions of years", "Centuries"], correctIndex: 2 }
    ]
  },
  {
    id: 'home-energy',
    title: 'Home Energy Secrets',
    duration: '12 min',
    category: 'Lifestyle',
    progress: 0,
    description: 'Simple hacks to reduce your electricity bill and footprint at home.',
    lessons: [
      { 
        id: 'he-l1', 
        title: 'Lighting Secrets', 
        type: 'Reading', 
        duration: '2 min', 
        content: { 
          paragraphs: [
            "Switching to LEDs is the easiest way to save energy. LED bulbs use at least 75% less energy and last 25 times longer than incandescent lighting.",
            "Always turn off lights when leaving a room. Natural light during the day is free and better for focus and mood."
          ],
          table: {
            headers: ["Bulb", "Life", "Efficiency"],
            rows: [["Incandescent", "1k hr", "10%"], ["CFL", "8k hr", "50%"], ["LED", "25k hr", "90%"]]
          }
        } 
      },
      { id: 'he-l2', title: 'Appliance Efficiency', type: 'Reading', duration: '2 min', content: { paragraphs: ["Check the BEE Star Rating labels on your appliances in India. More stars mean more efficiency.", "Old refrigerators can use 3 times more energy than modern efficient models."] } },
      { id: 'he-l3', title: 'Smart Cooling', type: 'Tips', duration: '3 min', content: { paragraphs: ["Set your AC to 24°C-26°C. Each degree higher can save about 6% on electricity.", "Use ceiling fans with AC to circulate cool air more effectively."] } },
      { id: 'he-l4', title: 'Phantom Loads', type: 'Reading', duration: '2 min', content: { paragraphs: ["Devices plugged in but 'off' still consume power. This is called 'Vampire power'.", "Turn off the main switches for TVs, chargers, and microwaves when not in use."] } },
      { id: 'he-l5', title: 'Solar Transition', type: 'Guide', duration: '3 min', content: { paragraphs: ["Rooftop solar is becoming highly affordable in India with government subsidies.", "It can reduce your energy bill to near zero while using 100% clean energy."] } }
    ],
    quiz: [
      { question: "What is the most energy-efficient lighting option?", options: ["Incandescent", "CFL", "Halogen", "LED"], correctIndex: 3 },
      { question: "What is the recommended AC temperature to save energy?", options: ["16°C", "24-26°C", "30°C", "18°C"], correctIndex: 1 },
      { question: "What does 'Phantom Load' refer to?", options: ["Heavy appliances", "Static electricity", "Power used by idle devices", "Power surges"], correctIndex: 2 },
      { question: "Which agency provides Star Ratings for appliances in India?", options: ["NITI Aayog", "BEE", "ISRO", "FSSAI"], correctIndex: 1 },
      { question: "Solar energy is considered...", options: ["Non-renewable", "Finite", "Renewable", "Inefficient"], correctIndex: 2 }
    ]
  },
  {
    id: 'future-food',
    title: 'Future of Food',
    duration: '18 min',
    category: 'Lifestyle',
    progress: 0,
    description: 'Exploring the climate impact of our diets and sustainable alternatives.',
    lessons: [
      { 
        id: 'ff-l1', 
        title: 'Dietary Impact', 
        type: 'Reading', 
        duration: '3 min', 
        content: { 
          paragraphs: [
            "Food production accounts for about a quarter of global greenhouse gas emissions.",
            "Animal-based foods generally have a higher footprint than plant-based foods due to land use and methane from livestock."
          ],
          graph: [{ name: 'Beef', value: 60 }, { name: 'Rice', value: 4 }, { name: 'Wheat', value: 1.5 }]
        } 
      },
      { id: 'ff-l2', title: 'Organic Farming', type: 'Reading', duration: '4 min', content: { paragraphs: ["Synthetic fertilizers release nitrous oxide, a powerful greenhouse gas.", "Organic farming uses natural compost, which helps the soil store more carbon."] } },
      { id: 'ff-l3', title: 'Food Waste', type: 'Tips', duration: '4 min', content: { paragraphs: ["If food waste were a country, it would be the third-largest emitter of greenhouse gases.", "Plan your meals, store food correctly, and compost your scraps."] } },
      { id: 'ff-l4', title: 'Millet Magic', type: 'Reading', duration: '4 min', content: { paragraphs: ["Millets are climate-resilient superfoods. They require much less water than rice and wheat.", "They are rich in nutrition and a key part of India's traditional agricultural heritage."] } },
      { id: 'ff-l5', title: 'Local Sourcing', type: 'Summary', duration: '3 min', content: { paragraphs: ["'Food miles' refer to the distance food travels from farm to plate.", "Buying seasonal and local food reduces the carbon footprint from transport and refrigeration."] } }
    ],
    quiz: [
      { question: "Which food generally has the highest carbon footprint?", options: ["Rice", "Beef", "Apples", "Lentils"], correctIndex: 1 },
      { question: "What gas is primarily released by synthetic fertilizers?", options: ["Oxygen", "Nitrous Oxide", "Helium", "Neon"], correctIndex: 1 },
      { question: "What are 'Food Miles'?", options: ["Length of a farm", "Calories in food", "Distance food travels", "Speed of eating"], correctIndex: 2 },
      { question: "Which crop is most water-efficient?", options: ["Rice", "Sugarcane", "Millet", "Wheat"], correctIndex: 2 },
      { question: "Reducing food waste helps because food in landfills produces...", options: ["Oxygen", "Methane", "Nitrogen", "Argon"], correctIndex: 1 }
    ]
  },
  {
    id: 'green-transport',
    title: 'Green Transport',
    duration: '22 min',
    category: 'Lifestyle',
    progress: 0,
    description: 'Optimize your commute and understand the impact of different transit modes.',
    lessons: [
      { 
        id: 'gt-l1', 
        title: 'Public Transit', 
        type: 'Reading', 
        duration: '4 min', 
        content: { 
          paragraphs: [
            "One full metro train or bus can take dozens of cars off the road, drastically reducing congestion and emissions.",
            "Public transit is the backbone of sustainable urban growth in India's expanding cities."
          ],
          table: {
            headers: ["Mode", "CO2/km", "Cost"],
            rows: [["SUV", "250g", "High"], ["Metro", "30g", "Low"], ["Bicycle", "0g", "Zero"]]
          }
        } 
      },
      { id: 'gt-l2', title: 'EV Basics', type: 'Reading', duration: '4 min', content: { paragraphs: ["Electric vehicles produce zero tailpipe emissions. Their total benefit depends on the source of electricity.", "In India, as the grid adds more solar and wind, EVs become even cleaner over time."] } },
      { id: 'gt-l3', title: 'Cycling Benefits', type: 'Health', duration: '5 min', content: { paragraphs: ["Cycling is 100% emission-free and provides great cardiovascular exercise.", "It is often faster than driving for short distances in crowded Indian cities."] } },
      { id: 'gt-l4', title: 'Carpooling Tips', type: 'Reading', duration: '4 min', content: { paragraphs: ["Empty car seats are a wasted resource. Sharing your ride halves your individual footprint.", "Use trusted carpooling apps to find commuters on your route."] } },
      { id: 'gt-l5', title: 'Aviation Impact', type: 'Analysis', duration: '5 min', content: { paragraphs: ["Flying is the most carbon-intensive mode of transport per passenger-kilometer.", "Try to use trains for shorter trips and consider direct flights to reduce take-off/landing emissions."] } }
    ],
    quiz: [
      { question: "Which transport mode has zero emissions?", options: ["Petrol Car", "Bus", "Bicycle", "Airplane"], correctIndex: 2 },
      { question: "Electric Vehicles (EVs) have zero...", options: ["Batteries", "Tires", "Tailpipe emissions", "Weight"], correctIndex: 2 },
      { question: "Aviation contributes significantly to emissions because of...", options: ["High altitude", "Fuel intensity", "Both a & b", "Neither"], correctIndex: 2 },
      { question: "Sharing a ride with others is called...", options: ["Ghosting", "Carpooling", "Drafting", "Soloing"], correctIndex: 1 },
      { question: "Compared to a car, a metro train is...", options: ["Less efficient", "More efficient", "Equally efficient", "Slower always"], correctIndex: 1 }
    ]
  },
  {
    id: 'waste-management',
    title: 'Zero Waste Living',
    duration: '25 min',
    category: 'Lifestyle',
    progress: 0,
    description: 'Master the 5 Rs: Refuse, Reduce, Reuse, Repurpose, Recycle.',
    lessons: [
      { 
        id: 'zw-l1', 
        title: 'Plastic Crisis', 
        type: 'Reading', 
        duration: '5 min', 
        content: { 
          paragraphs: [
            "Single-use plastics take hundreds of years to decompose. They break down into microplastics that enter the food chain.",
            "Refuse plastic bags and straws. Always carry a reusable cloth bag when shopping."
          ],
          graph: [{ name: 'Used', value: 100 }, { name: 'Recycled', value: 9 }, { name: 'Burned', value: 12 }]
        } 
      },
      { id: 'zw-l2', title: 'Composting 101', type: 'Guide', duration: '5 min', content: { paragraphs: ["Nearly half of household waste is organic. Composting prevents this waste from releasing methane in landfills.", "You can compost even in small balconies using 'bokashi' or aerobic bins."] } },
      { id: 'zw-l3', title: 'Recycling Myths', type: 'Reading', duration: '5 min', content: { paragraphs: ["Not everything with a recycle symbol actually gets recycled. Contamination from food waste is a big issue.", "Wash your plastics and papers before putting them in the recycling bin."] } },
      { id: 'zw-l4', title: 'Minimalist Wardrobe', type: 'Tips', duration: '5 min', content: { paragraphs: ["Fast fashion is one of the world's most polluting industries. It uses massive amounts of water and chemicals.", "Buy quality over quantity, swap clothes with friends, and repair what's broken."] } },
      { id: 'zw-l5', title: 'Circular Economy', type: 'Summary', duration: '5 min', content: { paragraphs: ["In nature, there is no waste. The circular economy mimics this by designing products to be remade or composted.", "Support brands that take back their products at the end of their life."] } }
    ],
    quiz: [
      { question: "The '5 Rs' stand for Refuse, Reduce, Reuse, Repurpose and...", options: ["Relax", "Recycle", "Remove", "Repeat"], correctIndex: 1 },
      { question: "What percent of global plastic is actually recycled?", options: ["90%", "50%", "9%", "100%"], correctIndex: 2 },
      { question: "Composting helps reduce which harmful gas?", options: ["Oxygen", "Methane", "Argon", "Helium"], correctIndex: 1 },
      { question: "What is 'Fast Fashion' criticized for?", options: ["High cost", "Sustainability", "Environmental damage", "Durability"], correctIndex: 2 },
      { question: "A primary issue with recycling is...", options: ["Lack of bins", "Contamination", "Colors", "Too much paper"], correctIndex: 1 }
    ]
  },
  {
    id: 'water-conservation',
    title: 'Water Wisdom',
    duration: '15 min',
    category: 'Environment',
    progress: 0,
    description: 'Ensuring water security in a changing climate.',
    lessons: [
      { 
        id: 'ww-l1', 
        title: 'India\'s Water Crisis', 
        type: 'Reading', 
        duration: '3 min', 
        content: { 
          paragraphs: [
            "India has 18% of the world's population but only 4% of its freshwater resources.",
            "Groundwater is being depleted at an unsustainable rate in many parts of India, especially in the Northwest."
          ],
          table: {
            headers: ["Usage", "Percentage"],
            rows: [["Agriculture", "85%"], ["Industry", "9%"], ["Domestic", "6%"]]
          }
        } 
      },
      { id: 'ww-l2', title: 'Rainwater Harvesting', type: 'Guide', duration: '3 min', content: { paragraphs: ["Rainwater harvesting involves collecting and storing rain from roofs or ground surfaces for later use.", "It can recharge groundwater aquifers and provide a reliable backup source during dry seasons."] } },
      { id: 'ww-l3', title: 'Greywater Use', type: 'Reading', duration: '3 min', content: { paragraphs: ["Greywater is wastewater from baths, sinks, and washing machines. It can be filtered and used for gardening.", "This reduces the demand for fresh drinking-quality water for non-drinking needs."] } },
      { id: 'ww-l4', title: 'Wetland Protection', type: 'Ecology', duration: '3 min', content: { paragraphs: ["Wetlands act as natural kidneys, filtering water and helping recharge groundwater.", "They also provide a buffer against floods and droughts."] } },
      { id: 'ww-l5', title: 'The Future Flow', type: 'Summary', duration: '3 min', content: { paragraphs: ["Climate change alters the monsoon and melts glaciers, making water management the biggest challenge for 21st-century India.", "Every drop saved today is a drop available for tomorrow."] } }
    ],
    quiz: [
      { question: "What percent of world's freshwater does India have?", options: ["18%", "50%", "4%", "2%"], correctIndex: 2 },
      { question: "Which sector uses the most water in India?", options: ["Domestic", "Industry", "Agriculture", "Tourism"], correctIndex: 2 },
      { question: "Collecting rain for later use is called...", options: ["Dumping", "Harvesting", "Mining", "Siphoning"], correctIndex: 1 },
      { question: "Wastewater from sinks and baths is called...", options: ["Blackwater", "Sewerage", "Greywater", "Oilwater"], correctIndex: 2 },
      { question: "Wetlands help in...", options: ["Drying soil", "Water filtration", "Killing birds", "Faster evaporation"], correctIndex: 1 }
    ]
  },
  {
    id: 'renewable-policy',
    title: 'India\'s Green Policy',
    duration: '30 min',
    category: 'Policy',
    progress: 0,
    description: 'Deep dive into India\'s renewable energy goals and international commitments.',
    lessons: [
      { 
        id: 'gp-l1', 
        title: 'Paris Agreement', 
        type: 'Reading', 
        duration: '6 min', 
        content: { 
          paragraphs: [
            "The Paris Agreement is a legally binding international treaty on climate change. It was adopted by 196 Parties in 2015.",
            "Its goal is to limit global warming to well below 2, preferably to 1.5 degrees Celsius, compared to pre-industrial levels."
          ],
          graph: [{ name: 'Goal', value: 1.5 }, { name: 'Current', value: 1.2 }, { name: 'Business as Usual', value: 3.2 }]
        } 
      },
      { id: 'gp-l2', title: 'Net Zero by 2070', type: 'Reading', duration: '6 min', content: { paragraphs: ["At COP26, India announced its goal to achieve net-zero emissions by 2070.", "Net-zero means removing as much CO2 from the atmosphere as we put into it."] } },
      { id: 'gp-l3', title: 'Solar Mission', type: 'Policy', duration: '6 min', content: { paragraphs: ["India aims to have 500 GW of non-fossil fuel capacity by 2030. Much of this will be solar.", "Large solar parks and rooftop solar schemes are core to this transition."] } },
      { id: 'gp-l4', title: 'Green Hydrogen', type: 'Reading', duration: '6 min', content: { paragraphs: ["Green hydrogen is produced by splitting water using renewable electricity. It leaves no carbon footprint.", "It is vital for decarbonizing 'hard-to-abate' sectors like steel and fertilizers."] } },
      { id: 'gp-l5', title: 'Climate Finance', type: 'Analysis', duration: '6 min', content: { paragraphs: ["The transition to green energy requires trillions of dollars in investment.", "Developed nations have committed to providing finance to developing nations, though the actual flow has been slow."] } }
    ],
    quiz: [
      { question: "In which year was the Paris Agreement adopted?", options: ["2000", "2010", "2015", "2022"], correctIndex: 2 },
      { question: "India's Net Zero target year is...", options: ["2030", "2050", "2070", "2100"], correctIndex: 2 },
      { question: "What does 'Net Zero' mean?", options: ["Zero electricity", "Zero plants", "Balanced emissions", "No transport"], correctIndex: 2 },
      { question: "India aims for how much non-fossil capacity by 2030?", options: ["100 GW", "250 GW", "500 GW", "1000 GW"], correctIndex: 2 },
      { question: "Green Hydrogen is produced from...", options: ["Natural gas", "Coal", "Water + Renewables", "Petroleum"], correctIndex: 2 }
    ]
  },
  {
    id: 'ocean-health',
    title: 'Blue Carbon',
    duration: '20 min',
    category: 'Science',
    progress: 0,
    description: 'The critical role of oceans in regulating our climate.',
    lessons: [
      { 
        id: 'bc-l1', 
        title: 'Mangrove Forests', 
        type: 'Reading', 
        duration: '4 min', 
        content: { 
          paragraphs: [
            "Mangroves store up to 10 times more carbon per acre than tropical rainforests. This is called 'Blue Carbon'.",
            "They protected Indian coastlines during the 2004 Tsunami and continue to buffer against severe cyclones."
          ],
          table: {
            headers: ["System", "Carbon Store (tC/ha)"],
            rows: [["Mangrove", "937"], ["Seagrass", "142"], ["Tropical Forest", "225"]]
          }
        } 
      },
      { id: 'bc-l2', title: 'Ocean Acidification', type: 'Reading', duration: '4 min', content: { paragraphs: ["Oceans have absorbed 90% of the heating from global warming. This causes them to expand and warm.", "Warmer oceans lead to coral bleaching, where corals expel their vital algae and turn white and die."] } },
      { id: 'bc-l3', title: 'Seaweed Farming', type: 'Innovation', duration: '4 min', content: { paragraphs: ["Seaweed grows incredibly fast and absorbs huge amounts of CO2. It can be used for food, fertilizer, and even bio-plastic.", "It requires no land, fresh water, or fertilizers to grow."] } },
      { id: 'bc-l4', title: 'Plastic Pollution', type: 'Reading', duration: '4 min', content: { paragraphs: ["The Great Pacific Garbage Patch is twice the size of Texas. Plactics kill marine life and disrupt the carbon-absorbing ability of plankton.", "Ghost nets (lost fishing gear) are a major source of marine entanglement."] } },
      { id: 'bc-l5', title: 'Marine Governance', type: 'Summary', duration: '4 min', content: { paragraphs: ["High seas (areas beyond national jurisdiction) need international protection from overfishing and mining.", "Marine Protected Areas (MPAs) are essential for restoring biodiversity and carbon sequestration."] } }
    ],
    quiz: [
      { question: "What is 'Blue Carbon'?", options: ["Blue paint", "Carbon in ocean ecosystems", "Carbon in the sky", "Coal"], correctIndex: 1 },
      { question: "Mangroves can store how much more carbon than forests?", options: ["2x", "5x", "Up to 10x", "Equally"], correctIndex: 2 },
      { question: "Coral bleaching is primarily caused by...", options: ["Oil", "Warming oceans", "Plastic", "Swimming"], correctIndex: 1 },
      { question: "Why is seaweed farming sustainable?", options: ["Needs no land", "Needs no fresh water", "No fertilizer", "All of the above"], correctIndex: 3 },
      { question: "Ghost nets refer to...", options: ["Halloween decor", "Invisible fish", "Lost fishing gear", "Ocean foam"], correctIndex: 2 }
    ]
  },
  {
    id: 'climate-justice',
    title: 'Climate Justice',
    duration: '15 min',
    category: 'Social',
    progress: 0,
    description: 'Ensuring a fair and equitable transition for all communities.',
    lessons: [
      { 
        id: 'cj-l1', 
        title: 'Equity vs Equality', 
        type: 'Reading', 
        duration: '3 min', 
        content: { 
          paragraphs: [
            "Equality means giving everyone the same resources. Equity means giving people what they need to reach an equal outcome.",
            "In climate change, the poor contribute the least to emissions but suffer the most from its impacts."
          ],
          graph: [{ name: 'Top 10%', value: 50 }, { name: 'Middle 40%', value: 38 }, { name: 'Bottom 50%', value: 12 }]
        } 
      },
      { id: 'cj-l2', title: 'Displaced People', type: 'Reading', duration: '3 min', content: { paragraphs: ["Climate refugees are forced to leave their homes due to drought, disaster, or sea level rise.", "Most climate displacement happens within countries, especially from rural to urban areas."] } },
      { id: 'cj-l3', title: 'Gender & Climate', type: 'Sociology', duration: '3 min', content: { paragraphs: ["Women are often more vulnerable to climate impacts because they are responsible for water, food, and fuel collection.", "Empowering women is one of the most effective ways to build climate resilience."] } },
      { id: 'cj-l4', title: 'Indigenous Wisdom', type: 'Reading', duration: '3 min', content: { paragraphs: ["Indigenous peoples manage 80% of the world's remaining biodiversity. Their knowledge of secret ecosystems is vital.", "Respecting land rights is fundamental to protecting the planet."] } },
      { id: 'cj-l5', title: 'The Just Transition', type: 'Summary', duration: '3 min', content: { paragraphs: ["A 'Just Transition' ensure that workers in fossil fuel industries are not left behind as we move to green energy.", "It includes reskilling, social protection, and investment in clean industries in coal regions."] } }
    ],
    quiz: [
      { question: "What is 'Climate Justice'?", options: ["Legal court for weather", "Fair outcome for all", "Punishing emissions", "Ignoring problems"], correctIndex: 1 },
      { question: "Who contributes the least to emissions but suffers most?", options: ["Rich nations", "Corporations", "Poor communities", "Scientists"], correctIndex: 2 },
      { question: "Climate displacement often results in...", options: ["Wealth growth", "Rural-to-urban migration", "More forests", "Better health"], correctIndex: 1 },
      { question: "Indigenous peoples manage what % of biodiversity?", options: ["10%", "50%", "80%", "100%"], correctIndex: 2 },
      { question: "What is a 'Just Transition'?", options: ["Switching fast", "Protecting workers", "Leaving legacy", "Strict laws"], correctIndex: 1 }
    ]
  }
];

const LOCKED_COURSES = [
  { id: 'lock-1', title: 'Biodiversity Hotspots', category: 'Environment', date: 'June 30, 2026' },
  { id: 'lock-2', title: 'Sustainable Architecture', category: 'Design', date: 'August 14, 2026' },
  { id: 'lock-3', title: 'Climate Psychology', category: 'Science', date: 'September 28, 2026' },
  { id: 'lock-4', title: 'Urban Rewilding', category: 'Lifestyle', date: 'November 12, 2026' },
  { id: 'lock-5', title: 'Renewable Storage', category: 'Tech', date: 'December 27, 2026' },
];

interface QuizViewProps {
  course: Course;
  onComplete: () => void;
  onCancel: () => void;
}

function QuizView({ course, onComplete, onCancel }: QuizViewProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleNext = () => {
    // Check answer for the current step before proceeding or ending
    const isCorrect = selectedOption === course.quiz[currentStep].correctIndex;
    const finalScore = isCorrect ? score + 1 : score;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    if (currentStep < course.quiz.length - 1) {
      setCurrentStep(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  const percentage = Math.round((score / course.quiz.length) * 100);
  const passed = percentage >= 80;

  if (showResult) {
    return (
      <div className="max-w-2xl mx-auto py-12 animate-in zoom-in-95 duration-300">
        <div className="bg-white rounded-[40px] border border-[#E5E5E1] p-12 text-center space-y-8 shadow-2xl">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto text-4xl ${passed ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
             {passed ? '🏆' : '⚠️'}
          </div>
          
          <div>
            <h2 className="text-4xl font-black text-[#1D1D1F] tracking-tighter">
              {passed ? 'Course Completed' : 'Failed the Quiz'}
            </h2>
            <p className="text-[#8E8E93] text-lg font-medium mt-2">
              Score: {percentage}%
            </p>
          </div>

          <p className="text-[#424245] font-medium leading-relaxed">
            {passed 
              ? `Congratulations! You've successfully mastered ${course.title}. You have demonstrated a deep understanding of the core concepts.`
              : `You didn't reach the 80% passing threshold for ${course.title}. Review the lessons and try again to earn your certification.`}
          </p>

          <div className="pt-4">
            <button 
              onClick={onComplete}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${passed ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-[#1D1D1F] text-white hover:bg-[#2C2C2E]'}`}
            >
              {passed ? 'Finish & Certification' : 'Back to Curriculum'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = course.quiz[currentStep];

  return (
    <div className="max-w-2xl mx-auto py-12 animate-in slide-in-from-bottom-8 duration-500">
      <div className="bg-white rounded-[40px] border border-[#E5E5E1] p-10 space-y-8 shadow-xl">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Quiz • {course.title}</span>
          <span className="text-xs font-black text-[#8E8E93] uppercase tracking-widest">Question {currentStep + 1} of {course.quiz.length}</span>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-black text-[#1D1D1F] leading-tight tracking-tight">
            {currentQuestion.question}
          </h3>

          <div className="grid gap-3">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedOption(idx)}
                className={`w-full p-6 rounded-2xl border-2 text-left font-bold transition-all ${
                  selectedOption === idx 
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                    : 'border-[#F2F2F7] hover:border-emerald-200 text-[#1D1D1F]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6 flex gap-4">
          <button 
            onClick={onCancel}
            className="flex-1 text-[#8E8E93] font-bold text-sm"
          >
            Cancel Quiz
          </button>
          <button 
            disabled={selectedOption === null}
            onClick={handleNext}
            className={`flex-[2] py-4 rounded-2xl font-bold transition-all ${
              selectedOption !== null 
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 active:scale-95' 
                : 'bg-[#F2F2F7] text-[#8E8E93] cursor-not-allowed'
            }`}
          >
            {currentStep < course.quiz.length - 1 ? 'Next Question' : 'View Results'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Academy() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    const saved = localStorage.getItem('eco_completed_lessons_v2');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleLessonComplete = (lessonId: string) => {
    setCompletedLessons(prev => {
      const next = prev.includes(lessonId) 
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId];
      localStorage.setItem('eco_completed_lessons_v2', JSON.stringify(next));
      return next;
    });
  };

  const getCourseProgress = (course: Course) => {
    const completedCount = course.lessons.filter(l => completedLessons.includes(l.id)).length;
    return Math.round((completedCount / course.lessons.length) * 100);
  };

  if (showQuiz && selectedCourse) {
    return <QuizView course={selectedCourse} onComplete={() => setShowQuiz(false)} onCancel={() => setShowQuiz(false)} />;
  }

  if (selectedLesson && selectedCourse) {
    const isDone = completedLessons.includes(selectedLesson.id);
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-24 md:pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header className="flex flex-col gap-6">
          <button 
            onClick={() => setSelectedLesson(null)} 
            className="flex items-center gap-2 text-[#8E8E93] font-bold text-sm hover:text-[#1D1D1F] transition-colors w-fit"
          >
            <ArrowLeft size={16} /> Back to {selectedCourse.title}
          </button>
          
          <div className="flex justify-between items-end">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-[#F2F2F7] text-[#8E8E93] text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest leading-none">
                  {selectedLesson.type} • {selectedLesson.duration}
                </span>
              </div>
              <h1 className="text-4xl font-black text-[#1D1D1F] tracking-tighter">{selectedLesson.title}</h1>
            </div>
            {isDone && (
              <span className="flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-full">
                <CheckCircle size={16} /> Completed
              </span>
            )}
          </div>
        </header>

        <div className="bg-white rounded-[32px] border border-[#E5E5E1] p-8 md:p-12 space-y-10 shadow-sm relative">
          {selectedLesson.content.paragraphs.map((p, i) => (
            <p key={i} className="text-xl text-[#424245] leading-relaxed font-medium">
              {p}
            </p>
          ))}

          {selectedLesson.content.table && (
            <div className="overflow-hidden rounded-2xl border border-[#F2F2F7]">
              <table className="w-full text-left">
                <thead className="bg-[#F9F9FB]">
                  <tr>
                    {selectedLesson.content.table.headers.map((h, i) => (
                      <th key={i} className="px-6 py-4 text-[11px] font-black text-[#8E8E93] uppercase tracking-widest">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2F2F7]">
                  {selectedLesson.content.table.rows.map((row, i) => (
                    <tr key={i} className="hover:bg-[#F9F9FB] transition-colors">
                      {row.map((cell, j) => (
                        <td key={j} className="px-6 py-4 text-sm font-bold text-[#1D1D1F]">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedLesson.content.graph && (
            <div className="space-y-4">
              <h4 className="text-sm font-black text-[#1D1D1F] uppercase tracking-widest flex items-center gap-2">
                <BarChart2 size={16} className="text-emerald-500" />
                Data Insights
              </h4>
              <div className="h-[300px] w-full bg-[#F9F9FB] rounded-2xl p-6 border border-[#F2F2F7]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={selectedLesson.content.graph}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E1" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#8E8E93', fontSize: 11, fontWeight: 700 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#8E8E93', fontSize: 11, fontWeight: 700 }}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                      cursor={{ fill: '#F2F2F7' }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {selectedLesson.content.graph.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#34C759' : '#007AFF'} fillOpacity={0.8} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div className="pt-10 border-t border-[#F2F2F7] flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isDone ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-600'}`}>
                <CheckCircle size={24} />
              </div>
              <div>
                <p className="text-sm font-black text-[#1D1D1F]">{isDone ? 'Lesson Completed' : 'Mark Lesson as Done'}</p>
                <p className="text-xs text-[#8E8E93] font-medium tracking-tight">Focus on consistent learning</p>
              </div>
            </div>
            <button 
              onClick={() => {
                if (!isDone) toggleLessonComplete(selectedLesson.id);
                setSelectedLesson(null);
              }}
              className="bg-[#1D1D1F] text-white px-8 py-3 rounded-2xl font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-black/10"
            >
              {isDone ? 'Return to Module' : 'Complete & Continue'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedCourse) {
    const progress = getCourseProgress(selectedCourse);
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-24 md:pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header className="flex flex-col gap-6">
          <button 
            onClick={() => setSelectedCourse(null)} 
            className="flex items-center gap-2 text-[#8E8E93] font-bold text-sm hover:text-[#1D1D1F] transition-colors w-fit"
          >
            <ArrowLeft size={16} /> All Courses
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-xl">
              <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest mb-4 inline-block">
                {selectedCourse.category}
              </span>
              <h1 className="text-5xl font-black text-[#1D1D1F] tracking-tighter mb-4 leading-none">{selectedCourse.title}</h1>
              <p className="text-[#8E8E93] text-xl font-medium leading-relaxed">{selectedCourse.description}</p>
            </div>
            <div className="bg-white p-6 rounded-[32px] border border-[#E5E5E1] shadow-sm flex flex-col items-center min-w-[160px]">
              <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center mb-2 ${progress === 100 ? 'border-emerald-500' : 'border-[#F2F2F7] border-t-emerald-500'}`}>
                <span className="text-xl font-black text-[#1D1D1F]">{progress}%</span>
              </div>
              <p className="text-[10px] font-black text-[#8E8E93] uppercase tracking-widest">Mastery</p>
            </div>
          </div>
        </header>

        <div className="space-y-4">
          <h2 className="text-sm font-black text-[#1D1D1F] uppercase tracking-widest px-1">Curriculum</h2>
          <div className="grid gap-3">
            {selectedCourse.lessons.map((lesson, idx) => {
              const isDone = completedLessons.includes(lesson.id);
              return (
                <button
                  key={lesson.id}
                  onClick={() => setSelectedLesson(lesson)}
                  className={`w-full p-6 rounded-[24px] border flex items-center justify-between group transition-all ${isDone ? 'bg-emerald-50/30 border-emerald-100' : 'bg-white border-[#E5E5E1] hover:border-emerald-500'}`}
                >
                  <div className="flex items-center gap-6 text-left">
                    <div className={`text-2xl font-black italic transition-colors w-8 ${isDone ? 'text-emerald-200' : 'text-[#F2F2F7]'}`}>
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#1D1D1F] tracking-tight">{lesson.title}</h3>
                      <div className="flex items-center gap-3 text-[11px] font-bold text-[#8E8E93] uppercase tracking-widest mt-1">
                        <span><Clock size={12} className="inline mr-1" /> {lesson.duration}</span>
                        {isDone && <span className="text-emerald-600 font-black tracking-normal flex items-center gap-1"><CheckCircle size={10} /> DONE</span>}
                      </div>
                    </div>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm ${isDone ? 'bg-emerald-500 text-white' : 'bg-[#F9F9FB] text-[#8E8E93] group-hover:bg-emerald-500 group-hover:text-white'}`}>
                    <PlayCircle size={20} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className={`rounded-[32px] p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative transition-all ${progress === 100 ? 'bg-[#1D1D1F] text-white shadow-xl' : 'bg-emerald-500 text-white'}`}>
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 text-center md:text-left">
            <h4 className="text-2xl font-black tracking-tighter mb-2">Final Certification</h4>
            <p className="text-white/80 font-medium max-w-sm">
              {progress === 100 ? "Congratulations! You've unlocked the final assessment." : "Complete all 5 lessons to unlock the course certification."}
            </p>
          </div>
          <div className="relative z-10 w-full md:w-auto">
            <button 
              onClick={() => progress === 100 && setShowQuiz(true)}
              disabled={progress < 100} 
              className={`w-full md:w-auto py-4 px-10 rounded-2xl font-bold text-sm transition-all ${progress === 100 ? 'bg-emerald-500 text-white hover:scale-105 active:scale-95 shadow-lg' : 'bg-white/20 backdrop-blur-md text-white opacity-60 cursor-not-allowed border border-white/10'}`}
            >
              {progress === 100 ? 'Take Final Quiz' : 'Locked'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24 md:pb-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <Link to="/" className="flex items-center gap-2 text-[#8E8E93] font-black text-[10px] mb-6 hover:text-[#E1FF01] transition-colors uppercase tracking-[0.2em] group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-2 mb-3">
             <div className="w-4 h-1 bg-[#E1FF01] rounded-full" />
             <span className="text-[10px] font-black text-[#8E8E93] uppercase tracking-[0.4em]">Knowledge Repository</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
            Climora <span className="text-[#E1FF01]">Academy</span>
          </h1>
          <p className="text-[#8E8E93] text-sm font-bold uppercase tracking-widest mt-6 opacity-60">Expand your eco-consciousness through structured modules.</p>
        </div>
      </header>

      <div className="space-y-6">
        <h2 className="text-sm font-black text-[#1D1D1F] uppercase tracking-widest px-1">Active Modules (10)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ACADEMY_DATA.map((course) => {
            const progress = getCourseProgress(course);
            return (
              <button 
                key={course.id} 
                onClick={() => setSelectedCourse(course)}
                className="group bg-white rounded-[32px] border border-[#E5E5E1] overflow-hidden flex flex-col hover:border-emerald-500 transition-all hover:shadow-xl hover:shadow-black/5 text-left active:scale-[0.98]"
              >
                <div className="h-40 bg-[#1D1D1F] relative flex items-center justify-center group-hover:bg-[#2C2C2E] transition-colors">
                   <BookOpen size={48} className="text-white/10 group-hover:scale-110 transition-transform duration-500" />
                   <div className="absolute top-4 right-4">
                     <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-1 rounded shadow-lg uppercase tracking-[0.15em]">
                       {course.category}
                     </span>
                   </div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-xl font-black text-[#1D1D1F] tracking-tight mb-4 leading-tight group-hover:text-emerald-600 transition-colors h-14 line-clamp-2">
                    {course.title}
                  </h3>
                  
                  <div className="mt-auto space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-[#8E8E93] uppercase tracking-widest">Progress</span>
                      <span className="text-xs font-black text-[#1D1D1F]">{progress}%</span>
                    </div>
                    <div className="h-1.5 bg-[#F2F2F7] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-emerald-500 rounded-full" 
                      />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-6 pt-10 border-t border-[#F2F2F7]">
        <h2 className="text-sm font-black text-[#1D1D1F] uppercase tracking-widest px-1">Upcoming Content (5)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {LOCKED_COURSES.map((course) => (
            <div key={course.id} className="bg-[#F9F9FB] rounded-3xl border border-dashed border-[#E5E5E1] p-6 text-center group cursor-not-allowed">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#8E8E93] mx-auto mb-4 border border-[#F2F2F7]">
                🔒
              </div>
              <h4 className="text-sm font-bold text-[#1D1D1F] mb-1">{course.title}</h4>
              <p className="text-[10px] font-black text-[#8E8E93] uppercase tracking-widest mb-4">{course.category}</p>
              <div className="text-[11px] font-bold text-emerald-600 bg-emerald-50 py-1.5 rounded-full">
                Unlocks {course.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
