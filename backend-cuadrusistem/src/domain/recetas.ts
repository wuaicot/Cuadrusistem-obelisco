export type IngredienteDef = {
  nombre: string;
  cantidad: number;
  unidad?: string;
};
export type MenuDef = {
  codigo: string;
  nombre: string;
  ingredientes: IngredienteDef[];
};
export type BebestibleDef = { codigo: string; nombre: string; unidad?: string, ingredientes?: IngredienteDef[] };
export type EmpanadaDef = MenuDef;

export const BEBESTIBLES: Record<string, BebestibleDef> = {
  "4101": { codigo: "4101", nombre: "AUSTRAL LATA 1/2", unidad: "unidad" },
  "4202": { codigo: "4202", nombre: "ESCUDO LITRO", unidad: "unidad" },
  "4203": { codigo: "4203", nombre: "ROYAL LITRO", unidad: "unidad" },
  "4207": { codigo: "4207", nombre: "BOTELLIN CRISTAL", unidad: "unidad" },
  "4211": { codigo: "4211", nombre: "BOTELLIN TOROBAYO", unidad: "unidad" },
  "4217": { codigo: "4217", nombre: "HEINEKEN LATA", unidad: "unidad" },
  "4219": { codigo: "4219", nombre: "ESCUDO LATA 1/2", unidad: "unidad" },
  "4220": { codigo: "4220", nombre: "CRISTAL LATA 1/2", unidad: "unidad" },
  "4221": { codigo: "4221", nombre: "SCHOP QUILMES 500CC", unidad: "unidad" },  
  "4224": { codigo: "4224", nombre: "BOTELLIN HEINEKEN", unidad: "unidad" },
  "4228": { codigo: "4228", nombre: "CERVEZA SOL BOTELLIN", unidad: "unidad" },
  "4230": { codigo: "4230", nombre: "SHOP CRISTAL 500CC", unidad: "unidad" },
  "4232": { codigo: "4232", nombre: "HEINEKEN LATA 1/2", unidad: "unidad" },
  "4233": { codigo: "4233", nombre: "BOTELLIN ROYAL", unidad: "unidad" },  
  "4239": { codigo: "4239", nombre: "ROYAL LATA 1/2", unidad: "unidad" },
  "4240": { codigo: "4240", nombre: "STELLA LITRO 1LT", unidad: "unidad" },
  "4246": { codigo: "4246", nombre: "CORONA BOTELLIN", unidad: "unidad" },
  "4306": { codigo: "4306", nombre: "COCA COLA LATA", unidad: "unidad" },
  "4401": { codigo: "4401", nombre: "COCA COLA 591CC", unidad: "unidad" },
  "4407": { codigo: "4407", nombre: "VITAL SIN GAS", unidad: "unidad" },
  "4426": { codigo: "4426", nombre: "VITAL 1 1/2", unidad: "unidad" },
  "4428": { codigo: "4428", nombre: "BEBIDA 1 1/5", unidad: "unidad" },
  "4501": { codigo: "4501", nombre: "NECTAR IND", unidad: "unidad" },
  "4601": { codigo: "4601", nombre: "HEINEKEN LATA 1/2", unidad: "unidad" },
  "4602": { codigo: "4602", nombre: "TE GRANDE", unidad: "unidad" },
  "4869": { codigo: "4869", nombre: "PROMO SCHOP 2X1", unidad: "unidad" },
  //Continuarà...
};



export const MENUS: Record<string, MenuDef> = {
  "0101": {
    codigo: "0101",
    nombre: "COM ITALIANO PERSONA",
    ingredientes: [
      { nombre: "Pan mesa Personal", cantidad: 1, unidad: "un" },
      { nombre: "Vienesas personal", cantidad: 1, unidad: "un" as any },
    ],
  },
  "0102": {
    codigo: "0102",
    nombre: "COM COMPLETO PERSONA",
    ingredientes: [
      { nombre: "Pan mesa Personal", cantidad: 1 },
      { nombre: "Vienesas personal", cantidad: 1 },
    ],
  },
  "0103": {
    codigo: "0103",
    nombre: "COM CATALANA PERSONA",
    ingredientes: [
      { nombre: "Pan mesa Personal", cantidad: 1 },
      { nombre: "Vienesas personal", quantity: 1 } as any,
    ],
  },
  "0105": {
    codigo: "0105",
    nombre: "COM CHACARERO PERSON",
    ingredientes: [
      { nombre: "Pan mesa Personal", cantidad: 1 },
      { nombre: "Vienesas personal", quantity: 1 } as any,
    ],
  },

  "0301": {
    codigo: "0301",
    nombre: "COM ITALIANO GIGANTE",
    ingredientes: [
      { nombre: "Pan mesa Gigante", cantidad: 1 },
      { nombre: "Vienesas doggi", cantidad: 1 },
    ],
  },
  "0302": {
    codigo: "0302",
    nombre: "COM COMPLETO GIGANTE",
    ingredientes: [
      { nombre: "Pan mesa Gigante", cantidad: 1 },
      { nombre: "Vienesas doggi", cantidad: 1 },
    ],
  },
  "0303": {
    codigo: "0303",
    nombre: "COM CATALANA GIGANTE",
    ingredientes: [
      { nombre: "Pan mesa Gigante", cantidad: 1 },
      { nombre: "Vienesas doggi", cantidad: 1 },
    ],
  },
  "0502": {
    codigo: "0502",
    nombre: "COM COMPLETO SUPER",
    ingredientes: [
      { nombre: "Pan mesa súper Gigan.", cantidad: 1 },
      { nombre: "Vienesas personal", cantidad: 2 },
    ],
  },
  "0508": {
    codigo: "0508",
    nombre: "COM ITALIANO SUPER",
    ingredientes: [
      { nombre: "Pan mesa súper Gigan.", cantidad: 1 },
      { nombre: "Vienesas personal", cantidad: 2 },
    ],
  },
  "0901": {
    codigo: "0901",
    nombre: "CHUR ITA GIG",
    ingredientes: [
      { nombre: "Pan hallullon", cantidad: 1 },
      { nombre: "Churrasc Gigante", cantidad: 2 },
    ],
  },
  "0902": {
    codigo: "0902",
    nombre: "CHUR COMP GIG",
    ingredientes: [
      { nombre: "Pan hallullon", cantidad: 1 },
      { nombre: "Churrasc Gigante", cantidad: 2 },
    ],
  },
  "0903": {
    codigo: "0903",
    nombre: "CHUR COMP GIG",
    ingredientes: [
      { nombre: "Pan hallullon", cantidad: 1 },
      { nombre: "Churrasc Gigante", cantidad: 2 },
    ],
  },
  "0911": {
    codigo: "0911",
    nombre: "CHUR MEXICANO GIG",
    ingredientes: [
      { nombre: "Pan hallullon", cantidad: 1 },
      { nombre: "Churrasc Gigante", cantidad: 2 },
    ],
  },
  "1502": {
    codigo: "1502",
    nombre: "LOMO COMPLETO PER",
    ingredientes: [
      { nombre: "Pan FRICAS", cantidad: 1 },
      { nombre: "Lomo Personal", cantidad: 2 },
    ],
  },
  "1503": {
    codigo: "1503",
    nombre: "LOMO CHACARE PER",
    ingredientes: [
      { nombre: "Pan FRICAS", cantidad: 1 },
      { nombre: "Lomo Personal", cantidad: 1 },
    ],
  },
  "1901": {
    codigo: "1901",
    nombre: "POLLO ITALIANO PER",
    ingredientes: [
      { nombre: "Pan FRICAS", cantidad: 1 },
      { nombre: "Ave Personal", cantidad: 1 },
    ],
  },
  "1903": {
    codigo: "1903",
    nombre: "POLLO CHACARE PER",
    ingredientes: [
      { nombre: "Pan FRICAS", cantidad: 1 },
      { nombre: "Ave Personal", cantidad: 1 },
    ],
  },
  "1908": {
    codigo: "1908",
    nombre: "POLLO OBELISCO PER",
    ingredientes: [
      { nombre: "Pan FRICAS", cantidad: 1 },
      { nombre: "Ave Personal", cantidad: 1 },
    ],
  },
  "2305": {
    codigo: "2305",
    nombre: "HAMBURG LUCO CHAMP P",
    ingredientes: [
      { nombre: "Pan Brioche 12", cantidad: 1 },
      { nombre: "Hamb. Personal", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 3 },
    ],
  },
  "2316": {
    codigo: "2316",
    nombre: "HAMB CLASSIC BURG 2X",
    ingredientes: [
      { nombre: "Pan Brioche 12", cantidad: 2 },
      { nombre: "Hamburg KING K", cantidad: 2 },
      { nombre: "Cheddar porc", cantidad: 4 },
    ],
  },
  "2801": {
    codigo: "2801",
    nombre: "CHURRASCO ITALIANO PE",
    ingredientes: [
      { nombre: "Pan FRICAS", cantidad: 1 },
      { nombre: "Churrasc Personal", cantidad: 1 },
    ],
  },
  "2803": {
    codigo: "2803",
    nombre: "CHURRASCO CHACARRERO",
    ingredientes: [
      { nombre: "Pan FRICAS", cantidad: 1 },
      { nombre: "Churrasc Personal", cantidad: 1 },
    ],
  },
  "2812": {
    codigo: "2812",
    nombre: "CHURRASCO AMERICANO PER",
    ingredientes: [
      { nombre: "Pan FRICAS", cantidad: 1 },
      { nombre: "Churrasc Personal", cantidad: 1 },
    ],
  },
  "3704": {
    codigo: "3704",
    nombre: "ENSALADA AVE",
    ingredientes: [
      { nombre: "Ave Gigante", cantidad: 1 },      
    ],
  },
  "3901": {
    codigo: "3901",
    nombre: "PAPAS FRITAS GRANDES",
    ingredientes: [{ nombre: "Papas grandes 700gr", cantidad: 1 }],
  },
  "3902": {
    codigo: "3902",
    nombre: "PAPAS FRITAS PERSONA",
    ingredientes: [{ nombre: "Papas personal 350gr", cantidad: 1 }],
  },
  "3903": {
    codigo: "3903",
    nombre: "CHORRILLANA GRANDE",
    ingredientes: [
      { nombre: "Papas grandes 700gr", cantidad: 1 },
      { nombre: "Churrasc Gigante", cantidad: 1 },
      { nombre: "Vienesas doggi", cantidad: 1 },
      { nombre: "Chorizo", cantidad: 2 },
    ],
  },
  "4023": {
    codigo: "4023",
    nombre: "CARNE MECHADA C ARRO",
    ingredientes: [{ nombre: "Porcion Mechada", cantidad: 1 }],
  },
  "4024": {
    codigo: "4024",
    nombre: "CARNE MECHADA C PAPA",
    ingredientes: [{ nombre: "Porcion Mechada", cantidad: 1 }],
  },
  "4029": {
    codigo: "4029",
    nombre: "PESCADO/ESCALO/ARROZ",
    ingredientes: [{ nombre: "Pangasiu", cantidad: 1 }],
  },
  "4030": {
    codigo: "4030",
    nombre: "PESCA/ESCALO/ENSALAD",
    ingredientes: [{ nombre: "Pangasiu", cantidad: 1 }],
  },
  "4031": {
    codigo: "4031",
    nombre: "PESCA/ESCALO/PAPAS",
    ingredientes: [{ nombre: "Pangasiu", cantidad: 1 }],
  },
  "4871": {
    codigo: "4871",
    nombre: "COM PER+PAPAS",
    ingredientes: [{ nombre: "Pan mesa Personal", cantidad: 1 },
        { nombre: "Vienesas personal", cantidad: 1 },
    ],
  },
  "4896": {
    codigo: "4896",
    nombre: "LOMO PERSONAL ITALIA",
    ingredientes: [{ nombre: "Pan mesa Personal", cantidad: 1 },
        { nombre: "Lomo Personal", cantidad: 1 },
    ],
  },
  "5201": {
    codigo: "5201",
    nombre: "WRAP POLLO CLASICO",
    ingredientes: [{ nombre: "Tortilla De Wrap", cantidad: 1 },
        { nombre: "Carne Ave Personal", cantidad: 1 },
    ],
  },
  "5203": {
    codigo: "5203",
    nombre: "WRAP MEXICACO POLLO",
    ingredientes: [{ nombre: "Tortilla De Wrap", cantidad: 1 },
        { nombre: "Carne Ave Personal", cantidad: 1 },
    ],
  },
  "5205": {
    codigo: "5205",
    nombre: "WRAP MEXICANO MIXTO",
    ingredientes: [{ nombre: "Tortilla De Wrap", cantidad: 1 },
        { nombre: "Carne Ave Personal", cantidad: 0.5 },
        { nombre: "Carne para As Gig.", cantidad: 0.5 },
    ],
  },
  "5208": {
    codigo: "5208",
    nombre: "WRAP AMERICANO POLLO",
    ingredientes: [{ nombre: "Tortilla De Wrap", cantidad: 1 },
        { nombre: "Carne Ave Personal", cantidad: 1 },
    ],
  },
  "5210": {
    codigo: "5210",
    nombre: "WRAP AMERICANO MIXTO",
    ingredientes: [{ nombre: "Tortilla De Wrap", cantidad: 1 },
        { nombre: "Carne Ave Personal", cantidad: 1 },
    ],
  },
  //Continuarà...
  
};

export const EMPANADAS: Record<string, EmpanadaDef> = { 
  "3508": {
    codigo: "3508",
    nombre: "EMP PINO CERNE HORNO",
    ingredientes: [
      { nombre: "Emp. Horno Pino Carne", cantidad: 1 },            
    ],
  }, 
  "3510": {
    codigo: "3510",
    nombre: "EMP PINO MARISCO HOR",
    ingredientes: [
      { nombre: "Emp. Horno marisco", cantidad: 1 },            
    ],
  }, 
  "3601": {
    codigo: "3601",
    nombre: "EMP CAMARON QUESO FR",
    ingredientes: [
      { nombre: "Hojarascas", cantidad: 1 },
      { nombre: "Porciones de camarones", cantidad: 1, },
      { nombre: "Queso laminado", cantidad: 2, },
    ],
  },
  "3602": {
    codigo: "3602",
    nombre: "EMP CHAMPIGNON QUESO",
    ingredientes: [
      { nombre: "Hojarascas", cantidad: 1 },
      { nombre: "Champiñones", cantidad: 1, },
      { nombre: "Queso laminado", cantidad: 2, },
    ],
  },
  "3603": {
    codigo: "3603",
    nombre: "EMP ESPAÑOLA FRITA",
    ingredientes: [
      { nombre: "Hojarascas", cantidad: 1 },
      { nombre: "Chorizo", cantidad: 1, },
      { nombre: "Queso laminado", cantidad: 2, },
    ],
  },
  "3605": {
    codigo: "3805",
    nombre: "EMP NAPOLETANA FRITA",
    ingredientes: [
      { nombre: "Hojarascas", cantidad: 1 },      
      { nombre: "Queso laminado", cantidad: 2, },
    ],
  },
  "3608": {
    codigo: "3608",
    nombre: "EMP PINO CARNE FRITA",
    ingredientes: [
      { nombre: "Hojarascas", cantidad: 1 },      
      { nombre: "Porcion Pino Carne", cantidad: 1 },      
    ],
  },
"3609": {
    codigo: "3609",
    nombre: "EMP PINO CARNE QUESO",
    ingredientes: [
      { nombre: "Hojarascas", cantidad: 1 },      
      { nombre: "Porcion Pino Carne", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 2, },      
    ],
  },
  "3610": {
    codigo: "3610",
    nombre: "EMP PINO MARISCO FRI",
    ingredientes: [
      { nombre: "Hojarascas", cantidad: 1 },      
      { nombre: "Porcion Pino Carne", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 2, },      
    ],
  },
  "3611": {
    codigo: "3611",
    nombre: "EMP CARNE CHOCLO FRI",
    ingredientes: [
      { nombre: "Hojarascas", cantidad: 1 },      
      { nombre: "Carne para As Gig.", cantidad: 0.5 },            
    ],
  },
  "6313": {
    codigo: "6313",
    nombre: "EMP QUESO CHOCLO FRI",
    ingredientes: [
      { nombre: "Hojarascas", cantidad: 1 },      
      { nombre: "Queso laminado", cantidad: 2, },      
    ],
  },
  "3614": {
    codigo: "3614",
    nombre: "EMP VEGETARIANA FRIT",
    ingredientes: [
      { nombre: "Hojarascas", cantidad: 1 },      
      { nombre: "Queso laminado", cantidad: 2, },      
    ],
  },
  "3615": {
    codigo: "3615",
    nombre: "EMP MEXICANA FRITA",
    ingredientes: [
      { nombre: "Hojarascas", cantidad: 1 },      
      { nombre: "Queso laminado", cantidad: 2, },      
    ],
  },
  "3617": {
    codigo: "3617",
    nombre: "EMP QUESO FRITA",
    ingredientes: [
      { nombre: "Hojarascas", cantidad: 1 },      
      { nombre: "Queso laminado", cantidad: 4, },      
    ],
  },
  "3623": {
    codigo: "3623",
    nombre: "MECHADA QUESO FRITA",
    ingredientes: [
      { nombre: "Hojarascas", cantidad: 1 },
      { nombre: "Carne Mechada", cantidad: 0.5 },      
      { nombre: "Queso laminado", cantidad: 2, },      
    ],
  },
  "3625": {
    codigo: "3625",
    nombre: "CARNE CHAMPIñON",
    ingredientes: [
      { nombre: "Hojarascas", cantidad: 1 },
      { nombre: "Carne para As Gig.", cantidad: 0.5 },      
      { nombre: "Champiñones", cantidad: 1, },      
    ],
    },
  "3628": {
    codigo: "3628",
    nombre: "EMPANADA POLLO QUESO",
    ingredientes: [
      { nombre: "Hojarascas", cantidad: 1 },
      { nombre: "Carne Ave Personal", cantidad: 0.5 },      
      { nombre: "Queso laminado", cantidad: 2, }      
    ],
  },
  "3629": {
    codigo: "3629",
    nombre: "EMP CARNE QUESO",
    ingredientes: [
      { nombre: "Hojarascas", cantidad: 1 },
      { nombre: "Carne para As Gig.", cantidad: 1 },      
      { nombre: "Champiñones", cantidad: 1, },      
    ],
  },
  "4029": {
    codigo: "4029",
    nombre: "PESCADO/ESCAL/ARROZ",
    ingredientes: [
      { nombre: "Pangasius", cantidad: 1 },            
    ],
  },
  "4030": {
    codigo: "4030",
    nombre: "PESCA/ESCALO/ENSALAD",
    ingredientes: [
      { nombre: "Pangasius", cantidad: 1 },            
    ],
  },
  //Continuarà...
};
