import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import CodeDisplay from '@/components/CodeDisplay';
import { Column, Row, ColumnType } from './types';

interface DataSectionProps {
  columns: Column[];
  rows: Row[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredRows: Row[];
  isAddRowOpen: boolean;
  setIsAddRowOpen: (open: boolean) => void;
  newRowData: Record<string, string>;
  setNewRowData: (data: Record<string, string>) => void;
  handleAddRow: () => void;
  handleDeleteRow: (id: string) => void;
  handleScanCode: (columnId: string) => void;
  getTypeIcon: (type: ColumnType) => string;
}

const DataSection = ({
  columns,
  searchTerm,
  setSearchTerm,
  filteredRows,
  isAddRowOpen,
  setIsAddRowOpen,
  newRowData,
  setNewRowData,
  handleAddRow,
  handleDeleteRow,
  handleScanCode,
  getTypeIcon
}: DataSectionProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">База данных</h2>
          <p className="text-muted-foreground mt-1">Просмотр и редактирование данных</p>
        </div>
        <Dialog open={isAddRowOpen} onOpenChange={setIsAddRowOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Icon name="Plus" size={18} />
              Добавить строку
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Новая строка</DialogTitle>
              <DialogDescription>Заполните данные для новой записи</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {columns.map(col => (
                <div key={col.id} className="space-y-2">
                  <Label htmlFor={col.id}>{col.name}</Label>
                  {col.type === 'qrcode' || col.type === 'barcode' ? (
                    <div className="flex gap-2">
                      <Input
                        id={col.id}
                        type="text"
                        placeholder={`Введите ${col.name.toLowerCase()}`}
                        value={newRowData[col.id] || ''}
                        onChange={(e) => setNewRowData({ ...newRowData, [col.id]: e.target.value })}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleScanCode(col.id)}
                        className="gap-2 shrink-0"
                      >
                        <Icon name="Camera" size={18} />
                        Сканировать
                      </Button>
                    </div>
                  ) : (
                    <Input
                      id={col.id}
                      type={col.type === 'number' ? 'number' : col.type === 'date' ? 'date' : 'text'}
                      placeholder={`Введите ${col.name.toLowerCase()}`}
                      value={newRowData[col.id] || ''}
                      onChange={(e) => setNewRowData({ ...newRowData, [col.id]: e.target.value })}
                    />
                  )}
                </div>
              ))}
              <Button onClick={handleAddRow} className="w-full">Добавить</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Поиск по всем колонкам..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map(col => (
                    <TableHead key={col.id} className="font-semibold">
                      <div className="flex items-center gap-2">
                        <Icon name={getTypeIcon(col.type)} size={16} className="text-primary" />
                        {col.name}
                      </div>
                    </TableHead>
                  ))}
                  <TableHead className="w-[100px]">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? 'Нет результатов поиска' : 'Нет данных'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRows.map(row => (
                    <TableRow key={row.id} className="hover:bg-muted/50 transition-colors">
                      {columns.map(col => (
                        <TableCell key={col.id}>
                          {col.type === 'qrcode' || col.type === 'barcode' ? (
                            <CodeDisplay value={String(row[col.id] || '')} type={col.type} />
                          ) : (
                            row[col.id]
                          )}
                        </TableCell>
                      ))}
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteRow(row.id)}
                          className="hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataSection;
