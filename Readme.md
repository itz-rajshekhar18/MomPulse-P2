mompulse-web/
├── backend/                # Node.js server
│   ├── controllers/        # API logic
│   ├── models/             # Database models (MongoDB / PostgreSQL)
│   ├── routes/             # API endpoints
│   ├── services/           # Business logic (email, notifications, auth)
│   ├── utils/              # Helper functions
│   ├── middlewares/        # Auth, validation, error handling
│   ├── config/             # DB, environment, secrets
│   ├── app.js              # Express server entry
│   └── package.json
│
├── python-services/        # Python services (optional AI, ML)
│   ├── health_recommendations/
│   │   ├── __init__.py
│   │   ├── predictor.py
│   │   └── utils.py
│   ├── requirements.txt
│   └── run.py
│
├── frontend/               # Next.js frontend
│   ├── components/         # Reusable React components
│   ├── pages/              # Next.js pages (SSR / static)
│   ├── public/             # Images, favicon, static files
│   ├── styles/             # CSS / SCSS / Tailwind
│   ├── hooks/              # Custom React hooks
│   ├── context/            # React context for state management
│   ├── utils/              # Helper functions
│   ├── services/           # API calls to backend
│   ├── package.json
│   └── next.config.js
│
├── docker/                 # Docker setups
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── docker-compose.yml
│
├── scripts/                # Dev / deployment scripts
└── README.md
