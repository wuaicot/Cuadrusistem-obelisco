// src/domain/recetas.ts
export type IngredienteDef = {
  nombre: string;
  cantidad: number;
  unidad?: string;
};
export type MenuDef = {
  codigo: string;
  nombre: string;
  categoria: 'COCINA' | 'EMPANADAS' | 'BAR';
  ingredientes: IngredienteDef[];
};
export type BebestibleDef = { 
  codigo: string; 
  nombre: string; 
  categoria: 'BAR';
  unidad?: string;
  ingredientes?: IngredienteDef[];
};
export type EmpanadaDef = MenuDef;

export const BEBESTIBLES: Record<string, BebestibleDef> = {
  "4101": { codigo: "4101", nombre: "Cerveza lata Austral 1/2 lt", categoria: 'BAR', unidad: "unidad" },
  "4201": { codigo: "4201", nombre: "Cerv Cristal ret 1 Lt", categoria: 'BAR', unidad: "unidad" },
  "4202": { codigo: "4202", nombre: "Cerv Escudo Ret 1 Lt", categoria: 'BAR', unidad: "unidad" },
  "4203": { codigo: "4203", nombre: "ROYAL LITRO", categoria: 'BAR', unidad: "unidad" },
  "4204": { codigo: "4204", nombre: "HEINEKEN LITRO", categoria: 'BAR', unidad: "unidad" },
  "4207": { codigo: "4207", nombre: "Cerveza Botella Corona", categoria: 'BAR', unidad: "unidad" },
  "4209": { codigo: "4209", nombre: "Cerveza botella Royal 355cc", categoria: 'BAR', unidad: "unidad" },
  "4211": { codigo: "4211", nombre: "Cerveza Torobayo 1/2 lt", categoria: 'BAR', unidad: "unidad" },
  "4215": { codigo: "4215", nombre: "Cerveza lata pers. Cristal", categoria: 'BAR', unidad: "unidad" },
  "4217": { codigo: "4217", nombre: "HEINEKEN LATA", categoria: 'BAR', unidad: "unidad" },
  "4219": { codigo: "4219", nombre: "Cerveza lata escudo 1/2 lt", categoria: 'BAR', unidad: "unidad" },
  "4220": { codigo: "4220", nombre: "Cerveza lata Cristal 1/2 lt", categoria: 'BAR', unidad: "unidad" },
  "4221": { codigo: "4221", nombre: "SCHOP QUILMES 500 CC", categoria: 'BAR', unidad: "unidad" },  
  "4224": { codigo: "4224", nombre: "BOTELLIN HEINEKEN", categoria: 'BAR', unidad: "unidad" },
  "4228": { codigo: "4228", nombre: "Cerveza Sol botellín", categoria: 'BAR', unidad: "unidad" },
  "4230": { codigo: "4230", nombre: "SHOP CRISTAL 500CC", categoria: 'BAR', unidad: "unidad" },
  "4232": { codigo: "4232", nombre: "HEINIKEN LATA 1/2", categoria: 'BAR', unidad: "unidad" },
  "4233": { codigo: "4233", nombre: "BOTELLIN ROYAL", categoria: 'BAR', unidad: "unidad" },  
  "4239": { codigo: "4239", nombre: "Cerveza Royal 1/2 lt", categoria: 'BAR', unidad: "unidad" },
  "4240": { codigo: "4240", nombre: "STELLA LITRO 1LT", categoria: 'BAR', unidad: "unidad" },
  "4241": { codigo: "4241", nombre: "GOLDEN 1/2 LATA", categoria: 'BAR', unidad: "unidad" },
  "4245": { codigo: "4245", nombre: "Barril Quilmes (tara 11.00)", categoria: 'BAR', unidad: "unidad" },
  "4246": { codigo: "4246", nombre: "CORONA BOTELLIN", categoria: 'BAR', unidad: "unidad" },

  "4306": { codigo: "4306", nombre: "COCA COLA LATA", categoria: 'BAR', unidad: "unidad" },
  "4313": { codigo: "4313", nombre: "Juao nectar individual", categoria: 'BAR', unidad: "unidad" },
  "4314": { codigo: "4314", nombre: "MONSTER BEBIDA ENERG", categoria: 'BAR', unidad: "unidad" },
  "4315": { codigo: "4315", nombre: "RedBull", categoria: 'BAR', unidad: "unidad" },
  
  "4401": { codigo: "4401", nombre: "COCA COLA 591CC", categoria: 'BAR', unidad: "unidad" },
  "4407": { codigo: "4407", nombre: "VITAL SIN GAS", categoria: 'BAR', unidad: "unidad" },
  "4426": { codigo: "4426", nombre: "VITAL 1 1/2", categoria: 'BAR', unidad: "unidad" },
  "4428": { codigo: "4428", nombre: "BBIDA 1 1/5", categoria: 'BAR', unidad: "unidad" },

  "4501": { codigo: "4501", nombre: "Juao nectar individual", categoria: 'BAR', unidad: "unidad" },
  "4504": { codigo: "4504", nombre: "Juao nectar 11/2 litros", categoria: 'BAR', unidad: "unidad" },
  
  "4601": { codigo: "4601", nombre: "CAFE GRANDE", categoria: 'BAR', unidad: "unidad" },
  "4602": { codigo: "4602", nombre: "TE GRANDE", categoria: 'BAR', unidad: "unidad" },
  "4869": { codigo: "4869", nombre: "PROMO SCHOP 2X1", categoria: 'BAR', unidad: "unidad" },
};


export const MENUS: Record<string, MenuDef> = {
  "0101": {
    codigo: "0101",
    nombre: "COM ITALIANO PERSONA",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan mesa Personal", cantidad: 1 },
      { nombre: "Vienesas personal", cantidad: 1 },
    ],
  },
  "0102": {
    codigo: "0102",
    nombre: "COM COMPLETO PERSONA",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan mesa Personal", cantidad: 1 },
      { nombre: "Vienesas personal", cantidad: 1 },
    ],
  },
  "0103": {
    codigo: "0103",
    nombre: "COM CATALANA PERSONA",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan mesa Personal", cantidad: 1 },
      { nombre: "Vienesas personal", cantidad: 1 },
    ],
  },
  "0104": {
    codigo: "0104",
    nombre: "COM VEGETARIANO PERS",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan mesa Personal", cantidad: 1 },
      { nombre: "Vienesas personal", cantidad: 1 },
    ],
  },
  "0105": {
    codigo: "0105",
    nombre: "COM CHACARERO PERSON",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan mesa Personal", cantidad: 1 },
      { nombre: "Vienesas personal", cantidad: 1 },
    ],
  },
  "0110": {
    codigo: "0110",
    nombre: "DELIVERY      APP",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "DELIVERY      APP", cantidad: 1 },
    ],
  },
  "0111": {
    codigo: "0111",
    nombre: "DELIVERY      APP",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "DELIVERY      APP", cantidad: 1 },
    ],
  },
  "0201": {
    codigo: "0201",
    nombre: "+PALTA",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Paltas", cantidad: 1 },
      
    ],
  },  
  "0205": {
    codigo: "0205",
    nombre: "+HUEVO",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Huevos", cantidad: 2 },
      
    ],
  },
  "0211": {
    codigo: "0211",
    nombre: "+QUESO",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Queso laminado", cantidad: 3 },
      
    ],
  },
  "0301": {
    codigo: "0301",
    nombre: "COM ITALIANO GIGANTE",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan mesa Gigante", cantidad: 1 },
      { nombre: "Vienesas doggi", cantidad: 1 },
    ],
  },
  "0302": {
    codigo: "0302",
    nombre: "COM COMPLETO GIGANTE",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan mesa Gigante", cantidad: 1 },
      { nombre: "Vienesas doggi", cantidad: 1 },
    ],
  },
  "0303": {
    codigo: "0303",
    nombre: "COM CATALANA GIGANTE",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan mesa Gigante", cantidad: 1 },
      { nombre: "Vienesas doggi", cantidad: 1 },
    ],
  },  
  "0304": {
    codigo: "0304",
    nombre: "COM VEGE GIGANTE",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan mesa Gigante", cantidad: 1 },            
    ],
  },
  "0306": {
    codigo: "0306",
    nombre: "COM CATALANA ITALIAN",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan mesa Gigante", cantidad: 1 },
      { nombre: "Vienesas doggi", cantidad: 1 },            
    ],
  },
  
  // --- AGREGADOS / EXTRAS ---
  "0405": { codigo: "0405", nombre: "+HUEVO", categoria: 'COCINA', ingredientes: [{ nombre: "Huevos", cantidad: 1 }] },
  "0411": { codigo: "0411", nombre: "+QUESO", categoria: 'COCINA', ingredientes: [{ nombre: "Queso laminado", cantidad: 2 }] },
  "1005": { codigo: "1005", nombre: "+HUEVO", categoria: 'COCINA', ingredientes: [{ nombre: "Huevos", cantidad: 1 }] },

  "0502": {
    codigo: "0502",
    nombre: "COM COMPLETO SUPER",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan mesa súper Gigan.", cantidad: 1 },
      { nombre: "Vienesas personal", cantidad: 2 },
    ],
  },
  "0503": {
    codigo: "0503",
    nombre: "COM CATALANA SUPER",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan mesa súper Gigan.", cantidad: 1 },
      { nombre: "Vienesas personal", cantidad: 2 },
      { nombre: "Queso laminado", cantidad: 3 },
    ],
  },
  "0508": {
    codigo: "0508",
    nombre: "COM ITALIANO SUPER",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan mesa súper Gigan.", cantidad: 1 },
      { nombre: "Vienesas personal", cantidad: 2 },
    ],
  },

  "0701": {
    codigo: "0701",
    nombre: "AS ITALIANO",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan mesa Gigante", cantidad: 1 },
      { nombre: "Carne para As Gig.", cantidad: 1 },
    ],
  },
  "0702": {
    codigo: "0702",
    nombre: "AS COMPLETO",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan mesa Gigante", cantidad: 1 },
      { nombre: "Carne para As Gig.", cantidad: 1 },
    ],
  },
  "0703": {
    codigo: "0703",
    nombre: "AS CHACARERO",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan mesa Gigante", cantidad: 1 },
      { nombre: "Carne para As Gig.", cantidad: 1 },
    ],
  },
  "0704": {
    codigo: "0704",
    nombre: "AS LUCO",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan mesa Gigante", cantidad: 1 },
      { nombre: "Carne para As Gig.", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 2 },
    ],
  },
  "0705": {
    codigo: "0705",
    nombre: "AS LUCO PALTA",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan mesa Gigante", cantidad: 1 },
      { nombre: "Carne para As Gig.", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 2 },
    ],
  },
  "0708": {
    codigo: "0708",
    nombre: "AS OBELISCO",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan mesa Gigante", cantidad: 1 },
      { nombre: "Carne para As Gig.", cantidad: 1 },
    ],
  },
  "0711": {
    codigo: "0711",
    nombre: "AS MEXICANO",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan mesa Gigante", cantidad: 1 },
      { nombre: "Carne para As Gig.", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 2 },
    ],
  },
  "0712": {
    codigo: "0712",
    nombre: "AS AMERICANO",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan mesa Gigante", cantidad: 1 },
      { nombre: "Carne para As Gig.", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 2 },
      { nombre: "Tocino porciones", cantidad: 1 },
    ],
  },

  "0901": {
    codigo: "0901",
    nombre: "CHUR ITA GIG",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan hallullon", cantidad: 1 },
      { nombre: "Carne churrasco gig", cantidad: 1 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "0902": {
    codigo: "0902",
    nombre: "CHUR COMP GIG",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan hallullon", cantidad: 1 },
      { nombre: "Carne churrasco gig", cantidad: 1 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "0903": {
    codigo: "0903",
    nombre: "CHUR CHACA GIG",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan hallullon", cantidad: 1 },
      { nombre: "Carne churrasco gig", cantidad: 1 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],    
  },
  "0905": {
    codigo: "0905",
    nombre: "CHUR LUCO PAL GIG",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan hallullon", cantidad: 1 },
      { nombre: "Carne churrasco gig", cantidad: 1 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],    
  },
  "0904": {
    codigo: "0904",
    nombre: "CHUR LUCO GIG",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan hallullon", cantidad: 1 },
      { nombre: "Carne churrasco gig", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 5 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],        
  },
  "0906": {
    codigo: "0906",
    nombre: "CHUR LUCO CHAM GIG",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan hallullon", cantidad: 1 },
      { nombre: "Carne churrasco gig", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 5 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
      { nombre: "Champiñones", cantidad: 1 },
    ],        
  },
  "0908": {
    codigo: "0908",
    nombre: "CHUR OBELISCO GIG",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan hallullon", cantidad: 1 },
      { nombre: "Carne churrasco gig", cantidad: 1 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],    
  },
  "0911": {
    codigo: "0911",
    nombre: "CHUR MEXICANO GIG",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan hallullon", cantidad: 1 },
      { nombre: "Carne churrasco gig", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 4 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "0912": {
    codigo: "0912",
    nombre: "CHUR AMERICANO GIG",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan hallullon", cantidad: 1 },
      { nombre: "Carne churrasco gig", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 4 },
      { nombre: "Tocino porciones", cantidad: 2 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "1011": {
    codigo: "1011",
    nombre: "+QUESO",
    categoria: 'COCINA',
    ingredientes: [      
      { nombre: "Queso laminado", cantidad: 3 },
    ],
    },    
  "1019": {
    codigo: "1019",
    nombre: "EXTRA CARNE GIGANTE",
    categoria: 'COCINA',
    ingredientes: [      
      { nombre: "Carne churrasco gig", cantidad: 1 },
    ],
  },

  "1201": {
    codigo: "1201",
    nombre: "+PALTA",
    categoria: 'COCINA',
    ingredientes: [      
      { nombre: "Paltas", cantidad: 1 },
    ],
  },
  "1211": {
    codigo: "1211",
    nombre: "+QUESO",
    categoria: 'COCINA',
    ingredientes: [      
      { nombre: "Queso laminado", cantidad: 3 },
    ],
  },  
  "1213": {
    codigo: "1213",
    nombre: "+TOCINO",
    categoria: 'COCINA',
    ingredientes: [      
      { nombre: "Tocino", cantidad: 1 },
    ],
  },
  "1219": {
    codigo: "1219",
    nombre: "EXTRA CARNE PERSONAL",
    categoria: 'COCINA',
    ingredientes: [      
      { nombre: "Carne churrasco pers.", cantidad: 1 },
    ],
  },

  "1301": {
    codigo: "1301",
    nombre: "LOMO ITALIANO GIG",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan hallullon", cantidad: 1 },
      { nombre: "Carne lomo gig.", cantidad: 1 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "1302": {
    codigo: "1302",
    nombre: "LOMO COMPLETO GIG",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan hallullon", cantidad: 1 },
      { nombre: "Carne lomo gig.", cantidad: 1 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "1308": {
    codigo: "1308",
    nombre: "LOMO OBELISCO GIG",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan hallullon", cantidad: 1 },
      { nombre: "Carne lomo gig.", cantidad: 1 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "1310": {
    codigo: "1310",
    nombre: "LOMO AMERICANO GIG",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan hallullon", cantidad: 1 },
      { nombre: "Carne lomo gig.", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 4 },
      { nombre: "Tocino porciones", cantidad: 2 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "1314": {
    codigo: "1314",
    nombre: "LOMO GRAN OBELISCO",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan fricas", cantidad: 1 },
      { nombre: "Carne lomo pers.", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 2 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "1315": {
    codigo: "1315",
    nombre: "AGREGADO LOMO",
    categoria: 'COCINA',
    ingredientes: [      
      { nombre: "Carne lomo pers.", cantidad: 1 },
    ],
  },
  
  "1501": {
    codigo: "1501",
    nombre: "LOMO ITALIANO PER",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan fricas", cantidad: 1 },
      { nombre: "Carne lomo pers.", cantidad: 1 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "1502": {
    codigo: "1502",
    nombre: "LOMO COMPLETO PER",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan fricas", cantidad: 1 },
      { nombre: "Carne lomo pers.", cantidad: 1 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "1503": {
    codigo: "1503",
    nombre: "LOMO CHACARE PER",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan fricas", cantidad: 1 },
      { nombre: "Carne lomo pers.", cantidad: 1 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "1504": {
    codigo: "1504",
    nombre: "LOMO LUCO PER",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan fricas", cantidad: 1 },
      { nombre: "Carne lomo pers.", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 2 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "1505": {
    codigo: "1505",
    nombre: "LOMO LUCO PALTA PER",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan fricas", cantidad: 1 },
      { nombre: "Carne lomo pers.", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 2 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },

  "1901": {
    codigo: "1901",
    nombre: "POLLO ITALIANO PER",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan fricas", cantidad: 1 },
      { nombre: "Carne Ave Personal", cantidad: 1 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "1903": {
    codigo: "1903",
    nombre: "POLLO CHACARE PER",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan fricas", cantidad: 1 },
      { nombre: "Carne Ave Personal", cantidad: 1 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "1905": {
    codigo: "1905",
    nombre: "POLLO LUCO PALTA PER",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan fricas", cantidad: 1 },
      { nombre: "Carne Ave Personal", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 2 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "1907": {
    codigo: "1907",
    nombre: "POLLO KAISER PER",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan fricas", cantidad: 1 },
      { nombre: "Carne Ave Personal", cantidad: 1 },
      { nombre: "Jamón", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 2 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "1908": {
    codigo: "1908",
    nombre: "POLLO OBELISCO PER",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan fricas", cantidad: 1 },
      { nombre: "Carne Ave Personal", cantidad: 1 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "1915": {
    codigo: "1915",
    nombre: "POLLO CRISPY ITALIAN",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan fricas", cantidad: 1 },
      { nombre: "Carne Ave Personal", cantidad: 1 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },

  "2101": {
    codigo: "2101",
    nombre: "HAMBU ITALIANA GIG",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan hallullon", cantidad: 1 },
      { nombre: "Carne Hamburg Gigant.", cantidad: 1 },   
      { nombre: "Papas personal 150gr", cantidad: 1 },   
    ],
  },
  "2103": {
    codigo: "2103",
    nombre: "HAMBU LUCO GIG",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan hallullon", cantidad: 1 },
      { nombre: "Carne Hamburg Gigant.", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 4 },
    ],
  },
  "2104": {
    codigo: "2104",
    nombre: "HAMB LUCO PALTA G",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan hallullon", cantidad: 1 },
      { nombre: "Carne Hamburg Gigant.", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 4 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "2105": {
    codigo: "2105",
    nombre: "HAMB LUCO CHAMP GIG",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan hallullon", cantidad: 1 },
      { nombre: "Carne Hamburg Gigant.", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 4 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "2109": {
    codigo: "2109",
    nombre: "HAMB YORK GIG",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan hallullon", cantidad: 1 },
      { nombre: "Carne Hamburg Gigant.", cantidad: 1 },
      { nombre: "Cheddar porc" , cantidad: 3 },
      { nombre: "Huevos", cantidad: 3 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "2114": {
    codigo: "2114",
    nombre: "HAMBUR GIG GRINGA",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan hallullon", cantidad: 1 },
      { nombre: "Carne Hamburg Gigant.", cantidad: 1 },
      { nombre: "Cheddar porc" , cantidad: 3 },
      { nombre: "Huevos", cantidad: 3 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "2301": {
    codigo: "2301",
    nombre: "HAMBURG ITALIANA PER",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan Brioche 12", cantidad: 1 },
      { nombre: "Carne hamburg. Porc.", cantidad: 1 },
      { nombre: "Papas personal 150gr", cantidad: 1 },      
    ],
  }, 
  "2302": {
    codigo: "2302",
    nombre: "HAMBURG COMPLETA PER",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan Brioche 12", cantidad: 1 },
      { nombre: "Carne hamburg. Porc.", cantidad: 1 },     
      { nombre: "Papas personal 150gr", cantidad: 1 }, 
    ],
  },    
  "2303": {
    codigo: "2303",
    nombre: "HAMBURG LUCO PER",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan Brioche 12", cantidad: 1 },
      { nombre: "Carne hamburg. Porc.", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 2 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "2304": {
    codigo: "2304",
    nombre: "HAMBURG LUCO PALTA P",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan Brioche 12", cantidad: 1 },
      { nombre: "Carne hamburg. Porc.", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 2 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "2305": {
    codigo: "2305",
    nombre: "HAMBURG LUCO CHAMP P",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan Brioche 12", cantidad: 1 },
      { nombre: "Carne hamburg. Porc.", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 2 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "2306": {
    codigo: "2306",
    nombre: "HAMBURG KAISER PER",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan Brioche 12", cantidad: 1 },
      { nombre: "Carne hamburg. Porc.", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 2 },
      { nombre: "Jamón", cantidad: 1 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "2307": {
    codigo: "2307",
    nombre: "HAMBURG OBELISCO PER",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan Brioche 12", cantidad: 1 },
      { nombre: "Carne hamburg. Porc.", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 2 },
      { nombre: "Cheddar porc" , cantidad: 1 },
      { nombre: "Tocino porciones", cantidad: 1 },
      { nombre: "Huevos", cantidad: 1 },
      { nombre: "Papas personal 150gr", cantidad: 1 },    ],
  },
  "2308": {
    codigo: "2308",
    nombre: "HAMBURG AMERICANA PER",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan Brioche 12", cantidad: 1 },
      { nombre: "Carne hamburg. Porc.", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 3 },
      { nombre: "Tocino porciones", cantidad: 1 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "2309": {
    codigo: "2309",
    nombre: "HAMB PERS YORK",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan Brioche 12", cantidad: 1 },
      { nombre: "Carne hamburg. Porc.", cantidad: 1 },
      { nombre: "Cheddar porc" , cantidad: 1 },
      { nombre: "Huevos", cantidad: 3 },
      { nombre: "Papas personal 150gr", cantidad: 1 },      
    ],
  },
  "2315": {
    codigo: "2315",
    nombre: "HAMBUR PER GINGA",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan Brioche 12", cantidad: 1 },
      { nombre: "Carne hamburg. Porc.", cantidad: 1 },
      { nombre: "Cheddar porc" , cantidad: 1 },
      { nombre: "Huevos", cantidad: 1 },
      { nombre: "Tocino porciones", cantidad: 1 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "2316": {
    codigo: "2316",
    nombre: "HAMB CLASSIC BURG 2X",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan Brioche 12", cantidad: 2 },
      { nombre: "Hamburg KING K", cantidad: 2 },
      { nombre: "Cheddar porc" , cantidad: 2 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },

  "2416": {
    codigo: "2416",
    nombre: "AGRE HAM PERSONAL",
    categoria: 'COCINA',
    ingredientes: [      
      { nombre: "Hamburg KING K", cantidad: 1 },      
    ],
  },

  "2707": {
    codigo: "2707",
    nombre: "HAMBURG LUCO CHAMP P",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan Brioche 12", cantidad: 1 },
      { nombre: "Carne hamburg. Porc.", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 2 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  
  "2801": {
    codigo: "2801",
    nombre: "CHURRASO ITALIANO PE",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan fricas", cantidad: 1 },
      { nombre: "Carne churrasco pers.", cantidad: 1 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "2802": {
    codigo: "2802",
    nombre: "CHURRASCO COMPLETO P",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan fricas", cantidad: 1 },
      { nombre: "Carne churrasco pers.", cantidad: 1 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "2803": {
    codigo: "2803",
    nombre: "CHURRASCO CHACARERO",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan fricas", cantidad: 1 },
      { nombre: "Carne churrasco pers.", cantidad: 1 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "2804": {
    codigo: "2804",
    nombre: "CHURRASCO LUCO PER",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan fricas", cantidad: 1 },
      { nombre: "Carne churrasco pers.", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 2 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "2805": {
    codigo: "2805",
    nombre: "CHURRASCO LUCO PALTA",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan fricas", cantidad: 1 },
      { nombre: "Carne churrasco pers.", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 2 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "2807": {
    codigo: "2807",
    nombre: "CHURRASCO KAISER PER",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan fricas", cantidad: 1 },
      { nombre: "Carne churrasco pers.", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 2 },
      { nombre: "Jamón", cantidad: 1 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "2808": {
    codigo: "2808",
    nombre: "CHURRASCO OBELISCO P",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan fricas", cantidad: 1 },
      { nombre: "Carne churrasco pers.", cantidad: 1 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "2810": {
    codigo: "2810",
    nombre: "CHURRASCO YORK PER",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan fricas", cantidad: 1 },
      { nombre: "Carne churrasco pers.", cantidad: 1 },
      { nombre: "Huevos", cantidad: 2 },
      { nombre: "Queso laminado", cantidad: 2 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "2811": {
    codigo: "2811",
    nombre: "CHURRASCO MEXICANO P",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan fricas", cantidad: 1 },
      { nombre: "Carne churrasco pers.", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 2 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "2812": {
    codigo: "2812",
    nombre: "CHUR AMERICANO PER",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan fricas", cantidad: 1 },
      { nombre: "Carne churrasco pers.", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 2 },
      { nombre: "Tocino porciones", cantidad: 1 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  
  "3703": {
    codigo: "3703",
    nombre: "ENSALADA MIX",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "", cantidad: 0 }   
    ],
  },
  "3704": {
    codigo: "3704",
    nombre: "ENSALADA AVE",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Carne Ave .Gigante", cantidad: 1 },      
    ],
  },
  "3705": {
    codigo: "3705",
    nombre: "ENSALADA ATUN",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Atún", cantidad: 1 },      
    ],
  },

  "3901": {
    codigo: "3901",
    nombre: "PAPAS FRITAS GRANDES",
    categoria: 'COCINA',
    ingredientes: [{ nombre: "Papas grandes 700gr", cantidad: 1 }],
  },
  "3902": {
    codigo: "3902",
    nombre: "PAPAS FRITAS PERSONA",
    categoria: 'COCINA',
    ingredientes: [{ nombre: "Papas personal 350gr", cantidad: 1 }],
  },
  "3903": {
    codigo: "3903",
    nombre: "CHORRILLANA GRANDE",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Papas grandes 700gr", cantidad: 1 },
      { nombre: "Carne churrasco gig", cantidad: 1 },
      { nombre: "Vienesas doggi", cantidad: 1 },
      { nombre: "Chorizo", cantidad: 2 },
    ],
  },
  "3904": {
    codigo: "3904",
    nombre: "CHORRILLANA PERSONAL",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Papas personal 350gr", cantidad: 1 },
      { nombre: "Carne churrasco pers.", cantidad: 1 },
      { nombre: "Vienesas personal", cantidad: 1 },
      { nombre: "Chorizo", cantidad: 1 },
    ],
  },
   "3908": {
    codigo: "3908",
    nombre: "SALCHI PAPAS GRANDE",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Papas grandes 700gr", cantidad: 1 },      
      { nombre: "Vienesas doggi", cantidad: 1 },      
    ],
  },
  "3909": {
    codigo: "3909",
    nombre: "SALCHI PAPAS PERSONA",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Papas personal 350gr", cantidad: 1 },      
      { nombre: "Vienesas personal", cantidad: 1 },      
    ],
  },
  
  "4021": {
    codigo: "4021",
    nombre: "COLACION JUGO+COMPLETO",
    categoria: 'COCINA',
    ingredientes: [{ nombre: "", cantidad: 0 }      
    ],
  },
  "4023": {
    codigo: "4023",
    nombre: "CARNE MECHADA C ARRO",
    categoria: 'COCINA',
    ingredientes: [{ nombre: "Menú 3 Carne Mechada", cantidad: 1 }      
    ],
  },
  "4024": {
    codigo: "4024",
    nombre: "CARNE MECHADA C PAPA",
    categoria: 'COCINA',
    ingredientes: [{ nombre: "Menú 3 Carne Mechada", cantidad: 1 }      
    ],
  },
  "4029": {
    codigo: "4029",
    nombre: "PESCADO/ESCAL/ARROZ",
    categoria: 'COCINA',
    ingredientes: [{ nombre: "Menú 2 Pangasius", cantidad: 1 }      
    ],
  },
  "4030": {
    codigo: "4030",
    nombre: "PESCA/ESCALO/ENSALAD",
    categoria: 'COCINA',
    ingredientes: [{ nombre: "Menú 2 Pangasius", cantidad: 1 }      
    ],
  },
  "4031": {
    codigo: "4031",
    nombre: "PESCA/ESCALO/PAPAS",
    categoria: 'COCINA',
    ingredientes: [{ nombre: "Menú 2 Pangasius", cantidad: 1 }      
    ],
  },
  "4033": {
    codigo: "4033",
    nombre: "COLACION ADMINISTRAD",
    categoria: 'COCINA',
    ingredientes: [{ nombre: "", cantidad: 1 }      
    ],
  },
  "4036": {
    codigo: "4036",
    nombre: "CHULETAS ARROZ",
    categoria: 'COCINA',
    ingredientes: [{ nombre: "Chuleta", cantidad: 1 }      
    ],
  },
  "4037": {
    codigo: "4037",
    nombre: "CHULETAS PAPAS FRITAS",
    categoria: 'COCINA',
    ingredientes: [{ nombre: "Chuleta", cantidad: 1 }      
    ],
  },

  "4871": {
    codigo: "4871",
    nombre: "COM PER+PAPAS",
    categoria: 'COCINA',
    ingredientes: [{ nombre: "Pan mesa Personal", cantidad: 1 },
        { nombre: "Vienesas personal", cantidad: 1 },
    ],
  },
  "4872": {
    codigo: "4872",
    nombre: "COM GIG+PAPAS",
    categoria: 'COCINA',
    ingredientes: [{ nombre: "Pan mesa Gigante", cantidad: 1 },
        { nombre: "Vienesas doggi", cantidad: 1 },
        { nombre: "Papas personal 150gr", cantidad: 1 },
        
    ],
  },  
  "4874": {
    codigo: "4874",
    nombre: "HAMB+PPS+BEBIDA",
    categoria: 'COCINA',
    ingredientes: [{ nombre: "Pan Brioche 12", cantidad: 1 },
        { nombre: "Carne hamburg. Porc.", cantidad: 1 },
        { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "4875": {
    codigo: "4875",
    nombre: "LOMOPER+PPS+BEBIDA",
    categoria: 'COCINA',
    ingredientes: [{ nombre: "Pan fricas", cantidad: 1 },
        { nombre: "Carne lomo pers.", cantidad: 1 },
        { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "4895": {
    codigo: "4895",
    nombre: "CHORRILLA GIGANTE + P",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Papas grandes 700gr", cantidad: 1 },
      { nombre: "Carne churrasco gig", cantidad: 1 },
      { nombre: "Vienesas doggi", cantidad: 1 },
      { nombre: "Chorizo", cantidad: 2 },
    ],
  },
  "4896": {
    codigo: "4896",
    nombre: "LOMO PERSONAL ITALIA",
    categoria: 'COCINA',
    ingredientes: [{ nombre: "Pan fricas", cantidad: 1 },
        { nombre: "Carne lomo pers.", cantidad: 1 },
        { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },

  "5302": {
    codigo: "5302",
    nombre: "TOSTADAS Jamón HUEVO",
    categoria: 'COCINA',
    ingredientes: [{ nombre: "Pan mesa Personal", cantidad: 1 },
        { nombre: "Carne lomo pers.", cantidad: 1 },
    ],
  },

  // WRAPS

  "5201": {
    codigo: "5201",
    nombre: "WRAP POLLO CLASICO",
    categoria: 'COCINA',
    ingredientes: [{ nombre: "Tortilla De Wrap", cantidad: 1 },
        { nombre: "Carne Ave Personal", cantidad: 1 },
        { nombre: "Papas personal 150gr", cantidad: 1 },        
    ],
  },
  "5203": {
    codigo: "5203",
    nombre: "WRAP MEXICACO POLLO",
    categoria: 'COCINA',
    ingredientes: [{ nombre: "Tortilla De Wrap", cantidad: 1 },
        { nombre: "Carne Ave Personal", cantidad: 1 },
        { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "5204": {
    codigo: "5204",
    nombre: "WRAP MEXICANO CARNE",
    categoria: 'COCINA',
    ingredientes: [{ nombre: "Tortilla De Wrap", cantidad: 1 },
        { nombre: "Carne para As Gig.", cantidad: 1 },
        { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "5205": {
    codigo: "5205",
    nombre: "WRAP MEXICANO MIXTO",
    categoria: 'COCINA',
    ingredientes: [{ nombre: "Tortilla De Wrap", cantidad: 1 },
        { nombre: "Carne Ave Personal", cantidad: 0.5 },
        { nombre: "Carne para As Gig.", cantidad: 0.5 },
        { nombre: "Papas personal 150gr", cantidad: 1 },
    ],    
  },
  "5206": {
    codigo: "5206",
    nombre: "WRAP CLASICO CARNE",
    categoria: 'COCINA',
    ingredientes: [{ nombre: "Tortilla De Wrap", cantidad: 1 },
        { nombre: "Carne para As Gig.", cantidad: 1 },
        { nombre: "Papas personal 150gr", cantidad: 1 },
    ],    
  },  
  "5208": {
    codigo: "5208",
    nombre: "WRAP AMERICANO POLLO",
    categoria: 'COCINA',
    ingredientes: [{ nombre: "Tortilla De Wrap", cantidad: 1 },
        { nombre: "Carne Ave Personal", cantidad: 1 },
        { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "5209": {
    codigo: "5209",
    nombre: "WRAP AMERICANO CARNE",
    categoria: 'COCINA',
    ingredientes: [{ nombre: "Tortilla De Wrap", cantidad: 1 },
        { nombre: "Carne para As Gig.", cantidad: 1 },
        { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "5210": {
    codigo: "5210",
    nombre: "WRAP AMERICANO MIXTO",
    categoria: 'COCINA',
    ingredientes: [{ nombre: "Tortilla De Wrap", cantidad: 1 },
        { nombre: "Carne Ave Personal", cantidad: 0.5 },
        { nombre: "Carne para As Gig.", cantidad: 0.5 },
        { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  
  // --- OTROS FALTANTES ---
  "1701": {
    codigo: "1701",
    nombre: "POLLO ITALIANO GIG",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan hallullon", cantidad: 1 },
      { nombre: "Carne Ave .Gigante", cantidad: 1 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "2107": {
    codigo: "2107",
    nombre: "HAMBU OBE GIG",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan hallullon", cantidad: 1 },
      { nombre: "Carne Hamburg Gigant.", cantidad: 1 },
      { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "4032": {
    codigo: "4032",
    nombre: "COLACION TOMAS HERBI",
    categoria: 'COCINA',
    ingredientes: [{ nombre: "Pan mesa Personal", cantidad: 1 }], // Estimado
  },
};

// EMPANADAS

export const EMPANADAS: Record<string, EmpanadaDef> = { 
  "3508": {
    codigo: "3508",
    nombre: "EMP PINO CERNE HORNO",
    categoria: 'EMPANADAS',
    ingredientes: [
      { nombre: "Emp. Horno Pino Carne", cantidad: 1 },            
    ],
  }, 
  "3510": {
    codigo: "3510",
    nombre: "EMP PINO MARISCO HOR",
    categoria: 'EMPANADAS',
    ingredientes: [
      { nombre: "Emp. Horno marisco", cantidad: 1 },            
    ],
  }, 
  "3601": {
    codigo: "3601",
    nombre: "EMP CAMARON QUESO FR",
    categoria: 'EMPANADAS',
    ingredientes: [
      { nombre: "Hojarascas", cantidad: 1 },
      { nombre: "Porciones de camarones", cantidad: 1, },
      { nombre: "Queso laminado", cantidad: 2, },
    ],
  },
  "3602": {
    codigo: "3602",
    nombre: "EMP CHAMPIGNON QUESO",
    categoria: 'EMPANADAS',
    ingredientes: [
      { nombre: "Hojarascas", cantidad: 1 },
      { nombre: "Champiñones", cantidad: 1, },
      { nombre: "Queso laminado", cantidad: 2, },
    ],
  },
  "3603": {
    codigo: "3603",
    nombre: "EMP ESPAÑOLA FRITA",
    categoria: 'EMPANADAS',
    ingredientes: [
      { nombre: "Hojarascas", cantidad: 1 },
      { nombre: "Chorizo", cantidad: 1, },
      { nombre: "Queso laminado", cantidad: 2, },
    ],
  },
  "3605": {
    codigo: "3605",
    nombre: "EMP NAPOLETANA FRITA",
    categoria: 'EMPANADAS',
    ingredientes: [
      { nombre: "Hojarascas", cantidad: 1 }, 
      { nombre: "Chorizo", cantidad: 1, },     
      { nombre: "Queso laminado", cantidad: 2, },
    ],
  },
  "3608": {
    codigo: "3608",
    nombre: "EMP PINO CARNE FRITA",
    categoria: 'EMPANADAS',
    ingredientes: [
      { nombre: "Hojarascas", cantidad: 1 },      
      { nombre: "Porcion Pino Carne", cantidad: 1 },      
    ],
  },
"3609": {
    codigo: "3609",
    nombre: "EMP PINO CARNE QUESO",
    categoria: 'EMPANADAS',
    ingredientes: [
      { nombre: "Hojarascas", cantidad: 1 },      
      { nombre: "Porcion Pino Carne", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 2, },      
    ],
  },
  "3610": {
    codigo: "3610",
    nombre: "EMP PINO MARISCO FRI",
    categoria: 'EMPANADAS',
    ingredientes: [
      { nombre: "Hojarascas", cantidad: 1 },      
      { nombre: "Porcion Pino Marisco", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 2, },      
    ],
  },
  "3611": {
    codigo: "3611",
    nombre: "EMP CARNE CHOCLO FRI",
    categoria: 'EMPANADAS',
    ingredientes: [
      { nombre: "Hojarascas", cantidad: 1 },      
      { nombre: "Carne para As Gig.", cantidad: 0.5 },            
    ],
  },
  "3613": {
    codigo: "3613",
    nombre: "EMP QUESO CHOCLO FRI",
    categoria: 'EMPANADAS',
    ingredientes: [
      { nombre: "Hojarascas", cantidad: 1 },      
      { nombre: "Queso laminado", cantidad: 2, },      
    ],
  },
  "3614": {
    codigo: "3614",
    nombre: "EMP VEGETARIANA FRIT",
    categoria: 'EMPANADAS',
    ingredientes: [
      { nombre: "Hojarascas", cantidad: 1 },      
      { nombre: "Queso laminado", cantidad: 2, },      
    ],
  },
  "3615": {
    codigo: "3615",
    nombre: "EMP MEXICANA FRITA",
    categoria: 'EMPANADAS',
    ingredientes: [
      { nombre: "Hojarascas", cantidad: 1 },      
      { nombre: "Queso laminado", cantidad: 2, },      
    ],
  },
  "3617": {
    codigo: "3617",
    nombre: "EMP QUESO FRITA",
    categoria: 'EMPANADAS',
    ingredientes: [
      { nombre: "Hojarascas", cantidad: 1 },      
      { nombre: "Queso laminado", cantidad: 4, },      
    ],
  },
  "3623": {
    codigo: "3623",
    nombre: "MECHADA QUESO FRITA",
    categoria: 'EMPANADAS',
    ingredientes: [
      { nombre: "Hojarascas", cantidad: 1 },
      { nombre: "Menú 3 Carne Mechada", cantidad: 0.5 },      
      { nombre: "Queso laminado", cantidad: 2, },      
    ],
  },
  "3625": {
    codigo: "3625",
    nombre: "CARNE CHAMPIñON",
    categoria: 'EMPANADAS',
    ingredientes: [
      { nombre: "Hojarascas", cantidad: 1 },
      { nombre: "Carne para As Gig.", cantidad: 0.5 },      
      { nombre: "Champiñones", cantidad: 1, },      
    ],
    },
  "3628": {
    codigo: "3628",
    nombre: "EMPANADA POLLO QUESO",
    categoria: 'EMPANADAS',
    ingredientes: [
      { nombre: "Hojarascas", cantidad: 1 },
      { nombre: "Carne Ave Personal", cantidad: 0.5 },      
      { nombre: "Queso laminado", cantidad: 2, }      
    ],
  },
  "3629": {
    codigo: "3629",
    nombre: "EMP CARNE QUESO",
    categoria: 'EMPANADAS',
    ingredientes: [
      { nombre: "Hojarascas", cantidad: 1 },
      { nombre: "Carne para As Gig.", cantidad: 0.5 },      
      { nombre: "Queso laminado", cantidad: 2, },      
    ],
  },
};

export const recetas: (MenuDef | BebestibleDef)[] = [
  ...Object.values(BEBESTIBLES),
  ...Object.values(MENUS),
  ...Object.values(EMPANADAS),
];
