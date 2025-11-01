import React from 'react';
import { PrimeReactProvider } from 'primereact/api';
import ArtworkTable from './components/ArtworkTable';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import './index.css';

const App: React.FC = () => {
  return (
    <PrimeReactProvider>
      <div className="app-container">
        <div className="p-4">
          <h1>Chicago Art Institute Collection</h1>
          <p className="text-600 mb-4">Browse and select artworks from the museum collection</p>
          <ArtworkTable />
        </div>
      </div>
    </PrimeReactProvider>
  );
};

export default App;