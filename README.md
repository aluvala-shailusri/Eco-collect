# 🌱 EcoCollect Telangana

### Smart E-Waste Collection & Rewards Platform

EcoCollect Telangana is a client-side web application designed to encourage responsible **e-waste disposal and recycling** through a combination of e-waste collection centers, reward points, environmental impact tracking, GPS location services, and a digital rewards catalog.

The platform allows users to submit their e-waste, calculate reward points based on the type and weight of waste, locate collection centers, track environmental impact, and redeem earned points for rewards.

---

## ✨ Features

### 📊 Interactive Dashboard

* View total reward points
* Track e-waste submissions
* Monitor environmental impact
* View user level and achievements
* Quick navigation to major application features

### ♻️ E-Waste Submission

Users can submit e-waste by:

* Selecting an e-waste category
* Entering the waste weight
* Uploading an image of the waste
* Capturing location information
* Generating a geotagged submission image
* Receiving reward points based on the submission

### 🧮 Smart Reward Calculator

The application calculates reward points based on:

* E-waste category
* Weight in kilograms
* Progressive reward multipliers

Supported categories include:

| Category               |   Base Points |
| ---------------------- | ------------: |
| 📱 Smartphones         | 160 points/kg |
| 💻 Laptops             | 140 points/kg |
| 🔌 Appliances          |  60 points/kg |
| 🔋 Batteries           | 190 points/kg |
| 🔧 Cables & PCBs       | 110 points/kg |
| 🖥️ Screens & Monitors |  85 points/kg |

### 🏆 Progressive Reward System

Higher quantities of e-waste receive additional reward multipliers:

|   Weight | Tier               | Multiplier |
| -------: | ------------------ | ---------: |
|   20+ kg | Gold Bulk Recycler |      1.50× |
|   10+ kg | Silver Eco Batch   |      1.35× |
|    4+ kg | Bronze Volume      |      1.20× |
|  1.5+ kg | Standard Saver     |      1.10× |
| < 1.5 kg | Base Scale         |      1.00× |

### 🌍 Environmental Impact

The platform estimates environmental benefits from each submission, including:

* CO₂ emissions prevented
* Toxic metals diverted from the environment

The current calculation model uses:

* **2.1 kg CO₂ prevented per kg of e-waste**
* **35 g toxic metals per kg of e-waste**

### 🗺️ Interactive Collection Center Map

The application uses **Leaflet.js** to provide an interactive map.

Users can:

* View e-waste collection centers
* View collection center details
* Use their current GPS location
* View submitted e-waste locations
* Filter map locations
* Explore collection facilities across Telangana

### 📸 Photo Geotagging

Uploaded e-waste photographs can be processed using the browser's **HTML5 Canvas API**.

The generated image can contain:

* E-waste category
* Date and time
* Location information
* Tracking ID
* Submission metadata

### 🎁 Rewards Catalog

Users can use their earned points to redeem rewards.

The catalog contains different categories of rewards, including:

* Electronics
* Shopping vouchers
* Food vouchers
* Lifestyle products
* Sustainable products
* Entertainment rewards
* Environmental contributions

### 💾 Local Data Storage

The application currently uses the browser's **Local Storage API** to preserve application state.

This allows information such as:

* User points
* Submissions
* Redemptions
* User information

to persist between browser sessions on the same device/browser.

---

# 🛠️ Technologies Used

## Frontend

* **HTML5** – Application structure and content
* **CSS3** – Styling, responsive layout, animations, and glassmorphism UI
* **JavaScript (ES6+)** – Application logic and interactivity

## Libraries & APIs

* **Leaflet.js** – Interactive maps
* **Font Awesome** – Icons
* **Google Fonts** – Outfit and Plus Jakarta Sans
* **OpenStreetMap / CARTO** – Map tiles
* **Browser Geolocation API** – User location
* **HTML5 Canvas API** – Image processing and geotagging
* **FileReader API** – Image upload and processing
* **Local Storage API** – Client-side data persistence

---

# 📁 Project Structure

```text
EcoCollect-Telangana/
│
├── index.html
│
├── css/
│   ├── main.css
│   └── map.css
│
├── js/
│   ├── app.js
│   ├── calculator.js
│   ├── map.js
│   ├── rewards.js
│   └── upload.js
│
└── README.md
```

---

# 📄 File Description

### `index.html`

The main HTML file that defines the application's user interface.

It contains sections for:

* Dashboard
* Collection Centers
* Submit E-Waste
* Rewards Catalog
* My Redemptions

---

### `css/main.css`

Contains the main application design system and styling.

It controls:

* Colors
* Typography
* Navigation
* Cards
* Buttons
* Forms
* Dashboard components
* Responsive layouts
* Glassmorphism effects
* Animations

---

### `css/map.css`

Contains styling specific to the Leaflet map and map-related components.

It controls:

* Map container
* Map controls
* Collection center markers
* Submission markers
* GPS marker
* Map popups

---

### `js/app.js`

The main application controller.

It handles:

* Application initialization
* Navigation between views
* User interface updates
* Local Storage state
* E-waste submissions
* Points management
* Redemptions
* Toast notifications

---

### `js/calculator.js`

Contains the reward calculation system.

It calculates:

* Base reward points
* Weight multipliers
* Reward tiers
* Total points
* CO₂ impact
* Toxic metal impact

---

### `js/map.js`

Controls the interactive map using Leaflet.js.

It manages:

* Collection center locations
* User GPS location
* Map markers
* Map filters
* Submission locations
* Map initialization

---

### `js/upload.js`

Handles e-waste image submission.

It manages:

* Image uploads
* Drag-and-drop
* Weight input
* Category selection
* Live reward calculations
* Canvas processing
* Geotag watermark generation
* Submission image download

---

### `js/rewards.js`

Manages the rewards catalog and redemption system.

It handles:

* Reward catalog
* Reward categories
* Reward filtering
* Reward point requirements
* Redemption history

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
```

Replace `YOUR-USERNAME` and `YOUR-REPOSITORY` with your GitHub username and repository name.

---

## 2. Open the Project

Navigate into the project folder:

```bash
cd EcoCollect-Telangana
```

---

## 3. Run the Application

This is a client-side web application, so no backend server or database is required for the current version.

You can open:

```text
index.html
```

directly in a browser.

For a better development experience, use a local development server such as **VS Code Live Server**.

---

# 🌐 GitHub Pages Deployment

EcoCollect Telangana can be deployed using GitHub Pages.

### Recommended repository structure

Make sure your repository has this structure:

```text
Repository/
│
├── index.html
│
├── css/
│   ├── main.css
│   └── map.css
│
├── js/
│   ├── app.js
│   ├── calculator.js
│   ├── map.js
│   ├── rewards.js
│   └── upload.js
│
└── README.md
```

### Important

The file and folder names must match the paths referenced by `index.html`.

For example:

```html
<link rel="stylesheet" href="css/main.css">
```

and:

```html
<script src="js/app.js"></script>
```

Therefore, avoid putting the JavaScript and CSS files directly in the repository root unless you also change these paths.

GitHub Pages is also **case-sensitive**, so filenames such as:

```text
app.js
```

and:

```text
App.js
```

are treated as different files.

---

# 🔐 Current Data Architecture

The current version is a **frontend/client-side application**.

User state is stored using:

```text
Browser Local Storage
        │
        ├── User information
        ├── Reward points
        ├── E-waste submissions
        └── Redemption history
```

There is currently no dedicated backend database or server-side authentication system in the supplied project.

This architecture makes the project simple to run and demonstrate while providing a foundation for future backend integration.

---

# 🔮 Future Enhancements

The project can be extended with a backend and database to provide production-level functionality.

Possible future improvements include:

* 🔐 Real user authentication
* 👤 User registration and profiles
* 🗄️ Cloud database integration
* ☁️ Secure image storage
* 📍 Real collection center database
* 📦 E-waste pickup scheduling
* 🚚 Pickup tracking
* 🎟️ Real reward/voucher processing
* 🔔 Notifications
* 📈 Admin dashboard
* 🏢 Recycler/collection-center accounts
* 🛡️ Server-side validation
* 📊 Analytics and reporting
* 🌐 API integration

---

# 🎯 Project Objective

The main objective of EcoCollect Telangana is to make responsible e-waste disposal more engaging by combining:

```text
E-Waste Collection
        ↓
Weight & Category
        ↓
Reward Calculation
        ↓
Points Earned
        ↓
Environmental Impact
        ↓
Rewards Redemption
```

The platform aims to encourage users to recycle electronic waste while making the recycling process more transparent, interactive, and rewarding.

---

# 🌱 Environmental Impact

Electronic waste contains valuable recyclable materials as well as potentially harmful substances.

EcoCollect Telangana promotes responsible disposal by providing users with visibility into the environmental impact associated with their recycling activities.

The application tracks estimated:

**CO₂ prevented**

and

**Toxic metals diverted**

to help users understand the environmental value of their contributions.

---

# 📱 Application Modules

| Module             | Purpose                              |
| ------------------ | ------------------------------------ |
| Dashboard          | User overview and statistics         |
| Collection Centers | Locate e-waste collection facilities |
| Submit E-Waste     | Submit and process e-waste           |
| Reward Calculator  | Calculate points                     |
| Rewards Catalog    | Browse available rewards             |
| My Redemptions     | View redeemed rewards                |
| GPS Tracking       | Determine user location              |
| Photo Geotagging   | Add submission metadata to images    |

---

# 👨‍💻 Development

This project was developed as a **frontend web application using HTML5, CSS3, and JavaScript**.

The application follows a modular JavaScript structure where different files are responsible for specific functionality:

```text
app.js
   │
   ├── Application State
   ├── Navigation
   ├── User Interface
   └── Local Storage
        │
        ├── calculator.js
        │      └── Reward calculation
        │
        ├── map.js
        │      └── Maps & GPS
        │
        ├── upload.js
        │      └── Image processing
        │
        └── rewards.js
               └── Rewards & redemptions
```

---

# 📜 License

This project is currently intended for **educational, demonstration, and project development purposes**.

If you plan to distribute or deploy the project commercially, add an appropriate license and review the licensing requirements of the external libraries, fonts, map services, and assets used by the application.

---

# 💚 EcoCollect Telangana

**Recycle Responsibly. Earn Rewards. Protect Telangana.**

🌱 ♻️ 🌍 🏆
