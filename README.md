# FAIE - Financial Analyst for Investments and Expenses

FAIE is a modern, responsive, and feature-rich personal finance dashboard designed to help users track their investments, manage expenses, and gain insights into their financial health. This application was built from the ground up as a comprehensive learning project, demonstrating a full range of modern front-end development skills.

![FAIE Dashboard Screenshot](./path/to/your/screenshot.png)
_(**Action Required:** Take a beautiful screenshot of your finished dashboard, add it to your project folder, and update this path!)_

---

## ✨ Features

- **Multi-Page Dashboard:** A clean, multi-page interface built with Vue Router for logical separation of concerns.
- **Investment Tracking:**
  - Add, edit, and delete stock, ETF, and crypto holdings.
  - Live price data fetched from multiple financial APIs (Financial Modeling Prep & Alpha Vantage).
  - Real-time calculation of total value, daily change, and total gain/loss.
  - Smart API routing that uses the best data source based on the ticker symbol.
- **Expense Management:**
  - Log expenses with title, amount, category, and date.
  - View a list of recent expenses.
- **Data Visualization:**
  - Interactive doughnut charts for both asset allocation and spending by category.
  - A line chart on the Analytics page showing the "Monthly Savings" trend over time.
- **Robust & Performant:**
  - **Smart Caching:** API calls are cached for 15 minutes to improve performance and stay within free tier limits.
  - **Data Persistence:** User's portfolio and expenses are saved to the browser's Local Storage.
  - **Graceful Error Handling:** The UI provides clear feedback for failed API calls, with a "Retry" mechanism.
- **Modern UX/UI:**
  - Fully responsive design that looks great on desktop and mobile devices.
  - Smooth fade transitions for adding/deleting items.
  - A sleek, professional dark theme built with Tailwind CSS.
  - Autocomplete ticker search to assist users in finding the right stock or ETF.

---

## 🛠️ Tech Stack

- **Framework:** [Vue 3](https://vuejs.org/) (with Composition API and `<script setup>`)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **State Management:** [Pinia](https://pinia.vuejs.org/)
- **Routing:** [Vue Router](https://router.vuejs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Charting:** [Chart.js](https://www.chartjs.org/) with [vue-chartjs](https://vue-chartjs.org/)
- **Icons:** [Heroicons](https://heroicons.com/)
- **Deployment:** [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

To run this project locally, follow these steps:

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or a compatible package manager

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/investment-tracker.git
    cd investment-tracker
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env.local` in the root of the project and add your API keys. You can get free keys from the respective websites.

    ```
    VITE_FMP_API_KEY=your_financial_modeling_prep_key
    VITE_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
    VITE_NEWS_API_KEY=your_newsapi_org_key
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

---

## 🌟 What I Learned

This project was a deep dive into the modern front-end ecosystem. Key learnings include:

- Building a scalable architecture with Pinia for state management.
- Implementing a robust, multi-source API fetching engine with smart caching and graceful error handling.
- Creating a complex, data-driven, and fully responsive UI with Tailwind CSS.
- Configuring a modern development environment with Vite, including server proxies for local development.
- Deploying a full-stack application (front-end + serverless functions) to a production environment with Vercel.
