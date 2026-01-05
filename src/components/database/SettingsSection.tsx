import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Column } from './types';

interface SettingsSectionProps {
  rows: number;
  columns: Column[];
}

const SettingsSection = ({ rows, columns }: SettingsSectionProps) => {
  return (
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
              <p className="text-3xl font-bold mt-1">{rows}</p>
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
  );
};

export default SettingsSection;
