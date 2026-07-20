# 🌍 OpenPlaces — Frontend

**Every place should be open to everyone.**

OpenPlaces is a collaborative map for discovering eco-friendly, accessible businesses that care about every dietary need — found, reviewed and suggested by the community.

**🔗 Live demo:** [openplaces.netlify.app](https://openplaces.netlify.app)

**⚙️ Backend repository:** [OpenPlaces API](https://github.com/FabioDeiana/Backend)

![Home page](screenshots/home.png)

## ✨ Features

- **Interactive map** (Leaflet + OpenStreetMap) with custom category markers and hover previews
- **Advanced filtering** — by category, city, dietary options, accessibility features and food bases (soy, oat, rice...) for allergy-aware search
- **Community-driven content** — logged-in users can suggest new places, with admin approval workflow
- **Reviews with multi-criteria ratings** — eco-friendliness, accessibility and dietary options, editable over time
- **User profiles** with dietary preferences, allergies and accessibility needs
- **AI assistant** — chatbot that recommends places based on user preferences (OpenRouter)
- **Admin dashboard** — user management, activity moderation, pending proposals
- **i18n** — full Italian/English support with automatic language detection
- **Auth** — JWT with in-memory access token + httpOnly refresh token cookie, automatic silent refresh via axios interceptors
- **Responsive design** with scroll-triggered animations (Motion)

## 🛠️ Tech Stack

- **React 19** + **Vite**
- **Tailwind CSS v4** (custom theme)
- **React Router** — SPA routing with protected routes by role
- **Leaflet / react-leaflet** — interactive maps
- **Motion** (Framer Motion) — animations
- **i18next** — internationalization
- **Axios** — API client with automatic token refresh
- **Nominatim (OpenStreetMap)** — address geocoding

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/FabioDeiana/Frontend.git
cd Frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start dev server
npm run dev
```

The app expects the [backend](https://github.com/FabioDeiana/Backend) running on port 5000.


## 👤 Author

**Fabio Deiana** — Full Stack Developer

[LinkedIn](https://www.linkedin.com/in/fabiodeiana/) · [GitHub](https://github.com/FabioDeiana)