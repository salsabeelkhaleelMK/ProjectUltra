# LeadSpark CRM - Vue 3 Application

A comprehensive CRM (Customer Relationship Management) application built with Vue 3, Pinia, and Tailwind CSS.

## 🚀 Features

### Core Functionality
- **Role-Based Dashboards**: Different dashboards for Salespeople and Operators
- **Lead Management**: Complete lead tracking with detailed views
- **Pipeline Visualization**: Sales funnel with stage tracking
- **Calendar Integration**: FullCalendar for appointments and test drives
- **Contacts Management**: Customer and account management
- **Opportunities Tracking**: Deal pipeline with probability tracking
- **Vehicle Inventory**: Complete vehicle management system
- **Marketing Tools**: Campaign management (basic UI)
- **Reports & Analytics**: Performance metrics and reports (basic UI)

### Technical Features
- **Vue 3 Composition API**: Modern reactive state management
- **Pinia State Management**: Centralized store for all entities
- **Vue Router**: SPA navigation with dynamic routing
- **Tailwind CSS**: Utility-first CSS framework
- **FullCalendar**: Interactive calendar component
- **Mock Data Layer**: Easy-to-replace API abstraction
- **Responsive Design**: Works on desktop and tablet devices
- **Icon-Based Navigation**: Clean sidebar navigation

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Project Structure

```
src/
├── api/                    # Mock data layer (replace with real API)
│   ├── mockData.js        # Sample CRM data
│   ├── leads.js           # Lead operations
│   ├── contacts.js        # Contact operations
│   ├── opportunities.js   # Opportunity operations
│   └── vehicles.js        # Vehicle operations
├── stores/                # Pinia stores
│   ├── user.js           # User state & authentication
│   ├── leads.js          # Lead management
│   ├── contacts.js       # Contact management
│   ├── opportunities.js  # Opportunity management
│   └── vehicles.js       # Vehicle management
├── views/                 # Page components
│   ├── Home.vue          # Role-based dashboard
│   ├── Calendar.vue      # FullCalendar integration
│   ├── Pipeline.vue      # Sales funnel visualization
│   ├── Leads.vue         # Leads list view
│   ├── LeadDetail.vue    # Detailed lead view
│   ├── Contacts.vue      # Contacts grid
│   ├── Opportunities.vue # Opportunities table
│   ├── Vehicles.vue      # Vehicle inventory
│   ├── Marketing.vue     # Marketing tools
│   └── Reports.vue       # Reports & analytics
├── components/            # Reusable components
│   ├── layout/           # Layout components
│   └── dashboard/        # Dashboard components
├── router/               # Vue Router configuration
│   └── index.js
├── App.vue              # Root component
└── main.js              # Application entry point
```

## 🎨 Key Pages

### 1. Home (Dashboard)
- **Salesman View**: Hot leads, conversion rates, upcoming tasks, recent leads
- **Operator View**: System-wide metrics, team overview, activity log

### 2. Pipeline
- Sales funnel with 5 stages: Open Leads → Open Opportunities → In Negotiation → Won → Lost
- Conversion metrics and funnel visualization
- Interactive stage filtering

### 3. Leads
- Comprehensive leads table with filtering
- Stage tabs (Open Leads, Opportunities, In Negotiation, Won, Lost)
- Advanced search and filtering

### 4. Lead Detail
- Three-column layout (lead cards, detail view, activity timeline)
- Customer information with expandable contact details
- Requested vehicle widget
- Action management (call, postpone, create opportunity, disqualify)
- Activity timeline with notes and communications

### 5. Calendar
- FullCalendar integration
- Month, week, and day views
- Event creation (test drives, appointments, calls)
- Drag-and-drop scheduling

### 6. Contacts
- Grid view of all contacts
- Search and filter functionality
- Company and tag management

### 7. Opportunities
- Table view with stage tracking
- Probability indicators
- Expected close dates
- Value tracking

### 8. Vehicles
- Grid view of vehicle inventory
- Stock day tracking
- Requested by tracking
- Status management

## 🔄 Replacing Mock Data with Real API

The application uses a mock data layer designed for easy replacement with real API calls. To integrate with your backend:

### 1. Update API files in `src/api/`

Replace mock implementations with actual API calls:

```javascript
// Before (Mock)
export const fetchLeads = async (filters = {}) => {
  await delay()
  return mockLeads.filter(/* filter logic */)
}

// After (Real API)
export const fetchLeads = async (filters = {}) => {
  const response = await axios.get('/api/leads', { params: filters })
  return response.data
}
```

### 2. No changes needed in components or stores!

All components use the store, and stores use the API layer. You only need to update the API files.

## 👥 User Roles

### Salesman
- View assigned leads and opportunities
- Manage pipeline
- Schedule appointments
- Track personal performance

### Operator
- System-wide view of all activities
- Team management and oversight
- System metrics and reporting
- Resource allocation

### Switching Roles (Demo)
Click on the user menu in the top-right corner and select "Switch to Salesman" or "Switch to Operator" to see different dashboard views.

## 🎯 Navigation

### Icon Sidebar (Left)
- ➕ **Create New**: Quick access to create leads, contacts, opportunities, vehicles
- 👥 **Contacts**: Contacts & Accounts
- 🏷️ **Leads**: Lead management (with hot lead indicator)
- 💎 **Opportunities**: Deal tracking
- 🚗 **Vehicles**: Inventory management
- 📈 **Pipeline**: Sales funnel
- 📅 **Calendar**: Appointments & events
- 📢 **Marketing**: Marketing tools
- 📊 **Reports**: Analytics & reports

## 🛠️ Technologies Used

- **Vue 3**: Progressive JavaScript framework
- **Pinia**: State management for Vue 3
- **Vue Router 4**: Official router for Vue 3
- **Tailwind CSS**: Utility-first CSS framework
- **FullCalendar**: Calendar component library
- **Font Awesome 6**: Icon library
- **Vite**: Fast build tool and development server

## 📝 Mock Data

The application includes realistic mock data for:
- 3 leads with various priorities and stages
- 2 opportunities at different stages
- 2 contacts with complete information
- 3 vehicles in inventory
- 3 calendar events
- Activity timeline entries

## 🔮 Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced filtering and saved views
- [ ] Email integration
- [ ] WhatsApp integration
- [ ] Document management
- [ ] Advanced reporting with charts
- [ ] Export functionality (CSV, PDF)
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Mobile app version

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Development

```bash
# Install dependencies
npm install

# Run development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## 📄 License

This project is private and proprietary.

## 👤 Author

Built with ❤️ for automotive CRM needs

---

**Note**: This application uses mock data by default. To connect to a real backend, update the API layer in `src/api/` with your actual API endpoints.

## 🚀 Quick Start

1. Clone the repository
2. Run `npm install`
3. Run `npm run dev`
4. Open `http://localhost:5173` in your browser
5. Use the user menu to switch between Salesman and Operator roles

Happy CRM managing! 🎉

