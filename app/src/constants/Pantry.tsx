export type StockKey = 'ignore' | 'units';
export type UnitType = 'g' | 'ml' | 'count';

export interface PantryEntry {
  status: StockKey;
  units: number;
  unitSize: number;
  unitType: UnitType;
}

export interface UnitLabel {
  singular: string;
  plural: string;
}

export interface Product {
  id: string;
  name: string;
  unitSize?: number;
  unitType?: UnitType;
  unitLabel?: UnitLabel;
}

export interface Category {
  id: string;
  label: string;
  emoji: string;
  products: Product[];
}

export interface CategoryDefault {
  unitSize: number;
  unitType: UnitType;
  unitLabel: UnitLabel;
}

export const CATEGORY_DEFAULTS: Record<string, CategoryDefault> = {
  pastas:    { unitSize: 500,  unitType: 'g',     unitLabel: { singular: 'paquete',  plural: 'paquetes'  } },
  harinas:   { unitSize: 1000, unitType: 'g',     unitLabel: { singular: 'bolsa',    plural: 'bolsas'    } },
  conservas: { unitSize: 300,  unitType: 'g',     unitLabel: { singular: 'lata',     plural: 'latas'     } },
  lacteos:   { unitSize: 1000, unitType: 'ml',    unitLabel: { singular: 'unidad',   plural: 'unidades'  } },
  frescos:   { unitSize: 1000, unitType: 'g',     unitLabel: { singular: 'kilo',     plural: 'kilos'     } },
  carnes:    { unitSize: 500,  unitType: 'g',     unitLabel: { singular: 'paquete',  plural: 'paquetes'  } },
  bebidas:   { unitSize: 1500, unitType: 'ml',    unitLabel: { singular: 'botella',  plural: 'botellas'  } },
  limpieza:  { unitSize: 750,  unitType: 'ml',    unitLabel: { singular: 'unidad',   plural: 'unidades'  } },
  personal:  { unitSize: 300,  unitType: 'ml',    unitLabel: { singular: 'unidad',   plural: 'unidades'  } },
  default:   { unitSize: 500,  unitType: 'g',     unitLabel: { singular: 'unidad',   plural: 'unidades'  } },
};

export const PANTRY_CATEGORIES: Category[] = [
  {
    id: 'pastas',
    label: 'Pastas y cereales',
    emoji: '🍝',
    products: [
      { id: 'fideos_spaghetti', name: 'Fideos spaghetti', unitSize: 500,  unitType: 'g',  unitLabel: { singular: 'paquete', plural: 'paquetes' } },
      { id: 'fideos_mostachol', name: 'Mostachol',        unitSize: 500,  unitType: 'g',  unitLabel: { singular: 'paquete', plural: 'paquetes' } },
      { id: 'arroz',            name: 'Arroz',            unitSize: 1000, unitType: 'g',  unitLabel: { singular: 'bolsa',   plural: 'bolsas'   } },
      { id: 'polenta',          name: 'Polenta',          unitSize: 500,  unitType: 'g',  unitLabel: { singular: 'caja',    plural: 'cajas'    } },
      { id: 'avena',            name: 'Avena',            unitSize: 500,  unitType: 'g',  unitLabel: { singular: 'caja',    plural: 'cajas'    } },
      { id: 'quinoa',           name: 'Quinoa',           unitSize: 500,  unitType: 'g',  unitLabel: { singular: 'bolsa',   plural: 'bolsas'   } },
    ],
  },
  {
    id: 'harinas',
    label: 'Harinas y panificados',
    emoji: '🌾',
    products: [
      { id: 'harina_000',      name: 'Harina 000',     unitSize: 1000, unitType: 'g', unitLabel: { singular: 'bolsa',    plural: 'bolsas'    } },
      { id: 'harina_integral', name: 'Harina integral', unitSize: 1000, unitType: 'g', unitLabel: { singular: 'bolsa',    plural: 'bolsas'    } },
      { id: 'pan_lactal',      name: 'Pan lactal',      unitSize: 500,  unitType: 'g', unitLabel: { singular: 'paquete',  plural: 'paquetes'  } },
      { id: 'galletitas',      name: 'Galletitas',      unitSize: 200,  unitType: 'g', unitLabel: { singular: 'paquete',  plural: 'paquetes'  } },
      { id: 'levadura',        name: 'Levadura',        unitSize: 10,   unitType: 'g', unitLabel: { singular: 'sobrecito',plural: 'sobrecitos'} },
    ],
  },
  {
    id: 'conservas',
    label: 'Conservas y enlatados',
    emoji: '🥫',
    products: [
      { id: 'atun',            name: 'Atún',            unitSize: 170, unitType: 'g', unitLabel: { singular: 'lata',  plural: 'latas'  } },
      { id: 'tomate_triturado',name: 'Tomate triturado', unitSize: 400, unitType: 'g', unitLabel: { singular: 'tetrapak', plural: 'tetrapaks' } },
      { id: 'choclo',          name: 'Choclo en lata',  unitSize: 300, unitType: 'g', unitLabel: { singular: 'lata',  plural: 'latas'  } },
      { id: 'arvejas',         name: 'Arvejas',         unitSize: 300, unitType: 'g', unitLabel: { singular: 'lata',  plural: 'latas'  } },
      { id: 'aceitunas',       name: 'Aceitunas',       unitSize: 200, unitType: 'g', unitLabel: { singular: 'frasco',plural: 'frascos'} },
    ],
  },
  {
    id: 'lacteos',
    label: 'Lácteos y huevos',
    emoji: '🥛',
    products: [
      { id: 'leche',         name: 'Leche',         unitSize: 1000, unitType: 'ml',    unitLabel: { singular: 'sachet', plural: 'sachets' } },
      { id: 'yogur',         name: 'Yogur',         unitSize: 200,  unitType: 'g',     unitLabel: { singular: 'pote',   plural: 'potes'   } },
      { id: 'queso_cremoso', name: 'Queso cremoso', unitSize: 400,  unitType: 'g',     unitLabel: { singular: 'horma',  plural: 'hormas'  } },
      { id: 'manteca',       name: 'Manteca',       unitSize: 200,  unitType: 'g',     unitLabel: { singular: 'paquete',plural: 'paquetes'} },
      { id: 'huevos',        name: 'Huevos',        unitSize: 12,   unitType: 'count', unitLabel: { singular: 'cartón', plural: 'cartones'} },
    ],
  },
  {
    id: 'frescos',
    label: 'Frutas y verduras',
    emoji: '🥦',
    products: [
      { id: 'tomate',  name: 'Tomate',  unitSize: 1000, unitType: 'g',     unitLabel: { singular: 'kilo',   plural: 'kilos'   } },
      { id: 'lechuga', name: 'Lechuga', unitSize: 1,    unitType: 'count', unitLabel: { singular: 'unidad', plural: 'unidades'} },
      { id: 'papa',    name: 'Papa',    unitSize: 1000, unitType: 'g',     unitLabel: { singular: 'kilo',   plural: 'kilos'   } },
      { id: 'cebolla', name: 'Cebolla', unitSize: 1000, unitType: 'g',     unitLabel: { singular: 'kilo',   plural: 'kilos'   } },
      { id: 'banana',  name: 'Banana',  unitSize: 1000, unitType: 'g',     unitLabel: { singular: 'kilo',   plural: 'kilos'   } },
      { id: 'manzana', name: 'Manzana', unitSize: 1000, unitType: 'g',     unitLabel: { singular: 'kilo',   plural: 'kilos'   } },
    ],
  },
  {
    id: 'carnes',
    label: 'Carnes y proteínas',
    emoji: '🥩',
    products: [
      { id: 'carne_molida', name: 'Carne molida', unitSize: 500,  unitType: 'g', unitLabel: { singular: 'paquete', plural: 'paquetes' } },
      { id: 'pollo',        name: 'Pollo',        unitSize: 1000, unitType: 'g', unitLabel: { singular: 'unidad',  plural: 'unidades' } },
      { id: 'milanesa',     name: 'Milanesa',     unitSize: 500,  unitType: 'g', unitLabel: { singular: 'paquete', plural: 'paquetes' } },
      { id: 'salchicha',    name: 'Salchicha',    unitSize: 500,  unitType: 'g', unitLabel: { singular: 'paquete', plural: 'paquetes' } },
      { id: 'jamon',        name: 'Jamón cocido', unitSize: 150,  unitType: 'g', unitLabel: { singular: 'paquete', plural: 'paquetes' } },
    ],
  },
  {
    id: 'bebidas',
    label: 'Bebidas',
    emoji: '🧃',
    products: [
      { id: 'agua',    name: 'Agua mineral', unitSize: 2000, unitType: 'ml', unitLabel: { singular: 'botella', plural: 'botellas' } },
      { id: 'jugo',    name: 'Jugo en polvo',unitSize: 20,   unitType: 'g',  unitLabel: { singular: 'sobre',   plural: 'sobres'   } },
      { id: 'gaseosa', name: 'Gaseosa',      unitSize: 2000, unitType: 'ml', unitLabel: { singular: 'botella', plural: 'botellas' } },
      { id: 'mate',    name: 'Yerba mate',   unitSize: 500,  unitType: 'g',  unitLabel: { singular: 'paquete', plural: 'paquetes' } },
      { id: 'cafe',    name: 'Café',         unitSize: 250,  unitType: 'g',  unitLabel: { singular: 'paquete', plural: 'paquetes' } },
      { id: 'te',      name: 'Té',           unitSize: 25,   unitType: 'g',  unitLabel: { singular: 'caja',    plural: 'cajas'    } },
    ],
  },
  {
    id: 'limpieza',
    label: 'Limpieza del hogar',
    emoji: '🧹',
    products: [
      { id: 'detergente',      name: 'Detergente',       unitSize: 750,  unitType: 'ml',    unitLabel: { singular: 'botella', plural: 'botellas' } },
      { id: 'lavandina',       name: 'Lavandina',        unitSize: 1000, unitType: 'ml',    unitLabel: { singular: 'botella', plural: 'botellas' } },
      { id: 'jabon_ropa',      name: 'Jabón en polvo',   unitSize: 1000, unitType: 'g',     unitLabel: { singular: 'caja',    plural: 'cajas'    } },
      { id: 'desengrasante',   name: 'Desengrasante',    unitSize: 500,  unitType: 'ml',    unitLabel: { singular: 'botella', plural: 'botellas' } },
      { id: 'papel_higienico', name: 'Papel higiénico',  unitSize: 4,    unitType: 'count', unitLabel: { singular: 'paquete', plural: 'paquetes' } },
    ],
  },
  {
    id: 'personal',
    label: 'Cuidado personal',
    emoji: '🧴',
    products: [
      { id: 'shampoo',       name: 'Shampoo',       unitSize: 400, unitType: 'ml', unitLabel: { singular: 'frasco', plural: 'frascos' } },
      { id: 'jabon_liquido', name: 'Jabón líquido', unitSize: 300, unitType: 'ml', unitLabel: { singular: 'frasco', plural: 'frascos' } },
      { id: 'pasta_dental',  name: 'Pasta dental',  unitSize: 90,  unitType: 'g',  unitLabel: { singular: 'tubo',   plural: 'tubos'   } },
      { id: 'desodorante',   name: 'Desodorante',   unitSize: 150, unitType: 'ml', unitLabel: { singular: 'unidad', plural: 'unidades'} },
    ],
  },
];
