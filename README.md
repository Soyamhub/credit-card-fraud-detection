# Credit Card Fraud Detection System

An intelligent machine learning system for detecting credit card fraud in real-time using Random Forest and SMOTE.

## Features
- 99.8% accuracy fraud detection
- Real-time prediction API
- Explainable AI with SHAP
- Interactive dashboard with React.js
- Advanced data balancing with SMOTE

## Tech Stack
**Backend:** Django, Django REST Framework  
**ML:** scikit-learn, Random Forest, SMOTE, SHAP  
**Frontend:** React.js, Vite, Tailwind CSS  
**Visualization:** matplotlib, seaborn

## Installation

### Backend Setup
cd backend
pip install -r requirements.txt
python manage.py runserver

### Frontend Setup
cd frontend
npm install
npm run dev

## Model Training
cd training
python model_training.py

## API Usage
POST /api/predict/
{
"Time": 12345,
"Amount": 100.0,
"V1": -1.35,
...
}

## Results
- Accuracy: 99.8%
- Precision: 0.97
- Recall: 0.95
- AUC: 1.0
