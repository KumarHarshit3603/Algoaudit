# 🚀 Quick Setup Guide

## Installation Steps

1. **Navigate to the project directory:**
   ```bash
   cd algoaudit
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   - The app will run at `http://localhost:5173`
   - You should see the AlgoAudit interface

## What You'll See

- **Left Panel**: Algorithm selector with 5 sorting algorithms
- **Middle Panel**: Test case selector with various data sizes
- **Right Panel**: Custom code input for your own algorithms
- **Action Bar**: Run benchmarks and download reports
- **Results Area**: Charts and detailed performance tables

## Quick Test

1. Select "Bubble Sort" and "Quick Sort"
2. Select "Small (100)" and "Medium (1000)"
3. Click "RUN BENCHMARKS"
4. Watch the progress bar and view results
5. Click "DOWNLOAD REPORT" to get a .txt file

## Troubleshooting

**Port already in use?**
```bash
npm run dev -- --port 3000
```

**Dependencies not installing?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Build errors?**
```bash
npm run build
```

## Project Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

---

Enjoy benchmarking! ⚡
