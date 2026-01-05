import { useState } from 'react';
import { toast } from 'sonner';
import BarcodeScanner from '@/components/BarcodeScanner';
import Sidebar from '@/components/database/Sidebar';
import DataSection from '@/components/database/DataSection';
import CreateSection from '@/components/database/CreateSection';
import SettingsSection from '@/components/database/SettingsSection';
import ExportSection from '@/components/database/ExportSection';
import { Column, Row, ColumnType } from '@/components/database/types';

const Index = () => {
  const [columns, setColumns] = useState<Column[]>([
    { id: 'col1', name: 'Имя', type: 'text' },
    { id: 'col2', name: 'Email', type: 'email' },
    { id: 'col3', name: 'Возраст', type: 'number' },
    { id: 'col4', name: 'Дата регистрации', type: 'date' }
  ]);

  const [rows, setRows] = useState<Row[]>([
    { id: 'row1', col1: 'Анна Смирнова', col2: 'anna@example.com', col3: 28, col4: '2024-01-15' },
    { id: 'row2', col1: 'Иван Петров', col2: 'ivan@example.com', col3: 34, col4: '2024-02-20' },
    { id: 'row3', col1: 'Мария Иванова', col2: 'maria@example.com', col3: 25, col4: '2024-03-10' },
    { id: 'row4', col1: 'Дмитрий Козлов', col2: 'dmitry@example.com', col3: 42, col4: '2024-01-28' },
    { id: 'row5', col1: 'Елена Волкова', col2: 'elena@example.com', col3: 31, col4: '2024-04-05' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState('data');
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [isAddRowOpen, setIsAddRowOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnType, setNewColumnType] = useState<ColumnType>('text');
  const [newRowData, setNewRowData] = useState<Record<string, string>>({});
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannerColumnId, setScannerColumnId] = useState<string>('');

  const filteredRows = rows.filter(row => {
    const searchLower = searchTerm.toLowerCase();
    return columns.some(col => {
      const value = row[col.id];
      return value?.toString().toLowerCase().includes(searchLower);
    });
  });

  const handleAddColumn = () => {
    if (!newColumnName.trim()) {
      toast.error('Введите название колонки');
      return;
    }
    const newColumn: Column = {
      id: `col${Date.now()}`,
      name: newColumnName,
      type: newColumnType
    };
    setColumns([...columns, newColumn]);
    setNewColumnName('');
    setNewColumnType('text');
    setIsAddColumnOpen(false);
    toast.success('Колонка добавлена');
  };

  const handleAddRow = () => {
    const newRow: Row = { id: `row${Date.now()}`, ...newRowData };
    setRows([...rows, newRow]);
    setNewRowData({});
    setIsAddRowOpen(false);
    toast.success('Строка добавлена');
  };

  const handleDeleteRow = (id: string) => {
    setRows(rows.filter(row => row.id !== id));
    toast.success('Строка удалена');
  };

  const handleDeleteColumn = (id: string) => {
    setColumns(columns.filter(col => col.id !== id));
    const updatedRows = rows.map(row => {
      const { [id]: _, ...rest } = row;
      return rest;
    });
    setRows(updatedRows);
    toast.success('Колонка удалена');
  };

  const handleExportCSV = () => {
    const headers = columns.map(col => col.name).join(',');
    const data = rows.map(row => 
      columns.map(col => row[col.id] || '').join(',')
    ).join('\n');
    const csv = `${headers}\n${data}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv';
    a.click();
    toast.success('CSV файл загружен');
  };

  const handleExportJSON = () => {
    const data = rows.map(row => {
      const obj: Record<string, any> = {};
      columns.forEach(col => {
        obj[col.name] = row[col.id];
      });
      return obj;
    });
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
    toast.success('JSON файл загружен');
  };

  const handleScanCode = (columnId: string) => {
    setScannerColumnId(columnId);
    setIsScannerOpen(true);
  };

  const handleCodeScanned = (data: string) => {
    setNewRowData({ ...newRowData, [scannerColumnId]: data });
  };

  const getTypeIcon = (type: ColumnType) => {
    switch (type) {
      case 'text': return 'Type';
      case 'number': return 'Hash';
      case 'email': return 'Mail';
      case 'date': return 'Calendar';
      case 'qrcode': return 'QrCode';
      case 'barcode': return 'Barcode';
      default: return 'Circle';
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        rowsCount={rows.length}
        columnsCount={columns.length}
      />

      <main className="flex-1 p-8">
        {activeSection === 'data' && (
          <DataSection
            columns={columns}
            rows={rows}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredRows={filteredRows}
            isAddRowOpen={isAddRowOpen}
            setIsAddRowOpen={setIsAddRowOpen}
            newRowData={newRowData}
            setNewRowData={setNewRowData}
            handleAddRow={handleAddRow}
            handleDeleteRow={handleDeleteRow}
            handleScanCode={handleScanCode}
            getTypeIcon={getTypeIcon}
          />
        )}

        {activeSection === 'create' && (
          <CreateSection
            columns={columns}
            isAddColumnOpen={isAddColumnOpen}
            setIsAddColumnOpen={setIsAddColumnOpen}
            newColumnName={newColumnName}
            setNewColumnName={setNewColumnName}
            newColumnType={newColumnType}
            setNewColumnType={setNewColumnType}
            handleAddColumn={handleAddColumn}
            handleDeleteColumn={handleDeleteColumn}
            getTypeIcon={getTypeIcon}
          />
        )}

        {activeSection === 'settings' && (
          <SettingsSection
            rows={rows.length}
            columns={columns}
          />
        )}

        {activeSection === 'export' && (
          <ExportSection
            handleExportCSV={handleExportCSV}
            handleExportJSON={handleExportJSON}
          />
        )}
      </main>
      
      <BarcodeScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleCodeScanned}
      />
    </div>
  );
};

export default Index;
