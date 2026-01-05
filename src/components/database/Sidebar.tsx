import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  rowsCount: number;
  columnsCount: number;
}

const Sidebar = ({ activeSection, setActiveSection, rowsCount, columnsCount }: SidebarProps) => {
  return (
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
            <Badge variant="secondary">{rowsCount}</Badge>
          </div>
          <div className="flex justify-between">
            <span>Колонок:</span>
            <Badge variant="secondary">{columnsCount}</Badge>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
