import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Column, ColumnType } from './types';

interface CreateSectionProps {
  columns: Column[];
  isAddColumnOpen: boolean;
  setIsAddColumnOpen: (open: boolean) => void;
  newColumnName: string;
  setNewColumnName: (name: string) => void;
  newColumnType: ColumnType;
  setNewColumnType: (type: ColumnType) => void;
  handleAddColumn: () => void;
  handleDeleteColumn: (id: string) => void;
  getTypeIcon: (type: ColumnType) => string;
}

const CreateSection = ({
  columns,
  isAddColumnOpen,
  setIsAddColumnOpen,
  newColumnName,
  setNewColumnName,
  newColumnType,
  setNewColumnType,
  handleAddColumn,
  handleDeleteColumn,
  getTypeIcon
}: CreateSectionProps) => {
  return (
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
                      <SelectItem value="qrcode">QR-код</SelectItem>
                      <SelectItem value="barcode">Штрих-код</SelectItem>
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
  );
};

export default CreateSection;
