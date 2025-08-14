// src/views/AboutView.vue
<template>
  <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="text-center">
      <h1 class="text-4xl font-extrabold text-white sm:text-5xl">
        Welcome to <span class="text-brand-primary">FAIE</span>
      </h1>
      <p class="mt-4 text-xl text-brand-secondary">
        Your Personal Financial Analyst for Investments and Expenses.
      </p>
    </div>

    <div class="mt-12 space-y-10">
      <div class="prose prose-invert lg:prose-xl mx-auto text-gray-300">
        <h2>Our Mission</h2>
        <p>
          In today's complex financial world, clarity is power. FAIE was built to provide a clean,
          powerful, and intuitive dashboard to help you consolidate your financial life. We believe
          that by tracking your investments and monitoring your expenses in one place, you can make
          smarter decisions and achieve your financial goals faster.
        </p>

        <h2>Key Features</h2>
        <ul>
          <li>
            <strong>Comprehensive Dashboard:</strong> Get a high-level overview of your total net
            worth, daily performance, and spending habits all in one place.
          </li>
          <li>
            <strong>Live Investment Tracking:</strong> Connect to real-time market data for stocks,
            ETFs, and cryptocurrencies to see exactly how your portfolio is performing.
          </li>
          <li>
            <strong>Detailed Expense Management:</strong> Log your expenses by category to
            understand where your money is going and identify opportunities to save.
          </li>
          <li>
            <strong>Powerful Analytics:</strong> Visualize your financial trends over time with
            interactive charts, helping you see the bigger picture of your financial journey.
          </li>
          <li>
            <strong>Secure & Private:</strong> Built with Firebase Authentication, your financial
            data is linked to your private account.
          </li>
        </ul>

        <h2>About the Developer</h2>
        <p>
          This application was developed by a passionate software engineer returning to the tech
          industry. It represents a journey of rediscovering skills, mastering modern technologies
          like Vue.js, TypeScript, and Firebase, and a commitment to building high-quality,
          user-focused products. This project is a testament to the power of continuous learning and
          dedication.
        </p>
      </div>
    </div>
  </main>
</template>

<style>
/* Basic styles for the prose plugin to look good */
.prose h2 {
  @apply mb-4 text-2xl font-bold text-white;
}
.prose p,
.prose ul {
  @apply text-lg;
}
.prose ul {
  @apply list-disc pl-5;
}
.prose li {
  @apply mb-2;
}
</style>
