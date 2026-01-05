import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface ExportSectionProps {
  handleExportCSV: () => void;
  handleExportJSON: () => void;
}

const ExportSection = ({ handleExportCSV, handleExportJSON }: ExportSectionProps) => {
  return (
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
  );
};

export default ExportSection;
