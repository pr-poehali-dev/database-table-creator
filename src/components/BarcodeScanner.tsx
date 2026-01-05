import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface BarcodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (data: string) => void;
}

const BarcodeScanner = ({ isOpen, onClose, onScan }: BarcodeScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    if (isOpen && !scannerRef.current) {
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;
    }

    return () => {
      if (scannerRef.current && isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, [isOpen]);

  const startScanning = async () => {
    if (!scannerRef.current) return;

    try {
      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
          onScan(decodedText);
          stopScanning();
          onClose();
          toast.success('Код отсканирован');
        },
        () => {}
      );
      setIsScanning(true);
      setHasPermission(true);
    } catch (err) {
      console.error('Scanner error:', err);
      setHasPermission(false);
      toast.error('Не удалось получить доступ к камере');
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        setIsScanning(false);
      } catch (err) {
        console.error('Stop error:', err);
      }
    }
  };

  const handleClose = () => {
    stopScanning();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Сканировать код</DialogTitle>
          <DialogDescription>
            Наведите камеру на QR-код или штрих-код
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div 
            id="qr-reader" 
            className="w-full rounded-lg overflow-hidden border"
            style={{ minHeight: isScanning ? '300px' : '0' }}
          />
          
          {hasPermission === false && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
              Нет доступа к камере. Разрешите доступ в настройках браузера.
            </div>
          )}

          <div className="flex gap-2">
            {!isScanning ? (
              <Button onClick={startScanning} className="flex-1 gap-2">
                <Icon name="Camera" size={18} />
                Начать сканирование
              </Button>
            ) : (
              <Button onClick={stopScanning} variant="destructive" className="flex-1 gap-2">
                <Icon name="StopCircle" size={18} />
                Остановить
              </Button>
            )}
            <Button variant="outline" onClick={handleClose}>
              Отмена
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BarcodeScanner;
