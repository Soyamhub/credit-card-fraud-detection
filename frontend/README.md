🛡️ Fraud Detection System — Full-Stack (React + Django + ML)

A modern real-time AI-powered fraud detection platform built with React (Vite) on the frontend and Django + Machine Learning on the backend.
Supports user authentication (JWT), per-user transaction history, rule-enhanced ML fraud prediction, and a clean & interactive UI.

🚀 Key Features
🔐 Authentication

Secure JWT-based Login & Signup

Only authenticated users can submit transactions

Each user sees only their own transaction history

🤖 Fraud Detection Engine

Backend ML model + rule-based risk enhancer

Human-friendly inputs → converted to V1–V28 features

Real-time fraud probability score

Risk boost logic: large amounts, foreign country, chargebacks, high burst activity, etc.

📊 Dashboard & History

User-specific transaction logs

Filters: Fraud / Safe / All

Search by ID or amount

Auto-stored history in database (not localStorage)

🖥️ Modern UI

Built using React 18, TailwindCSS, shadcn/ui

Fast Vite bundler

Responsive on mobile + desktop

🏗️ Tech Stack
Frontend

React 18 + Vite

TailwindCSS

shadcn/ui components

Lucide Icons

React Router 6

Axios

Backend

Django

Django REST Framework

SimpleJWT Auth

Scikit-Learn ML Model

NumPy, Pandas

Machine Learning

Trained RandomForest classifier

Scaled feature input

PCA-transformed V1–V28 embedding

Risk-boost heuristic layer

📁 Project Structure
fraud-detection-app/
├── backend/
│   ├── api/
│   │   ├── models.py           # Transaction model
│   │   ├── views.py            # Prediction, history, auth
│   │   ├── serializers.py
│   │   ├── feature_mapping.py  # Converts human input → V1–V28
│   │   ├── urls.py
│   │   └── utils.py            # Load ML model + scaler
│   ├── fraud_detection/
│   ├── ml_models/
│   │   ├── model.pkl
│   │   ├── scaler.pkl
│   │   └── feature_means.json
│   └── manage.py
└── frontend/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── services/
    │   └── App.jsx
    └── package.json

🔧 Backend Setup
1️⃣ Install dependencies
cd backend
pip install -r requirements.txt

2️⃣ Run migrations
python manage.py makemigrations
python manage.py migrate

3️⃣ Start server
python manage.py runserver

4️⃣ ML Model Files

Place inside:

backend/ml_models/
  - model.pkl
  - scaler.pkl
  - feature_means.json

🔐 Authentication Endpoints
Signup

POST /api/auth/register/

Body:

{
  "username": "john",
  "password": "123456",
  "email": "john@gmail.com"
}

Login

POST /api/auth/login/

Returns:

{
  "access": "<jwt>",
  "refresh": "<jwt>"
}

Refresh Token

POST /api/auth/refresh/

🤖 Fraud Prediction Endpoint

POST /api/predict/ (Authenticated)

Body example:

{
  "amount": 9000,
  "time_since_last_txn": 1,
  "channel": "online",
  "merchant_category": "electronics",
  "country": "UK",
  "time_of_day": "evening",
  "day_of_week": "fri",
  "previous_24h_txns": 8,
  "avg_amount_7d": 1500,
  "chargeback_history": "yes"
}


Returns:

{
  "prediction": 1,
  "fraud_probability": 0.92,
  "ml_probability": 0.41,
  "rule_probability": 0.78,
  "risk_bonus": 0.3
}

📜 Transaction History API

User must be logged in.

GET /api/my-transactions/

Returns only the logged-in user’s transactions.

🧠 Fraud Model Logic (Simplified)

Your backend combines:

1️⃣ Machine Learning (RandomForest)

Predicts a base fraud probability from V1–V28 features.

2️⃣ Rule-Based System

Adds probability when:

Amount > 5000 or > 10,000

Previous 24h transactions ≥ 5 or ≥ 10

Country ≠ IN

Chargeback history = yes

Amount ≫ avg last 7 days

3️⃣ Final Score
combined = 0.5 * ml_prob + 0.5 * rules_prob + risk_bonus

🖥️ Frontend Setup
Install dependencies
cd frontend
npm install

Start development server
npm run dev

🧭 Frontend Pages
Page	Route	Description
Login	/login	User authentication
Signup	/signup	Create new account
Dashboard	/dashboard	Analytics overview
Request	/request	Fraud check form
Result	/result	Prediction output
Transactions	/transactions	History (per-user)
About	/about	Project info
🔐 Protected Routes

You cannot access:

/dashboard

/request

/transactions

/result

until logged in, enforced by ProtectedRoute.jsx.

⭐ Future Enhancements

Admin dashboard

Live anomaly monitoring

Neural network fraud model

Multi-factor authentication

SMS/email alert system

👤 Author

Soyam Shubham Swain
📍 Bhubaneswar
🎓 Gandhi Engineering College
💼 ML + Full-Stack Developer

⭐ Support the Project

If this helped you, please ⭐ star the GitHub repo!