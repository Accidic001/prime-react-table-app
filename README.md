# Artwork Gallery - React TypeScript Application

A responsive web application for browsing and managing artwork collections from the Chicago Art Institute API. Built with React, TypeScript, Vite, and PrimeReact components.

## 🚀 Live Demo

[Deployed Application URL] - https://prime-react-table-app.netlify.app/

## 📋 Features

- **Artwork Browsing**: View artwork details including title, artist, origin, date range, and inscriptions
- **Server-Side Pagination**: Efficient data loading with 12 items per page
- **Row Selection**: Select individual or multiple rows with persistent selection across pages
- **Bulk Selection**: Select multiple rows across pages using the bulk selection feature
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **TypeScript**: Full type safety and better development experience

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Components**: PrimeReact + PrimeFlex
- **API**: Chicago Art Institute API
- **Styling**: CSS3 with responsive design
- **Deployment**: Netlify

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Accidic001/prime-react-table-app
   cd artwork-gallery
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🏗️ Project Structure

```
src/
├── components/
│   └── ArtworkTable.tsx          # Main table component
├── types/
│   └── index.ts                  # TypeScript type definitions
├── services/
│   └── api.ts                    # API service functions
├── App.tsx                       # Root component
├── main.tsx                      # Application entry point
└── index.css                     # Global styles
```

## 🔧 Key Implementation Details

### Data Management
- **No Memory Overhead**: Only stores selected artwork IDs, not complete data
- **API Efficiency**: Fetches data on every page change, no client-side caching
- **Selection Persistence**: Maintains selections across page navigation

### Component Features
- **PrimeReact DataTable**: With custom selection handling
- **Responsive Pagination**: Configurable rows per page (12, 24, 48, 96)
- **Bulk Selection Overlay**: Input-based multi-row selection
- **Selection Panel**: Real-time selection count with clear option

### API Integration
```typescript
// Example API call
const response = await fetchArtworks({
  page: 1,
  limit: 12
});
```

## 🎯 Core Requirements Met

✅ **Memory Efficiency**: No storage of fetched rows across pages  
✅ **API Calls**: Fresh data fetch on every page change  
✅ **Selection Persistence**: Selections maintained across page navigation  
✅ **Responsive Design**: Works on all device sizes  
✅ **TypeScript**: Full type safety implementation  
✅ **Performance**: Optimized rendering and state management  

## 📱 Responsive Breakpoints

- **Mobile**: < 480px (optimized for small screens)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px (full feature set)

## 🚀 Deployment

### Netlify
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Environment variables: None required



## 📄 API Reference

This application uses the [Chicago Art Institute API](https://api.artic.edu/api/v1/artworks):
- Endpoint: `GET /api/v1/artworks`
- Parameters: `page`, `limit`, `fields`
- Response: Paginated artwork data with metadata

## 🎨 Customization

### Adding New Columns
1. Update `Artwork` interface in `types/index.ts`
2. Add new Column component in `ArtworkTable.tsx`
3. Update API fields parameter in `services/api.ts`

### Modifying Pagination
```typescript
const [pagination, setPagination] = useState<PaginationParams>({
  page: 1,
  limit: 12 // Change this value
});
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Chicago Art Institute](https://www.artic.edu/) for providing the API
- [PrimeReact](https://primereact.org/) for the excellent UI components
- [Vite](https://vitejs.dev/) for the fast build tooling

---

**Developed with ❤️ using React, TypeScript, and PrimeReact**