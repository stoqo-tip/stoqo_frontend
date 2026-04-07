export type StockKey = 'ignore' | 'empty' | 'low' | 'medium' | 'full';

export interface StockLevel {
  key: StockKey;
  label: string;
  color: string;
  fill: number | null; // 0–1, null = no fill (ignore)
  icon?: string;
}

export const STOCK_LEVELS: StockLevel[] = [
  { key: 'ignore', label: 'No consumo', color: '#E0E0E0', fill: null, icon: '✕' },
  { key: 'empty',  label: 'Sin stock',  color: '#FF6B6B', fill: 0 },
  { key: 'low',    label: 'Poco',       color: '#FFB347', fill: 0.25 },
  { key: 'medium', label: 'Regular',    color: '#FFE066', fill: 0.55 },
  { key: 'full',   label: 'Tengo',      color: '#6FCF97', fill: 0.85 },
];

export interface Product {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  label: string;
  emoji: string;
  products: Product[];
}

export const PANTRY_CATEGORIES: Category[] = [
  {
    id: 'pastas',
    label: 'Pastas y cereales',
    emoji: '🍝',
    products: [
      { id: 'fideos_spaghetti', name: 'Fideos spaghetti' },
      { id: 'fideos_mostachol', name: 'Mostachol' },
      { id: 'arroz', name: 'Arroz' },
      { id: 'polenta', name: 'Polenta' },
      { id: 'avena', name: 'Avena' },
      { id: 'quinoa', name: 'Quinoa' },
    ],
  },
  {
    id: 'harinas',
    label: 'Harinas y panificados',
    emoji: '🌾',
    products: [
      { id: 'harina_000', name: 'Harina 000' },
      { id: 'harina_integral', name: 'Harina integral' },
      { id: 'pan_lactal', name: 'Pan lactal' },
      { id: 'galletitas', name: 'Galletitas' },
      { id: 'levadura', name: 'Levadura' },
    ],
  },
  {
    id: 'conservas',
    label: 'Conservas y enlatados',
    emoji: '🥫',
    products: [
      { id: 'atun', name: 'Atún' },
      { id: 'tomate_triturado', name: 'Tomate triturado' },
      { id: 'choclo', name: 'Choclo en lata' },
      { id: 'arvejas', name: 'Arvejas' },
      { id: 'aceitunas', name: 'Aceitunas' },
    ],
  },
  {
    id: 'lacteos',
    label: 'Lácteos y huevos',
    emoji: '🥛',
    products: [
      { id: 'leche', name: 'Leche' },
      { id: 'yogur', name: 'Yogur' },
      { id: 'queso_cremoso', name: 'Queso cremoso' },
      { id: 'manteca', name: 'Manteca' },
      { id: 'huevos', name: 'Huevos' },
    ],
  },
  {
    id: 'frescos',
    label: 'Frutas y verduras',
    emoji: '🥦',
    products: [
      { id: 'tomate', name: 'Tomate' },
      { id: 'lechuga', name: 'Lechuga' },
      { id: 'papa', name: 'Papa' },
      { id: 'cebolla', name: 'Cebolla' },
      { id: 'banana', name: 'Banana' },
      { id: 'manzana', name: 'Manzana' },
    ],
  },
  {
    id: 'carnes',
    label: 'Carnes y proteínas',
    emoji: '🥩',
    products: [
      { id: 'carne_molida', name: 'Carne molida' },
      { id: 'pollo', name: 'Pollo' },
      { id: 'milanesa', name: 'Milanesa' },
      { id: 'salchicha', name: 'Salchicha' },
      { id: 'jamon', name: 'Jamón cocido' },
    ],
  },
  {
    id: 'bebidas',
    label: 'Bebidas',
    emoji: '🧃',
    products: [
      { id: 'agua', name: 'Agua mineral' },
      { id: 'jugo', name: 'Jugo en polvo' },
      { id: 'gaseosa', name: 'Gaseosa' },
      { id: 'mate', name: 'Yerba mate' },
      { id: 'cafe', name: 'Café' },
      { id: 'te', name: 'Té' },
    ],
  },
  {
    id: 'limpieza',
    label: 'Limpieza del hogar',
    emoji: '🧹',
    products: [
      { id: 'detergente', name: 'Detergente' },
      { id: 'lavandina', name: 'Lavandina' },
      { id: 'jabon_ropa', name: 'Jabón en polvo' },
      { id: 'desengrasante', name: 'Desengrasante' },
      { id: 'papel_higienico', name: 'Papel higiénico' },
    ],
  },
  {
    id: 'personal',
    label: 'Cuidado personal',
    emoji: '🧴',
    products: [
      { id: 'shampoo', name: 'Shampoo' },
      { id: 'jabon_liquido', name: 'Jabón líquido' },
      { id: 'pasta_dental', name: 'Pasta dental' },
      { id: 'desodorante', name: 'Desodorante' },
    ],
  },
];