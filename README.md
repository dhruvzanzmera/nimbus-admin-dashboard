# Admin Panel

A modern React admin dashboard for managing key business areas such as overview, orders, users, revenue, reports, and settings.

## Tech Stack

- React 19
- Vite
- React Router DOM
- Tailwind CSS
- JavaScript

## Features

- Responsive admin dashboard layout
- Sidebar navigation
- Overview metrics cards
- Orders, users, revenue, reports, and settings pages
- Reusable table component
- Clean UI for dashboard management workflows

## Project Structure

```bash
src/
├── App.jsx
├── App.css
├── index.css
├── main.jsx
├── assets/
├── components/
│   ├── Icon.jsx
│   └── Table.jsx
├── pages/
│   ├── Overview.jsx
│   ├── Orders.jsx
│   ├── Users.jsx
│   ├── Revenue.jsx
│   ├── Reports.jsx
│   └── Settings.jsx
└── ...
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

Then open the local URL shown in the terminal, typically:

```bash
http://localhost:5173
```

### 3. Build for production

```bash
npm run build
```

### 4. Preview production build

```bash
npm run preview
```

## Scripts

```bash
npm run dev     # start Vite dev server
npm run build   # create production build
npm run preview # preview built app locally
npm run lint    # run project linting
```

## Notes

- The app includes Nimbus SEO metadata and a branded SVG favicon.
- You can customize page content and styling in the pages and CSS files under `src/`.

## License

This project is for educational/demo purposes.
