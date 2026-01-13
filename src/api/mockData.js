// Mock data for CRM application
// This layer can be easily replaced with real API calls

export const mockUsers = [
  { id: 1, name: 'Salsabeel Khaleel', initials: 'SK', role: 'manager', email: 'salsabeel.khaleel@example.com' },
  { id: 2, name: 'Sarah Jenkins', initials: 'SJ', role: 'salesman', email: 'sarah.jenkins@example.com' },
  { id: 3, name: 'David Miller', initials: 'DM', role: 'operator', email: 'david.miller@example.com' },
  { id: 4, name: 'Natalia Sung', initials: 'NS', role: 'operator', email: 'natalia.sung@example.com' }
]

// Customers are the top-level entity - independent contact data
export const mockCustomers = [
  { 
    id: 1, 
    name: 'Josh Adams', 
    initials: 'JA', 
    email: 'josh.adams@example.com', 
    phone: '+4901564879300', 
    address: 'Via Torino 56, 20123 Milan', 
    company: null, 
    source: 'Google Ads', 
    tags: ['Premium', 'Automation'], 
    createdAt: '2025-03-21T08:17:00', 
    lastContact: '2025-03-25T14:30:00',
    summary: 'Prefers premium SUVs and crossovers, particularly Audi models. Highly responsive to WhatsApp messages during morning hours (8-11 AM). Decision-maker who values detailed specifications and technical data. Has shown interest in automation features and driver assistance systems. Budget range: €50,000-€80,000. Prefers to schedule appointments mid-week.',
    preferredVehicleType: 'SUV',
    preferredChannel: 'WhatsApp',
    preferredContactTime: 'Mornings (8-11 AM)',
    budgetRange: '€50K-€80K'
  },
  { 
    id: 2, 
    name: 'Emma Watson', 
    initials: 'EW', 
    email: 'emma.watson@example.com', 
    phone: '+4901234567890', 
    address: 'Hauptstraße 12, 10115 Berlin', 
    company: null, 
    source: 'Google Ads', 
    tags: [], 
    createdAt: '2025-03-20T10:15:00', 
    lastContact: '2025-03-24T16:20:00',
    summary: 'First-time car buyer looking for reliable, fuel-efficient vehicles. Prefers email communication for detailed information but responds well to phone calls after 5 PM. Takes time to make decisions and appreciates follow-up with comparison data. Interested in compact sedans and hatchbacks. Budget-conscious, range: €20,000-€35,000. Values safety features highly.',
    preferredVehicleType: 'Sedan',
    preferredChannel: 'Email',
    preferredContactTime: 'Evenings (after 5 PM)',
    budgetRange: '€20K-€35K'
  },
  { 
    id: 3, 
    name: 'Liam Johnson', 
    initials: 'LJ', 
    email: 'liam.johnson@example.com', 
    phone: '+4901567891234', 
    address: 'Unter den Linden 45, 10117 Berlin', 
    company: null, 
    source: 'Google Ads', 
    tags: [], 
    createdAt: '2025-03-19T13:52:00', 
    lastContact: '2025-03-19T13:52:00',
    summary: 'Young professional interested in sporty coupes and performance vehicles. Very active on social media and prefers quick communication via SMS or WhatsApp. Available mostly on weekends. Has trade-in potential (owns a 2019 VW Golf). Fast decision-maker when the right deal is presented. Budget: €35,000-€50,000.',
    preferredVehicleType: 'Coupe',
    preferredChannel: 'SMS',
    preferredContactTime: 'Weekends',
    budgetRange: '€35K-€50K'
  },
  { 
    id: 4, 
    name: 'Sophie Mueller', 
    initials: 'SM', 
    email: 'sophie.mueller@example.com', 
    phone: '+4901678912345', 
    address: 'Maximilianstraße 10, 80539 Munich', 
    company: null, 
    source: 'Google Ads', 
    tags: ['Premium'], 
    createdAt: '2025-03-16T10:00:00', 
    lastContact: '2025-03-24T14:00:00',
    summary: 'Premium segment buyer with strong preference for BMW and Mercedes. Best reached by phone during lunch hours (12-2 PM). Appreciates personalized service and exclusive offers. Family of 4, looking for spacious SUVs with luxury features. Previous customer with excellent payment history. Budget: €80,000+. Low price sensitivity, high service expectations.',
    preferredVehicleType: 'SUV',
    preferredChannel: 'Phone',
    preferredContactTime: 'Lunch hours (12-2 PM)',
    budgetRange: '€80K+'
  },
  { 
    id: 5, 
    name: 'Marco Rossi', 
    initials: 'MR', 
    email: 'marco.rossi@example.com', 
    phone: '+393401234567', 
    address: 'Via della Repubblica 25, 50123 Florence', 
    company: null, 
    source: 'Facebook', 
    tags: [], 
    createdAt: '2025-03-18T09:00:00', 
    lastContact: '2025-03-25T12:00:00',
    summary: 'Referred by existing customer. Interested in Italian brands (Alfa Romeo, Fiat). Prefers face-to-face meetings and test drives. Available mainly in early mornings (7-9 AM) before work. Loyal customer type who values long-term relationships. Looking for family vehicles with good fuel economy. Budget: €30,000-€45,000. Open to financing options.',
    preferredVehicleType: 'Minivan',
    preferredChannel: 'Phone',
    preferredContactTime: 'Early mornings (7-9 AM)',
    budgetRange: '€30K-€45K'
  },
  { 
    id: 6, 
    name: 'Klaus Schmidt', 
    initials: 'KS', 
    email: 'klaus.schmidt@example.com', 
    phone: '+4901789123456', 
    address: 'Friedrichstraße 100, 10117 Berlin', 
    company: null, 
    source: 'Google Ads', 
    tags: [], 
    createdAt: '2025-03-06T10:00:00', 
    lastContact: '2025-03-23T14:00:00',
    summary: 'Business professional looking for reliable sedan for daily commute. Prefers email communication and detailed specifications. Interested in mid-range vehicles with good fuel economy. Budget: €30,000-€45,000. Available for test drives on weekends.'
  },
  { 
    id: 7, 
    name: 'Anna Becker', 
    initials: 'AB', 
    email: 'anna.becker@example.com', 
    phone: '+4901890234567', 
    address: 'Reeperbahn 50, 20359 Hamburg', 
    company: null, 
    source: 'Google Ads', 
    tags: [], 
    createdAt: '2025-03-13T10:00:00', 
    lastContact: '2025-03-24T15:00:00',
    summary: 'Family-oriented buyer seeking spacious vehicle for family of 4. Values safety features and cargo space. Prefers phone calls during business hours. Interested in SUVs and minivans. Budget: €35,000-€50,000. Decision-maker who values practical features over luxury.'
  },
  { 
    id: 8, 
    name: 'Thomas Weber', 
    initials: 'TW', 
    email: 'thomas.weber@example.com', 
    phone: '+4901901345678', 
    address: 'Königsallee 60, 40212 Düsseldorf', 
    company: null, 
    source: 'Walk-in', 
    tags: [], 
    createdAt: '2025-03-01T10:00:00', 
    lastContact: '2025-03-22T10:00:00',
    summary: 'Executive looking for premium sedan for business use. Prefers in-person meetings and detailed walkthroughs. Interested in German luxury brands. Budget: €60,000-€80,000. Values prestige and advanced technology features.'
  },
  { 
    id: 9, 
    name: 'Julia Fischer', 
    initials: 'JF', 
    email: 'julia.fischer@example.com', 
    phone: '+4901912456789', 
    address: 'Ludwigstraße 15, 70173 Stuttgart', 
    company: null, 
    source: 'Google Ads', 
    tags: [], 
    createdAt: '2025-03-19T10:00:00', 
    lastContact: '2025-03-25T09:00:00',
    summary: 'Young professional interested in compact cars with modern technology. Prefers email for initial contact, phone for follow-ups. Interested in electric and hybrid vehicles. Budget: €25,000-€40,000. Environmentally conscious buyer.'
  },
  { 
    id: 10, 
    name: 'Michael Hoffmann', 
    initials: 'MH', 
    email: 'michael.hoffmann@example.com', 
    phone: '+4901923567890', 
    address: 'Marienplatz 8, 80331 Munich', 
    company: null, 
    source: 'Facebook', 
    tags: [], 
    createdAt: '2025-03-14T10:00:00', 
    lastContact: '2025-03-24T16:00:00',
    summary: 'Referred customer interested in mid-size SUVs. Prefers phone communication during evenings. Looking for reliable vehicle with good resale value. Budget: €40,000-€55,000. Values long-term ownership and maintenance costs.'
  },
  { 
    id: 11, 
    name: 'Laura Zimmermann', 
    initials: 'LZ', 
    email: 'laura.zimmermann@example.com', 
    phone: '+4901934678901', 
    address: 'Kurfürstendamm 100, 10709 Berlin', 
    company: null, 
    source: 'Walk-in', 
    tags: ['Urgent'], 
    createdAt: '2025-03-09T10:00:00', 
    lastContact: '2025-03-25T06:00:00',
    summary: 'Urgent buyer - needs vehicle within 2 weeks. Single mother of 2, prioritizes safety and practicality over luxury. Prefers compact SUVs or minivans with good cargo space. Best reached by phone during school hours (9 AM-3 PM). Price-sensitive but willing to pay for essential safety features. Looking for financing options. Budget: €25,000-€35,000. Responds well to empathetic, solution-focused approach.',
    preferredVehicleType: 'SUV',
    preferredChannel: 'Phone',
    preferredContactTime: 'School hours (9 AM-3 PM)',
    budgetRange: '€25K-€35K'
  },
  { 
    id: 12, 
    name: 'Stefan Braun', 
    initials: 'SB', 
    email: 'stefan.braun@example.com', 
    phone: '+4901945789012', 
    address: 'Elbchaussee 200, 22605 Hamburg', 
    company: null, 
    source: 'Google Ads', 
    tags: [], 
    createdAt: '2025-03-03T10:00:00', 
    lastContact: '2025-03-25T00:00:00',
    summary: 'Active buyer interested in performance vehicles. Prefers WhatsApp for quick communication. Looking for sporty sedans or coupes. Budget: €45,000-€65,000. Values driving dynamics and engine performance.'
  },
  { 
    id: 13, 
    name: 'Nina Keller', 
    initials: 'NK', 
    email: 'nina.keller@example.com', 
    phone: '+4901956890123', 
    address: 'Bahnhofstraße 45, 60329 Frankfurt', 
    company: null, 
    source: 'Facebook', 
    tags: ['VIP', 'Urgent'], 
    createdAt: '2025-03-25T06:00:00', 
    lastContact: '2025-03-25T07:00:00',
    summary: 'VIP referral - high-priority lead. Fashion industry professional with refined taste. Interested in premium compact vehicles (Mini Cooper, Audi A3, BMW 1 Series) with stylish design. Very busy schedule - prefers text/SMS for quick updates, video calls for detailed discussions. Available mostly late evenings (8-10 PM). Fast decision-maker when presented with exclusive options. Budget: €40,000-€60,000. Values unique customization options.',
    preferredVehicleType: 'Compact',
    preferredChannel: 'SMS',
    preferredContactTime: 'Late evenings (8-10 PM)',
    budgetRange: '€40K-€60K'
  },
  { 
    id: 14, 
    name: 'Oliver Lang', 
    initials: 'OL', 
    email: 'oliver.lang@example.com', 
    phone: '+4901967901234', 
    address: 'Schillerstraße 30, 70173 Stuttgart', 
    company: null, 
    source: 'Google Ads', 
    tags: [], 
    createdAt: '2025-03-25T00:00:00', 
    lastContact: '2025-03-25T04:00:00',
    summary: 'Tech professional interested in electric vehicles. Prefers email communication and detailed technical specifications. Looking for modern EVs with long range. Budget: €40,000-€60,000. Values innovation and sustainability.'
  },
  { 
    id: 15, 
    name: 'Petra Schulz', 
    initials: 'PS', 
    email: 'petra.schulz@example.com', 
    phone: '+4901978012345', 
    address: 'Alexanderplatz 5, 10178 Berlin', 
    company: null, 
    source: 'Walk-in', 
    tags: ['Hot'], 
    createdAt: '2025-03-20T10:00:00', 
    lastContact: '2025-03-22T10:00:00',
    summary: 'Hot lead interested in compact luxury vehicles. Prefers phone calls during business hours. Looking for premium compact cars with stylish design. Budget: €35,000-€50,000. Fast decision-maker when presented with right options.'
  },
  { 
    id: 16, 
    name: 'Robert Klein', 
    initials: 'RK', 
    email: 'robert.klein@example.com', 
    phone: '+4901989123456', 
    address: 'Hafenstraße 80, 20359 Hamburg', 
    company: 'Klein GmbH', 
    source: 'Google Ads', 
    tags: ['Corporate'], 
    createdAt: '2025-03-19T10:00:00', 
    lastContact: '2025-03-19T10:00:00',
    summary: 'Corporate buyer looking for fleet vehicles for company executives. Prefers email for proposals and documentation. Interested in executive sedans with professional appearance. Budget: €50,000-€70,000 per vehicle. Requires detailed proposals and TCO analysis.'
  },
  { 
    id: 17, 
    name: 'Sabine Vogel', 
    initials: 'SV', 
    email: 'sabine.vogel@example.com', 
    phone: '+4901990234567', 
    address: 'Goethestraße 25, 60313 Frankfurt', 
    company: null, 
    source: 'Walk-in', 
    tags: [], 
    createdAt: '2025-03-24T10:00:00', 
    lastContact: '2025-03-25T03:00:00',
    summary: 'Family buyer seeking reliable vehicle for daily use. Prefers phone communication. Interested in practical vehicles with good fuel economy. Budget: €25,000-€40,000. Values reliability and low maintenance costs.'
  },
  { 
    id: 18, 
    name: 'Dr. Andreas Werner', 
    initials: 'AW', 
    email: 'andreas.werner@example.com', 
    phone: '+4902001345678', 
    address: 'Königsallee 25, 40212 Düsseldorf', 
    company: 'Werner Medical GmbH', 
    source: 'Facebook', 
    tags: ['VIP', 'Referral', 'Premium', 'High-Value'], 
    createdAt: '2025-03-25T04:00:00', 
    lastContact: '2025-03-25T06:00:00',
    summary: 'VIP customer. Medical professional with busy schedule - best reached via email for initial contact, then phone after 6 PM. Extremely high standards and expects white-glove service. Interested in luxury sedans and executive vehicles (Mercedes S-Class, BMW 7 Series, Audi A8). Company car purchase potential. Budget: €100,000+. Values discretion, punctuality, and efficiency. Quick decision-maker when properly presented.',
    preferredVehicleType: 'Sedan',
    preferredChannel: 'Email',
    preferredContactTime: 'Evenings (after 6 PM)',
    budgetRange: '€100K+'
  },
  { 
    id: 19, 
    name: 'Christina Bauer', 
    initials: 'CB', 
    email: 'christina.bauer@example.com', 
    phone: '+4902012456789', 
    address: 'Leopoldstraße 50, 80802 Munich', 
    company: 'Bauer Consulting AG', 
    source: 'Google Ads', 
    tags: ['Corporate', 'Urgent'], 
    createdAt: '2025-03-23T10:00:00', 
    lastContact: '2025-03-25T07:00:00',
    summary: 'Corporate fleet buyer for consulting firm. Looking to purchase 3-5 vehicles for company executives. Prefers professional, executive sedans (Audi A6, BMW 5 Series, Mercedes E-Class). Email preferred for initial proposals and documentation, phone for negotiations. Available weekdays 9 AM-5 PM. Decision involves board approval - requires detailed proposals with TCO analysis. Budget: €50,000-€70,000 per vehicle. Long sales cycle but high-value opportunity.',
    preferredVehicleType: 'Sedan',
    preferredChannel: 'Email',
    preferredContactTime: 'Business hours (9 AM-5 PM)',
    budgetRange: '€50K-€70K per vehicle'
  },
  { 
    id: 20, 
    name: 'Martin Richter', 
    initials: 'MR', 
    email: 'martin.richter@example.com', 
    phone: '+4902023567890', 
    address: 'Mönckebergstraße 15, 20095 Hamburg', 
    company: null, 
    source: 'Walk-in', 
    tags: ['Performance', 'Hot'], 
    createdAt: '2025-03-21T10:00:00', 
    lastContact: '2025-03-24T10:00:00',
    summary: 'Performance enthusiast. Hot lead interested in sports cars and high-performance vehicles. Highly engaged and knowledgeable about specs. Prefers WhatsApp for quick questions and phone calls for serious discussions. Available mainly on weekends for test drives. Has active trade-in (Porsche 911). Looking to upgrade. Budget: €120,000+. Impulse buyer when excited about the vehicle.',
    preferredVehicleType: 'Sports Car',
    preferredChannel: 'WhatsApp',
    preferredContactTime: 'Weekends',
    budgetRange: '€120K+'
  },
  { 
    id: 21, 
    name: 'Emma Wilson', 
    initials: 'EW', 
    email: 'emma.wilson@example.com', 
    phone: '+4901987654321', 
    address: 'Via Garibaldi 10, 50123 Firenze', 
    company: null, 
    source: 'Google Ads', 
    tags: ['Premium'], 
    createdAt: '2025-03-24T10:00:00', 
    lastContact: '2025-03-24T10:00:00',
    summary: 'Premium buyer interested in luxury vehicles. Prefers email communication and detailed information. Looking for high-end sedans or SUVs with premium features. Budget: €70,000-€100,000. Values quality, comfort, and brand prestige.'
  },
  { 
    id: 22, 
    name: 'Daniel Kim', 
    initials: 'DK', 
    email: 'daniel.kim@example.com', 
    phone: '+4901777888999', 
    address: 'Via Roma 15, 20121 Milano', 
    company: null, 
    source: 'Google Ads', 
    tags: [], 
    createdAt: '2024-12-10T09:00:00', 
    lastContact: '2024-12-18T10:00:00',
    summary: 'Professional looking for reliable mid-size vehicle. Prefers phone communication during business hours. Interested in sedans with good fuel economy. Budget: €35,000-€50,000. Values reliability and resale value.'
  },
  { 
    id: 23, 
    name: 'Robert Taylor', 
    initials: 'RT', 
    email: 'robert.taylor@example.com', 
    phone: '+4901888999000', 
    address: 'Via Garibaldi 20, 50123 Firenze', 
    company: null, 
    source: 'Google Ads', 
    tags: [], 
    createdAt: '2024-12-05T10:00:00', 
    lastContact: '2024-12-15T11:00:00',
    summary: 'Family buyer seeking spacious vehicle for long trips. Prefers email for initial contact. Interested in SUVs or minivans with good cargo space. Budget: €40,000-€60,000. Values comfort and safety features.'
  },
  { 
    id: 24, 
    name: 'Daniel Kim', 
    initials: 'DK', 
    email: 'daniel.kim@example.com', 
    phone: '+4901777888999', 
    address: 'Via Roma 15, 20121 Milano', 
    company: null, 
    source: 'Google Ads', 
    tags: [], 
    createdAt: '2024-12-12T11:00:00', 
    lastContact: '2024-12-18T10:00:00',
    summary: 'Repeat inquiry from same customer. Still interested in mid-size sedans. Prefers phone communication. Budget: €35,000-€50,000. Looking for best value proposition.'
  },
  { 
    id: 25, 
    name: 'Janice Litman', 
    initials: 'JL', 
    email: 'janice.litman@example.com', 
    phone: '+4901888999000', 
    address: 'Alexanderstraße 10, 10178 Berlin', 
    company: null, 
    source: 'Google Ads', 
    tags: [], 
    createdAt: '2024-12-08T10:00:00', 
    lastContact: '2024-12-20T14:00:00',
    summary: 'Urban professional interested in compact vehicles. Prefers email communication. Looking for efficient city cars with modern technology. Budget: €25,000-€40,000. Values fuel economy and parking ease.'
  },
  { 
    id: 26, 
    name: 'Michael Brown', 
    initials: 'MB', 
    email: 'michael.brown@example.com', 
    phone: '+4901999000111', 
    address: 'Via Dante 5, 20121 Milano', 
    company: null, 
    source: 'Google Ads', 
    tags: [], 
    createdAt: '2024-12-07T10:00:00', 
    lastContact: '2024-12-20T15:00:00',
    summary: 'Business owner looking for reliable vehicle for business and personal use. Prefers phone calls. Interested in executive sedans. Budget: €45,000-€65,000. Values professionalism and reliability.'
  },
  { 
    id: 27, 
    name: 'Sarah Johnson', 
    initials: 'SJ', 
    email: 'sarah.johnson@example.com', 
    phone: '+4901111222333', 
    address: 'Via Manzoni 10, 20121 Milano', 
    company: null, 
    source: 'Google Ads', 
    tags: [], 
    createdAt: '2024-12-06T10:00:00', 
    lastContact: '2024-12-20T16:00:00',
    summary: 'Young professional interested in sporty vehicles. Prefers WhatsApp for quick communication. Looking for coupes or sporty sedans. Budget: €30,000-€50,000. Values style and performance.'
  },
  { 
    id: 28, 
    name: 'Thomas Anderson', 
    initials: 'TA', 
    email: 'thomas.anderson@example.com', 
    phone: '+4901222333444', 
    address: 'Via Verdi 8, 20121 Milano', 
    company: null, 
    source: 'Google Ads', 
    tags: [], 
    createdAt: '2024-12-05T10:00:00', 
    lastContact: '2024-12-20T17:00:00',
    summary: 'Family buyer seeking practical vehicle. Prefers email communication. Interested in reliable sedans or SUVs. Budget: €30,000-€45,000. Values safety and reliability.'
  },
  { 
    id: 29, 
    name: 'Emily Davis', 
    initials: 'ED', 
    email: 'emily.davis@example.com', 
    phone: '+4901999000222', 
    address: 'Via Dante 6, 20121 Milano', 
    company: null, 
    source: 'Google Ads', 
    tags: [], 
    createdAt: '2024-12-04T10:00:00', 
    lastContact: '2024-12-20T18:00:00',
    summary: 'First-time buyer looking for entry-level vehicle. Prefers phone communication. Interested in compact cars with good value. Budget: €20,000-€35,000. Values affordability and fuel economy.'
  },
  // Additional customers from opportunities (reassigned IDs to avoid conflicts)
  { 
    id: 30, 
    name: 'Sophia Martinez', 
    initials: 'SM', 
    email: 'sophia.martinez@example.com', 
    phone: '+4901555666777', 
    address: 'Piazza Navona 8, 00186 Roma', 
    company: null, 
    source: 'Google Ads', 
    tags: [], 
    createdAt: '2025-03-01T09:00:00', 
    lastContact: '2025-03-25T11:30:00',
    summary: 'Premium buyer interested in luxury electric vehicles. Prefers email communication and detailed specifications. Looking for high-end EVs with long range. Budget: €80,000-€120,000. Values innovation and sustainability.'
  },
  { 
    id: 31, 
    name: 'Alexander Chen', 
    initials: 'AC', 
    email: 'alexander.chen@example.com', 
    phone: '+4901999888777', 
    address: 'Via Montenapoleone 3, 20121 Milano', 
    company: null, 
    source: 'Google Ads', 
    tags: ['Premium'], 
    createdAt: '2025-03-16T10:00:00', 
    lastContact: '2025-03-16T10:00:00',
    summary: 'High-end buyer looking for luxury vehicles. Prefers phone communication. Interested in premium sedans and SUVs. Budget: €90,000-€150,000. Values exclusivity and advanced features.'
  },
  { 
    id: 32, 
    name: 'Lisa Anderson', 
    initials: 'LA', 
    email: 'lisa.anderson@example.com', 
    phone: '+4901555123456', 
    address: 'Marienplatz 5, 80331 München', 
    company: null, 
    source: 'Google Ads', 
    tags: [], 
    createdAt: '2024-12-20T10:00:00', 
    lastContact: '2024-12-20T10:00:00',
    summary: 'Professional seeking reliable mid-size vehicle. Prefers email communication. Interested in practical sedans with good fuel economy. Budget: €35,000-€50,000. Values reliability and efficiency.'
  },
  { 
    id: 33, 
    name: 'James White', 
    initials: 'JW', 
    email: 'james.white@example.com', 
    phone: '+4901999887766', 
    address: 'Schildergasse 18, 50667 Köln', 
    company: null, 
    source: 'Google Ads', 
    tags: ['Premium'], 
    createdAt: '2024-12-15T11:00:00', 
    lastContact: '2024-12-20T14:00:00',
    summary: 'Executive buyer interested in premium vehicles. Prefers phone communication during business hours. Looking for luxury sedans with advanced technology. Budget: €70,000-€100,000. Values prestige and comfort.'
  },
  { 
    id: 34, 
    name: 'Maria Garcia', 
    initials: 'MG', 
    email: 'maria.garcia@example.com', 
    phone: '+4901444555666', 
    address: 'Königsallee 70, 40212 Düsseldorf', 
    company: null, 
    source: 'Google Ads', 
    tags: [], 
    createdAt: '2024-12-18T10:00:00', 
    lastContact: '2024-12-25T15:00:00',
    summary: 'Family buyer seeking spacious vehicle. Prefers email communication. Interested in SUVs with good cargo space. Budget: €40,000-€60,000. Values safety and practicality.'
  },
  { 
    id: 35, 
    name: 'Jennifer Lee', 
    initials: 'JL', 
    email: 'jennifer.lee@example.com', 
    phone: '+4901888777666', 
    address: 'Zeil 90, 60313 Frankfurt am Main', 
    company: null, 
    source: 'Google Ads', 
    tags: ['Automation'], 
    createdAt: '2024-12-10T09:00:00', 
    lastContact: '2024-12-20T14:00:00',
    summary: 'Tech-savvy buyer interested in vehicles with advanced automation features. Prefers email communication. Looking for modern vehicles with driver assistance systems. Budget: €45,000-€70,000. Values innovation and safety technology.'
  },
  { 
    id: 36, 
    name: 'Ross Geller', 
    initials: 'RG', 
    email: 'ross.geller@example.com', 
    phone: '+4901222333444', 
    address: 'Unter den Linden 77, 10117 Berlin', 
    company: null, 
    source: 'Google Ads', 
    tags: [], 
    createdAt: '2024-12-03T10:00:00', 
    lastContact: '2024-12-20T11:00:00',
    summary: 'Professional looking for reliable vehicle for daily commute. Prefers phone communication. Interested in mid-size sedans. Budget: €30,000-€45,000. Values fuel economy and reliability.'
  },
  { 
    id: 37, 
    name: 'Rachel Green', 
    initials: 'RG', 
    email: 'rachel.green@example.com', 
    phone: '+4901333444555', 
    address: 'Alexanderplatz 1, 10178 Berlin', 
    company: null, 
    source: 'Google Ads', 
    tags: [], 
    createdAt: '2024-12-02T10:00:00', 
    lastContact: '2024-12-20T12:00:00',
    summary: 'Urban professional interested in compact luxury vehicles. Prefers email communication. Looking for stylish compact cars with premium features. Budget: €35,000-€55,000. Values style and brand image.'
  },
  // New customers with only contact data (no leads or opportunities yet)
  {
    id: 38,
    name: 'Alexandra Petrov',
    initials: 'AP',
    email: 'alexandra.petrov@example.com',
    phone: '+4901555666888',
    address: 'Potsdamer Platz 1, 10785 Berlin',
    company: null,
    source: 'Walk-in',
    tags: [],
    createdAt: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 2) // Created 2 hours ago
      return date.toISOString()
    })(),
    lastContact: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 2)
      return date.toISOString()
    })()
  },
  {
    id: 39,
    name: 'Marcus Schneider',
    initials: 'MS',
    email: 'marcus.schneider@example.com',
    phone: '+4901666777888',
    address: 'Neue Straße 15, 70173 Stuttgart',
    company: 'Schneider Tech Solutions',
    source: 'Immo-scout',
    tags: ['Corporate'],
    createdAt: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 5) // Created 5 hours ago
      return date.toISOString()
    })(),
    lastContact: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 5)
      return date.toISOString()
    })()
  },
  {
    id: 40,
    name: 'Isabella Rodriguez',
    initials: 'IR',
    email: 'isabella.rodriguez@example.com',
    phone: '+4901777888999',
    address: 'Maximilianstraße 25, 80539 Munich',
    company: null,
    source: 'Facebook',
    tags: [],
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1) // Created yesterday
      date.setHours(14, 0, 0, 0)
      return date.toISOString()
    })(),
    lastContact: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      date.setHours(14, 0, 0, 0)
      return date.toISOString()
    })()
  },
  {
    id: 41,
    name: 'Felix Müller',
    initials: 'FM',
    email: 'felix.mueller@example.com',
    phone: '+4901888999000',
    address: 'Königsallee 80, 40212 Düsseldorf',
    company: null,
    source: 'Instagram',
    tags: [],
    createdAt: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 3) // Created 3 hours ago
      return date.toISOString()
    })(),
    lastContact: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 3)
      return date.toISOString()
    })()
  },
  {
    id: 42,
    name: 'Sofia Andersson',
    initials: 'SA',
    email: 'sofia.andersson@example.com',
    phone: '+4901999000111',
    address: 'Reeperbahn 75, 20359 Hamburg',
    company: null,
    source: 'Google Ads',
    tags: [],
    createdAt: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 1) // Created 1 hour ago
      return date.toISOString()
    })(),
    lastContact: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 1)
      return date.toISOString()
    })()
  },
  {
    id: 43,
    name: 'Lucas Bergmann',
    initials: 'LB',
    email: 'lucas.bergmann@example.com',
    phone: '+4901111222333',
    address: 'Bahnhofstraße 30, 60329 Frankfurt',
    company: null,
    source: 'Walk-in',
    tags: [],
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1) // Created yesterday
      date.setHours(10, 0, 0, 0)
      return date.toISOString()
    })(),
    lastContact: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      date.setHours(10, 0, 0, 0)
      return date.toISOString()
    })()
  },
  {
    id: 44,
    name: 'Elena Kowalski',
    initials: 'EK',
    email: 'elena.kowalski@example.com',
    phone: '+4901222333444',
    address: 'Via del Corso 120, 00186 Roma',
    company: null,
    source: 'Immo-scout',
    tags: [],
    createdAt: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 4) // Created 4 hours ago
      return date.toISOString()
    })(),
    lastContact: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 4)
      return date.toISOString()
    })()
  },
  {
    id: 45,
    name: 'Niklas Johansson',
    initials: 'NJ',
    email: 'niklas.johansson@example.com',
    phone: '+4901333444555',
    address: 'Schildergasse 25, 50667 Köln',
    company: 'Johansson Consulting',
    source: 'Facebook',
    tags: ['Corporate'],
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1) // Created yesterday
      date.setHours(16, 0, 0, 0)
      return date.toISOString()
    })(),
    lastContact: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      date.setHours(16, 0, 0, 0)
      return date.toISOString()
    })()
  }
]

export const mockLeads = [
  {
    id: 1,
    customerId: 1,
    status: 'Open',
    priority: 'Hot',
    requestedCar: { 
      brand: 'Audi', 
      model: 'A6 Allroad', 
      year: 2023, 
      price: 19000, 
      image: 'https://images.unsplash.com/photo-1589536672709-a5d34b12466d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGF1ZGl8ZW58MHx8MHx8fDA%3D',
      vin: '7015733W8749',
      kilometers: 10,
      status: 'Used',
      fuelType: 'Petrol',
      gearType: 'Manual',
      registration: '03/2016',
      dealership: 'Firenze',
      stockDays: 412,
      requestMessage: 'Hello, I would like to know the details about the car: What is the suspension?'
    },
    carStatus: 'In Stock',
    requestType: 'Quotation',
    source: 'Google Ads',
    fiscalEntity: 'MotorK',
    sourceDetails: 'ADD 2024',
    assignee: 'Salsabeel Khaleel', // Assign to manager so it shows up
    assigneeInitials: 'SK',
    createdAt: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 3) // 3 hours ago - very fresh lead
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 3)
      return date.toISOString()
    })(),
    nextActionDue: (() => {
      const date = new Date()
      date.setHours(date.getHours() + 2) // 2 hours in the future - urgent, not overdue
      return date.toISOString()
    })(),
    tags: ['Premium', 'Automation'],
    stage: 'Open Lead', // Maps to "New" - Brand new lead, no contact attempts yet
    isDisqualified: false,
    disqualifyReason: null,
    scheduledAppointment: null,
    contactAttempts: [] // Zero contact attempts - needs initial call
  },
  // GROUP A: Validated Stage Leads
  {
    id: 4,
    customerId: 4,
    status: 'Open',
    priority: 'Hot',
    requestedCar: { 
      brand: 'BMW', 
      model: 'iX xDrive50', 
      year: 2024, 
      price: 105000, 
      image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=900&auto=format&fit=crop&q=60',
      vin: 'BMW1234567890',
      kilometers: 0,
      status: 'New',
      fuelType: 'Electric',
      gearType: 'Automatic',
      registration: '01/2024',
      dealership: 'Munich',
      stockDays: 5,
      requestMessage: 'Interested in BMW iX. Ready for test drive this week.'
    },
    carStatus: 'In Stock',
    requestType: 'Test Drive',
    source: 'Google Ads',
    fiscalEntity: '',
    sourceDetails: '',
    assignee: 'Salsabeel Khaleel', // Assign to manager
    assigneeInitials: 'SK',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 4)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString()
    })(),
    nextActionDue: null, // No next action due - appointment already scheduled
    tags: ['Premium'],
    stage: 'Validated', // Validated with test drive appointment scheduled
    isDisqualified: false,
    disqualifyReason: null,
    disqualifyCategory: null,
    scheduledAppointment: {
      id: 101,
      start: (() => {
        const date = new Date()
        date.setDate(date.getDate() + 2)
        date.setHours(14, 0, 0, 0)
        return date.toISOString()
      })(),
      end: (() => {
        const date = new Date()
        date.setDate(date.getDate() + 2)
        date.setHours(15, 0, 0, 0)
        return date.toISOString()
      })(),
      type: 'test-drive',
      status: 'confirmed'
    },
    contactAttempts: [
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 3)
          return date.toISOString()
        })(),
        outcome: 'spoke-to-customer',
        channel: 'phone',
        notes: 'Customer confirmed interest, validated contact details, scheduled test drive',
        transcription: null
      }
    ]
  },
  {
    id: 5,
    customerId: 5,
    status: 'Open',
    priority: 'Normal',
    requestedCar: { 
      brand: 'Audi', 
      model: 'Q4 e-tron', 
      year: 2024, 
      price: 55000, 
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=900&auto=format&fit=crop&q=60',
      vin: 'AUDI9876543210',
      kilometers: 0,
      status: 'New',
      fuelType: 'Electric',
      gearType: 'Automatic',
      registration: '02/2024',
      dealership: 'Firenze',
      stockDays: 12,
      requestMessage: 'Looking for Q4 e-tron information and pricing.'
    },
    carStatus: 'In Stock',
    requestType: 'Quotation',
    source: 'Facebook',
    fiscalEntity: '',
    sourceDetails: '',
    assignee: 'Salsabeel Khaleel', // Assign to manager
    assigneeInitials: 'SK',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 2)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 4)
      return date.toISOString()
    })(),
    nextActionDue: (() => {
      const date = new Date()
      date.setHours(date.getHours() + 6) // Due in 6 hours
      return date.toISOString()
    })(),
    tags: [],
    stage: 'Validated', // Validated but NO appointment scheduled - needs follow-up to schedule
    isDisqualified: false,
    disqualifyReason: null,
    disqualifyCategory: null,
    scheduledAppointment: null,
    contactAttempts: [
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 2)
          return date.toISOString()
        })(),
        outcome: 'no-answer',
        channel: 'phone',
        notes: 'First call - no answer',
        transcription: null
      },
      {
        timestamp: (() => {
          const date = new Date()
          date.setHours(date.getHours() - 4)
          return date.toISOString()
        })(),
        outcome: 'spoke-to-customer',
        channel: 'phone',
        notes: 'Validated lead, customer interested. Needs to check calendar for appointment',
        transcription: null
      }
    ]
  },
  // GROUP B: Disqualified States
  {
    id: 6,
    customerId: 6,
    status: 'Disqualified',
    priority: 'Normal',
    requestedCar: { 
      brand: 'Volkswagen', 
      model: 'ID.4', 
      year: 2023, 
      price: 45000, 
      image: 'https://images.unsplash.com/photo-1622353219448-46a009f0d44f?w=900&auto=format&fit=crop&q=60',
      vin: 'VW1234567890',
      kilometers: 10,
      status: 'Used',
      fuelType: 'Electric',
      gearType: 'Automatic',
      registration: '05/2023',
      dealership: 'Berlin',
      stockDays: 45,
      requestMessage: 'Interested in ID.4 but need to check budget first.'
    },
    carStatus: 'In Stock',
    requestType: 'Quotation',
    source: 'Google Ads',
    fiscalEntity: '',
    sourceDetails: '',
    assignee: 'Sarah Jenkins',
    assigneeInitials: 'SJ',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 15)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 2)
      return date.toISOString()
    })(),
    nextActionDue: null,
    tags: [],
    stage: 'Not Valid',
    isDisqualified: true,
    disqualifyReason: 'Data cleanup',
    disqualifyCategory: 'Not Valid',
    scheduledAppointment: null,
    contactAttempts: []
  },
  {
    id: 7,
    customerId: 7,
    status: 'Disqualified',
    priority: 'Normal',
    requestedCar: { 
      brand: 'Mercedes-Benz', 
      model: 'GLC 300', 
      year: 2024, 
      price: 68000, 
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=900&auto=format&fit=crop&q=60',
      vin: 'MB9876543210',
      kilometers: 0,
      status: 'New',
      fuelType: 'Hybrid',
      gearType: 'Automatic',
      registration: '01/2024',
      dealership: 'Hamburg',
      stockDays: 8,
      requestMessage: 'Looking for GLC but considering other brands too.'
    },
    carStatus: 'In Stock',
    requestType: 'Test Drive',
    source: 'Google Ads',
    fiscalEntity: '',
    sourceDetails: '',
    assignee: 'David Miller',
    assigneeInitials: 'DM',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 8)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString()
    })(),
    nextActionDue: null,
    tags: [],
    stage: 'Not Interested',
    isDisqualified: true,
    disqualifyReason: 'Bought elsewhere',
    disqualifyCategory: 'Not Interested',
    scheduledAppointment: null,
    contactAttempts: [
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 5)
          return date.toISOString()
        })(),
        outcome: 'spoke-to-customer',
        channel: 'phone',
        notes: 'Customer informed us they purchased from competitor',
        transcription: null
      }
    ]
  },
  {
    id: 8,
    customerId: 1, // Same customer as Lead 1 - making it a duplicate
    status: 'Disqualified',
    priority: 'Normal',
    requestedCar: { 
      brand: 'Audi', 
      model: 'A6 Allroad', 
      year: 2023, 
      price: 19000, 
      image: 'https://images.unsplash.com/photo-1589536672709-a5d34b12466d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGF1ZGl8ZW58MHx8MHx8fDA%3D',
      vin: '7015733W8749',
      kilometers: 10,
      status: 'Used',
      fuelType: 'Petrol',
      gearType: 'Manual',
      registration: '03/2016',
      dealership: 'Firenze',
      stockDays: 412,
      requestMessage: 'Duplicate inquiry - same customer as Lead 1'
    },
    carStatus: 'In Stock',
    requestType: 'Quotation',
    source: 'Google Ads',
    fiscalEntity: 'MotorK',
    sourceDetails: 'ADD 2024',
    assignee: 'Sarah Jenkins',
    assigneeInitials: 'SJ',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 18)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 3)
      return date.toISOString()
    })(),
    nextActionDue: null,
    tags: [],
    stage: 'Closed Failed',
    isDisqualified: true,
    isDuplicate: true,
    disqualifyReason: 'Duplicate',
    disqualifyCategory: 'Not Valid',
    scheduledAppointment: null,
    contactAttempts: []
  },
  {
    id: 10,
    customerId: 10,
    status: 'Open',
    priority: 'Normal',
    requestedCar: { 
      brand: 'BMW', 
      model: '3 Series', 
      year: 2023, 
      price: 48000, 
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&auto=format&fit=crop&q=60',
      vin: 'BMW3456789012',
      kilometers: 10,
      status: 'Used',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      registration: '06/2023',
      dealership: 'Munich',
      stockDays: 20,
      requestMessage: 'Interested in pre-owned 3 Series.'
    },
    carStatus: 'In Stock',
    requestType: 'Test Drive',
    source: 'Facebook',
    fiscalEntity: '',
    sourceDetails: '',
    assignee: 'Salsabeel Khaleel', // Assign to manager
    assigneeInitials: 'SK',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 5)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString()
    })(),
    nextActionDue: (() => {
      const date = new Date()
      date.setHours(date.getHours() + 8) // Due in 8 hours
      date.setMinutes(0, 0, 0)
      return date.toISOString()
    })(),
    callbackDate: (() => {
      const date = new Date()
      date.setHours(date.getHours() + 8) // Callback scheduled in 8 hours
      date.setMinutes(0, 0, 0)
      return date.toISOString()
    })(),
    callbackScheduled: true,
    tags: [],
    stage: 'Open Lead', // Will map to "To be called back" due to callbackDate - customer requested specific callback time
    isDisqualified: false,
    disqualifyReason: null,
    disqualifyCategory: null,
    scheduledAppointment: null,
    contactAttempts: [
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 5)
          return date.toISOString()
        })(),
        outcome: 'no-answer',
        channel: 'phone',
        notes: 'No answer on first attempt',
        transcription: null
      },
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 3)
          return date.toISOString()
        })(),
        outcome: 'voicemail',
        channel: 'phone',
        notes: 'Left voicemail with callback request',
        transcription: null
      },
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 1)
          return date.toISOString()
        })(),
        outcome: 'spoke-to-customer',
        channel: 'phone',
        notes: 'Customer interested, requested callback tomorrow afternoon at 2 PM',
        transcription: null
      }
    ]
  },
  // Lead 11 - Open Lead with 1 contact attempt (no answer)
  {
    id: 11,
    customerId: 11,
    status: 'Open',
    priority: 'Normal',
    requestedCar: { 
      brand: 'Porsche', 
      model: 'Cayenne', 
      year: 2024, 
      price: 85000, 
      image: 'https://images.unsplash.com/photo-1613246922662-c0b007a418d5?w=900&auto=format&fit=crop&q=60',
      vin: 'PORSCHE123456',
      kilometers: 0,
      status: 'New',
      fuelType: 'Hybrid',
      gearType: 'Automatic',
      registration: '03/2024',
      dealership: 'Berlin',
      stockDays: 8,
      requestMessage: 'Looking for Cayenne Hybrid. Need urgent purchase for family.'
    },
    carStatus: 'In Stock',
    requestType: 'Quotation',
    source: 'Walk-in',
    fiscalEntity: '',
    sourceDetails: '',
    assignee: 'Salsabeel Khaleel', // Assign to manager
    assigneeInitials: 'SK',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      date.setHours(10, 0, 0, 0)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      date.setHours(11, 0, 0, 0)
      return date.toISOString()
    })(),
    nextActionDue: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 2) // OVERDUE by 2 hours
      return date.toISOString()
    })(),
    tags: ['Urgent'],
    stage: 'Open Lead', // NEW state with 1 failed contact attempt - OVERDUE
    isDisqualified: false,
    disqualifyReason: null,
    scheduledAppointment: null,
    contactAttempts: [
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 1)
          date.setHours(11, 0, 0, 0)
          return date.toISOString()
        })(),
        outcome: 'no-answer',
        channel: 'phone',
        notes: 'Walk-in customer left details. Called but no answer.',
        transcription: null
      }
    ]
  },
  // Lead 12 - Open Lead with 2 contact attempts (close to auto-disqualify threshold)
  {
    id: 12,
    customerId: 12,
    status: 'Open',
    priority: 'Normal',
    requestedCar: { 
      brand: 'Porsche', 
      model: 'Macan', 
      year: 2023, 
      price: 62000, 
      image: 'https://images.unsplash.com/photo-1613246922662-c0b007a418d5?w=900&auto=format&fit=crop&q=60',
      vin: 'PORSCHE789012',
      kilometers: 10,
      status: 'Used',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      registration: '05/2023',
      dealership: 'Hamburg',
      stockDays: 45,
      requestMessage: 'Interested in pre-owned Macan. Please contact me.'
    },
    carStatus: 'In Stock',
    requestType: 'Quotation',
    source: 'Google Ads',
    fiscalEntity: '',
    sourceDetails: 'Facebook Ads Campaign',
    assignee: 'Salsabeel Khaleel', // Assign to manager
    assigneeInitials: 'SK',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 6)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 2)
      return date.toISOString()
    })(),
    nextActionDue: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1) // OVERDUE by 1 day
      return date.toISOString()
    })(),
    tags: [],
    stage: 'Open Lead', // NEW state with 2 contact attempts - one more attempt before auto-disqualify
    isDisqualified: false,
    disqualifyReason: null,
    scheduledAppointment: null,
    contactAttempts: [
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 5)
          return date.toISOString()
        })(),
        outcome: 'no-answer',
        channel: 'phone',
        notes: 'First attempt - no answer',
        transcription: null
      },
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 2)
          return date.toISOString()
        })(),
        outcome: 'voicemail',
        channel: 'phone',
        notes: 'Second attempt - left voicemail. No response yet.',
        transcription: null
      }
    ]
  },
  // Additional leads for showcasing carousel - Customer 1 (Josh Adams)
  {
    id: 13,
    customerId: 1,
    status: 'Open',
    priority: 'Hot',
    requestedCar: { 
      brand: 'Audi', 
      model: 'Q7', 
      year: 2024, 
      price: 75000, 
      image: 'https://images.unsplash.com/photo-1589536672709-a5d34b12466d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGF1ZGl8ZW58MHx8MHx8fDA%3D',
      vin: 'AUDI123456789',
      kilometers: 0,
      status: 'New',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      registration: '01/2024',
      dealership: 'Milan',
      stockDays: 8,
      requestMessage: 'Looking for a spacious SUV for family trips'
    },
    carStatus: 'In Stock',
    requestType: 'Quotation',
    source: 'Google Ads',
    fiscalEntity: 'MotorK',
    sourceDetails: 'ADD 2024',
    assignee: 'Sarah Jenkins',
    assigneeInitials: 'SJ',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 3)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString()
    })(),
    nextActionDue: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 1)
      return date.toISOString()
    })(),
    tags: ['Premium'],
    stage: 'Open Lead',
    isDisqualified: false,
    disqualifyReason: null,
    scheduledAppointment: null,
    contactAttempts: []
  },
  // Customer 2 (Emma Watson) - Lead
  {
    id: 14,
    customerId: 2,
    status: 'Open',
    priority: 'Normal',
    requestedCar: { 
      brand: 'Volkswagen', 
      model: 'Golf', 
      year: 2023, 
      price: 28000, 
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=900&auto=format&fit=crop&q=60',
      vin: 'VW987654321',
      kilometers: 10,
      status: 'Used',
      fuelType: 'Petrol',
      gearType: 'Manual',
      registration: '06/2023',
      dealership: 'Berlin',
      stockDays: 120,
      requestMessage: 'First car purchase - need reliable hatchback'
    },
    carStatus: 'In Stock',
    requestType: 'Quotation',
    source: 'Instagram',
    assignee: 'David Miller',
    assigneeInitials: 'DM',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 5)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 2)
      return date.toISOString()
    })(),
    nextActionDue: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 3)
      return date.toISOString()
    })(),
    tags: [],
    stage: 'Validated',
    isDisqualified: false,
    disqualifyReason: null,
    scheduledAppointment: null,
    contactAttempts: [
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 2)
          return date.toISOString()
        })(),
        outcome: 'spoke-to-customer',
        channel: 'phone',
        notes: 'Customer confirmed interest in Golf. First-time buyer, needs guidance on financing options. Validated contact details.',
        transcription: null
      }
    ]
  },
  // Customer 3 (Liam Johnson) - Lead
  {
    id: 15,
    customerId: 3,
    status: 'Open',
    priority: 'Hot',
    requestedCar: { 
      brand: 'BMW', 
      model: 'M4 Coupe', 
      year: 2024, 
      price: 85000, 
      image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=900&auto=format&fit=crop&q=60',
      vin: 'BMW456789012',
      kilometers: 0,
      status: 'New',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      registration: '02/2024',
      dealership: 'Berlin',
      stockDays: 15,
      requestMessage: 'Sporty coupe for weekend drives'
    },
    carStatus: 'In Stock',
    requestType: 'Test Drive',
    source: 'Immo-scout',
    assignee: 'Sarah Jenkins',
    assigneeInitials: 'SJ',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 2)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString()
    })(),
    nextActionDue: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 1)
      return date.toISOString()
    })(),
    tags: ['Performance'],
    stage: 'Open Lead',
    isDisqualified: false,
    disqualifyReason: null,
    scheduledAppointment: null,
    contactAttempts: []
  },
  // Customer 4 (Sophie Mueller) - Lead
  {
    id: 16,
    customerId: 4,
    status: 'Open',
    priority: 'Hot',
    requestedCar: { 
      brand: 'Mercedes-Benz', 
      model: 'GLE 350', 
      year: 2024, 
      price: 72000, 
      image: 'https://images.unsplash.com/photo-1613246922662-c0b007a418d5?w=900&auto=format&fit=crop&q=60',
      vin: 'MB789012345',
      kilometers: 0,
      status: 'New',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      registration: '01/2024',
      dealership: 'Munich',
      stockDays: 5,
      requestMessage: 'Premium SUV for family of 4'
    },
    carStatus: 'In Stock',
    requestType: 'Quotation',
    source: 'Instagram',
    assignee: 'Salsabeel Khaleel',
    assigneeInitials: 'SK',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 4)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString()
    })(),
    nextActionDue: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 2)
      return date.toISOString()
    })(),
    tags: ['Premium'],
    stage: 'Validated',
    isDisqualified: false,
    disqualifyReason: null,
    scheduledAppointment: null,
    contactAttempts: [
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 1)
          return date.toISOString()
        })(),
        outcome: 'spoke-to-customer',
        channel: 'phone',
        notes: 'Customer very interested in GLE 350. Premium buyer, validated contact details. Needs pricing and financing information. Ready to move forward.',
        transcription: null
      }
    ]
  },
  // Customer 5 (Marco Rossi) - Lead
  {
    id: 17,
    customerId: 5,
    status: 'Open',
    priority: 'Normal',
    requestedCar: { 
      brand: 'Fiat', 
      model: '500X', 
      year: 2023, 
      price: 24000, 
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=900&auto=format&fit=crop&q=60',
      vin: 'FIAT123456789',
      kilometers: 10,
      status: 'Used',
      fuelType: 'Petrol',
      gearType: 'Manual',
      registration: '04/2023',
      dealership: 'Florence',
      stockDays: 90,
      requestMessage: 'Italian brand preference - family vehicle'
    },
    carStatus: 'In Stock',
    requestType: 'Quotation',
    source: 'Facebook',
    assignee: 'David Miller',
    assigneeInitials: 'DM',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 6)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 3)
      return date.toISOString()
    })(),
    nextActionDue: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 4)
      return date.toISOString()
    })(),
    tags: [],
    stage: 'Open Lead',
    isDisqualified: false,
    disqualifyReason: null,
    scheduledAppointment: null,
    contactAttempts: []
  },
  // Customer 11 (Laura Zimmermann) - Lead
  {
    id: 18,
    customerId: 11,
    status: 'Open',
    priority: 'Urgent',
    requestedCar: { 
      brand: 'Volkswagen', 
      model: 'Tiguan', 
      year: 2023, 
      price: 32000, 
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=900&auto=format&fit=crop&q=60',
      vin: 'VWTIGUAN123',
      kilometers: 10,
      status: 'Used',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      registration: '03/2023',
      dealership: 'Berlin',
      stockDays: 60,
      requestMessage: 'Urgent need - compact SUV with safety features'
    },
    carStatus: 'In Stock',
    requestType: 'Quotation',
    source: 'Walk-in',
    assignee: 'Sarah Jenkins',
    assigneeInitials: 'SJ',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 2)
      return date.toISOString()
    })(),
    nextActionDue: (() => {
      const date = new Date()
      date.setHours(date.getHours() + 4)
      return date.toISOString()
    })(),
    tags: ['Urgent'],
    stage: 'Open Lead',
    isDisqualified: false,
    disqualifyReason: null,
    scheduledAppointment: null,
    contactAttempts: []
  },
  // Customer 13 (Nina Keller) - Lead
  {
    id: 19,
    customerId: 13,
    status: 'Open',
    priority: 'Hot',
    requestedCar: { 
      brand: 'Mini', 
      model: 'Cooper S', 
      year: 2024, 
      price: 35000, 
      image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=900&auto=format&fit=crop&q=60',
      vin: 'MINI987654321',
      kilometers: 0,
      status: 'New',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      registration: '01/2024',
      dealership: 'Frankfurt',
      stockDays: 3,
      requestMessage: 'Stylish compact car for city driving'
    },
    carStatus: 'In Stock',
    requestType: 'Test Drive',
    source: 'Facebook',
    assignee: 'Salsabeel Khaleel',
    assigneeInitials: 'SK',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 6)
      return date.toISOString()
    })(),
    nextActionDue: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 1)
      return date.toISOString()
    })(),
    tags: ['VIP'],
    stage: 'Open Lead',
    isDisqualified: false,
    disqualifyReason: null,
    scheduledAppointment: null,
    contactAttempts: []
  },
  // Customer 18 (Dr. Andreas Werner) - Lead
  {
    id: 20,
    customerId: 18,
    status: 'Open',
    priority: 'Hot',
    requestedCar: { 
      brand: 'Mercedes-Benz', 
      model: 'S-Class', 
      year: 2024, 
      price: 120000, 
      image: 'https://images.unsplash.com/photo-1613246922662-c0b007a418d5?w=900&auto=format&fit=crop&q=60',
      vin: 'MBS123456789',
      kilometers: 0,
      status: 'New',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      registration: '01/2024',
      dealership: 'Düsseldorf',
      stockDays: 2,
      requestMessage: 'Executive vehicle for company car program'
    },
    carStatus: 'In Stock',
    requestType: 'Quotation',
    source: 'Facebook',
    assignee: 'Salsabeel Khaleel',
    assigneeInitials: 'SK',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 2)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString()
    })(),
    nextActionDue: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 1)
      return date.toISOString()
    })(),
    tags: ['VIP', 'Premium'],
    stage: 'Open Lead',
    isDisqualified: false,
    disqualifyReason: null,
    scheduledAppointment: null,
    contactAttempts: []
  },
  // Lead 21 - To be called back with OVERDUE callback
  {
    id: 21,
    customerId: 9,
    status: 'Open',
    priority: 'Normal',
    requestedCar: { 
      brand: 'Audi', 
      model: 'A4', 
      year: 2023, 
      price: 42000, 
      image: 'https://images.unsplash.com/photo-1589536672709-a5d34b12466d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGF1ZGl8ZW58MHx8MHx8fDA%3D',
      vin: 'AUDI456789012',
      kilometers: 10,
      status: 'Used',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      registration: '07/2023',
      dealership: 'Berlin',
      stockDays: 80,
      requestMessage: 'Looking for A4 sedan. Need to schedule callback.'
    },
    carStatus: 'In Stock',
    requestType: 'Quotation',
    source: 'Google Ads',
    fiscalEntity: '',
    sourceDetails: '',
    assignee: 'David Miller',
    assigneeInitials: 'DM',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 4)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 2)
      return date.toISOString()
    })(),
    nextActionDue: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 3) // OVERDUE callback by 3 hours
      return date.toISOString()
    })(),
    callbackDate: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 3) // Callback was scheduled 3 hours ago - OVERDUE
      return date.toISOString()
    })(),
    callbackScheduled: true,
    tags: [],
    stage: 'Open Lead', // Will map to "To be called back" due to callbackDate
    isDisqualified: false,
    disqualifyReason: null,
    scheduledAppointment: null,
    contactAttempts: [
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 3)
          return date.toISOString()
        })(),
        outcome: 'no-answer',
        channel: 'phone',
        notes: 'No answer on initial call',
        transcription: null
      },
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 2)
          return date.toISOString()
        })(),
        outcome: 'spoke-to-customer',
        channel: 'phone',
        notes: 'Customer requested callback at specific time. Scheduled for today.',
        transcription: null
      }
    ]
  },
  // Lead 22 - To be called back with URGENT upcoming callback
  {
    id: 22,
    customerId: 14,
    status: 'Open',
    priority: 'Hot',
    requestedCar: { 
      brand: 'BMW', 
      model: 'X3', 
      year: 2024, 
      price: 52000, 
      image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=900&auto=format&fit=crop&q=60',
      vin: 'BMW789012345',
      kilometers: 10,
      status: 'Used',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      registration: '02/2024',
      dealership: 'Munich',
      stockDays: 25,
      requestMessage: 'Interested in X3. Call me back tomorrow morning.'
    },
    carStatus: 'In Stock',
    requestType: 'Test Drive',
    source: 'Facebook',
    fiscalEntity: '',
    sourceDetails: '',
    assignee: 'Salsabeel Khaleel',
    assigneeInitials: 'SK',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 2)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 12)
      return date.toISOString()
    })(),
    nextActionDue: (() => {
      const date = new Date()
      date.setHours(date.getHours() + 2) // URGENT - callback in 2 hours
      return date.toISOString()
    })(),
    callbackDate: (() => {
      const date = new Date()
      date.setHours(date.getHours() + 2) // Callback scheduled in 2 hours - URGENT
      return date.toISOString()
    })(),
    callbackScheduled: true,
    tags: ['Hot'],
    stage: 'Open Lead', // Will map to "To be called back" due to callbackDate
    isDisqualified: false,
    disqualifyReason: null,
    scheduledAppointment: null,
    contactAttempts: [
      {
        timestamp: (() => {
          const date = new Date()
          date.setHours(date.getHours() - 12)
          return date.toISOString()
        })(),
        outcome: 'spoke-to-customer',
        channel: 'phone',
        notes: 'Customer very interested. Requested urgent callback tomorrow morning at 10 AM.',
        transcription: null
      }
    ]
  },
  // Lead 23 - Validated with multiple contact attempts before validation
  {
    id: 23,
    customerId: 15,
    status: 'Open',
    priority: 'Normal',
    requestedCar: { 
      brand: 'Mercedes-Benz', 
      model: 'C-Class', 
      year: 2024, 
      price: 48000, 
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=900&auto=format&fit=crop&q=60',
      vin: 'MBC123456789',
      kilometers: 0,
      status: 'New',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      registration: '01/2024',
      dealership: 'Hamburg',
      stockDays: 10,
      requestMessage: 'Looking for C-Class sedan. Multiple attempts needed to reach me.'
    },
    carStatus: 'In Stock',
    requestType: 'Quotation',
    source: 'Google Ads',
    fiscalEntity: '',
    sourceDetails: '',
    assignee: 'Sarah Jenkins',
    assigneeInitials: 'SJ',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 7)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString()
    })(),
    nextActionDue: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 2)
      return date.toISOString()
    })(),
    tags: [],
    stage: 'Validated',
    isDisqualified: false,
    disqualifyReason: null,
    scheduledAppointment: null,
    contactAttempts: [
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 6)
          return date.toISOString()
        })(),
        outcome: 'no-answer',
        channel: 'phone',
        notes: 'First attempt - no answer',
        transcription: null
      },
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 5)
          return date.toISOString()
        })(),
        outcome: 'voicemail',
        channel: 'phone',
        notes: 'Second attempt - left voicemail',
        transcription: null
      },
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 3)
          return date.toISOString()
        })(),
        outcome: 'no-answer',
        channel: 'phone',
        notes: 'Third attempt - no answer',
        transcription: null
      },
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 1)
          return date.toISOString()
        })(),
        outcome: 'spoke-to-customer',
        channel: 'phone',
        notes: 'Finally reached customer. Very interested in C-Class. Validated contact details and requirements. Ready to proceed.',
        transcription: null
      }
    ]
  },
  // Lead 24 - Closed - Invalid with contact attempts showing why it's invalid
  {
    id: 24,
    customerId: 19,
    status: 'Disqualified',
    priority: 'Normal',
    requestedCar: { 
      brand: 'Volkswagen', 
      model: 'Passat', 
      year: 2023, 
      price: 35000, 
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=900&auto=format&fit=crop&q=60',
      vin: 'VWPASSAT123',
      kilometers: 10,
      status: 'Used',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      registration: '08/2023',
      dealership: 'Berlin',
      stockDays: 150,
      requestMessage: 'Interested in Passat but vehicle was already sold.'
    },
    carStatus: 'Sold',
    requestType: 'Quotation',
    source: 'Google Ads',
    fiscalEntity: '',
    sourceDetails: '',
    assignee: 'David Miller',
    assigneeInitials: 'DM',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 10)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 3)
      return date.toISOString()
    })(),
    nextActionDue: null,
    tags: [],
    stage: 'Not Valid',
    isDisqualified: true,
    disqualifyReason: 'Vehicle sold',
    disqualifyCategory: 'Not Valid',
    scheduledAppointment: null,
    contactAttempts: [
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 8)
          return date.toISOString()
        })(),
        outcome: 'no-answer',
        channel: 'phone',
        notes: 'First attempt - no answer',
        transcription: null
      },
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 5)
          return date.toISOString()
        })(),
        outcome: 'spoke-to-customer',
        channel: 'phone',
        notes: 'Reached customer. Vehicle they requested was already sold. Customer not interested in alternatives. Disqualified as invalid.',
        transcription: null
      }
    ]
  },
  // Lead 25 - Closed - Not Interested with conversation history
  {
    id: 25,
    customerId: 20,
    status: 'Disqualified',
    priority: 'Normal',
    requestedCar: { 
      brand: 'Audi', 
      model: 'Q5', 
      year: 2024, 
      price: 58000, 
      image: 'https://images.unsplash.com/photo-1589536672709-a5d34b12466d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGF1ZGl8ZW58MHx8MHx8fDA%3D',
      vin: 'AUDIQ5123456',
      kilometers: 0,
      status: 'New',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      registration: '01/2024',
      dealership: 'Firenze',
      stockDays: 12,
      requestMessage: 'Interested in Q5 but decided to postpone purchase.'
    },
    carStatus: 'In Stock',
    requestType: 'Test Drive',
    source: 'Google Ads',
    fiscalEntity: '',
    sourceDetails: '',
    assignee: 'Sarah Jenkins',
    assigneeInitials: 'SJ',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 12)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 2)
      return date.toISOString()
    })(),
    nextActionDue: null,
    tags: [],
    stage: 'Not Interested',
    isDisqualified: true,
    disqualifyReason: 'Purchase postponed',
    disqualifyCategory: 'Not Interested',
    scheduledAppointment: null,
    contactAttempts: [
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 10)
          return date.toISOString()
        })(),
        outcome: 'spoke-to-customer',
        channel: 'phone',
        notes: 'Initial contact - customer showed interest in Q5. Scheduled test drive.',
        transcription: null
      },
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 5)
          return date.toISOString()
        })(),
        outcome: 'spoke-to-customer',
        channel: 'phone',
        notes: 'Follow-up call. Customer mentioned financial constraints and decided to postpone purchase for 6-12 months.',
        transcription: null
      },
      {
        timestamp: (() => {
          const date = new Date()
          date.setDate(date.getDate() - 2)
          return date.toISOString()
        })(),
        outcome: 'spoke-to-customer',
        channel: 'phone',
        notes: 'Final confirmation call. Customer confirmed decision to postpone. Not interested at this time. Disqualified.',
        transcription: null
      }
    ]
  },
  // Lead 26 - New lead with upcoming deadline (not urgent, not overdue)
  {
    id: 26,
    customerId: 21,
    status: 'Open',
    priority: 'Normal',
    requestedCar: { 
      brand: 'BMW', 
      model: '1 Series', 
      year: 2024, 
      price: 32000, 
      image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=900&auto=format&fit=crop&q=60',
      vin: 'BMW1SERIES123',
      kilometers: 0,
      status: 'New',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      registration: '01/2024',
      dealership: 'Munich',
      stockDays: 18,
      requestMessage: 'Looking for compact BMW 1 Series. Standard follow-up timeline.'
    },
    carStatus: 'In Stock',
    requestType: 'Quotation',
    source: 'Google Ads',
    fiscalEntity: '',
    sourceDetails: '',
    assignee: 'David Miller',
    assigneeInitials: 'DM',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString()
    })(),
    nextActionDue: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 2) // Upcoming deadline in 2 days - not urgent, not overdue
      return date.toISOString()
    })(),
    tags: [],
    stage: 'Open Lead',
    isDisqualified: false,
    disqualifyReason: null,
    scheduledAppointment: null,
    contactAttempts: []
  },
  // Lead 27 - New lead with no deadline yet (very fresh, just created)
  {
    id: 27,
    customerId: 22,
    status: 'Open',
    priority: 'Normal',
    requestedCar: { 
      brand: 'Volkswagen', 
      model: 'Polo', 
      year: 2024, 
      price: 22000, 
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=900&auto=format&fit=crop&q=60',
      vin: 'VWPOLO2024',
      kilometers: 0,
      status: 'New',
      fuelType: 'Petrol',
      gearType: 'Manual',
      registration: '01/2024',
      dealership: 'Berlin',
      stockDays: 5,
      requestMessage: 'Just submitted inquiry. Very fresh lead with no deadline set yet.'
    },
    carStatus: 'In Stock',
    requestType: 'Quotation',
    source: 'Google Ads',
    fiscalEntity: '',
    sourceDetails: '',
    assignee: 'Natalia Sung',
    assigneeInitials: 'NS',
    createdAt: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 1) // Created 1 hour ago - very fresh
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 1)
      return date.toISOString()
    })(),
    nextActionDue: null, // No deadline set yet - very fresh lead
    tags: [],
    stage: 'Open Lead',
    isDisqualified: false,
    disqualifyReason: null,
    scheduledAppointment: null,
    contactAttempts: []
  },
  // Lead for customer 2
  {
    id: 28,
    customerId: 2,
    status: 'Open',
    priority: 'Normal',
    requestedCar: {
      brand: 'Mercedes-Benz',
      model: 'EQS',
      year: 2024,
      price: 95000,
      image: 'https://images.unsplash.com/photo-1546518071-fddcdda7580a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWVyY2VkZXN8ZW58MHx8MHx8fDA%3D',
      vin: '8912345X6789',
      kilometers: 0,
      status: 'New',
      fuelType: 'Electric',
      gearType: 'Automatic',
      registration: '01/2024',
      dealership: 'Berlin Mitte',
      stockDays: 42,
      requestMessage: 'Interested in electric vehicles. Looking for reliable and fuel-efficient options.'
    },
    carStatus: 'In Stock',
    requestType: 'Quotation',
    source: 'Google Ads',
    fiscalEntity: '',
    sourceDetails: '',
    assignee: 'Sarah Jenkins',
    assigneeInitials: 'SJ',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 2)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 4)
      return date.toISOString()
    })(),
    nextActionDue: (() => {
      const date = new Date()
      date.setHours(date.getHours() + 6)
      return date.toISOString()
    })(),
    tags: [],
    stage: 'Open Lead',
    isDisqualified: false,
    disqualifyReason: null,
    scheduledAppointment: null,
    contactAttempts: []
  },
  // Lead for customer 3
  {
    id: 29,
    customerId: 3,
    status: 'Open',
    priority: 'Hot',
    requestedCar: {
      brand: 'BMW',
      model: 'M4 Coupe',
      year: 2024,
      price: 85000,
      image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=900&auto=format&fit=crop&q=60',
      vin: 'BMW456789012',
      kilometers: 0,
      status: 'New',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      registration: '02/2024',
      dealership: 'Berlin',
      stockDays: 15,
      requestMessage: 'Interested in sporty coupes. Looking for performance vehicles.'
    },
    carStatus: 'In Stock',
    requestType: 'Test Drive',
    source: 'Google Ads',
    fiscalEntity: '',
    sourceDetails: '',
    assignee: 'David Miller',
    assigneeInitials: 'DM',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 2)
      return date.toISOString()
    })(),
    nextActionDue: (() => {
      const date = new Date()
      date.setHours(date.getHours() + 4)
      return date.toISOString()
    })(),
    tags: ['Hot'],
    stage: 'Open Lead',
    isDisqualified: false,
    disqualifyReason: null,
    scheduledAppointment: null,
    contactAttempts: []
  },
  // Lead for customer 8
  {
    id: 30,
    customerId: 8,
    status: 'Open',
    priority: 'Normal',
    requestedCar: {
      brand: 'Audi',
      model: 'A6',
      year: 2024,
      price: 65000,
      image: 'https://images.unsplash.com/photo-1613246922662-c0b007a418d5?w=900&auto=format&fit=crop&q=60',
      vin: 'AUDI789012345',
      kilometers: 0,
      status: 'New',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      registration: '01/2024',
      dealership: 'Düsseldorf',
      stockDays: 8,
      requestMessage: 'Looking for premium sedan for business use.'
    },
    carStatus: 'In Stock',
    requestType: 'Quotation',
    source: 'Walk-in',
    fiscalEntity: '',
    sourceDetails: '',
    assignee: 'Michael Thomas',
    assigneeInitials: 'MT',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 3)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString()
    })(),
    nextActionDue: (() => {
      const date = new Date()
      date.setHours(date.getHours() + 8)
      return date.toISOString()
    })(),
    tags: [],
    stage: 'Open Lead',
    isDisqualified: false,
    disqualifyReason: null,
    scheduledAppointment: null,
    contactAttempts: []
  },
  // Lead for customer 16
  {
    id: 31,
    customerId: 16,
    status: 'Open',
    priority: 'Normal',
    requestedCar: {
      brand: 'BMW',
      model: '5 Series',
      year: 2024,
      price: 70000,
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGJtd3xlbnwwfHwwfHx8MA%3D%3D',
      vin: 'BMW567890123',
      kilometers: 0,
      status: 'New',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      registration: '01/2024',
      dealership: 'Hamburg',
      stockDays: 12,
      requestMessage: 'Corporate fleet inquiry. Need executive sedans for company.'
    },
    carStatus: 'In Stock',
    requestType: 'Quotation',
    source: 'Google Ads',
    fiscalEntity: 'Klein GmbH',
    sourceDetails: '',
    assignee: 'David Miller',
    assigneeInitials: 'DM',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 5)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 2)
      return date.toISOString()
    })(),
    nextActionDue: (() => {
      const date = new Date()
      date.setHours(date.getHours() + 12)
      return date.toISOString()
    })(),
    tags: ['Corporate'],
    stage: 'Open Lead',
    isDisqualified: false,
    disqualifyReason: null,
    scheduledAppointment: null,
    contactAttempts: []
  },
  // Lead for customer 17
  {
    id: 32,
    customerId: 17,
    status: 'Open',
    priority: 'Normal',
    requestedCar: {
      brand: 'Volkswagen',
      model: 'Golf',
      year: 2024,
      price: 28000,
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=900&auto=format&fit=crop&q=60',
      vin: 'VW987654321',
      kilometers: 0,
      status: 'New',
      fuelType: 'Petrol',
      gearType: 'Manual',
      registration: '01/2024',
      dealership: 'Frankfurt',
      stockDays: 20,
      requestMessage: 'Looking for reliable family vehicle with good fuel economy.'
    },
    carStatus: 'In Stock',
    requestType: 'Quotation',
    source: 'Walk-in',
    fiscalEntity: '',
    sourceDetails: '',
    assignee: 'Sarah Jenkins',
    assigneeInitials: 'SJ',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 3)
      return date.toISOString()
    })(),
    nextActionDue: (() => {
      const date = new Date()
      date.setHours(date.getHours() + 6)
      return date.toISOString()
    })(),
    tags: [],
    stage: 'Open Lead',
    isDisqualified: false,
    disqualifyReason: null,
    scheduledAppointment: null,
    contactAttempts: []
  }
]

// Additional opportunities for showcasing carousel - Customers 1-20
// Defined before mockOpportunities to avoid initialization error
const additionalOpportunitiesForCarousel = [
  // Customer 1 (Josh Adams) - In Negotiation with offers
  {
    id: 30,
    customerId: 1,
    requestedCar: { 
      brand: 'Audi', 
      model: 'Q5', 
      year: 2024, 
      price: 55000, 
      image: 'https://images.unsplash.com/photo-1589536672709-a5d34b12466d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGF1ZGl8ZW58MHx8MHx8fDA%3D',
      dealership: 'Milan',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 10
    },
    vehicle: null,
    selectedVehicle: null,
    stage: 'In Negotiation',
    tags: ['Premium'],
    value: 55000,
    expectedCloseDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 20)
      return date.toISOString().split('T')[0]
    })(),
    assignee: 'Sarah Jenkins',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 10)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString()
    })(),
    scheduledAppointment: null
  },
  // Customer 2 (Emma Watson) - Qualified
  {
    id: 31,
    customerId: 2,
    requestedCar: { 
      brand: 'Volkswagen', 
      model: 'Polo', 
      year: 2023, 
      price: 22000, 
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=900&auto=format&fit=crop&q=60',
      dealership: 'Berlin',
      fuelType: 'Petrol',
      gearType: 'Manual',
      kilometers: 10,
      status: 'Used',
      stockDays: 150
    },
    vehicle: null,
    selectedVehicle: null,
    stage: 'Qualified',
    tags: [],
    value: 22000,
    expectedCloseDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 45)
      return date.toISOString().split('T')[0]
    })(),
    assignee: 'David Miller',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 7)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 2)
      return date.toISOString()
    })(),
    scheduledAppointment: null
  },
  // Customer 4 (Sophie Mueller) - Closed Won (Purchased)
  {
    id: 32,
    customerId: 4,
    requestedCar: { 
      brand: 'BMW', 
      model: 'X5', 
      year: 2023, 
      price: 85000, 
      image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=900&auto=format&fit=crop&q=60',
      dealership: 'Munich',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 10,
      status: 'Used',
      stockDays: 200
    },
    vehicle: { 
      brand: 'BMW', 
      model: 'X5', 
      year: 2023, 
      price: 85000, 
      image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=900&auto=format&fit=crop&q=60',
      dealership: 'Munich',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 10,
      status: 'Used',
      stockDays: 200
    },
    selectedVehicle: null,
    stage: 'Closed Won',
    tags: ['Premium'],
    value: 85000,
    expectedCloseDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 30)
      return date.toISOString().split('T')[0]
    })(),
    contractDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 30)
      return date.toISOString()
    })(),
    assignee: 'Salsabeel Khaleel',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 60)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 30)
      return date.toISOString()
    })(),
    scheduledAppointment: null
  },
  // Customer 11 (Laura Zimmermann) - In Negotiation
  {
    id: 33,
    customerId: 11,
    requestedCar: { 
      brand: 'Volkswagen', 
      model: 'Touran', 
      year: 2023, 
      price: 35000, 
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=900&auto=format&fit=crop&q=60',
      dealership: 'Berlin',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 10,
      status: 'Used',
      stockDays: 100
    },
    vehicle: null,
    selectedVehicle: null,
    stage: 'In Negotiation',
    tags: ['Urgent'],
    value: 35000,
    expectedCloseDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 7)
      return date.toISOString().split('T')[0]
    })(),
    assignee: 'Sarah Jenkins',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 5)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString()
    })(),
    scheduledAppointment: null
  },
  // Customer 13 (Nina Keller) - Qualified
  {
    id: 34,
    customerId: 13,
    requestedCar: { 
      brand: 'Audi', 
      model: 'A3', 
      year: 2024, 
      price: 38000, 
      image: 'https://images.unsplash.com/photo-1589536672709-a5d34b12466d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGF1ZGl8ZW58MHx8MHx8fDA%3D',
      dealership: 'Frankfurt',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 5
    },
    vehicle: null,
    selectedVehicle: null,
    stage: 'Qualified',
    tags: ['VIP'],
    value: 38000,
    expectedCloseDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 30)
      return date.toISOString().split('T')[0]
    })(),
    assignee: 'Salsabeel Khaleel',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 3)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString()
    })(),
    scheduledAppointment: null
  },
  // Customer 18 (Dr. Andreas Werner) - Closed Won (Purchased)
  {
    id: 35,
    customerId: 18,
    requestedCar: { 
      brand: 'Mercedes-Benz', 
      model: 'E-Class', 
      year: 2024, 
      price: 65000, 
      image: 'https://images.unsplash.com/photo-1613246922662-c0b007a418d5?w=900&auto=format&fit=crop&q=60',
      dealership: 'Düsseldorf',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 12
    },
    vehicle: { 
      brand: 'Mercedes-Benz', 
      model: 'E-Class', 
      year: 2024, 
      price: 65000, 
      image: 'https://images.unsplash.com/photo-1613246922662-c0b007a418d5?w=900&auto=format&fit=crop&q=60',
      dealership: 'Düsseldorf',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 12
    },
    selectedVehicle: null,
    stage: 'Closed Won',
    tags: ['VIP', 'Premium'],
    value: 65000,
    expectedCloseDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 15)
      return date.toISOString().split('T')[0]
    })(),
    contractDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 15)
      return date.toISOString()
    })(),
    assignee: 'Salsabeel Khaleel',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 45)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 15)
      return date.toISOString()
    })(),
    scheduledAppointment: null
  },
  // Customer 20 (Martin Richter) - Closed Won (Purchased)
  {
    id: 36,
    customerId: 20,
    requestedCar: { 
      brand: 'Porsche', 
      model: '911 Carrera', 
      year: 2024, 
      price: 135000, 
      image: 'https://images.unsplash.com/photo-1613246922662-c0b007a418d5?w=900&auto=format&fit=crop&q=60',
      dealership: 'Hamburg',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 1
    },
    vehicle: { 
      brand: 'Porsche', 
      model: '911 Carrera', 
      year: 2024, 
      price: 135000, 
      image: 'https://images.unsplash.com/photo-1613246922662-c0b007a418d5?w=900&auto=format&fit=crop&q=60',
      dealership: 'Hamburg',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 1
    },
    selectedVehicle: null,
    stage: 'Closed Won',
    tags: ['Performance', 'Hot'],
    value: 135000,
    expectedCloseDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 10)
      return date.toISOString().split('T')[0]
    })(),
    contractDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 10)
      return date.toISOString()
    })(),
    assignee: 'Salsabeel Khaleel',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 30)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 10)
      return date.toISOString()
    })(),
    scheduledAppointment: null
  }
]

export const mockOpportunities = [
  {
    id: 1,
    customerId: 21,
    requestedCar: { 
      brand: 'Audi', 
      model: 'e-tron GT', 
      year: 2024,
      price: 98000,
      image: 'https://images.unsplash.com/photo-1589536672709-a5d34b12466d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGF1ZGl8ZW58MHx8MHx8fDA%3D',
      dealership: 'Firenze',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 12,
      requestMessage: 'Looking for a new e-tron GT. What are the financing options?'
    },
    vehicle: { 
      brand: 'Audi', 
      model: 'e-tron GT', 
      year: 2024,
      price: 98000,
      image: 'https://images.unsplash.com/photo-1589536672709-a5d34b12466d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGF1ZGl8ZW58MHx8MHx8fDA%3D',
      dealership: 'Firenze',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 12,
      requestMessage: 'Looking for a new e-tron GT. What are the financing options?'
    },
    selectedVehicle: null, // Vehicle selected for offer (can differ from requested)
    stage: 'Qualified',
    tags: ['Premium'],
    value: 98000,
    expectedCloseDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 30) // 30 days in the future
      return date.toISOString().split('T')[0]
    })(),
    assignee: 'Salsabeel Khaleel', // Assign to manager so it shows up
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1) // 1 day ago - fresh opportunity
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString()
    })(),
    scheduledAppointment: {
      id: 10,
      title: 'Dealership Visit - Emma Wilson',
      start: (() => {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 2) // 2 days ago to trigger action item
        yesterday.setHours(11, 0, 0, 0)
        return yesterday.toISOString()
      })(),
      end: (() => {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 2)
        yesterday.setHours(12, 0, 0, 0)
        return yesterday.toISOString()
      })(),
      type: 'appointment',
      customer: 'Emma Wilson',
      vehicle: 'Audi e-tron GT',
      assignee: 'Salsabeel Khaleel',
      assigneeId: 1,
      dealership: 'Firenze',
      team: 'Sales (New)',
      status: 'confirmed',
      noShowCount: 0
    }
  },
  // REMOVED ID 2 - Duplicate of Qualified stage (ID 1)
  {
    id: 3,
    customerId: 30,
    requestedCar: { 
      brand: 'Porsche', 
      model: 'Taycan', 
      year: 2024,
      price: 120000,
      image: 'https://images.unsplash.com/photo-1613246922662-c0b007a418d5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjQzfHxjYXJ8ZW58MHx8MHx8fDA%3D',
      dealership: 'Milano',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: null,
      requestMessage: 'Interested in a Taycan. Do you have any in a specific color?'
    },
    vehicle: { 
      brand: 'Porsche', 
      model: 'Taycan', 
      year: 2024,
      price: 120000,
      image: 'https://images.unsplash.com/photo-1613246922662-c0b007a418d5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjQzfHxjYXJ8ZW58MHx8MHx8fDA%3D',
      dealership: 'Milano',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: null,
      requestMessage: 'Interested in a Taycan. Do you have any in a specific color?'
    },
    stage: 'Qualified',
    tags: [],
    value: 120000,
    expectedCloseDate: '2025-05-15',
    assignee: 'Salsabeel Khaleel', // Assign to manager so it shows up
    createdAt: '2025-03-01T09:00:00',
    lastActivity: '2025-03-25T11:30:00',
    scheduledAppointment: {
      id: 20,
      title: 'Meeting - Oliver Brown',
      start: (() => {
        const threeDaysAgo = new Date()
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
        threeDaysAgo.setHours(14, 0, 0, 0)
        return threeDaysAgo.toISOString()
      })(),
      end: (() => {
        const threeDaysAgo = new Date()
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
        threeDaysAgo.setHours(15, 30, 0, 0)
        return threeDaysAgo.toISOString()
      })(),
      type: 'appointment',
      customer: 'Oliver Brown',
      vehicle: 'Porsche Taycan',
      assignee: 'Salsabeel Khaleel',
      assigneeId: 1,
      dealership: 'Milano',
      team: 'Sales (New)',
      status: 'no-show',
      noShowCount: 1,
      nsTaskCreatedAt: (() => {
        const threeDaysAgo = new Date()
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
        threeDaysAgo.setHours(16, 0, 0, 0)
        return threeDaysAgo.toISOString()
      })()
    }
  },
  {
    id: 2,
    customerId: 30,
    requestedCar: { 
      brand: 'BMW', 
      model: 'iX', 
      year: 2024,
      price: 105000,
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJtd3xlbnwwfHwwfHx8MA%3D%3D',
      dealership: 'Roma',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 15,
      requestMessage: 'Looking for an iX. What are the delivery times?'
    },
    vehicle: { 
      brand: 'BMW', 
      model: 'iX', 
      year: 2024,
      price: 105000,
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJtd3xlbnwwfHwwfHx8MA%3D%3D',
      dealership: 'Roma',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 15,
      requestMessage: 'Looking for an iX. What are the delivery times?'
    },
    stage: 'Closed Won',
    tags: ['Automation'],
    value: 105000,
    expectedCloseDate: '2025-03-20',
    assignee: 'David Miller',
    createdAt: '2024-11-15T10:00:00',
    lastActivity: '2024-12-25T16:45:00', // Delivery date - matches delivery activity
    contractDate: '2024-12-20T15:00:00' // Contract signed before delivery - perfect for DFB
  },
  {
    id: 4,
    customerId: 31,
    requestedCar: { 
      brand: 'Tesla', 
      model: 'Model S', 
      year: 2024,
      price: 95000,
      image: 'https://images.unsplash.com/photo-1648413653819-7c0fd93e8e6a?q=80&w=1065&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      vin: 'TSLA2024MODELS123',
      kilometers: 10,
      status: 'Used',
      fuelType: 'Electric',
      gearType: 'Automatic',
      registration: '04/2024',
      dealership: 'Milano',
      stockDays: 8,
      requestMessage: 'Interested in purchasing a Model S. What are the available financing options and delivery timeline?',
      fiscalEntity: 'MotorK',
      sourceDetails: 'Website Inquiry'
    },
    vehicle: { 
      brand: 'Tesla', 
      model: 'Model S', 
      year: 2024,
      price: 95000,
      image: 'https://images.unsplash.com/photo-1648413653819-7c0fd93e8e6a?q=80&w=1065&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      vin: 'TSLA2024MODELS123',
      kilometers: 10,
      status: 'Used',
      fuelType: 'Electric',
      gearType: 'Automatic',
      registration: '04/2024',
      dealership: 'Milano',
      stockDays: 8,
      requestMessage: 'Interested in purchasing a Model S. What are the available financing options and delivery timeline?',
      fiscalEntity: 'MotorK',
      sourceDetails: 'Website Inquiry'
    },
    stage: 'In Negotiation',
    tags: ['Premium'],
    value: 95000,
    expectedCloseDate: '2025-05-01',
    assignee: 'Salsabeel Khaleel', // Assign to manager so it shows up
    source: 'Google Ads',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 9) // 9 days ago
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 9) // 9 days ago - no recent activity (triggers Stuck Opportunity)
      return date.toISOString()
    })(),
    scheduledAppointment: null // No appointment scheduled
  },
  // REMOVED ID 5 - Duplicate of Qualified stage (ID 1)
  // REMOVED ID 6 - Duplicate of Qualified stage (ID 1)
  // REMOVED ID 7 - Duplicate of Awaiting Response stage (keeping ID 7 for this stage - actually keeping it)
  {
    id: 7,
    customerId: 32,
    requestedCar: { 
      brand: 'Mercedes-Benz', 
      model: 'EQS', 
      year: 2024,
      price: 110000,
      image: 'https://images.unsplash.com/photo-1599912027765-a69c78bfa3aa?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fG1lcmNlZGVzfGVufDB8fDB8fHww',
      dealership: 'Firenze',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 20,
      requestMessage: 'Interested in EQS. Need more information about features.'
    },
    vehicle: { 
      brand: 'Mercedes-Benz', 
      model: 'EQS', 
      year: 2024,
      price: 110000,
      image: 'https://images.unsplash.com/photo-1599912027765-a69c78bfa3aa?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fG1lcmNlZGVzfGVufDB8fDB8fHww',
      dealership: 'Firenze',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 20,
      requestMessage: 'Interested in EQS. Need more information about features.'
    },
    stage: 'Qualified',
    tags: [],
    value: 110000,
    expectedCloseDate: '2025-06-01',
    assignee: 'Michael Thomas',
    source: 'Google Ads',
    createdAt: '2024-12-20T10:00:00', // 7+ days ago (OOFB criteria)
    lastActivity: '2024-12-20T10:00:00'
    // No offers, no appointment - perfect for OOFB
  },
  // REMOVED ID 6 - Duplicate of Qualified stage (ID 1)
  {
    id: 5,
    customerId: 22,
    requestedCar: { 
      brand: 'Volkswagen', 
      model: 'ID.4', 
      year: 2024,
      price: 45000,
      image: 'https://images.unsplash.com/photo-1607853203100-69829c08b88e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dm9sa3N3YWdlbnxlbnwwfHwwfHx8MA%3D%3D',
      dealership: 'Roma',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: null,
      requestMessage: 'Looking for an ID.4. What are the available options?'
    },
    vehicle: { 
      brand: 'Volkswagen', 
      model: 'ID.4', 
      year: 2024,
      price: 45000,
      image: 'https://images.unsplash.com/photo-1607853203100-69829c08b88e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dm9sa3N3YWdlbnxlbnwwfHwwfHx8MA%3D%3D',
      dealership: 'Roma',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: null,
      requestMessage: 'Looking for an ID.4. What are the available options?'
    },
    stage: 'Qualified',
    tags: [],
    value: 45000,
    expectedCloseDate: '2025-07-01',
    assignee: 'Sarah Jenkins',
    source: 'Google Ads',
    createdAt: '2024-12-10T09:00:00', // 14+ days ago (UFB criteria)
    lastActivity: '2024-12-10T09:00:00'
    // No offers, no appointment - perfect for UFB
  },
  {
    id: 8,
    customerId: 33,
    requestedCar: { 
      brand: 'BMW', 
      model: 'i4', 
      year: 2024,
      price: 65000,
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fGNhcnxlbnwwfHwwfHx8MA%3D%3D',
      dealership: 'Milano',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 10,
      requestMessage: 'Interested in BMW i4. Need financing details.'
    },
    vehicle: { 
      brand: 'BMW', 
      model: 'i4', 
      year: 2024,
      price: 65000,
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fGNhcnxlbnwwfHwwfHx8MA%3D%3D',
      dealership: 'Milano',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 10,
      requestMessage: 'Interested in BMW i4. Need financing details.'
    },
    stage: 'In Negotiation',
    tags: ['Premium'],
    value: 65000,
    expectedCloseDate: '2025-04-15',
    assignee: 'David Miller',
    source: 'Google Ads',
    createdAt: '2024-12-15T11:00:00',
    lastActivity: '2024-12-20T14:00:00' // 5+ days in negotiation (OFB criteria)
    // Has offers (stage is In Negotiation) but no contract - perfect for OFB
  },
  {
    id: 9,
    customerId: 34,
    requestedCar: { 
      brand: 'Audi', 
      model: 'Q4 e-tron', 
      year: 2024,
      price: 55000,
      image: 'https://images.unsplash.com/photo-1589536672709-a5d34b12466d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGF1ZGl8ZW58MHx8MHx8fDA%3D',
      dealership: 'Firenze',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 18,
      requestMessage: 'Interested in Q4 e-tron. When can I test drive?'
    },
    vehicle: { 
      brand: 'Audi', 
      model: 'Q4 e-tron', 
      year: 2024,
      price: 55000,
      image: 'https://images.unsplash.com/photo-1589536672709-a5d34b12466d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGF1ZGl8ZW58MHx8MHx8fDA%3D',
      dealership: 'Firenze',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 18,
      requestMessage: 'Interested in Q4 e-tron. When can I test drive?'
    },
    stage: 'In Negotiation',
    tags: [],
    value: 55000,
    expectedCloseDate: '2025-05-20',
    assignee: 'Michael Thomas',
    source: 'Google Ads',
    createdAt: '2024-12-18T10:00:00',
    lastActivity: '2024-12-25T15:00:00',
    contractDate: null // No contract date - perfect for NFU
    // In Negotiation, no contract date, no appointment - perfect for NFU
  },
  {
    id: 10,
    customerId: 34,
    requestedCar: { 
      brand: 'Porsche', 
      model: 'Macan Electric', 
      year: 2024,
      price: 85000,
      image: 'https://images.unsplash.com/photo-1613246922662-c0b007a418d5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjQzfHxjYXJ8ZW58MHx8MHx8fDA%3D',
      dealership: 'Milano',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 5,
      requestMessage: 'Interested in Macan Electric. Ready to proceed.'
    },
    vehicle: { 
      brand: 'Porsche', 
      model: 'Macan Electric', 
      year: 2024,
      price: 85000,
      image: 'https://images.unsplash.com/photo-1613246922662-c0b007a418d5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjQzfHxjYXJ8ZW58MHx8MHx8fDA%3D',
      dealership: 'Milano',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 5,
      requestMessage: 'Interested in Macan Electric. Ready to proceed.'
    },
    stage: 'Closed Won',
    tags: ['Premium'],
    value: 85000,
    expectedCloseDate: '2025-01-15',
    assignee: 'Sarah Jenkins',
    source: 'Google Ads',
    createdAt: '2024-12-01T09:00:00',
    lastActivity: '2024-12-22T16:00:00',
    contractDate: '2024-12-22T16:00:00' // Contract signed date - perfect for CFB
    // Closed Won (contract signed) but not delivered yet - perfect for CFB
  },
  {
    id: 24,
    customerId: 23,
    requestedCar: {
      brand: 'Mercedes-Benz', 
      model: 'EQC', 
      year: 2024,
      price: 75000,
      image: 'https://images.unsplash.com/photo-1605822102629-918beea85679?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDh8fGJtd3xlbnwwfHwwfHx8MA%3D%3D',
      dealership: 'Roma',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 14,
      requestMessage: 'Interested in EQC. Need information about charging infrastructure.'
    },
    vehicle: { 
      brand: 'Mercedes-Benz', 
      model: 'EQC', 
      year: 2024,
      price: 75000,
      image: 'https://images.unsplash.com/photo-1605822102629-918beea85679?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDh8fGJtd3xlbnwwfHwwfHx8MA%3D%3D',
      dealership: 'Roma',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 14,
      requestMessage: 'Interested in EQC. Need information about charging infrastructure.'
    },
    stage: 'In Negotiation',
    tags: [],
    value: 75000,
    expectedCloseDate: '2025-05-10',
    assignee: 'David Miller',
    source: 'Google Ads',
    createdAt: '2024-12-05T10:00:00',
    lastActivity: '2024-12-15T11:00:00', // 10+ days in negotiation (UFB criteria)
    contractDate: null // No contract date - perfect for UFB (In Negotiation)
    // In Negotiation for 10+ days without contract - perfect for UFB
  },
  {
    id: 27,
    customerId: 35,
    requestedCar: { 
      brand: 'BMW', 
      model: 'iX3', 
      year: 2024,
      price: 68000,
      image: 'https://images.unsplash.com/photo-1546518071-fddcdda7580a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWVyY2VkZXN8ZW58MHx8MHx8fDA%3D',
      dealership: 'Firenze',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 22,
      requestMessage: 'Interested in iX3. What are the warranty terms?'
    },
    vehicle: { 
      brand: 'BMW', 
      model: 'iX3', 
      year: 2024,
      price: 68000,
      image: 'https://images.unsplash.com/photo-1546518071-fddcdda7580a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWVyY2VkZXN8ZW58MHx8MHx8fDA%3D',
      dealership: 'Firenze',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 22,
      requestMessage: 'Interested in iX3. What are the warranty terms?'
    },
    stage: 'In Negotiation',
    tags: ['Automation'],
    value: 68000,
    expectedCloseDate: '2025-04-20',
    assignee: 'Michael Thomas',
    source: 'Google Ads',
    createdAt: '2024-12-10T09:00:00',
    lastActivity: '2024-12-20T14:00:00',
    contractDate: '2024-12-20T14:00:00' // Has contract date - stage mapper will show "Contract Pending"
    // In Negotiation with contract date - stage mapper calculates to "Contract Pending"
  },
  // REMOVED ID 12 - Duplicate of Awaiting Response stage (keeping ID 7 for this stage)
  // REMOVED ID 13 - Duplicate of Qualified stage (ID 1)
  // REMOVED ID 14 - Duplicate of Qualified stage (ID 1)
  // Opportunity 15 (Daniel Kim)
  {
    id: 15,
    customerId: 24,
    requestedCar: { 
      brand: 'Audi', 
      model: 'A6 e-tron', 
      year: 2024,
      price: 90000,
      image: 'https://images.unsplash.com/photo-1589536672709-a5d34b12466d?w=900&auto=format&fit=crop&q=60',
      dealership: 'Milano',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: null,
      requestMessage: 'Interested in A6 e-tron. When can I schedule a test drive?'
    },
    vehicle: { 
      brand: 'Audi', 
      model: 'A6 e-tron', 
      year: 2024,
      price: 90000,
      image: 'https://images.unsplash.com/photo-1589536672709-a5d34b12466d?w=900&auto=format&fit=crop&q=60',
      dealership: 'Milano',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: null,
      requestMessage: 'Interested in A6 e-tron. When can I schedule a test drive?'
    },
    stage: 'In Negotiation',
    tags: [],
    value: 90000,
    expectedCloseDate: '2025-05-05',
    assignee: 'Sarah Jenkins',
    source: 'Google Ads',
    createdAt: '2024-12-12T11:00:00',
    lastActivity: '2024-12-18T10:00:00',
    contractDate: null, // No contract date
    scheduledAppointment: {
      id: 21,
      title: 'Test Drive - Daniel Kim',
      start: '2026-01-10T14:00:00', // Future appointment
      end: '2026-01-10T15:00:00',
      type: 'appointment',
      customer: 'Daniel Kim',
      vehicle: 'Audi A6 e-tron',
      assignee: 'Sarah Jenkins',
      assigneeId: 2,
      dealership: 'Milano',
      team: 'Sales (New)',
      status: 'confirmed'
    }
    // In Negotiation with future appointment - should NOT show NFU
  },
  // REMOVED ID 13 - Duplicate of Qualified stage (ID 1)
  // REMOVED ID 14 - Duplicate of Qualified stage (ID 1)
  {
    id: 16,
    customerId: 36,
    requestedCar: { 
      brand: 'BMW', 
      model: 'i5', 
      year: 2024,
      price: 72000,
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJtd3xlbnwwfHwwfHx8MA%3D%3D',
      dealership: 'Firenze',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: null,
      requestMessage: 'Looking for BMW i5. Interested in test drive.'
    },
    vehicle: { 
      brand: 'BMW', 
      model: 'i5', 
      year: 2024,
      price: 72000,
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJtd3xlbnwwfHwwfHx8MA%3D%3D',
      dealership: 'Firenze',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: null,
      requestMessage: 'Looking for BMW i5. Interested in test drive.'
    },
    stage: 'Closed Lost',
    tags: [],
    value: 72000,
    expectedCloseDate: null,
    assignee: 'Sarah Jenkins',
    source: 'Google Ads',
    createdAt: '2025-02-10T09:00:00',
    lastActivity: '2025-03-01T15:00:00',
    contractDate: null,
    closedReason: 'Customer found better price at competitor',
    closedDate: '2025-03-01T15:00:00'
    // Closed Lost - terminal state, no widgets should appear
  },
  // ========================================
  // STATE MACHINE COVERAGE - All Stage Permutations
  // ========================================
  {
    id: 18,
    customerId: 37,
    requestedCar: { 
      brand: 'Audi', 
      model: 'A4', 
      year: 2024,
      price: 52000,
      image: 'https://images.unsplash.com/photo-1589536672709-a5d34b12466d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGF1ZGl8ZW58MHx8MHx8fDA%3D',
      dealership: 'Firenze',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 7,
      requestMessage: 'Interested in Audi A4. Scheduled appointment.'
    },
    vehicle: { 
      brand: 'Audi', 
      model: 'A4', 
      year: 2024,
      price: 52000,
      image: 'https://images.unsplash.com/photo-1589536672709-a5d34b12466d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGF1ZGl8ZW58MHx8MHx8fDA%3D',
      dealership: 'Firenze',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 7,
      requestMessage: 'Interested in Audi A4. Scheduled appointment.'
    },
    stage: 'Qualified',
    tags: [],
    value: 52000,
    expectedCloseDate: '2025-04-20',
    assignee: 'Salsabeel Khaleel',
    source: 'Google Ads',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 2)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString()
    })(),
    scheduledAppointment: {
      id: 23,
      title: 'Appointment - Rachel Green',
      start: (() => {
        const date = new Date()
        date.setDate(date.getDate() + 2) // Future appointment
        date.setHours(14, 0, 0, 0)
        return date.toISOString()
      })(),
      end: (() => {
        const date = new Date()
        date.setDate(date.getDate() + 2)
        date.setHours(15, 0, 0, 0)
        return date.toISOString()
      })(),
      type: 'appointment',
      customer: 'Rachel Green',
      vehicle: 'Audi A4',
      assignee: 'Salsabeel Khaleel',
      assigneeId: 1,
      dealership: 'Firenze',
      team: 'Sales (New)',
      status: 'confirmed',
      noShowCount: 0
    }
    // STAGE: Awaiting Appointment (has future scheduledAppointment)
  },
  // REMOVED ID 20 - Duplicate of Offer Sent stage (keeping ID 8 for this stage)
  // REMOVED ID 21 - Duplicate of Awaiting Response stage (keeping ID 7 for this stage)
  // REMOVED ID 22 - Duplicate of Contract Pending stage (keeping ID 11 for this stage)
  {
    id: 25,
    customerId: 28,
    requestedCar: { 
      brand: 'Mercedes-Benz', 
      model: 'C-Class', 
      year: 2024,
      price: 58000,
      image: 'https://images.unsplash.com/photo-1599912027765-a69c78bfa3aa?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fG1lcmNlZGVzfGVufDB8fDB8fHww',
      dealership: 'Milano',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 9,
      requestMessage: 'Interested in C-Class. Offer sent recently.'
    },
    vehicle: { 
      brand: 'Mercedes-Benz', 
      model: 'C-Class', 
      year: 2024,
      price: 58000,
      image: 'https://images.unsplash.com/photo-1599912027765-a69c78bfa3aa?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fG1lcmNlZGVzfGVufDB8fDB8fHww',
      dealership: 'Milano',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 9,
      requestMessage: 'Interested in C-Class. Offer sent recently.'
    },
    stage: 'In Negotiation',
    tags: [],
    value: 58000,
    expectedCloseDate: '2025-04-15',
    assignee: 'Sarah Jenkins',
    source: 'Google Ads',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 10)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1) // Offer sent 1 day ago (less than 3 days)
      return date.toISOString()
    })()
    // STAGE: In Negotiation (has offer activity less than 3 days old - will be calculated by stageMapper)
  },
  // REMOVED ID 21 - Duplicate of Awaiting Response stage (keeping ID 7 for this stage)
  {
    id: 28,
    customerId: 29,
    requestedCar: { 
      brand: 'BMW', 
      model: '3 Series', 
      year: 2024,
      price: 50000,
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fGNhcnxlbnwwfHwwfHx8MA%3D%3D',
      dealership: 'Firenze',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 11,
      requestMessage: 'Interested in 3 Series. Offer pending review.'
    },
    vehicle: { 
      brand: 'BMW', 
      model: '3 Series', 
      year: 2024,
      price: 50000,
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fGNhcnxlbnwwfHwwfHx8MA%3D%3D',
      dealership: 'Firenze',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 11,
      requestMessage: 'Interested in 3 Series. Offer pending review.'
    },
    stage: 'In Negotiation',
    tags: [],
    value: 50000,
    expectedCloseDate: '2025-04-20',
    assignee: 'Michael Thomas',
    source: 'Google Ads',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 15)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 4) // Offer sent 4 days ago (3+ days)
      return date.toISOString()
    })()
    // STAGE: Awaiting Response (has offer activity 3+ days old - will be calculated by stageMapper)
  },
  {
    id: 22,
    customerId: 26,
    requestedCar: {
      brand: 'BMW', 
      model: '3 Series', 
      year: 2024,
      price: 50000,
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fGNhcnxlbnwwfHwwfHx8MA%3D%3D',
      dealership: 'Firenze',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 11,
      requestMessage: 'Interested in 3 Series. Offer pending review.'
    },
    vehicle: { 
      brand: 'BMW', 
      model: '3 Series', 
      year: 2024,
      price: 50000,
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fGNhcnxlbnwwfHwwfHx8MA%3D%3D',
      dealership: 'Firenze',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 11,
      requestMessage: 'Interested in 3 Series. Offer pending review.'
    },
    stage: 'In Negotiation',
    tags: [],
    value: 50000,
    expectedCloseDate: '2025-04-20',
    assignee: 'Michael Thomas',
    source: 'Google Ads',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 15)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 4) // Offer sent 4 days ago (3+ days)
      return date.toISOString()
    })()
    // STAGE: Awaiting Response (has offer activity 3+ days old - will be calculated by stageMapper)
  },
  // REMOVED ID 22 - Duplicate of Contract Pending stage (keeping ID 11 for this stage)
  {
    id: 23,
    customerId: 27,
    requestedCar: { 
      brand: 'Porsche', 
      model: '911', 
      year: 2024,
      price: 150000,
      image: 'https://images.unsplash.com/photo-1613246922662-c0b007a418d5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjQzfHxjYXJ8ZW58MHx8MHx8fDA%3D',
      dealership: 'Milano',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 3,
      requestMessage: 'Interested in 911. Contract pending.'
    },
    vehicle: { 
      brand: 'Porsche', 
      model: '911', 
      year: 2024,
      price: 150000,
      image: 'https://images.unsplash.com/photo-1613246922662-c0b007a418d5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjQzfHxjYXJ8ZW58MHx8MHx8fDA%3D',
      dealership: 'Milano',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 3,
      requestMessage: 'Interested in 911. Contract pending.'
    },
    stage: 'In Negotiation',
    tags: ['Premium'],
    value: 150000,
    expectedCloseDate: '2025-03-25',
    assignee: 'Salsabeel Khaleel',
    source: 'Google Ads',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 20)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 5)
      return date.toISOString()
    })(),
    contractDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 2) // Contract date set 2 days ago
      return date.toISOString()
    })()
    // STAGE: Contract Pending (has contractDate but stage is In Negotiation - will be calculated by stageMapper)
  },
  {
    id: 26,
    customerId: 25,
    requestedCar: { 
      brand: 'Tesla', 
      model: 'Model Y', 
      year: 2024,
      price: 55000,
      image: 'https://images.unsplash.com/photo-1648413653819-7c0fd93e8e6a?q=80&w=1065&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      dealership: 'Firenze',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 6,
      requestMessage: 'Interested in Model Y. Delivery scheduled.'
    },
    vehicle: { 
      brand: 'Tesla', 
      model: 'Model Y', 
      year: 2024,
      price: 55000,
      image: 'https://images.unsplash.com/photo-1648413653819-7c0fd93e8e6a?q=80&w=1065&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      dealership: 'Firenze',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 6,
      requestMessage: 'Interested in Model Y. Delivery scheduled.'
    },
    stage: 'Closed Won',
    tags: [],
    value: 55000,
    expectedCloseDate: '2025-03-30',
    assignee: 'David Miller',
    source: 'Google Ads',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 30)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 3)
      return date.toISOString()
    })(),
    contractDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 10)
      return date.toISOString()
    })(),
    deliveryDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 5) // Delivery scheduled for 5 days from now
      return date.toISOString()
    })()
    // STAGE: Closed Won - Awaiting Delivery (has deliveryDate but no delivery activity - substatus will be calculated)
  },
  // Opportunity for customer 3
  {
    id: 100,
    customerId: 3,
    requestedCar: {
      brand: 'BMW',
      model: 'M4 Coupe',
      year: 2024,
      price: 85000,
      image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=900&auto=format&fit=crop&q=60',
      dealership: 'Berlin',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 15,
      requestMessage: 'Interested in sporty coupes for weekend driving.'
    },
    vehicle: null,
    selectedVehicle: null,
    stage: 'Qualified',
    tags: ['Hot'],
    value: 85000,
    expectedCloseDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 30)
      return date.toISOString().split('T')[0]
    })(),
    assignee: 'David Miller',
    source: 'Google Ads',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 5)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 2)
      return date.toISOString()
    })(),
    scheduledAppointment: null
  },
  // Opportunity for customer 5
  {
    id: 101,
    customerId: 5,
    requestedCar: {
      brand: 'Audi',
      model: 'Q4 e-tron',
      year: 2024,
      price: 55000,
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=900&auto=format&fit=crop&q=60',
      dealership: 'Firenze',
      fuelType: 'Electric',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 12,
      requestMessage: 'Looking for family vehicle with good fuel economy.'
    },
    vehicle: null,
    selectedVehicle: null,
    stage: 'Qualified',
    tags: [],
    value: 55000,
    expectedCloseDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 35)
      return date.toISOString().split('T')[0]
    })(),
    assignee: 'Salsabeel Khaleel',
    source: 'Facebook',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 3)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 4)
      return date.toISOString()
    })(),
    scheduledAppointment: null
  },
  // Opportunity for customer 6
  {
    id: 102,
    customerId: 6,
    requestedCar: {
      brand: 'Mercedes-Benz',
      model: 'C-Class',
      year: 2024,
      price: 45000,
      image: 'https://images.unsplash.com/photo-1613246922662-c0b007a418d5?w=900&auto=format&fit=crop&q=60',
      dealership: 'Berlin',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 8,
      requestMessage: 'Looking for reliable sedan for daily commute.'
    },
    vehicle: null,
    selectedVehicle: null,
    stage: 'Qualified',
    tags: [],
    value: 45000,
    expectedCloseDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 40)
      return date.toISOString().split('T')[0]
    })(),
    assignee: 'Michael Thomas',
    source: 'Google Ads',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 6)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString()
    })(),
    scheduledAppointment: null
  },
  // Opportunity for customer 7
  {
    id: 103,
    customerId: 7,
    requestedCar: {
      brand: 'Volkswagen',
      model: 'Tiguan',
      year: 2024,
      price: 38000,
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=900&auto=format&fit=crop&q=60',
      dealership: 'Hamburg',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 10,
      requestMessage: 'Family buyer seeking spacious SUV.'
    },
    vehicle: null,
    selectedVehicle: null,
    stage: 'Qualified',
    tags: [],
    value: 38000,
    expectedCloseDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 45)
      return date.toISOString().split('T')[0]
    })(),
    assignee: 'Sarah Jenkins',
    source: 'Google Ads',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 4)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 5)
      return date.toISOString()
    })(),
    scheduledAppointment: null
  },
  // Opportunity for customer 8
  {
    id: 104,
    customerId: 8,
    requestedCar: {
      brand: 'Audi',
      model: 'A6',
      year: 2024,
      price: 65000,
      image: 'https://images.unsplash.com/photo-1589536672709-a5d34b12466d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGF1ZGl8ZW58MHx8MHx8fDA%3D',
      dealership: 'Düsseldorf',
      fuelType: 'Petrol',
      gearType: 'Automatic',
      kilometers: 0,
      status: 'New',
      stockDays: 8,
      requestMessage: 'Executive looking for premium sedan for business use.'
    },
    vehicle: null,
    selectedVehicle: null,
    stage: 'Qualified',
    tags: [],
    value: 65000,
    expectedCloseDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 50)
      return date.toISOString().split('T')[0]
    })(),
    assignee: 'Michael Thomas',
    source: 'Walk-in',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 3)
      return date.toISOString()
    })(),
    lastActivity: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString()
    })(),
    scheduledAppointment: null
  },
  // Additional opportunities for showcasing carousel - Customers 1-20
  ...additionalOpportunitiesForCarousel
]

// Tasks are separate entities that can be associated with customers, leads, or opportunities
export const mockTasks = [
  {
    id: 1,
    title: 'Follow up on test drive request',
    description: 'Customer requested test drive for Audi A6 Allroad. Schedule appointment.',
    status: 'active',
    priority: 'high',
    dueDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 1)
      return date.toISOString()
    })(),
    customerId: 1,
    leadId: 21,
    opportunityId: null,
    assignee: 'Salsabeel Khaleel',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString()
    })()
  },
  {
    id: 2,
    title: 'Send quotation for Mercedes EQS',
    description: 'Prepare and send detailed quotation for EQS model.',
    status: 'active',
    priority: 'normal',
    dueDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 2)
      return date.toISOString()
    })(),
    customerId: 2,
    leadId: 2,
    opportunityId: null,
    assignee: 'Sarah Jenkins',
    createdAt: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 5)
      return date.toISOString()
    })()
  },
  {
    id: 3,
    title: 'Review financing options',
    description: 'Customer needs financing information for Audi e-tron GT purchase.',
    status: 'active',
    priority: 'high',
    dueDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 3)
      return date.toISOString()
    })(),
    customerId: 21,
    leadId: null,
    opportunityId: 1,
    assignee: 'Salsabeel Khaleel',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString()
    })()
  },
  {
    id: 4,
    title: 'Schedule delivery date',
    description: 'Coordinate delivery date for Porsche Taycan purchase.',
    status: 'active',
    priority: 'normal',
    dueDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 5)
      return date.toISOString()
    })(),
    customerId: 30,
    leadId: null,
    opportunityId: 3,
    assignee: 'Salsabeel Khaleel',
    createdAt: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 2)
      return date.toISOString()
    })()
  },
  {
    id: 5,
    title: 'Customer contact verification',
    description: 'Verify customer contact details and preferred communication method.',
    status: 'active',
    priority: 'normal',
    dueDate: (() => {
      const date = new Date()
      date.setHours(date.getHours() + 4)
      return date.toISOString()
    })(),
    customerId: 3,
    leadId: 3,
    opportunityId: null,
    assignee: 'David Miller',
    createdAt: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 1)
      return date.toISOString()
    })()
  },
  {
    id: 6,
    title: 'Prepare trade-in evaluation',
    description: 'Customer wants to trade in their current vehicle. Schedule evaluation.',
    status: 'active',
    priority: 'normal',
    dueDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 7)
      return date.toISOString()
    })(),
    customerId: 4,
    leadId: null,
    opportunityId: null,
    assignee: 'Sarah Jenkins',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 2)
      return date.toISOString()
    })()
  },
  {
    id: 7,
    title: 'Follow up on offer response',
    description: 'Customer received offer for BMW iX. Follow up on their response.',
    status: 'active',
    priority: 'high',
    dueDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 1)
      return date.toISOString()
    })(),
    customerId: 30,
    leadId: null,
    opportunityId: 2,
    assignee: 'Salsabeel Khaleel',
    createdAt: (() => {
      const date = new Date()
      date.setHours(date.getHours() - 3)
      return date.toISOString()
    })()
  },
  {
    id: 8,
    title: 'Complete paperwork',
    description: 'Complete all necessary paperwork for Tesla Model S purchase.',
    status: 'active',
    priority: 'normal',
    dueDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 4)
      return date.toISOString()
    })(),
    customerId: 31,
    leadId: null,
    opportunityId: 4,
    assignee: 'Salsabeel Khaleel',
    createdAt: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString()
    })()
  }
]

export const mockContacts = [
  {
    id: 1,
    customerId: 1,
    name: 'Josh Adams',
    initials: 'JA',
    email: 'josh.adams@example.com',
    phone: '+4901564879300',
    address: 'Via Torino 56, 20123 Milan',
    company: 'Tech Solutions GmbH',
    source: 'Google Ads',
    tags: ['Premium', 'Automation'],
    createdAt: '2025-03-21T08:17:00',
    lastContact: '2025-03-25T14:30:00',
    requestedCar: null
  },
  {
    id: 2,
    customerId: 2,
    name: 'Emma Watson',
    initials: 'EW',
    email: 'emma.watson@example.com',
    phone: '+4901234567890',
    address: 'Hauptstraße 12, 10115 Berlin',
    company: 'Fashion International',
    source: 'Google Ads',
    tags: [],
    createdAt: '2025-03-20T10:15:00',
    lastContact: '2025-03-24T16:20:00',
    requestedCar: null
  },
  {
    id: 999,
    customerId: 999,
    name: 'Test Contact with Car',
    initials: 'TC',
    email: 'test.contact@example.com',
    phone: '+4901234567999',
    address: 'Test Street 123, 10115 Berlin',
    company: null,
    source: 'Immo-scout',
    tags: ['Test'],
    createdAt: '2025-01-04T10:00:00',
    lastContact: '2025-01-04T10:00:00',
    requestedCar: {
      brand: 'BMW',
      model: '3 Series',
      year: 2024,
      price: 45000,
      requestType: 'Quotation',
      requestMessage: 'Interested in this model for company fleet',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500'
    }
  }
]

export const mockVehicles = [
  {
    id: 1,
    brand: 'Volkswagen',
    model: 'ID.4',
    year: 2024,
    vin: '7015733W8749',
    status: 'New',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1607853203100-69829c08b88e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dm9sa3N3YWdlbnxlbnwwfHwwfHx8MA%3D%3D',
    kilometers: 0,
    fuelType: 'Electric',
    gearType: 'Automatic',
    dealership: 'Firenze',
    stockDays: 15,
    color: 'Blue',
    requestedBy: ['Josh Adams']
  },
  {
    id: 2,
    brand: 'Mercedes-Benz',
    model: 'EQS',
    year: 2024,
    vin: '8912345X6789',
    status: 'New',
    price: 95000,
    image: 'https://images.unsplash.com/photo-1546518071-fddcdda7580a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWVyY2VkZXN8ZW58MHx8MHx8fDA%3D',
    kilometers: 0,
    fuelType: 'Electric',
    gearType: 'Automatic',
    dealership: 'Berlin Mitte',
    stockDays: 42,
    color: 'Black',
    requestedBy: ['Emma Watson']
  },
  {
    id: 3,
    brand: 'Audi',
    model: 'A6 Allroad',
    year: 2023,
    vin: '7015733W8750',
    status: 'Used',
    price: 19000,
    image: 'https://images.unsplash.com/photo-1589536672709-a5d34b12466d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGF1ZGl8ZW58MHx8MHx8fDA%3D',
    kilometers: 10,
    fuelType: 'Petrol',
    gearType: 'Manual',
    dealership: 'Firenze',
    stockDays: 412,
    color: 'Silver',
    requestedBy: []
  },
  {
    id: 4,
    brand: 'BMW',
    model: 'X5',
    year: 2024,
    vin: 'BMW2024X5001',
    status: 'New',
    price: 75000,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGJtd3xlbnwwfHwwfHx8MA%3D%3D',
    kilometers: 0,
    fuelType: 'Petrol',
    gearType: 'Automatic',
    dealership: 'Milano',
    stockDays: 8,
    color: 'Black',
    requestedBy: []
  },
  {
    id: 5,
    brand: 'BMW',
    model: 'iX',
    year: 2024,
    vin: 'BMW2024IX001',
    status: 'New',
    price: 105000,
    image: 'https://images.unsplash.com/photo-1605822102629-918beea85679?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDh8fGJtd3xlbnwwfHwwfHx8MA%3D%3D',
    kilometers: 0,
    fuelType: 'Electric',
    gearType: 'Automatic',
    dealership: 'Roma',
    stockDays: 15,
    color: 'White',
    requestedBy: []
  }
]

// Calendar filter options
export const calendarEventTypes = [
  { value: 'test-drive', label: 'Test Drive', category: 'negotiation' },
  { value: 'appointment', label: 'Dealership Visit', category: 'negotiation' },
  { value: 'offsite', label: 'Offsite Visit', category: 'negotiation' },
  { value: 'workshop', label: 'Workshop', category: 'negotiation' },
  { value: 'call', label: 'Call', category: 'negotiation' },
  { value: 'delivery', label: 'Delivery', category: 'negotiation' },
  { value: 'recall', label: 'Recall', category: 'negotiation' },
  { value: 'absence', label: 'Absence', category: 'reminder' },
  { value: 'leave', label: 'Leave', category: 'reminder' },
  { value: 'marketing', label: 'Marketing Event', category: 'reminder' },
  { value: 'memo', label: 'Memo', category: 'reminder' },
  { value: 'training', label: 'Training', category: 'reminder' },
  { value: 'meeting', label: 'Meeting', category: 'negotiation' },
  { value: 'other', label: 'Other', category: 'reminder' }
]

export const calendarDealerships = [
  { id: 1, name: 'Bari' },
  { id: 2, name: 'Firenze' },
  { id: 3, name: 'Milano' },
  { id: 4, name: 'Roma' },
  { id: 5, name: 'Trento' }
]

export const calendarTeams = [
  { id: 1, name: 'BDC' },
  { id: 2, name: 'Call Center' },
  { id: 3, name: 'General' },
  { id: 4, name: 'Service' },
  { id: 5, name: 'Sales (New)' },
  { id: 6, name: 'Sales (Rent)' },
  { id: 7, name: 'Sales (Used)' }
]

export const mockCalendarEvents = [
  {
    id: 4,
    title: 'Meeting - Oliver Brown',
    start: '2025-12-20T11:00:00',
    end: '2025-12-20T12:00:00',
    type: 'meeting',
    customer: 'Oliver Brown',
    customerId: 5,
    opportunityId: 2,
    vehicle: 'Porsche Taycan',
    assignee: 'Sarah Jenkins',
    assigneeId: 2,
    dealership: 'Milano',
    team: 'Sales (New)',
    status: 'confirmed',
    noShowCount: 0,
    previousAppointmentId: null
  },
  {
    id: 5,
    title: 'Test Drive - Emma Wilson',
    start: '2025-12-21T13:00:00',
    end: '2025-12-21T14:00:00',
    type: 'test-drive',
    customer: 'Emma Wilson',
    customerId: 21,
    opportunityId: 1,
    vehicle: 'Audi e-tron GT',
    assignee: 'Salsabeel Khaleel',
    assigneeId: 1,
    dealership: 'Firenze',
    team: 'Sales (New)',
    status: 'confirmed',
    noShowCount: 0,
    previousAppointmentId: null
  },
  {
    id: 6,
    title: 'Dealership Visit - Sophia Martinez',
    start: '2025-12-22T10:00:00',
    end: '2025-12-22T11:00:00',
    type: 'appointment',
    customer: 'Sophia Martinez',
    customerId: 6,
    vehicle: 'BMW iX',
    assignee: 'David Miller',
    assigneeId: 3,
    dealership: 'Roma',
    team: 'Sales (New)',
    status: 'cancelled',
    noShowCount: 0
  },
  {
    id: 7,
    title: 'Follow-up Call - Josh Adams',
    start: '2025-12-23T15:00:00',
    end: '2025-12-23T15:30:00',
    type: 'call',
    customer: 'Josh Adams',
    customerId: 1,
    assignee: 'Salsabeel Khaleel',
    assigneeId: 1,
    dealership: 'Firenze',
    team: 'BDC',
    status: 'no-show',
    noShowCount: 1
  },
  {
    id: 8,
    title: 'Test Drive - Emma Watson',
    start: '2025-12-26T09:00:00',
    end: '2025-12-26T10:00:00',
    type: 'test-drive',
    customer: 'Emma Watson',
    customerId: 2,
    vehicle: 'Mercedes-Benz EQS',
    assignee: 'Sarah Jenkins',
    assigneeId: 2,
    dealership: 'Milano',
    team: 'Sales (New)',
    status: 'confirmed',
    noShowCount: 0
  },
  {
    id: 9,
    title: 'Meeting - Oliver Brown',
    start: '2025-12-27T14:00:00',
    end: '2025-12-27T15:30:00',
    type: 'meeting',
    customer: 'Oliver Brown',
    customerId: 5,
    vehicle: 'Porsche Taycan',
    assignee: 'Sarah Jenkins',
    assigneeId: 2,
    dealership: 'Milano',
    team: 'Sales (New)',
    status: 'confirmed',
    noShowCount: 0
  },
  {
    id: 10,
    title: 'Dealership Visit - Emma Wilson',
    start: '2025-12-28T11:00:00',
    end: '2025-12-28T12:00:00',
    type: 'appointment',
    customer: 'Emma Wilson',
    customerId: 21,
    opportunityId: 1,
    vehicle: 'Audi e-tron GT',
    assignee: 'Salsabeel Khaleel',
    assigneeId: 1,
    dealership: 'Firenze',
    team: 'Sales (New)',
    status: 'confirmed',
    noShowCount: 0,
    previousAppointmentId: null
  },
  {
    id: 11,
    title: 'Workshop - Vehicle Inspection',
    start: '2025-12-29T09:00:00',
    end: '2025-12-29T12:00:00',
    type: 'workshop',
    customer: 'Josh Adams',
    customerId: 1,
    vehicle: 'Audi A6 Allroad',
    assignee: 'David Miller',
    assigneeId: 3,
    dealership: 'Firenze',
    team: 'Service',
    status: 'confirmed',
    noShowCount: 0
  },
  {
    id: 12,
    title: 'Delivery - BMW iX',
    start: '2025-12-30T14:00:00',
    end: '2025-12-30T15:00:00',
    type: 'delivery',
    customer: 'Sophia Martinez',
    customerId: 6,
    vehicle: 'BMW iX',
    assignee: 'David Miller',
    assigneeId: 3,
    dealership: 'Roma',
    team: 'Sales (New)',
    status: 'confirmed',
    noShowCount: 0
  },
  {
    id: 13,
    title: 'Training - New CRM Features',
    start: '2026-01-02T10:00:00',
    end: '2026-01-02T12:00:00',
    type: 'training',
    assignee: 'Salsabeel Khaleel',
    assigneeId: 1,
    dealership: 'Milano',
    team: 'General',
    status: 'confirmed'
  },
  {
    id: 14,
    title: 'Marketing Event - New Year Sale Launch',
    start: '2026-01-03T09:00:00',
    end: '2026-01-03T18:00:00',
    type: 'marketing',
    assignee: 'Sarah Jenkins',
    assigneeId: 2,
    dealership: 'Milano',
    team: 'General',
    status: 'confirmed'
  },
  {
    id: 15,
    title: 'Offsite Visit - Liam Johnson',
    start: '2026-01-06T11:00:00',
    end: '2026-01-06T12:30:00',
    type: 'offsite',
    customer: 'Liam Johnson',
    customerId: 3,
    vehicle: 'Mercedes-Benz EQS',
    assignee: 'Natalia Sung',
    assigneeId: 4,
    dealership: 'Bari',
    team: 'Sales (New)',
    status: 'confirmed'
  },
  {
    id: 16,
    title: 'Leave - Winter Vacation',
    start: '2026-01-07T00:00:00',
    end: '2026-01-10T23:59:59',
    type: 'leave',
    assignee: 'Sarah Jenkins',
    assigneeId: 2,
    team: 'Sales (New)',
    status: 'confirmed'
  },
  {
    id: 17,
    title: 'Call - Follow-up Emma Wilson',
    start: '2026-01-08T10:00:00',
    end: '2026-01-08T10:30:00',
    type: 'call',
    customer: 'Emma Wilson',
    customerId: 21,
    assignee: 'Salsabeel Khaleel',
    assigneeId: 1,
    dealership: 'Firenze',
    team: 'BDC',
    status: 'confirmed'
  },
  {
    id: 18,
    title: 'Test Drive - Marco Rossi',
    start: '2026-01-09T15:00:00',
    end: '2026-01-09T16:00:00',
    type: 'test-drive',
    customer: 'Marco Rossi',
    vehicle: 'Volkswagen ID.4',
    assignee: 'Natalia Sung',
    assigneeId: 4,
    dealership: 'Trento',
    team: 'Sales (New)',
    status: 'confirmed'
  },
  {
    id: 19,
    title: 'Memo - Q1 Targets Review',
    start: '2026-01-13T09:00:00',
    end: '2026-01-13T09:30:00',
    type: 'memo',
    assignee: 'David Miller',
    assigneeId: 3,
    team: 'General',
    status: 'confirmed'
  },
  {
    id: 20,
    title: 'Recall - Safety Check',
    start: '2026-01-15T08:00:00',
    end: '2026-01-15T17:00:00',
    type: 'recall',
    vehicle: 'Various Models',
    assignee: 'David Miller',
    assigneeId: 3,
    dealership: 'Roma',
    team: 'Service',
    status: 'confirmed'
  },
  // Test-drive events for showcasing carousel - Customers 1-20
  {
    id: 25,
    title: 'Test Drive - Josh Adams',
    start: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 5)
      date.setHours(14, 0, 0, 0)
      return date.toISOString()
    })(),
    end: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 5)
      date.setHours(15, 0, 0, 0)
      return date.toISOString()
    })(),
    type: 'test-drive',
    customer: 'Josh Adams',
    customerId: 1,
    opportunityId: 30,
    vehicle: 'Audi Q5',
    assignee: 'Sarah Jenkins',
    assigneeId: 2,
    dealership: 'Milan',
    team: 'Sales (New)',
    status: 'confirmed',
    noShowCount: 0,
    previousAppointmentId: null
  },
  {
    id: 26,
    title: 'Test Drive - Liam Johnson',
    start: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 3)
      date.setHours(10, 0, 0, 0)
      return date.toISOString()
    })(),
    end: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 3)
      date.setHours(11, 0, 0, 0)
      return date.toISOString()
    })(),
    type: 'test-drive',
    customer: 'Liam Johnson',
    customerId: 3,
    vehicle: 'BMW M4 Coupe',
    assignee: 'Sarah Jenkins',
    assigneeId: 2,
    dealership: 'Berlin',
    team: 'Sales (New)',
    status: 'confirmed',
    noShowCount: 0,
    previousAppointmentId: null
  },
  {
    id: 27,
    title: 'Test Drive - Nina Keller',
    start: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 2)
      date.setHours(16, 0, 0, 0)
      return date.toISOString()
    })(),
    end: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 2)
      date.setHours(17, 0, 0, 0)
      return date.toISOString()
    })(),
    type: 'test-drive',
    customer: 'Nina Keller',
    customerId: 13,
    opportunityId: 34,
    vehicle: 'Audi A3',
    assignee: 'Salsabeel Khaleel',
    assigneeId: 1,
    dealership: 'Frankfurt',
    team: 'Sales (New)',
    status: 'confirmed',
    noShowCount: 0,
    previousAppointmentId: null
  }
]

export const mockActivities = [
  // Opportunity 2 activities
  {
    id: 8,
    type: 'call',
    user: 'Sarah Jenkins',
    action: 'made a call',
    content: 'Discussed color preferences. Customer is interested in black or white Taycan.',
    timestamp: '2025-03-25T11:30:00',
    opportunityId: 2
  },
  {
    id: 9,
    type: 'note',
    user: 'Sarah Jenkins',
    action: 'added a note',
    content: 'Customer is waiting for specific color availability. Follow up in 2 weeks.',
    timestamp: '2025-03-23T16:20:00',
    opportunityId: 2
  },
  {
    id: 23,
    type: 'note',
    user: 'Sarah Jenkins',
    action: 'added a note',
    content: 'Customer prefers black exterior with beige interior. Checking availability.',
    timestamp: '2025-03-24T09:00:00',
    opportunityId: 2
  },
  {
    id: 10,
    type: 'email',
    user: 'Sarah Jenkins',
    action: 'sent an email',
    content: 'Sent available color options and pricing information.',
    timestamp: '2025-03-15T10:00:00',
    opportunityId: 2
  },
  {
    id: 11,
    type: 'opportunity-created',
    user: 'System',
    action: 'Opportunity was created from website inquiry',
    timestamp: '2025-03-01T09:00:00',
    opportunityId: 2
  },
  // Opportunity 3 activities (DFB - Delivery completed, 3+ days ago)
  {
    id: 12,
    type: 'delivery',
    user: 'David Miller',
    action: 'completed delivery',
    content: 'Vehicle delivered successfully. Customer satisfied with the purchase.',
    timestamp: '2024-12-25T16:45:00', // 3+ days ago - perfect for DFB
    opportunityId: 3
  },
  {
    id: 13,
    type: 'note',
    user: 'David Miller',
    action: 'added a note',
    content: 'Final paperwork completed. Payment received in full.',
    timestamp: '2024-12-25T14:00:00',
    opportunityId: 3
  },
  {
    id: 24,
    type: 'note',
    user: 'David Miller',
    action: 'added a note',
    content: 'Customer very satisfied with the purchase process. Potential referral opportunity.',
    timestamp: '2024-12-24T11:00:00',
    opportunityId: 3
  },
  {
    id: 14,
    type: 'call',
    user: 'David Miller',
    action: 'made a call',
    content: 'Confirmed delivery date and time. Customer will pick up at dealership.',
    timestamp: '2024-12-23T10:30:00',
    opportunityId: 3
  },
  {
    id: 15,
    type: 'opportunity-won',
    user: 'David Miller',
    action: 'marked opportunity as won',
    timestamp: '2024-12-20T15:00:00', // Contract signed date
    opportunityId: 3
  },
  {
    id: 16,
    type: 'opportunity-created',
    user: 'System',
    action: 'Opportunity was created from showroom visit',
    timestamp: '2024-11-15T10:00:00',
    opportunityId: 3
  },
  // Opportunity 4 activities
  {
    id: 17,
    type: 'call',
    user: 'Salsabeel Khaleel',
    action: 'made a call',
    content: 'Discussed financing options and trade-in value. Customer is negotiating final price.',
    timestamp: '2025-03-26T14:20:00',
    opportunityId: 4
  },
  {
    id: 18,
    type: 'note',
    user: 'Salsabeel Khaleel',
    action: 'added a note',
    content: 'Customer requested additional discount. Preparing counter-offer.',
    timestamp: '2025-03-25T11:00:00',
    opportunityId: 4
  },
  {
    id: 25,
    type: 'note',
    user: 'Salsabeel Khaleel',
    action: 'added a note',
    content: 'Customer interested in extended warranty and maintenance package. Discussing options.',
    timestamp: '2025-03-24T15:30:00',
    opportunityId: 4
  },
  {
    id: 19,
    type: 'email',
    user: 'Salsabeel Khaleel',
    action: 'sent an email',
    content: 'Sent detailed financing options and vehicle specifications.',
    timestamp: '2025-03-22T09:30:00',
    opportunityId: 4
  },
  {
    id: 20,
    type: 'meeting',
    user: 'Salsabeel Khaleel',
    action: 'scheduled a meeting',
    content: 'Test drive scheduled for next week. Customer will visit dealership.',
    timestamp: '2025-03-20T15:00:00',
    opportunityId: 4
  },
  {
    id: 21,
    type: 'opportunity-created',
    user: 'System',
    action: 'Opportunity was created from website inquiry',
    timestamp: '2025-03-15T11:00:00',
    opportunityId: 4
  },
  // Opportunity 5 activities (OOFB - Open for 7+ days without offers)
  {
    id: 26,
    type: 'note',
    user: 'Michael Thomas',
    action: 'added a note',
    content: 'Initial contact made. Customer interested in EQS features.',
    timestamp: '2024-12-20T10:30:00',
    opportunityId: 5
  },
  {
    id: 27,
    type: 'opportunity-created',
    user: 'System',
    action: 'Opportunity was created from website inquiry',
    timestamp: '2024-12-20T10:00:00',
    opportunityId: 5
  },
  // Opportunity 6 activities (UFB - Open for 14+ days without offers)
  {
    id: 28,
    type: 'call',
    user: 'Sarah Jenkins',
    action: 'made a call',
    content: 'Initial call. Customer asked about ID.4 availability.',
    timestamp: '2024-12-10T09:30:00',
    opportunityId: 6
  },
  {
    id: 29,
    type: 'opportunity-created',
    user: 'System',
    action: 'Opportunity was created from marketing campaign',
    timestamp: '2024-12-10T09:00:00',
    opportunityId: 6
  },
  // Opportunity 7 activities (OFB - In Negotiation for 5+ days without contract)
  {
    id: 30,
    type: 'offer',
    user: 'David Miller',
    action: 'created an offer',
    content: 'Initial offer sent for BMW i4',
    timestamp: '2024-12-20T14:00:00',
    opportunityId: 7
  },
  {
    id: 31,
    type: 'call',
    user: 'David Miller',
    action: 'made a call',
    content: 'Discussed offer details. Customer reviewing financing options.',
    timestamp: '2024-12-19T11:00:00',
    opportunityId: 7
  },
  {
    id: 32,
    type: 'opportunity-created',
    user: 'System',
    action: 'Opportunity was created from website inquiry',
    timestamp: '2024-12-15T11:00:00',
    opportunityId: 7
  },
  // Opportunity 8 activities (NFU - In Negotiation with no contract date)
  {
    id: 33,
    type: 'offer',
    user: 'Michael Thomas',
    action: 'created an offer',
    content: 'Offer sent for Audi Q4 e-tron',
    timestamp: '2024-12-25T15:00:00',
    opportunityId: 8
  },
  {
    id: 34,
    type: 'email',
    user: 'Michael Thomas',
    action: 'sent an email',
    content: 'Sent offer details and specifications.',
    timestamp: '2024-12-24T10:00:00',
    opportunityId: 8
  },
  {
    id: 35,
    type: 'opportunity-created',
    user: 'System',
    action: 'Opportunity was created from marketing campaign',
    timestamp: '2024-12-18T10:00:00',
    opportunityId: 8
  },
  // Opportunity 9 activities (CFB - Contract signed but not delivered)
  {
    id: 36,
    type: 'opportunity-won',
    user: 'Sarah Jenkins',
    action: 'marked opportunity as won',
    content: 'Contract signed. Vehicle preparation in progress.',
    timestamp: '2024-12-22T16:00:00',
    opportunityId: 9
  },
  {
    id: 37,
    type: 'note',
    user: 'Sarah Jenkins',
    action: 'added a note',
    content: 'Contract finalized. Payment received. Preparing vehicle for delivery.',
    timestamp: '2024-12-22T14:00:00',
    opportunityId: 9
  },
  {
    id: 38,
    type: 'offer',
    user: 'Sarah Jenkins',
    action: 'created an offer',
    content: 'Final offer accepted for Macan Electric',
    timestamp: '2024-12-20T11:00:00',
    opportunityId: 9
  },
  {
    id: 39,
    type: 'opportunity-created',
    user: 'System',
    action: 'Opportunity was created from website inquiry',
    timestamp: '2024-12-01T09:00:00',
    opportunityId: 9
  },
  // Opportunity 16 activities (UFB - In Negotiation for 10+ days without contract)
  {
    id: 40,
    type: 'offer',
    user: 'David Miller',
    action: 'created an offer',
    content: 'Initial offer sent for Mercedes-Benz EQC',
    timestamp: '2024-12-15T11:00:00',
    opportunityId: 16
  },
  {
    id: 41,
    type: 'call',
    user: 'David Miller',
    action: 'made a call',
    content: 'Discussed offer details. Customer reviewing terms.',
    timestamp: '2024-12-14T10:00:00',
    opportunityId: 16
  },
  {
    id: 42,
    type: 'opportunity-created',
    user: 'System',
    action: 'Opportunity was created from website inquiry',
    timestamp: '2024-12-05T10:00:00',
    opportunityId: 16
  },
  // Opportunity 11 activities (In Negotiation with contract date - no task widgets)
  {
    id: 43,
    type: 'opportunity-won',
    user: 'Michael Thomas',
    action: 'marked opportunity as won',
    content: 'Contract signed. Vehicle preparation in progress.',
    timestamp: '2024-12-20T14:00:00',
    opportunityId: 11
  },
  {
    id: 44,
    type: 'offer',
    user: 'Michael Thomas',
    action: 'created an offer',
    content: 'Final offer accepted for BMW iX3',
    timestamp: '2024-12-18T11:00:00',
    opportunityId: 11
  },
  {
    id: 45,
    type: 'note',
    user: 'Michael Thomas',
    action: 'added a note',
    content: 'Customer satisfied with offer. Contract terms agreed upon.',
    timestamp: '2024-12-19T15:00:00',
    opportunityId: 11
  },
  {
    id: 46,
    type: 'opportunity-created',
    user: 'System',
    action: 'Opportunity was created from marketing campaign',
    timestamp: '2024-12-10T09:00:00',
    opportunityId: 11
  },
  // Opportunity 12 activities (In Negotiation with future appointment - no NFU)
  {
    id: 47,
    type: 'offer',
    user: 'Sarah Jenkins',
    action: 'created an offer',
    content: 'Initial offer sent for Audi A6 e-tron',
    timestamp: '2024-12-18T10:00:00',
    opportunityId: 12
  },
  {
    id: 48,
    type: 'call',
    user: 'Sarah Jenkins',
    action: 'made a call',
    content: 'Discussed offer and scheduled test drive for next month.',
    timestamp: '2024-12-17T14:00:00',
    opportunityId: 12
  },
  {
    id: 49,
    type: 'note',
    user: 'Sarah Jenkins',
    action: 'added a note',
    content: 'Customer interested in test drive. Appointment scheduled.',
    timestamp: '2024-12-16T11:00:00',
    opportunityId: 12
  },
  {
    id: 50,
    type: 'opportunity-created',
    user: 'System',
    action: 'Opportunity was created from website inquiry',
    timestamp: '2024-12-12T11:00:00',
    opportunityId: 12
  },
  // Opportunity 13 activities (Open for 14+ days - stale but no task widget)
  {
    id: 51,
    type: 'note',
    user: 'David Miller',
    action: 'added a note',
    content: 'Initial contact made. Customer interested in ID.3 features.',
    timestamp: '2024-12-01T08:30:00',
    opportunityId: 13
  },
  {
    id: 52,
    type: 'opportunity-created',
    user: 'System',
    action: 'Opportunity was created from marketing campaign',
    timestamp: '2024-12-01T08:00:00',
    opportunityId: 13
  },
  // Opportunity 18 activities (Awaiting Appointment - has future appointment)
  {
    id: 53,
    type: 'appointment',
    user: 'Salsabeel Khaleel',
    action: 'scheduled an appointment',
    content: 'Appointment scheduled for Audi A4 test drive',
    timestamp: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString()
    })(),
    opportunityId: 18
  },
  {
    id: 54,
    type: 'opportunity-created',
    user: 'System',
    action: 'Opportunity was created from website inquiry',
    timestamp: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 2)
      return date.toISOString()
    })(),
    opportunityId: 18
  },
  // Opportunity 20 activities (Offer Sent - offer less than 3 days old)
  {
    id: 57,
    type: 'offer',
    user: 'Sarah Jenkins',
    action: 'created an offer',
    content: 'Initial offer sent for Mercedes-Benz C-Class',
    timestamp: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1) // 1 day ago (less than 3 days)
      return date.toISOString()
    })(),
    opportunityId: 20
  },
  {
    id: 58,
    type: 'opportunity-created',
    user: 'System',
    action: 'Opportunity was created from website inquiry',
    timestamp: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 10)
      return date.toISOString()
    })(),
    opportunityId: 20
  },
  // Opportunity 21 activities (Awaiting Response - offer 3+ days old)
  {
    id: 59,
    type: 'offer',
    user: 'Michael Thomas',
    action: 'created an offer',
    content: 'Initial offer sent for BMW 3 Series',
    timestamp: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 4) // 4 days ago (3+ days)
      return date.toISOString()
    })(),
    opportunityId: 21
  },
  {
    id: 60,
    type: 'note',
    user: 'Michael Thomas',
    action: 'added a note',
    content: 'Customer reviewing offer. Waiting for response.',
    timestamp: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 3)
      return date.toISOString()
    })(),
    opportunityId: 21
  },
  {
    id: 61,
    type: 'opportunity-created',
    user: 'System',
    action: 'Opportunity was created from marketing campaign',
    timestamp: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 15)
      return date.toISOString()
    })(),
    opportunityId: 21
  },
  // Opportunity 22 activities (Contract Pending - has contractDate)
  {
    id: 62,
    type: 'contract',
    user: 'Salsabeel Khaleel',
    action: 'contract date set',
    content: 'Contract date set for Porsche 911',
    timestamp: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 2)
      return date.toISOString()
    })(),
    opportunityId: 22
  },
  {
    id: 63,
    type: 'offer',
    user: 'Salsabeel Khaleel',
    action: 'created an offer',
    content: 'Final offer accepted for Porsche 911',
    timestamp: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 5)
      return date.toISOString()
    })(),
    opportunityId: 22
  },
  {
    id: 64,
    type: 'opportunity-created',
    user: 'System',
    action: 'Opportunity was created from website inquiry',
    timestamp: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 20)
      return date.toISOString()
    })(),
    opportunityId: 22
  },
  // Opportunity 23 activities (Closed Won - Awaiting Delivery - has deliveryDate but no delivery activity)
  {
    id: 65,
    type: 'opportunity-won',
    user: 'David Miller',
    action: 'marked opportunity as won',
    timestamp: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 10)
      return date.toISOString()
    })(),
    opportunityId: 23
  },
  {
    id: 66,
    type: 'contract',
    user: 'David Miller',
    action: 'contract signed',
    content: 'Contract signed for Tesla Model Y',
    timestamp: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 10)
      return date.toISOString()
    })(),
    opportunityId: 23
  },
  {
    id: 67,
    type: 'note',
    user: 'David Miller',
    action: 'added a note',
    content: 'Delivery scheduled for 5 days from now.',
    timestamp: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 3)
      return date.toISOString()
    })(),
    opportunityId: 23
  },
  {
    id: 68,
    type: 'opportunity-created',
    user: 'System',
    action: 'Opportunity was created from website inquiry',
    timestamp: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 30)
      return date.toISOString()
    })(),
    opportunityId: 23
  },
  
  // ========== LEAD ACTIVITIES (Leads 2-22) ==========
  
  // Lead 2 (Emma Watson) - Mercedes EQS
  {
    id: 69,
    type: 'call',
    user: 'Sarah Jenkins',
    action: 'made a call attempt',
    content: 'No answer. Will try again later.',
    timestamp: '2025-03-26T10:15:00',
    leadId: 2
  },
  {
    id: 70,
    type: 'note',
    user: 'Sarah Jenkins',
    action: 'added a note',
    content: 'Customer prefers contact after 2 PM. Interested in EQS test drive.',
    timestamp: '2025-03-25T16:30:00',
    leadId: 2
  },
  {
    id: 71,
    type: 'email',
    user: 'Sarah Jenkins',
    action: 'sent an email',
    content: 'Sent detailed EQS specifications and pricing information.',
    timestamp: '2025-03-24T14:00:00',
    leadId: 2
  },
  
  // Lead 3 (Liam Johnson) - Mercedes EQS
  {
    id: 72,
    type: 'sms',
    user: 'David Miller',
    action: 'sent an SMS',
    content: 'Hi Liam! Our Milano dealership is at Via Roma 45. Open Mon-Sat 9-7. Let me know when you can visit!',
    timestamp: '2025-03-26T09:00:00',
    leadId: 3
  },
  {
    id: 73,
    type: 'attachment',
    user: 'David Miller',
    action: 'uploaded an attachment',
    content: 'Mercedes-Benz EQS brochure and technical specifications',
    fileName: 'Mercedes_EQS_Brochure_2024.pdf',
    timestamp: '2025-03-25T11:30:00',
    leadId: 3
  },
  {
    id: 74,
    type: 'note',
    user: 'David Miller',
    action: 'added a note',
    content: 'Customer wants electric vehicle with long range. EQS perfect fit.',
    timestamp: '2025-03-24T10:00:00',
    leadId: 3
  },
  
  // Lead 4 (Sophie Mueller) - BMW X5
  {
    id: 75,
    type: 'whatsapp',
    user: 'Natalia Sung',
    action: 'sent a WhatsApp message',
    content: 'Hello Sophie! Thank you for your interest in the BMW X5. Would you like to schedule a test drive this week?',
    timestamp: '2025-03-26T15:00:00',
    leadId: 4
  },
  {
    id: 76,
    type: 'attachment',
    user: 'Natalia Sung',
    action: 'uploaded an attachment',
    content: 'BMW X5 exterior and interior photos',
    fileName: 'BMW_X5_Photos.jpg',
    timestamp: '2025-03-25T14:00:00',
    leadId: 4
  },
  {
    id: 77,
    type: 'call',
    user: 'Natalia Sung',
    action: 'made a call',
    content: 'Spoke with customer. Very interested in X5 M Sport package. Discussed financing options.',
    timestamp: '2025-03-24T11:00:00',
    leadId: 4
  },
  
  // Lead 5 (Marco Rossi) - Volkswagen ID.4
  {
    id: 78,
    type: 'email',
    user: 'Salsabeel Khaleel',
    action: 'sent an email',
    content: 'Sent comparison between ID.4 and ID.5 models with pricing.',
    timestamp: '2025-03-26T10:00:00',
    leadId: 5
  },
  {
    id: 79,
    type: 'call',
    user: 'Salsabeel Khaleel',
    action: 'made a call',
    content: 'Discussed electric vehicle benefits and charging infrastructure in Florence area.',
    timestamp: '2025-03-25T15:30:00',
    leadId: 5
  },
  {
    id: 80,
    type: 'note',
    user: 'Salsabeel Khaleel',
    action: 'added a note',
    content: 'Customer concerned about charging times. Explained fast charging capabilities.',
    timestamp: '2025-03-24T09:00:00',
    leadId: 5
  },
  
  // Lead 6 (Klaus Schmidt) - Porsche 911
  {
    id: 81,
    type: 'attachment',
    user: 'Sarah Jenkins',
    action: 'uploaded an attachment',
    content: 'Porsche 911 Carrera configuration options',
    fileName: 'Porsche_911_Configurator.pdf',
    timestamp: '2025-03-26T11:00:00',
    leadId: 6
  },
  {
    id: 82,
    type: 'whatsapp',
    user: 'Sarah Jenkins',
    action: 'sent a WhatsApp message',
    content: 'Hi Klaus! I have prepared a custom 911 configuration based on your preferences. Check the attachment!',
    timestamp: '2025-03-25T16:00:00',
    leadId: 6
  },
  {
    id: 83,
    type: 'call',
    user: 'Sarah Jenkins',
    action: 'made a call',
    content: 'Discussed 911 customization options. Customer wants Sport Chrono package.',
    timestamp: '2025-03-24T14:30:00',
    leadId: 6
  },
  
  // Lead 7 (Anna Becker) - Tesla Model 3
  {
    id: 84,
    type: 'sms',
    user: 'David Miller',
    action: 'sent an SMS',
    content: 'Hi Anna! Your Tesla Model 3 test drive is confirmed for Friday at 3 PM. See you then!',
    timestamp: '2025-03-26T12:00:00',
    leadId: 7
  },
  {
    id: 85,
    type: 'note',
    user: 'David Miller',
    action: 'added a note',
    content: 'Customer very enthusiastic about Tesla. Prefers Performance variant.',
    timestamp: '2025-03-25T10:00:00',
    leadId: 7
  },
  {
    id: 86,
    type: 'email',
    user: 'David Miller',
    action: 'sent an email',
    content: 'Sent Tesla Model 3 Performance specs and Autopilot features overview.',
    timestamp: '2025-03-24T13:00:00',
    leadId: 7
  },
  
  // Lead 8 (Thomas Weber) - Audi e-tron GT
  {
    id: 87,
    type: 'call',
    user: 'Natalia Sung',
    action: 'made a call',
    content: 'Detailed discussion about e-tron GT performance and luxury features.',
    timestamp: '2025-03-26T14:00:00',
    leadId: 8
  },
  {
    id: 88,
    type: 'attachment',
    user: 'Natalia Sung',
    action: 'uploaded an attachment',
    content: 'Audi e-tron GT RS comparison document',
    fileName: 'Audi_etron_GT_Comparison.pdf',
    timestamp: '2025-03-25T11:00:00',
    leadId: 8
  },
  {
    id: 89,
    type: 'whatsapp',
    user: 'Natalia Sung',
    action: 'sent a WhatsApp message',
    content: 'Thomas, I found a beautiful e-tron GT in Daytona Gray. Would you like to see it?',
    timestamp: '2025-03-24T16:00:00',
    leadId: 8
  },
  
  // Lead 9 (Julia Fischer) - Mercedes-Benz GLE
  {
    id: 74,
    type: 'note',
    user: 'Salsabeel Khaleel',
    action: 'added a note',
    content: 'Customer needs 7-seater SUV. GLE perfect match with third row option.',
    timestamp: '2025-03-26T09:30:00',
    leadId: 9
  },
  {
    id: 75,
    type: 'email',
    user: 'Salsabeel Khaleel',
    action: 'sent an email',
    content: 'Sent GLE 7-seater configuration with family package options.',
    timestamp: '2025-03-25T14:00:00',
    leadId: 9
  },
  {
    id: 76,
    type: 'sms',
    user: 'Salsabeel Khaleel',
    action: 'sent an SMS',
    content: 'Hi Julia! The GLE 450 with 7 seats is available for viewing. When can you visit?',
    timestamp: '2025-03-24T10:30:00',
    leadId: 9
  },
  
  // Lead 10 (Michael Hoffmann) - BMW iX
  {
    id: 77,
    type: 'call',
    user: 'Sarah Jenkins',
    action: 'made a call attempt',
    content: 'Left voicemail about BMW iX availability and test drive options.',
    timestamp: '2025-03-26T11:30:00',
    leadId: 10
  },
  {
    id: 78,
    type: 'attachment',
    user: 'Sarah Jenkins',
    action: 'uploaded an attachment',
    content: 'BMW iX sustainability and technology features',
    fileName: 'BMW_iX_Technology_Guide.pdf',
    timestamp: '2025-03-25T09:00:00',
    leadId: 10
  },
  {
    id: 79,
    type: 'note',
    user: 'Sarah Jenkins',
    action: 'added a note',
    content: 'Customer interested in sustainable mobility. iX perfect for eco-conscious buyers.',
    timestamp: '2025-03-24T15:00:00',
    leadId: 10
  },
  
  // Lead 11 (Laura Zimmermann) - Porsche Cayenne
  {
    id: 80,
    type: 'whatsapp',
    user: 'David Miller',
    action: 'sent a WhatsApp message',
    content: 'Laura, we have a stunning Cayenne S in white arriving next week. Interested in first look?',
    timestamp: '2025-03-26T13:00:00',
    leadId: 11
  },
  {
    id: 81,
    type: 'call',
    user: 'David Miller',
    action: 'made a call',
    content: 'Discussed Cayenne variants and performance differences between S and Turbo.',
    timestamp: '2025-03-25T16:30:00',
    leadId: 11
  },
  {
    id: 82,
    type: 'email',
    user: 'David Miller',
    action: 'sent an email',
    content: 'Sent Cayenne S vs Turbo comparison with pricing breakdown.',
    timestamp: '2025-03-24T12:00:00',
    leadId: 11
  },
  
  // Lead 12 (Stefan Braun) - Porsche Macan
  {
    id: 83,
    type: 'note',
    user: 'Sarah Jenkins',
    action: 'added a note',
    content: 'Multiple contact attempts. Customer seems busy. Will try different times.',
    timestamp: '2025-03-26T10:00:00',
    leadId: 12
  },
  {
    id: 84,
    type: 'sms',
    user: 'Sarah Jenkins',
    action: 'sent an SMS',
    content: 'Hi Stefan! Still interested in the Porsche Macan? We have great financing offers this month!',
    timestamp: '2025-03-25T14:30:00',
    leadId: 12
  },
  {
    id: 85,
    type: 'call',
    user: 'Sarah Jenkins',
    action: 'made a call attempt',
    content: 'No answer. Fifth attempt.',
    timestamp: '2025-03-24T11:00:00',
    leadId: 12
  },
  
  // Lead 13 (Nina Keller) - Audi e-tron GT (Hot/Urgent)
  {
    id: 86,
    type: 'call',
    user: 'Sarah Jenkins',
    action: 'made a call',
    content: 'Urgent inquiry. Customer needs e-tron GT for business event next week.',
    timestamp: '2025-03-26T16:00:00',
    leadId: 13
  },
  {
    id: 87,
    type: 'whatsapp',
    user: 'Sarah Jenkins',
    action: 'sent a WhatsApp message',
    content: 'Nina, I can arrange immediate viewing today at 5 PM. The e-tron GT is ready!',
    timestamp: '2025-03-26T15:30:00',
    leadId: 13
  },
  {
    id: 88,
    type: 'attachment',
    user: 'Sarah Jenkins',
    action: 'uploaded an attachment',
    content: 'Express delivery options and expedited paperwork process',
    fileName: 'Express_Delivery_Process.pdf',
    timestamp: '2025-03-26T15:00:00',
    leadId: 13
  },
  
  // Lead 14 (Oliver Lang) - Mercedes C-Class
  {
    id: 89,
    type: 'email',
    user: 'David Miller',
    action: 'sent an email',
    content: 'Sent C-Class hybrid benefits and fuel economy comparison.',
    timestamp: '2025-03-26T10:30:00',
    leadId: 14
  },
  {
    id: 90,
    type: 'note',
    user: 'David Miller',
    action: 'added a note',
    content: 'Customer interested in hybrid technology for daily commute.',
    timestamp: '2025-03-25T13:00:00',
    leadId: 14
  },
  {
    id: 91,
    type: 'call',
    user: 'David Miller',
    action: 'made a call',
    content: 'Discussed hybrid system and maintenance costs. Customer satisfied with information.',
    timestamp: '2025-03-24T14:00:00',
    leadId: 14
  },
  
  // Lead 15 (Petra Schulz) - Volkswagen ID.4
  {
    id: 92,
    type: 'sms',
    user: 'Natalia Sung',
    action: 'sent an SMS',
    content: 'Petra, your ID.4 test drive is scheduled for tomorrow at 11 AM. Looking forward to seeing you!',
    timestamp: '2025-03-26T17:00:00',
    leadId: 15
  },
  {
    id: 93,
    type: 'attachment',
    user: 'Natalia Sung',
    action: 'uploaded an attachment',
    content: 'ID.4 charging network map for Berlin area',
    fileName: 'ID4_Charging_Network_Berlin.pdf',
    timestamp: '2025-03-25T10:00:00',
    leadId: 15
  },
  {
    id: 94,
    type: 'whatsapp',
    user: 'Natalia Sung',
    action: 'sent a WhatsApp message',
    content: 'Hi Petra! I found a great ID.4 in your preferred color - Moonstone Gray. Want to see photos?',
    timestamp: '2025-03-24T16:30:00',
    leadId: 15
  },
  
  // Lead 16 (Robert Klein) - BMW M4
  {
    id: 95,
    type: 'call',
    user: 'Salsabeel Khaleel',
    action: 'made a call',
    content: 'Discussed M4 Competition performance specs and track capabilities.',
    timestamp: '2025-03-26T14:30:00',
    leadId: 16
  },
  {
    id: 96,
    type: 'note',
    user: 'Salsabeel Khaleel',
    action: 'added a note',
    content: 'Performance enthusiast. Interested in M4 Competition with M xDrive.',
    timestamp: '2025-03-25T11:30:00',
    leadId: 16
  },
  {
    id: 97,
    type: 'email',
    user: 'Salsabeel Khaleel',
    action: 'sent an email',
    content: 'Sent M4 Competition performance data and track mode features.',
    timestamp: '2025-03-24T09:30:00',
    leadId: 16
  },
  
  // Lead 17 (Sabine Vogel) - Audi Q5
  {
    id: 98,
    type: 'whatsapp',
    user: 'Sarah Jenkins',
    action: 'sent a WhatsApp message',
    content: 'Sabine, the Q5 45 TFSI you asked about is available. Can you visit this week?',
    timestamp: '2025-03-26T12:30:00',
    leadId: 17
  },
  {
    id: 99,
    type: 'attachment',
    user: 'Sarah Jenkins',
    action: 'uploaded an attachment',
    content: 'Audi Q5 interior photos and equipment list',
    fileName: 'Audi_Q5_Interior_Photos.jpg',
    timestamp: '2025-03-25T15:00:00',
    leadId: 17
  },
  {
    id: 100,
    type: 'call',
    user: 'Sarah Jenkins',
    action: 'made a call',
    content: 'Spoke about Q5 comfort features and advanced driver assistance systems.',
    timestamp: '2025-03-24T13:30:00',
    leadId: 17
  },
  
  // Lead 18 (Dr. Andreas Werner) - Porsche Taycan
  {
    id: 101,
    type: 'email',
    user: 'David Miller',
    action: 'sent an email',
    content: 'Sent Taycan Turbo S specifications and performance comparison with Tesla.',
    timestamp: '2025-03-26T09:00:00',
    leadId: 18
  },
  {
    id: 102,
    type: 'note',
    user: 'David Miller',
    action: 'added a note',
    content: 'High-value customer. Interested in Taycan Turbo S for luxury electric performance.',
    timestamp: '2025-03-25T14:00:00',
    leadId: 18
  },
  {
    id: 103,
    type: 'attachment',
    user: 'David Miller',
    action: 'uploaded an attachment',
    content: 'Porsche Taycan exclusive color options catalog',
    fileName: 'Taycan_Exclusive_Colors.pdf',
    timestamp: '2025-03-24T10:00:00',
    leadId: 18
  },
  
  // Lead 19 (Christina Bauer) - BMW X3
  {
    id: 104,
    type: 'sms',
    user: 'Natalia Sung',
    action: 'sent an SMS',
    content: 'Christina, we have a special offer on X3 xDrive30i this week. Save up to €5,000!',
    timestamp: '2025-03-26T11:00:00',
    leadId: 19
  },
  {
    id: 105,
    type: 'call',
    user: 'Natalia Sung',
    action: 'made a call',
    content: 'Discussed X3 family features and cargo space. Customer has two children.',
    timestamp: '2025-03-25T16:00:00',
    leadId: 19
  },
  {
    id: 106,
    type: 'whatsapp',
    user: 'Natalia Sung',
    action: 'sent a WhatsApp message',
    content: 'Hi Christina! I can arrange a family test drive with car seats installed. Let me know!',
    timestamp: '2025-03-24T12:00:00',
    leadId: 19
  },
  
  // Lead 20 (Martin Richter) - BMW M4 Competition (Hot)
  {
    id: 107,
    type: 'call',
    user: 'Sarah Jenkins',
    action: 'made a call',
    content: 'Customer very enthusiastic. Wants M4 Competition in Isle of Man Green.',
    timestamp: '2025-03-26T15:00:00',
    leadId: 20
  },
  {
    id: 108,
    type: 'attachment',
    user: 'Sarah Jenkins',
    action: 'uploaded an attachment',
    content: 'M4 Competition in Isle of Man Green - exclusive photos',
    fileName: 'M4_Isle_of_Man_Green.jpg',
    timestamp: '2025-03-26T14:30:00',
    leadId: 20
  },
  {
    id: 109,
    type: 'note',
    user: 'Sarah Jenkins',
    action: 'added a note',
    content: 'Performance enthusiast with track experience. Ready to proceed quickly.',
    timestamp: '2025-03-26T14:00:00',
    leadId: 20
  },
  
  // ========== OPPORTUNITY ACTIVITIES - MISSING TYPES ==========
  
  // Opportunity 1 activities removed - empty for demo
  
  // Opportunity 2 (Oliver Brown) - Add financing and SMS
  {
    id: 113,
    type: 'financing',
    user: 'Salsabeel Khaleel',
    action: 'submitted financing request',
    content: 'Financing approved: 60-month term at 3.5% APR',
    data: {
      term: 60,
      apr: 3.5,
      amount: 120000,
      downPayment: 30000,
      monthlyPayment: 1635,
      status: 'approved'
    },
    timestamp: '2025-03-24T14:00:00',
    opportunityId: 2
  },
  {
    id: 114,
    type: 'sms',
    user: 'Salsabeel Khaleel',
    action: 'sent an SMS',
    content: 'Oliver, your financing is approved! Ready to finalize the Taycan purchase.',
    timestamp: '2025-03-24T15:00:00',
    opportunityId: 2
  },
  {
    id: 115,
    type: 'attachment',
    user: 'Salsabeel Khaleel',
    action: 'uploaded an attachment',
    content: 'Financing approval letter and payment schedule',
    fileName: 'Financing_Approval_Oliver_Brown.pdf',
    timestamp: '2025-03-24T14:30:00',
    opportunityId: 2
  },
  
  // Opportunity 3 (Sophia Martinez) - Add WhatsApp and attachment
  {
    id: 116,
    type: 'whatsapp',
    user: 'David Miller',
    action: 'sent a WhatsApp message',
    content: 'Sophia, your BMW iX was delivered! Hope you love it. Let me know if you need anything!',
    timestamp: '2024-12-26T09:00:00',
    opportunityId: 3
  },
  {
    id: 117,
    type: 'attachment',
    user: 'David Miller',
    action: 'uploaded an attachment',
    content: 'Delivery receipt and vehicle handover checklist',
    fileName: 'Delivery_Receipt_Sophia_Martinez.pdf',
    timestamp: '2024-12-25T17:00:00',
    opportunityId: 3
  },
  {
    id: 118,
    type: 'sms',
    user: 'David Miller',
    action: 'sent an SMS',
    content: 'Delivery confirmed for tomorrow at 4 PM. All paperwork ready!',
    timestamp: '2024-12-24T16:00:00',
    opportunityId: 3
  },
  
  // Opportunity 4 (Alexander Chen) - Add trade-in and financing
  {
    id: 119,
    type: 'tradein',
    user: 'Salsabeel Khaleel',
    action: 'added trade-in information',
    content: 'Customer trade-in: 2019 Tesla Model S, valued at €45,000',
    data: {
      make: 'Tesla',
      model: 'Model S',
      year: 2019,
      mileage: 38000,
      condition: 'Very Good',
      value: 45000
    },
    timestamp: '2025-03-25T10:00:00',
    opportunityId: 4
  },
  {
    id: 120,
    type: 'financing',
    user: 'Salsabeel Khaleel',
    action: 'submitted financing request',
    content: 'Financing request: 48-month term at 3.9% APR',
    data: {
      term: 48,
      apr: 3.9,
      amount: 50000,
      downPayment: 45000,
      monthlyPayment: 1130,
      status: 'pending'
    },
    timestamp: '2025-03-25T11:00:00',
    opportunityId: 4
  },
  {
    id: 121,
    type: 'attachment',
    user: 'Salsabeel Khaleel',
    action: 'uploaded an attachment',
    content: 'Trade-in valuation report and inspection photos',
    fileName: 'TradeIn_Valuation_Tesla_ModelS.pdf',
    timestamp: '2025-03-25T09:30:00',
    opportunityId: 4
  },
  
  // Opportunity 5 (Emma Wilson) - Add attachment and SMS
  {
    id: 122,
    type: 'attachment',
    user: 'Michael Thomas',
    action: 'uploaded an attachment',
    content: 'Insurance documents and registration papers',
    fileName: 'Insurance_Registration_Emma_Wilson.pdf',
    timestamp: '2025-03-24T13:00:00',
    opportunityId: 5
  },
  {
    id: 123,
    type: 'sms',
    user: 'Michael Thomas',
    action: 'sent an SMS',
    content: 'Emma, reminder: Your Mercedes EQE delivery is scheduled for Friday at 10 AM!',
    timestamp: '2025-03-23T15:00:00',
    opportunityId: 5
  },
  {
    id: 124,
    type: 'whatsapp',
    user: 'Michael Thomas',
    action: 'sent a WhatsApp message',
    content: 'All documents are ready! Looking forward to handing over your new EQE.',
    timestamp: '2025-03-22T11:00:00',
    opportunityId: 5
  },
  
  // Opportunity 6 (Robert Taylor) - Full activity history
  {
    id: 125,
    type: 'call',
    user: 'Sarah Jenkins',
    action: 'made a call',
    content: 'Discussed BMW X7 features and luxury options.',
    timestamp: '2025-03-26T10:00:00',
    opportunityId: 6
  },
  {
    id: 126,
    type: 'note',
    user: 'Sarah Jenkins',
    action: 'added a note',
    content: 'Customer wants X7 M60i with Executive Drive Pro package.',
    timestamp: '2025-03-25T14:00:00',
    opportunityId: 6
  },
  {
    id: 127,
    type: 'email',
    user: 'Sarah Jenkins',
    action: 'sent an email',
    content: 'Sent X7 M60i configuration with all requested options.',
    timestamp: '2025-03-24T11:00:00',
    opportunityId: 6
  },
  {
    id: 128,
    type: 'attachment',
    user: 'Sarah Jenkins',
    action: 'uploaded an attachment',
    content: 'BMW X7 M60i detailed specification sheet',
    fileName: 'BMW_X7_M60i_Specs.pdf',
    timestamp: '2025-03-23T15:00:00',
    opportunityId: 6
  },
  {
    id: 129,
    type: 'tradein',
    user: 'Sarah Jenkins',
    action: 'added trade-in information',
    content: 'Customer trade-in: 2021 BMW X5, valued at €55,000',
    data: {
      make: 'BMW',
      model: 'X5',
      year: 2021,
      mileage: 28000,
      condition: 'Excellent',
      value: 55000
    },
    timestamp: '2025-03-22T10:00:00',
    opportunityId: 6
  },
  {
    id: 130,
    type: 'financing',
    user: 'Sarah Jenkins',
    action: 'submitted financing request',
    content: 'Financing approved: 36-month term at 2.9% APR',
    data: {
      term: 36,
      apr: 2.9,
      amount: 65000,
      downPayment: 55000,
      monthlyPayment: 1890,
      status: 'approved'
    },
    timestamp: '2025-03-21T14:00:00',
    opportunityId: 6
  },
  {
    id: 131,
    type: 'sms',
    user: 'Sarah Jenkins',
    action: 'sent an SMS',
    content: 'Robert, great news! Your financing is approved. Ready to order your X7!',
    timestamp: '2025-03-21T15:00:00',
    opportunityId: 6
  },
  {
    id: 132,
    type: 'whatsapp',
    user: 'Sarah Jenkins',
    action: 'sent a WhatsApp message',
    content: 'I found the perfect X7 in Tanzanite Blue. Want to see photos?',
    timestamp: '2025-03-20T12:00:00',
    opportunityId: 6
  },
  
  // Opportunity 7 (Lisa Anderson) - Add missing types
  {
    id: 133,
    type: 'attachment',
    user: 'Michael Thomas',
    action: 'uploaded an attachment',
    content: 'Audi Q8 e-tron brochure and pricing',
    fileName: 'Audi_Q8_etron_Brochure.pdf',
    timestamp: '2025-03-24T10:00:00',
    opportunityId: 7
  },
  {
    id: 134,
    type: 'sms',
    user: 'Michael Thomas',
    action: 'sent an SMS',
    content: 'Lisa, your Q8 e-tron test drive is confirmed for Saturday at 11 AM!',
    timestamp: '2025-03-23T16:00:00',
    opportunityId: 7
  },
  {
    id: 135,
    type: 'whatsapp',
    user: 'Michael Thomas',
    action: 'sent a WhatsApp message',
    content: 'The Q8 e-tron you liked is still available. Let me know if you want to proceed!',
    timestamp: '2025-03-22T14:00:00',
    opportunityId: 7
  },
  
  // Opportunity 8 (James White) - Add missing types
  {
    id: 136,
    type: 'financing',
    user: 'Michael Thomas',
    action: 'submitted financing request',
    content: 'Financing pending: 48-month term at 4.2% APR',
    data: {
      term: 48,
      apr: 4.2,
      amount: 78000,
      downPayment: 15000,
      monthlyPayment: 1445,
      status: 'pending'
    },
    timestamp: '2024-12-24T11:00:00',
    opportunityId: 8
  },
  {
    id: 137,
    type: 'attachment',
    user: 'Michael Thomas',
    action: 'uploaded an attachment',
    content: 'Audi Q4 e-tron financing options comparison',
    fileName: 'Q4_Financing_Options.pdf',
    timestamp: '2024-12-23T15:00:00',
    opportunityId: 8
  },
  {
    id: 138,
    type: 'sms',
    user: 'Michael Thomas',
    action: 'sent an SMS',
    content: 'James, I submitted your financing application. Should hear back in 24-48 hours.',
    timestamp: '2024-12-24T12:00:00',
    opportunityId: 8
  },
  
  // Opportunity 9 (Maria Garcia) - Add missing types
  {
    id: 139,
    type: 'tradein',
    user: 'Sarah Jenkins',
    action: 'added trade-in information',
    content: 'Customer trade-in: 2018 Porsche Cayenne, valued at €48,000',
    data: {
      make: 'Porsche',
      model: 'Cayenne',
      year: 2018,
      mileage: 52000,
      condition: 'Good',
      value: 48000
    },
    timestamp: '2024-12-21T10:00:00',
    opportunityId: 9
  },
  {
    id: 140,
    type: 'attachment',
    user: 'Sarah Jenkins',
    action: 'uploaded an attachment',
    content: 'Final contract and delivery schedule',
    fileName: 'Contract_Maria_Garcia.pdf',
    timestamp: '2024-12-22T15:00:00',
    opportunityId: 9
  },
  {
    id: 141,
    type: 'whatsapp',
    user: 'Sarah Jenkins',
    action: 'sent a WhatsApp message',
    content: 'Maria, your Macan Electric is being prepared for delivery. So exciting!',
    timestamp: '2024-12-21T14:00:00',
    opportunityId: 9
  },
  
  // Opportunity 11 (Jennifer Lee) - Add missing types
  {
    id: 142,
    type: 'attachment',
    user: 'Michael Thomas',
    action: 'uploaded an attachment',
    content: 'BMW iX3 warranty and service package details',
    fileName: 'BMW_iX3_Warranty.pdf',
    timestamp: '2024-12-19T11:00:00',
    opportunityId: 11
  },
  {
    id: 143,
    type: 'sms',
    user: 'Michael Thomas',
    action: 'sent an SMS',
    content: 'Jennifer, your iX3 contract is ready for signature. Can you come by this week?',
    timestamp: '2024-12-18T15:00:00',
    opportunityId: 11
  },
  {
    id: 144,
    type: 'whatsapp',
    user: 'Michael Thomas',
    action: 'sent a WhatsApp message',
    content: 'Great news! We secured the iX3 in your preferred Sophisto Gray color!',
    timestamp: '2024-12-17T10:00:00',
    opportunityId: 11
  },
  
  // Opportunity 12 (Daniel Kim) - Add missing types
  {
    id: 145,
    type: 'tradein',
    user: 'Sarah Jenkins',
    action: 'added trade-in information',
    content: 'Customer trade-in: 2020 Audi A4, valued at €28,000',
    data: {
      make: 'Audi',
      model: 'A4',
      year: 2020,
      mileage: 42000,
      condition: 'Very Good',
      value: 28000
    },
    timestamp: '2024-12-17T14:00:00',
    opportunityId: 12
  },
  {
    id: 146,
    type: 'financing',
    user: 'Sarah Jenkins',
    action: 'submitted financing request',
    content: 'Financing approved: 60-month term at 3.8% APR',
    data: {
      term: 60,
      apr: 3.8,
      amount: 62000,
      downPayment: 28000,
      monthlyPayment: 1140,
      status: 'approved'
    },
    timestamp: '2024-12-17T15:00:00',
    opportunityId: 12
  },
  {
    id: 147,
    type: 'attachment',
    user: 'Sarah Jenkins',
    action: 'uploaded an attachment',
    content: 'A6 e-tron configuration and financing summary',
    fileName: 'A6_etron_Config_Daniel_Kim.pdf',
    timestamp: '2024-12-16T13:00:00',
    opportunityId: 12
  },
  
  // Opportunity 13 (Rachel Green) - Add missing types
  {
    id: 148,
    type: 'attachment',
    user: 'David Miller',
    action: 'uploaded an attachment',
    content: 'VW ID.3 charging guide and home charger installation info',
    fileName: 'ID3_Charging_Guide.pdf',
    timestamp: '2024-12-01T09:00:00',
    opportunityId: 13
  },
  {
    id: 149,
    type: 'sms',
    user: 'David Miller',
    action: 'sent an SMS',
    content: 'Rachel, the ID.3 is available for test drive. When would you like to visit?',
    timestamp: '2024-12-01T10:00:00',
    opportunityId: 13
  },
  
  // Opportunity 14 (Monica Geller) - Communication-focused
  {
    id: 150,
    type: 'call',
    user: 'Michael Thomas',
    action: 'made a call',
    content: 'Discussed Tesla Model 3 features and Autopilot capabilities.',
    timestamp: '2025-03-16T10:00:00',
    opportunityId: 14
  },
  {
    id: 151,
    type: 'email',
    user: 'Michael Thomas',
    action: 'sent an email',
    content: 'Sent Model 3 comparison with other electric sedans.',
    timestamp: '2025-03-15T15:00:00',
    opportunityId: 14
  },
  {
    id: 152,
    type: 'whatsapp',
    user: 'Michael Thomas',
    action: 'sent a WhatsApp message',
    content: 'Monica, the Model 3 you test drove is still available. Ready to move forward?',
    timestamp: '2025-03-14T11:00:00',
    opportunityId: 14
  },
  {
    id: 153,
    type: 'sms',
    user: 'Michael Thomas',
    action: 'sent an SMS',
    content: 'Following up on your Model 3 interest. Let me know if you have questions!',
    timestamp: '2025-03-13T14:00:00',
    opportunityId: 14
  },
  {
    id: 154,
    type: 'note',
    user: 'Michael Thomas',
    action: 'added a note',
    content: 'Customer loved the test drive. Considering white vs blue exterior.',
    timestamp: '2025-03-12T16:00:00',
    opportunityId: 14
  },
  
  // Opportunity 15 (Ross Geller) - Document-focused
  {
    id: 155,
    type: 'attachment',
    user: 'David Miller',
    action: 'uploaded an attachment',
    content: 'Mercedes-Benz GLC detailed specifications',
    fileName: 'Mercedes_GLC_Specs.pdf',
    timestamp: '2025-03-20T10:00:00',
    opportunityId: 15
  },
  {
    id: 156,
    type: 'attachment',
    user: 'David Miller',
    action: 'uploaded an attachment',
    content: 'GLC financing options and payment calculator',
    fileName: 'GLC_Financing_Calculator.pdf',
    timestamp: '2025-03-19T14:00:00',
    opportunityId: 15
  },
  {
    id: 157,
    type: 'attachment',
    user: 'David Miller',
    action: 'uploaded an attachment',
    content: 'GLC warranty and maintenance package details',
    fileName: 'GLC_Warranty_Package.pdf',
    timestamp: '2025-03-18T11:00:00',
    opportunityId: 15
  },
  {
    id: 158,
    type: 'note',
    user: 'David Miller',
    action: 'added a note',
    content: 'Customer requested all documentation before making decision.',
    timestamp: '2025-03-17T15:00:00',
    opportunityId: 15
  },
  {
    id: 159,
    type: 'email',
    user: 'David Miller',
    action: 'sent an email',
    content: 'Sent comprehensive GLC information package as requested.',
    timestamp: '2025-03-17T16:00:00',
    opportunityId: 15
  },
  
  // Opportunity 16 (Thomas Anderson - formerly duplicate 10) - Add missing types
  {
    id: 160,
    type: 'financing',
    user: 'David Miller',
    action: 'submitted financing request',
    content: 'Financing pending: 48-month term at 4.5% APR',
    data: {
      term: 48,
      apr: 4.5,
      amount: 75000,
      downPayment: 0,
      monthlyPayment: 1715,
      status: 'pending'
    },
    timestamp: '2024-12-14T11:00:00',
    opportunityId: 16
  },
  {
    id: 161,
    type: 'attachment',
    user: 'David Miller',
    action: 'uploaded an attachment',
    content: 'Mercedes EQC charging infrastructure guide',
    fileName: 'EQC_Charging_Guide.pdf',
    timestamp: '2024-12-13T15:00:00',
    opportunityId: 16
  },
  {
    id: 162,
    type: 'whatsapp',
    user: 'David Miller',
    action: 'sent a WhatsApp message',
    content: 'Thomas, I submitted your financing application. Fingers crossed!',
    timestamp: '2024-12-14T12:00:00',
    opportunityId: 16
  },
  
  // Purchase activities (for closed/won opportunities)
  {
    id: 163,
    type: 'purchase',
    user: 'David Miller',
    action: 'completed a purchase',
    data: {
      brand: 'Mercedes-Benz',
      model: 'GLE 450',
      year: 2024,
      price: 78500,
      purchaseDate: '2025-12-18',
      notes: 'Full payment received. Customer opted for premium package with panoramic sunroof.'
    },
    timestamp: '2025-12-18T16:30:00',
    opportunityId: 3
  },
  {
    id: 164,
    type: 'purchase',
    user: 'Sarah Jenkins',
    action: 'completed a purchase',
    data: {
      brand: 'Audi',
      model: 'e-tron GT',
      year: 2024,
      price: 125000,
      purchaseDate: '2025-12-20',
      notes: 'Customer very satisfied with final negotiations. Trade-in processed successfully.'
    },
    timestamp: '2025-12-20T14:00:00',
    opportunityId: 9
  },
  {
    id: 165,
    type: 'purchase',
    user: 'Michael Thomas',
    action: 'completed a purchase',
    data: {
      brand: 'BMW',
      model: 'iX xDrive50',
      year: 2024,
      price: 89900,
      purchaseDate: '2025-12-22',
      notes: 'Contract finalized. Customer selected midnight blue metallic paint.'
    },
    timestamp: '2025-12-22T11:15:00',
    opportunityId: 11
  },
  // Offer activities for new opportunities (with vehicle data for carousel)
  {
    id: 100,
    type: 'offer',
    user: 'Sarah Jenkins',
    action: 'created an offer',
    content: 'Initial offer sent for Audi Q5',
    timestamp: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 3)
      return date.toISOString()
    })(),
    opportunityId: 30,
    data: {
      vehicle: {
        brand: 'Audi',
        model: 'Q5',
        year: 2024,
        price: 55000,
        image: 'https://images.unsplash.com/photo-1589536672709-a5d34b12466d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGF1ZGl8ZW58MHx8MHx8fDA%3D',
        dealership: 'Milan',
        fuelType: 'Petrol',
        gearType: 'Automatic',
        kilometers: 0,
      status: 'New',
        stockDays: 10
      }
    }
  },
  {
    id: 101,
    type: 'offer',
    user: 'David Miller',
    action: 'created an offer',
    content: 'Follow-up offer sent for Audi Q5 Premium',
    timestamp: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date.toISOString()
    })(),
    opportunityId: 30,
    data: {
      vehicle: {
        brand: 'Audi',
        model: 'Q5 Premium',
        year: 2024,
        price: 58000,
        image: 'https://images.unsplash.com/photo-1589536672709-a5d34b12466d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGF1ZGl8ZW58MHx8MHx8fDA%3D',
        dealership: 'Milan',
        fuelType: 'Petrol',
        gearType: 'Automatic',
        kilometers: 0,
      status: 'New',
        stockDays: 5
      }
    }
  },
  {
    id: 102,
    type: 'offer',
    user: 'Sarah Jenkins',
    action: 'created an offer',
    content: 'Initial offer sent for Volkswagen Touran',
    timestamp: (() => {
      const date = new Date()
      date.setDate(date.getDate() - 2)
      return date.toISOString()
    })(),
    opportunityId: 33,
    data: {
      vehicle: {
        brand: 'Volkswagen',
        model: 'Touran',
        year: 2023,
        price: 35000,
        image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=900&auto=format&fit=crop&q=60',
        dealership: 'Berlin',
        fuelType: 'Petrol',
        gearType: 'Automatic',
        kilometers: 10,
      status: 'Used',
        stockDays: 100
      }
    }
  }
]

// Dashboard Mock Data
export const mockDashboardKPIs = [
  {
    id: 1,
    title: 'Deals closed today',
    value: 12,
    change: 20,
    changeType: 'increase',
    trend: [8, 9, 10, 11, 12, 11, 12]
  },
  {
    id: 2,
    title: 'Deals in negotiation',
    value: 320,
    change: 11,
    changeType: 'increase',
    trend: [280, 290, 300, 310, 315, 318, 320]
  },
  {
    id: 3,
    title: 'New leads today',
    value: 79,
    change: 11,
    changeType: 'decrease',
    trend: [90, 88, 85, 82, 80, 79, 79]
  },
  {
    id: 4,
    title: 'New opportunities today',
    value: 23,
    change: 17,
    changeType: 'increase',
    trend: [18, 19, 20, 21, 22, 22, 23]
  }
]

export const mockSalesPipeline = {
  stages: [
    { name: 'Lead generated', percentage: 100, count: 1000, avgTime: '12h' },
    { name: 'Validated', percentage: 87.2, count: 872, avgTime: '12h' },
    { name: 'Qualified', percentage: 63.4, count: 634, avgTime: '12h' },
    { name: 'Offer created', percentage: 17.2, count: 172, avgTime: '7d 9h' },
    { name: 'Won', percentage: 11.2, count: 112, avgTime: '12h' }
  ],
  leadSources: [
    { name: 'Coches.net', color: 'red', data: [1000, 872, 634, 172, 112] },
    { name: 'Autoscout24', color: 'orange', data: [800, 700, 500, 140, 90] },
    { name: 'OLX', color: 'blue', data: [600, 520, 380, 100, 65] },
    { name: 'Cars.com', color: 'gray', data: [400, 350, 250, 70, 45] }
  ]
}

export const mockTeamPerformance = [
  { name: 'Jose Maria Gonzalez', leads: 171, qualifiedLeads: 85, qualifiedPercentage: 49, opportunities: 42, inNegotiation: 18, inNegotiationPercentage: 43, won: 12, wonPercentage: 67 },
  { name: 'Sarah Johnson', leads: 145, qualifiedLeads: 62, qualifiedPercentage: 43, opportunities: 38, inNegotiation: 15, inNegotiationPercentage: 39, won: 9, wonPercentage: 60 },
  { name: 'Michael Chen', leads: 198, qualifiedLeads: 94, qualifiedPercentage: 47, opportunities: 51, inNegotiation: 22, inNegotiationPercentage: 43, won: 15, wonPercentage: 68 },
  { name: 'Emma Rodriguez', leads: 156, qualifiedLeads: 78, qualifiedPercentage: 50, opportunities: 45, inNegotiation: 19, inNegotiationPercentage: 42, won: 11, wonPercentage: 58 },
  { name: 'David Kim', leads: 182, qualifiedLeads: 89, qualifiedPercentage: 49, opportunities: 48, inNegotiation: 21, inNegotiationPercentage: 44, won: 14, wonPercentage: 67 },
  { name: 'Lisa Thompson', leads: 134, qualifiedLeads: 59, qualifiedPercentage: 44, opportunities: 35, inNegotiation: 14, inNegotiationPercentage: 40, won: 8, wonPercentage: 57 },
  { name: 'Carlos Martinez', leads: 167, qualifiedLeads: 82, qualifiedPercentage: 49, opportunities: 44, inNegotiation: 20, inNegotiationPercentage: 45, won: 13, wonPercentage: 65 },
  { name: 'Anna Kowalski', leads: 143, qualifiedLeads: 65, qualifiedPercentage: 45, opportunities: 37, inNegotiation: 16, inNegotiationPercentage: 43, won: 10, wonPercentage: 63 },
  { name: 'Thomas Anderson', leads: 189, qualifiedLeads: 91, qualifiedPercentage: 48, opportunities: 49, inNegotiation: 23, inNegotiationPercentage: 47, won: 16, wonPercentage: 70 },
  { name: 'Sophie Laurent', leads: 159, qualifiedLeads: 73, qualifiedPercentage: 46, opportunities: 41, inNegotiation: 17, inNegotiationPercentage: 41, won: 11, wonPercentage: 65 }
]

export const mockTodaysEvents = [
  { id: 1, time: '09:30-10:30', type: 'Dealership visit', customer: 'Jose Maria Gonzalez', location: 'Madrid Mercedes-Benz Central' },
  { id: 2, time: '11:00-12:00', type: 'Test drive', customer: 'Sarah Johnson', location: 'Barcelona Mercedes-Benz' },
  { id: 3, time: '13:15-13:45', type: 'Call', customer: 'Michael Chen', location: 'Virtual Meeting' },
  { id: 4, time: '14:30-15:30', type: 'Delivery', customer: 'Emma Rodriguez', location: 'Valencia Mercedes-Benz' },
  { id: 5, time: '15:45-16:45', type: 'Recall', customer: 'David Kim', location: 'Seville Service Center' },
  { id: 6, time: '17:00-18:00', type: 'Offsite visit', customer: 'Lisa Thompson', location: 'Customer Location - Malaga' }
]

export const mockPageViewsByVehicle = [
  { id: 1, brand: 'BMW', model: 'X5', views: 102, change: 15.3, changeType: 'increase', avgPerDay: 3.4, trend: [85, 88, 92, 95, 98, 100, 102] },
  { id: 2, brand: 'Mercedes-Benz', model: 'GLE', views: 81, change: 12.0, changeType: 'increase', avgPerDay: 2.7, trend: [70, 72, 75, 77, 79, 80, 81] },
  { id: 3, brand: 'Audi', model: 'Q7', views: 72, change: 2.7, changeType: 'decrease', avgPerDay: 2.4, trend: [74, 73, 73, 72, 72, 72, 72] },
  { id: 4, brand: 'Porsche', model: 'Cayenne', views: 68, change: 8.0, changeType: 'increase', avgPerDay: 2.3, trend: [60, 62, 64, 65, 66, 67, 68] },
  { id: 5, brand: 'Tesla', model: 'Model Y', views: 60, change: 8.0, changeType: 'decrease', avgPerDay: 2.0, trend: [65, 64, 63, 62, 61, 60, 60] }
]

export const mockPageViewsOrganicPaid = [
  { day: '1', organic: 120, paid: 45 },
  { day: '2', organic: 135, paid: 52 },
  { day: '3', organic: 98, paid: 38 },
  { day: '4', organic: 145, paid: 60 },
  { day: '5', organic: 160, paid: 68 },
  { day: '6', organic: 185, paid: 75 },
  { day: '7', organic: 155, paid: 62 },
  { day: '8', organic: 125, paid: 48 },
  { day: '9', organic: 142, paid: 55 },
  { day: '10', organic: 110, paid: 42 },
  { day: '11', organic: 138, paid: 58 },
  { day: '12', organic: 168, paid: 72 },
  { day: '13', organic: 195, paid: 82 },
  { day: '14', organic: 165, paid: 70 },
  { day: '15', organic: 132, paid: 50 },
  { day: '16', organic: 148, paid: 60 },
  { day: '17', organic: 115, paid: 45 },
  { day: '18', organic: 152, paid: 65 },
  { day: '19', organic: 175, paid: 78 },
  { day: '20', organic: 205, paid: 88 },
  { day: '21', organic: 172, paid: 75 },
  { day: '22', organic: 140, paid: 55 },
  { day: '23', organic: 155, paid: 65 },
  { day: '24', organic: 122, paid: 48 },
  { day: '25', organic: 158, paid: 68 },
  { day: '26', organic: 182, paid: 82 },
  { day: '27', organic: 215, paid: 92 },
  { day: '28', organic: 180, paid: 80 },
  { day: '29', organic: 145, paid: 58 },
  { day: '30', organic: 162, paid: 70 }
]

// Performance Metrics Mock Data
export const mockBDCOperatorMetrics = {
  slaCompliance: {
    completed: 142,
    total: 158,
    percentage: 89.9,
    withinSLA: 142,
    trend: [85.2, 86.5, 87.1, 88.3, 88.9, 89.5, 89.9]
  },
  tasksPerDay: {
    current: 35,
    target: 40,
    average: 33.5,
    trend: [28, 30, 32, 33, 34, 34.5, 35]
  },
  appointmentsReserved: 28,
  appointmentsReservedTrend: [22, 24, 26, 25, 27, 28],
  leadToOpportunityConversion: 24.5,
  leadToOpportunityConversionTrend: [20, 21, 23, 24, 24.2, 24.5]
}

export const mockSalespersonMetrics = {
  contractsClosed: {
    month: 12,
    quarter: 34,
    year: 128
  },
  revenue: {
    month: 1250000,
    quarter: 3450000,
    year: 12800000
  },
  revenueTargets: {
    month: 1500000,
    quarter: 4000000,
    year: 15000000
  },
  pipelineValue: 3200000,
  winRate: 68.5,
  newOpportunities: {
    month: 23,
    quarter: 67,
    year: 245
  },
  dormantOpportunities: 8
}

export const mockManagerFunnelMetrics = {
  stages: [
    {
      name: 'Total leads',
      count: 1332,
      percentage: 100,
      color: 'gray',
      trend: [1200, 1250, 1280, 1300, 1315, 1325, 1332]
    },
    {
      name: 'Assigned leads',
      count: 1037,
      percentage: 78,
      color: 'gray',
      trend: [950, 980, 1000, 1015, 1025, 1030, 1037]
    },
    {
      name: 'Managed leads',
      count: 982,
      percentage: 74,
      color: 'gray',
      trend: [920, 940, 960, 970, 975, 980, 982]
    },
    {
      name: 'Qualified leads',
      count: 372,
      percentage: 28,
      color: 'orange',
      trend: [340, 350, 360, 365, 368, 370, 372]
    },
    {
      name: 'Managed opportunities',
      count: 316,
      percentage: 24,
      color: 'blue',
      trend: [290, 300, 308, 312, 314, 315, 316]
    },
    {
      name: 'Won opportunities',
      count: 211,
      percentage: 16,
      color: 'red',
      trend: [195, 200, 205, 208, 210, 210, 211]
    }
  ],
  conversionRate: 16,
  conversionRateTrend: [14.2, 14.8, 15.2, 15.5, 15.7, 15.9, 16]
}
