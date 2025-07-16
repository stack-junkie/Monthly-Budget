# Monthly Budget - WIP, this is a skeleton app

A modern, responsive budget tracking application built with Next.js 15 and React. Track your income and expenses with smart categories, real-time calculations, and export capabilities.

## ✨ Features

- 💰 **Income & Expense Tracking** - Categorize and track all your financial transactions
- 📊 **Real-time Dashboard** - Live calculations of totals, balance, and summaries
- 📋 **Smart Categories** - Predefined categories with ability to create custom ones
- 📤 **Export Functionality** - Export your budget data to CSV or Excel formats
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS
- 🌙 **Dark/Light Theme** - Toggle between light and dark modes
- 📱 **Mobile Responsive** - Works seamlessly on all device sizes
- ⚡ **Fast Performance** - Built with Next.js 15 and React 19

## 🚀 Quick Start

### Prerequisites

- Node.js 18.17 or higher
- pnpm 9.0 or higher (recommended)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/stack-junkie/Monthly-Budget.git
cd Monthly-Budget
```

2. Install dependencies:

```bash
pnpm install
# or use other package managers
npm install
yarn
```

3. Start the development server:

```bash
pnpm dev
# or npm run dev
```

4. Open your browser and visit [http://localhost:3000](http://localhost:3000) to start using the budget app.

## 🎯 Usage

### Getting Started

1. **Navigate to the Budget Page**: Visit `/budget` to access the main budget interface
2. **Add Income/Expenses**: Use the spreadsheet interface to add your financial data
3. **View Summary**: The dashboard shows real-time calculations of your totals and balance
4. **Export Data**: Download your budget as CSV or Excel files

### Features Overview

- **Spreadsheet Interface**: Excel-like table for easy data entry
- **Smart Categories**: Predefined categories for common income/expense types
- **Custom Categories**: Create your own categories and items
- **Real-time Calculations**: Automatic totals and balance calculations
- **Data Export**: Export to CSV or Excel formats
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS with custom components
- **Spreadsheet**: jspreadsheet-ce for Excel-like functionality
- **Data Export**: xlsx library for Excel export
- **UI Components**: Radix UI primitives
- **State Management**: React hooks and Zustand
- **TypeScript**: Full type safety

## 📁 Project Structure

```
app/
├── [locale]/
│   └── budget/          # Main budget page
components/
├── budget/              # Budget-specific components
│   ├── SimpleBudgetTable.tsx
│   ├── SummaryDashboard.tsx
│   ├── ViewToggle.tsx
│   └── ...
types/
└── budget.ts           # TypeScript definitions
```
