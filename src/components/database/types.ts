export type ColumnType = 'text' | 'number' | 'email' | 'date' | 'qrcode' | 'barcode';

export interface Column {
  id: string;
  name: string;
  type: ColumnType;
}

export interface Row {
  id: string;
  [key: string]: string | number;
}
