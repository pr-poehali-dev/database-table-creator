import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';

interface CodeDisplayProps {
  value: string;
  type: 'qrcode' | 'barcode';
  size?: number;
}

const CodeDisplay = ({ value, type, size = 80 }: CodeDisplayProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !value) return;

    const canvas = canvasRef.current;

    if (type === 'qrcode') {
      QRCode.toCanvas(canvas, value, {
        width: size,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }).catch(err => console.error('QR Error:', err));
    } else if (type === 'barcode') {
      try {
        JsBarcode(canvas, value, {
          width: 1.5,
          height: size * 0.6,
          displayValue: false,
          margin: 2
        });
      } catch (err) {
        console.error('Barcode Error:', err);
      }
    }
  }, [value, type, size]);

  if (!value) {
    return <span className="text-muted-foreground text-xs">—</span>;
  }

  return (
    <div className="flex items-center justify-center">
      <canvas ref={canvasRef} className="max-w-full" />
    </div>
  );
};

export default CodeDisplay;
