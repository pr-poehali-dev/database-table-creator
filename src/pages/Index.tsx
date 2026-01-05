import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type ColumnType = 'text' | 'number' | 'email' | 'date';

interface Column {
  id: string;
  name: string;
  type: ColumnType;
}

interface Row {
  id: string;
  [key: string]: string | number;
}

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

  const getTypeIcon = (type: ColumnType) => {
    switch (type) {
      case 'text': return 'Type';
      case 'number': return 'Hash';
      case 'email': return 'Mail';
      case 'date': return 'Calendar';
      default: return 'Circle';
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 border-r border-border bg-sidebar p-6 space-y-2">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-sidebar-foreground flex items-center gap-2">
            <Icon name="Database" size={28} className="text-primary" />
            DataBase
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Управление данными</p>
        </div>

        <nav className="space-y-1">
          <Button
            variant={activeSection === 'data' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setActiveSection('data')}
          >
            <Icon name="Table" size={18} className="mr-2" />
            Таблицы
          </Button>
          <Button
            variant={activeSection === 'create' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setActiveSection('create')}
          >
            <Icon name="Plus" size={18} className="mr-2" />
            Создание
          </Button>
          <Button
            variant={activeSection === 'settings' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setActiveSection('settings')}
          >
            <Icon name="Settings" size={18} className="mr-2" />
            Настройки
          </Button>
          <Button
            variant={activeSection === 'export' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setActiveSection('export')}
          >
            <Icon name="Download" size={18} className="mr-2" />
            Экспорт
          </Button>
        </nav>

        <div className="pt-8 mt-8 border-t border-border">
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Строк:</span>
              <Badge variant="secondary">{rows.length}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Колонок:</span>
              <Badge variant="secondary">{columns.length}</Badge>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-8">
        {activeSection === 'data' && (
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
                        <Input
                          id={col.id}
                          type={col.type === 'number' ? 'number' : col.type === 'date' ? 'date' : 'text'}
                          placeholder={`Введите ${col.name.toLowerCase()}`}
                          value={newRowData[col.id] || ''}
                          onChange={(e) => setNewRowData({ ...newRowData, [col.id]: e.target.value })}
                        />
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
                              <TableCell key={col.id}>{row[col.id]}</TableCell>
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
        )}

        {activeSection === 'create' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold">Создание структуры</h2>
              <p className="text-muted-foreground mt-1">Управление колонками таблицы</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Колонки таблицы</CardTitle>
                <CardDescription>Добавляйте и удаляйте колонки для вашей базы данных</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Dialog open={isAddColumnOpen} onOpenChange={setIsAddColumnOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full gap-2">
                      <Icon name="Plus" size={18} />
                      Добавить колонку
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Новая колонка</DialogTitle>
                      <DialogDescription>Создайте новую колонку для таблицы</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="colName">Название</Label>
                        <Input
                          id="colName"
                          placeholder="Название колонки"
                          value={newColumnName}
                          onChange={(e) => setNewColumnName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="colType">Тип данных</Label>
                        <Select value={newColumnType} onValueChange={(val) => setNewColumnType(val as ColumnType)}>
                          <SelectTrigger id="colType">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Текст</SelectItem>
                            <SelectItem value="number">Число</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="date">Дата</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleAddColumn} className="w-full">Создать</Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="space-y-2">
                  {columns.map(col => (
                    <div key={col.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Icon name={getTypeIcon(col.type)} size={20} className="text-primary" />
                        <div>
                          <p className="font-medium">{col.name}</p>
                          <p className="text-sm text-muted-foreground capitalize">{col.type}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteColumn(col.id)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Icon name="Trash2" size={18} />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === 'settings' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold">Настройки</h2>
              <p className="text-muted-foreground mt-1">Конфигурация базы данных</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Информация о базе</CardTitle>
                <CardDescription>Статистика и параметры</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Всего строк</p>
                    <p className="text-3xl font-bold mt-1">{rows.length}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Всего колонок</p>
                    <p className="text-3xl font-bold mt-1">{columns.length}</p>
                  </div>
                </div>
                <div className="p-4 border rounded-lg space-y-2">
                  <p className="font-medium">Типы колонок</p>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(columns.map(c => c.type))).map(type => (
                      <Badge key={type} variant="secondary" className="capitalize">
                        {type}: {columns.filter(c => c.type === type).length}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === 'export' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold">Экспорт данных</h2>
              <p className="text-muted-foreground mt-1">Скачайте данные в различных форматах</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleExportCSV}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Icon name="FileText" size={24} className="text-primary" />
                    </div>
                    <div>
                      <CardTitle>Экспорт в CSV</CardTitle>
                      <CardDescription>Табличный формат для Excel</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button className="w-full gap-2">
                    <Icon name="Download" size={18} />
                    Скачать CSV
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleExportJSON}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Icon name="Code" size={24} className="text-primary" />
                    </div>
                    <div>
                      <CardTitle>Экспорт в JSON</CardTitle>
                      <CardDescription>Формат для разработчиков</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button className="w-full gap-2">
                    <Icon name="Download" size={18} />
                    Скачать JSON
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
