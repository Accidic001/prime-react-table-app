import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import type { PaginatorPageChangeEvent } from 'primereact/paginator';
import { Checkbox } from 'primereact/checkbox';
import type { CheckboxChangeEvent } from 'primereact/checkbox';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import type { Artwork, PaginationParams } from '../types';
import { fetchArtworks } from '../services/api';

const ArtworkTable: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 12
  });
  const [rowsToSelect, setRowsToSelect] = useState<number>(0);

  const selectedArtworkIdsRef = useRef<Set<number>>(new Set());
  const overlayPanelRef = useRef<OverlayPanel>(null);

  useEffect(() => {
    const loadArtworks = async () => {
      setLoading(true);
      try {
        const response = await fetchArtworks(pagination);
        setArtworks(response.data);
        setTotalRecords(response.pagination.total);
        
        const currentPageSelectedArtworks = response.data.filter(artwork => 
          selectedArtworkIdsRef.current.has(artwork.id)
        );
        setSelectedArtworks(currentPageSelectedArtworks);
      } catch (error) {
        console.error('Error fetching artworks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadArtworks();
  }, [pagination]);

  const onPageChange = (event: PaginatorPageChangeEvent) => {
    setPagination({
      page: event.page + 1,
      limit: event.rows
    });
  };

  const onSelectionChange = (e: { value: Artwork[] }) => {
    const newSelectedArtworks = e.value;
    setSelectedArtworks(newSelectedArtworks);

    const currentPageArtworkIds = new Set(artworks.map(artwork => artwork.id));
    
    artworks.forEach(artwork => {
      if (currentPageArtworkIds.has(artwork.id) && !newSelectedArtworks.find(a => a.id === artwork.id)) {
        selectedArtworkIdsRef.current.delete(artwork.id);
      }
    });

    newSelectedArtworks.forEach(artwork => {
      selectedArtworkIdsRef.current.add(artwork.id);
    });
  };

  const onSelectAllChange = (e: CheckboxChangeEvent) => {
    const checked = e.checked ?? false;
    if (checked) {
      artworks.forEach(artwork => {
        selectedArtworkIdsRef.current.add(artwork.id);
      });
      setSelectedArtworks([...artworks]);
    } else {
      artworks.forEach(artwork => {
        selectedArtworkIdsRef.current.delete(artwork.id);
      });
      setSelectedArtworks([]);
    }
  };

  const onClearSelection = () => {
    selectedArtworkIdsRef.current.clear();
    setSelectedArtworks([]);
  };

  const handleBulkSelection = async () => {
    if (rowsToSelect <= 0) return;

    const totalRowsToSelect = Math.min(rowsToSelect, totalRecords);
    let remainingRows = totalRowsToSelect;
    let currentPage = pagination.page;
    
    selectedArtworkIdsRef.current.clear();

    while (remainingRows > 0 && currentPage <= Math.ceil(totalRecords / pagination.limit)) {
      try {
        const response = await fetchArtworks({ page: currentPage, limit: pagination.limit });
        const pageArtworks = response.data;

        const rowsToSelectFromPage = Math.min(remainingRows, pageArtworks.length);
        for (let i = 0; i < rowsToSelectFromPage; i++) {
          selectedArtworkIdsRef.current.add(pageArtworks[i].id);
        }

        remainingRows -= rowsToSelectFromPage;
        currentPage++;
      } catch (error) {
        console.error('Error fetching page:', currentPage, error);
        break;
      }
    }

    const currentPageSelectedArtworks = artworks.filter(artwork => 
      selectedArtworkIdsRef.current.has(artwork.id)
    );
    setSelectedArtworks(currentPageSelectedArtworks);
    
    overlayPanelRef.current?.hide();
    setRowsToSelect(0);
  };

  const selectionHeaderTemplate = () => {
    return (
      <div className="flex align-items-center gap-2">
        <Checkbox
          checked={selectedArtworks.length === artworks.length && artworks.length > 0}
          onChange={onSelectAllChange}
          disabled={artworks.length === 0}
        />
        <i 
          className="pi pi-chevron-down cursor-pointer"
          onClick={(e) => overlayPanelRef.current?.toggle(e)}
          style={{ 
            fontSize: '1rem',
            color: '#000000'
          }}
          title="Select rows..."
        />
      </div>
    );
  };

  const dateRangeBodyTemplate = (rowData: Artwork) => {
    if (rowData.date_start && rowData.date_end) {
      return `${rowData.date_start} - ${rowData.date_end}`;
    } else if (rowData.date_start) {
      return `${rowData.date_start}`;
    } else if (rowData.date_end) {
      return `${rowData.date_end}`;
    }
    return 'N/A';
  };

  const textBodyTemplate = (value: string) => {
    return value || 'N/A';
  };

  return (
    <div className="card">
      {selectedArtworkIdsRef.current.size > 0 && (
        <div className="p-3 surface-ground border-round mb-3">
          <div className="flex align-items-center justify-content-between">
            <div>
              <span className="font-bold">
                {selectedArtworkIdsRef.current.size} artwork(s) selected
              </span>
            </div>
            <button
              className="p-button p-button-secondary p-button-sm"
              onClick={onClearSelection}
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      <OverlayPanel ref={overlayPanelRef} dismissable>
        <div className="flex flex-column gap-3" style={{ width: '300px' }}>
          <h4>Bulk Row Selection</h4>
          <p className="text-sm text-600">
            Enter the number of rows to select. Selection will continue across pages if needed.
          </p>
          
          <div className="flex flex-column gap-2">
            <label htmlFor="rowsToSelect" className="font-medium">
              Number of rows to select:
            </label>
            <InputNumber
              id="rowsToSelect"
              value={rowsToSelect}
              onValueChange={(e) => setRowsToSelect(e.value ?? 0)}
              min={0}
              max={totalRecords}
              mode="decimal"
              className="w-full"
              showButtons={false}
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              label="Submit"
              icon="pi pi-check"
              onClick={handleBulkSelection}
              disabled={rowsToSelect <= 0}
            />
            <Button
              label="Cancel"
              icon="pi pi-times"
              className="p-button-secondary"
              onClick={() => {
                overlayPanelRef.current?.hide();
                setRowsToSelect(0);
              }}
            />
          </div>
          
          <div className="text-xs text-500">
            <strong>Note:</strong> Currently selected: {selectedArtworkIdsRef.current.size} rows
          </div>
        </div>
      </OverlayPanel>

      <DataTable
        value={artworks}
        loading={loading}
        selection={selectedArtworks}
        onSelectionChange={onSelectionChange}
        dataKey="id"
        selectionMode="checkbox"
        scrollable
        scrollHeight="flex"
        tableStyle={{ minWidth: '50rem' }}
      >
        <Column 
          selectionMode="multiple" 
          headerStyle={{ width: '4rem' }}
          header={selectionHeaderTemplate}
        />
        <Column 
          field="title" 
          header="Title" 
          body={(rowData) => textBodyTemplate(rowData.title)}
          style={{ minWidth: '200px' }}
        />
        <Column 
          field="artist_display" 
          header="Artist" 
          body={(rowData) => textBodyTemplate(rowData.artist_display)}
          style={{ minWidth: '150px' }}
        />
        <Column 
          field="place_of_origin" 
          header="Origin" 
          body={(rowData) => textBodyTemplate(rowData.place_of_origin)}
          style={{ minWidth: '120px' }}
        />
        <Column 
          field="date_start" 
          header="Date Range" 
          body={dateRangeBodyTemplate}
          style={{ width: '150px' }}
        />
        <Column 
          field="inscriptions" 
          header="Inscriptions" 
          body={(rowData) => textBodyTemplate(rowData.inscriptions)}
          style={{ minWidth: '200px' }}
        />
      </DataTable>

      <Paginator
        first={(pagination.page - 1) * pagination.limit}
        rows={pagination.limit}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} artworks"
        rowsPerPageOptions={[12, 24, 48, 96]}
      />
    </div>
  );
};

export default ArtworkTable;