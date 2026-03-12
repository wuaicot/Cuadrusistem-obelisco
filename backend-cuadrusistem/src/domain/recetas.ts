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
  "4201": { codigo: "4201", nombre: "CRISTAL LITRO", unidad: "unidad" },
  "4202": { codigo: "4202", nombre: "ESCUDO LITRO", unidad: "unidad" },
  "4203": { codigo: "4203", nombre: "ROYAL LITRO", unidad: "unidad" },
  "4207": { codigo: "4207", nombre: "BOTELLIN CRISTAL", unidad: "unidad" },
  "4209": { codigo: "4209", nombre: "ROYAL LATA", unidad: "unidad" },
  "4211": { codigo: "4211", nombre: "BOTELLIN TOROBAYO", unidad: "unidad" },
  "4215": { codigo: "4215", nombre: "CRISTAL LATA CH", unidad: "unidad" },
  "4217": { codigo: "4217", nombre: "HEINEKEN LATA", unidad: "unidad" },
  "4219": { codigo: "4219", nombre: "ESCUDO LATA 1/2", unidad: "unidad" },
  "4220": { codigo: "4220", nombre: "CRISTAL LATA 1/2", unidad: "unidad" },
  "4221": { codigo: "4221", nombre: "SCHOP QUILMES 500 CC", unidad: "unidad" },  
  "4224": { codigo: "4224", nombre: "BOTELLIN HEINEKEN", unidad: "unidad" },
  "4228": { codigo: "4228", nombre: "CERVEZA SOL BOTELLIN", unidad: "unidad" },
  "4230": { codigo: "4230", nombre: "SHOP CRISTAL 500CC", unidad: "unidad" },
  "4232": { codigo: "4232", nombre: "HEINEKEN LATA 1/2", unidad: "unidad" },
  "4233": { codigo: "4233", nombre: "BOTELLIN ROYAL", unidad: "unidad" },  
  "4239": { codigo: "4239", nombre: "ROYAL LATA 1/2", unidad: "unidad" },
  "4240": { codigo: "4240", nombre: "STELLA LITRO 1LT", unidad: "unidad" },
  "4245": { codigo: "4245", nombre: "PITCHER QUILMES 1.5", unidad: "unidad" },
  "4246": { codigo: "4246", nombre: "CORONA BOTELLIN", unidad: "unidad" },
  "4306": { codigo: "4306", nombre: "COCA COLA LATA", unidad: "unidad" },
  "4314": { codigo: "4314", nombre: "MONSTER BEBIDA ENERG", unidad: "unidad" },
  "4313": { codigo: "4313", nombre: "JUGO NATURAL", unidad: "unidad" },
  "4401": { codigo: "4401", nombre: "COCA COLA 591CC", unidad: "unidad" },
  "4407": { codigo: "4407", nombre: "VITAL SIN GAS", unidad: "unidad" },
  "4426": { codigo: "4426", nombre: "VITAL 1 1/2", unidad: "unidad" },
  "4428": { codigo: "4428", nombre: "BBIDA 1 1/5", unidad: "unidad" },
  "4504": { codigo: "4504", nombre: "NECTAR 1 1/2", unidad: "unidad" },
  "4501": { codigo: "4501", nombre: "NECTAR IND", unidad: "unidad" },
  "4601": { codigo: "4601", nombre: "CAFE GRANDE", unidad: "unidad" },
  "4602": { codigo: "4602", nombre: "TE GRANDE", unidad: "unidad" },
  "4869": { codigo: "4869", nombre: "PROMO SCHOP 2X1", unidad: "unidad" },
  //Continuarà...
};


export const MENUS: Record<string, MenuDef> = {
  "0101": {
    codigo: "0101",
    nombre: "COM ITALIANO PERSONA",
    ingredientes: [
      { nombre: "Pan mesa Personal", cantidad: 1 },
      { nombre: "Vienesas personal", cantidad: 1 },
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
      { nombre: "Vienesas personal", cantidad: 1 },
    ],
  },
  "0105": {
    codigo: "0105",
    nombre: "COM CHACARERO PERSON",
    ingredientes: [
      { nombre: "Pan mesa Personal", cantidad: 1 },
      { nombre: "Vienesas personal", cantidad: 1 },
    ],
  },
  "0110": {
    codigo: "0110",
    nombre: "DELIVERY      APP",
    ingredientes: [
      { nombre: "DELIVERY      APP", cantidad: 1 },
    ],
  },
  "0111": {
    codigo: "0111",
    nombre: "DELIVERY      APP",
    ingredientes: [
      { nombre: "DELIVERY      APP", cantidad: 1 },
    ],
  },
  "0201": {
    codigo: "0201",
    nombre: "+PALTA",
    ingredientes: [
      { nombre: "Paltas", cantidad: 1 },
      
    ],
  },
  "0205": {
    codigo: "0205",
    nombre: "+HUEVO",
    ingredientes: [
      { nombre: "Huevos", cantidad: 2 },
      
    ],
  },
  "0211": {
    codigo: "0211",
    nombre: "+QUESO",
    ingredientes: [
      { nombre: "Queso laminado", cantidad: 3 },
      
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
  "0304": {
    codigo: "0304",
    nombre: "COM VEGE GIGANTE",
    ingredientes: [
      { nombre: "Pan mesa Gigante", cantidad: 1 },
            
    ],
  },
  "0502": {
    codigo: "0502",
    nombre: "COM ITALIANO SUPER",
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
  "0701": {
    codigo: "0701",
    nombre: "AS ITALIANO",
    ingredientes: [
      { nombre: "Pan mesa Gigante", cantidad: 1 },
      { nombre: "Carne para As Gig.", cantidad: 1 },
    ],
  },
  "0702": {
    codigo: "0702",
    nombre: "AS COMPLETO",
    ingredientes: [
      { nombre: "Pan mesa Gigante", cantidad: 1 },
      { nombre: "Carne para As Gig.", cantidad: 1 },
    ],
  },
  "0703": {
    codigo: "0703",
    nombre: "AS CHACARERO",
    ingredientes: [
      { nombre: "Pan mesa Gigante", cantidad: 1 },
      { nombre: "Carne para As Gig.", cantidad: 1 },
    ],
  },
  "0704": {
    codigo: "0704",
    nombre: "AS CHACARERO",
    ingredientes: [
      { nombre: "Pan mesa Gigante", cantidad: 1 },
      { nombre: "Carne para As Gig.", cantidad: 1 },
    ],
  },
  "0705": {
    codigo: "0705",
    nombre: "AS CHACARERO",
    ingredientes: [
      { nombre: "Pan mesa Gigante", cantidad: 1 },
      { nombre: "Carne para As Gig.", cantidad: 1 },
    ],
  },
  "0708": {
    codigo: "0708",
    nombre: "AS OBELISCO",
    ingredientes: [
      { nombre: "Pan mesa Gigante", cantidad: 1 },
      { nombre: "Carne para As Gig.", cantidad: 1 },
    ],
  },
  "0711": {
    codigo: "0711",
    nombre: "AS MEXICANO",
    ingredientes: [
      { nombre: "Pan mesa Gigante", cantidad: 1 },
      { nombre: "Carne para As Gig.", cantidad: 1 },
    ],
  },
  "0712": {
    codigo: "0712",
    nombre: "AS AMERICANO",
    ingredientes: [
      { nombre: "Pan mesa Gigante", cantidad: 1 },
      { nombre: "Carne para As Gig.", cantidad: 1 },
    ],
  },
  "0901": {
    codigo: "0901",
    nombre: "CHUR ITA GIG",
    ingredientes: [
      { nombre: "Pan hallullon", cantidad: 1 },
      { nombre: "Carne churrasco gig", cantidad: 1 },
    ],
  },
  "0902": {
    codigo: "0902",
    nombre: "CHUR COMP GIG",
    ingredientes: [
      { nombre: "Pan hallullon", cantidad: 1 },
      { nombre: "Carne churrasco gig", cantidad: 1 },
    ],
  },
  "0903": {
    codigo: "0903",
    nombre: "CHUR CHACA GIG",
    ingredientes: [
      { nombre: "Pan hallullon", cantidad: 1 },
      { nombre: "Carne churrasco gig", cantidad: 1 },
    ],    
  },
  "0904": {
    codigo: "0904",
    nombre: "CHUR LUCO GIG",
    ingredientes: [
      { nombre: "Pan hallullon", cantidad: 1 },
      { nombre: "Carne churrasco gig", cantidad: 1 },
    ],    
  },
  "0908": {
    codigo: "0908",
    nombre: "CHUR OBELISCO GIG",
    ingredientes: [
      { nombre: "Pan hallullon", cantidad: 1 },
      { nombre: "Carne churrasco gig", cantidad: 1 },
    ],    
  },
  "0911": {
    codigo: "0911",
    nombre: "CHUR MEXICANO GIG",
    ingredientes: [
      { nombre: "Pan hallullon", cantidad: 1 },
      { nombre: "Carne churrasco gig", cantidad: 1 },
    ],
  },
  "0912": {
    codigo: "0912",
    nombre: "CHUR MEXICANO GIG",
    ingredientes: [
      { nombre: "Pan hallullon", cantidad: 1 },
      { nombre: "Carne churrasco gig", cantidad: 1 },
    ],
  },
  "1011": {
    codigo: "1011",
    nombre: "+QUESO",
    ingredientes: [      
      { nombre: "Carne churrasco gig", cantidad: 1 },
    ],
    },
  "1019": {
    codigo: "1019",
    nombre: "EXTRA CARNE GIGANTE",
    ingredientes: [      
      { nombre: "Carne churrasco gig", cantidad: 1 },
    ],
  },
  "1201": {
    codigo: "1201",
    nombre: "+PALTA",
    ingredientes: [      
      { nombre: "Paltas", cantidad: 1 },
    ],
  },
  "1211": {
    codigo: "1211",
    nombre: "+QUESO",
    ingredientes: [      
      { nombre: "Queso laminado", cantidad: 3 },
    ],
  },
  "1301": {
    codigo: "1301",
    nombre: "LOMO ITALIANO GIG",
    ingredientes: [
      { nombre: "Pan hallullon", cantidad: 1 },
      { nombre: "Carne lomo gig.", cantidad: 1 },
    ],
  },
  "1302": {
    codigo: "1302",
    nombre: "LOMO COMPLETO GIG",
    ingredientes: [
      { nombre: "Pan hallullon", cantidad: 1 },
      { nombre: "Carne lomo gig.", cantidad: 1 },
    ],
  },
  "1308": {
    codigo: "1308",
    nombre: "LOMO OBELISCO GIG",
    ingredientes: [
      { nombre: "Pan hallullon", cantidad: 1 },
      { nombre: "Carne lomo gig.", cantidad: 1 },
    ],
  },
  "1310": {
    codigo: "1310",
    nombre: "LOMO AMERICANO GIG",
    ingredientes: [
      { nombre: "Pan hallullon", cantidad: 1 },
      { nombre: "Carne lomo gig.", cantidad: 1 },
    ],
  },
  "1314": {
    codigo: "1314",
    nombre: "LOMO GRAN OBELISCO",
    ingredientes: [
      { nombre: "Pan fricas", cantidad: 1 },
      { nombre: "Carne lomo pers.", cantidad: 1 },
    ],
  },
  "1315": {
    codigo: "1315",
    nombre: "AGREGADO LOMO",
    ingredientes: [
      { nombre: "Pan fricas", cantidad: 1 },
      { nombre: "Carne lomo pers.", cantidad: 1 },
    ],
  },
  "1501": {
    codigo: "1501",
    nombre: "LOMO ITALIANO PER",
    ingredientes: [
      { nombre: "Pan fricas", cantidad: 1 },
      { nombre: "Carne lomo pers.", cantidad: 1 },
    ],
  },
  "1502": {
    codigo: "1502",
    nombre: "LOMO COMPLETO PER",
    ingredientes: [
      { nombre: "Pan fricas", cantidad: 1 },
      { nombre: "Carne lomo pers.", cantidad: 1 },
    ],
  },
  "1503": {
    codigo: "1503",
    nombre: "LOMO CHACARE PER",
    ingredientes: [
      { nombre: "Pan fricas", cantidad: 1 },
      { nombre: "Carne lomo pers.", cantidad: 1 },
    ],
  },
  "1504": {
    codigo: "1504",
    nombre: "LOMO LUCO PER",
    ingredientes: [
      { nombre: "Pan fricas", cantidad: 1 },
      { nombre: "Carne lomo pers.", cantidad: 1 },
    ],
  },
  "1901": {
    codigo: "1901",
    nombre: "POLLO ITALIANO PER",
    ingredientes: [
      { nombre: "Pan fricas", cantidad: 1 },
      { nombre: "Carne Ave Personal", cantidad: 1 },
    ],
  },
  "1903": {
    codigo: "1903",
    nombre: "POLLO CHACARE PER",
    ingredientes: [
      { nombre: "Pan fricas", cantidad: 1 },
      { nombre: "Carne Ave Personal", cantidad: 1 },
    ],
  },
  "1908": {
    codigo: "1908",
    nombre: "POLLO OBELISCO PER",
    ingredientes: [
      { nombre: "Pan fricas", cantidad: 1 },
      { nombre: "Carne Ave Personal", cantidad: 1 },
    ],
  },
  "1915": {
    codigo: "1915",
    nombre: "POLLO CRISPY ITALIAN",
    ingredientes: [
      { nombre: "Pan fricas", cantidad: 1 },
      { nombre: "Carne Ave Personal", cantidad: 1 },
    ],
  },
  "2103": {
    codigo: "2103",
    nombre: "HAMBU LUCO GIG",
    ingredientes: [
      { nombre: "Pan Brioche 12", cantidad: 1 },
      { nombre: "Carne Hamburg Gigant.", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 4 },
    ],
  },
  "2104": {
    codigo: "2104",
    nombre: "HAMB LUCO PALTA G",
    ingredientes: [
      { nombre: "Pan Brioche 12", cantidad: 1 },
      { nombre: "Carne Hamburg Gigant.", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 2 },
    ],
  },
  "2105": {
    codigo: "2105",
    nombre: "HAMB LUCO CHAMP GIG",
    ingredientes: [
      { nombre: "Pan Brioche 12", cantidad: 1 },
      { nombre: "Carne Hamburg Gigant.", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 2 },
    ],
  },
  "2109": {
    codigo: "2109",
    nombre: "HAMB YORK GIG",
    ingredientes: [
      { nombre: "Pan Brioche 12", cantidad: 1 },
      { nombre: "Carne Hamburg Gigant.", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 2 },
    ],
  },
  "2114": {
    codigo: "2114",
    nombre: "HAMBUR GIG GRINGA",
    ingredientes: [
      { nombre: "Pan Brioche 12", cantidad: 1 },
      { nombre: "Carne Hamburg Gigant.", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 2 },
    ],
  },
  "2301": {
    codigo: "2301",
    nombre: "HAMBURG COMPLETA PER",
    ingredientes: [
      { nombre: "Pan Brioche 12", cantidad: 1 },
      { nombre: "Carne hamburg. Porc.", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 2 },
    ],
  }, 
  "2302": {
    codigo: "2302",
    nombre: "HAMBURG COMPLETA PER",
    ingredientes: [
      { nombre: "Pan Brioche 12", cantidad: 1 },
      { nombre: "Carne hamburg. Porc.", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 2 },
    ],
  },    
  "2303": {
    codigo: "2303",
    nombre: "HAMBURG LUCO PER",
    ingredientes: [
      { nombre: "Pan Brioche 12", cantidad: 1 },
      { nombre: "Carne hamburg. Porc.", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 2 },
    ],
  },
  "2305": {
    codigo: "2305",
    nombre: "HAMBURG LUCO CHAMP P",
    ingredientes: [
      { nombre: "Pan Brioche 12", cantidad: 1 },
      { nombre: "Carne hamburg. Porc.", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 3 },
    ],
  },
  "2307": {
    codigo: "2307",
    nombre: "HAMBURG OBELISCO PER",
    ingredientes: [
      { nombre: "Pan Brioche 12", cantidad: 1 },
      { nombre: "Carne hamburg. Porc.", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 3 },
    ],
  },
  "2308": {
    codigo: "2308",
    nombre: "HAMBURG OBELISCO PER",
    ingredientes: [
      { nombre: "Pan Brioche 12", cantidad: 1 },
      { nombre: "Carne hamburg. Porc.", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 3 },
    ],
  },
  "2309": {
    codigo: "2309",
    nombre: "HAMB PERS YORK",
    ingredientes: [
      { nombre: "Pan Brioche 12", cantidad: 1 },
      { nombre: "Carne hamburg. Porc.", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 3 },
    ],
  },
  "2315": {
    codigo: "2315",
    nombre: "HAMBUR PER GINGA",
    ingredientes: [
      { nombre: "Pan Brioche 12", cantidad: 1 },
      { nombre: "Carne hamburg. Porc.", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 3 },
    ],
  },
  "2316": {
    codigo: "2316",
    nombre: "HAMB CLASSIC BURG 2X",
    ingredientes: [
      { nombre: "Pan Brioche 12", cantidad: 2 },
      { nombre: "Hamburg KING K", cantidad: 2 },
      { nombre: "Queso laminado", cantidad: 6 },
    ],
  },
  "2416": {
    codigo: "2416",
    nombre: "AGRE HAM PERSONAL",
    ingredientes: [      
      { nombre: "Hamburg KING K", cantidad: 2 },      
    ],
  },
  "2707": {
    codigo: "2707",
    nombre: "HAMBURG LUCO CHAMP P",
    ingredientes: [
      { nombre: "Pan Brioche 12", cantidad: 1 },
      { nombre: "Carne hamburg. Porc.", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 3 },
    ],
  },
  
  "2801": {
    codigo: "2801",
    nombre: "CHURRASO ITALIANO PE",
    ingredientes: [
      { nombre: "Pan fricas", cantidad: 1 },
      { nombre: "Carne churrasco pers.", cantidad: 1 },
    ],
  },
  "2802": {
    codigo: "2802",
    nombre: "CHURRASCO COMPLETO P",
    ingredientes: [
      { nombre: "Pan fricas", cantidad: 1 },
      { nombre: "Carne churrasco pers.", cantidad: 1 },
    ],
  },
  "2803": {
    codigo: "2803",
    nombre: "CHURRASCO CHACARERO",
    ingredientes: [
      { nombre: "Pan fricas", cantidad: 1 },
      { nombre: "Carne churrasco pers.", cantidad: 1 },
    ],
  },
  "2804": {
    codigo: "2804",
    nombre: "CHURRASCO LUCO PER",
    ingredientes: [
      { nombre: "Pan fricas", cantidad: 1 },
      { nombre: "Carne churrasco pers.", cantidad: 1 },
    ],
  },
  "2805": {
    codigo: "2805",
    nombre: "CHURRASCO LUCO PALTA",
    ingredientes: [
      { nombre: "Pan fricas", cantidad: 1 },
      { nombre: "Carne churrasco pers.", cantidad: 1 },
    ],
  },
  "2807": {
    codigo: "2807",
    nombre: "CHURRASCO KAISER PER",
    ingredientes: [
      { nombre: "Pan fricas", cantidad: 1 },
      { nombre: "Carne churrasco pers.", cantidad: 1 },
    ],
  },
  "2808": {
    codigo: "2808",
    nombre: "CHURRASCO OBELISCO P",
    ingredientes: [
      { nombre: "Pan fricas", cantidad: 1 },
      { nombre: "Carne churrasco pers.", cantidad: 1 },
    ],
  },
  "2811": {
    codigo: "2811",
    nombre: "CHURRASCO MEXICANO P",
    ingredientes: [
      { nombre: "Pan fricas", cantidad: 1 },
      { nombre: "Carne churrasco pers.", cantidad: 1 },
    ],
  },
  "2812": {
    codigo: "2812",
    nombre: "CHURRASCO AMERICANO PER",
    ingredientes: [
      { nombre: "Pan fricas", cantidad: 1 },
      { nombre: "Carne churrasco pers.", cantidad: 1 },
    ],
  },
  "3703": {
    codigo: "3703",
    nombre: "ENSALADA MIX",
    ingredientes: [
      { nombre: "", cantidad: 0 }   
    ],
  },
  "3704": {
    codigo: "3704",
    nombre: "ENSALADA AVE",
    ingredientes: [
      { nombre: "Carne Ave .Gigante", cantidad: 1 },      
    ],
  },
  "3705": {
    codigo: "3705",
    nombre: "ENSALADA ATUN",
    ingredientes: [
      { nombre: "Carne Ave .Gigante", cantidad: 1 },      
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
      { nombre: "Carne churrasco gig", cantidad: 1 },
      { nombre: "Vienesas doggi", cantidad: 1 },
      { nombre: "Chorizo", cantidad: 2 },
    ],
  },
  "3904": {
    codigo: "3904",
    nombre: "CHORRILLANA PERSONAL",
    ingredientes: [
      { nombre: "Papas personal 350gr", cantidad: 1 },
      { nombre: "Carne churrasco pers.", cantidad: 1 },
      { nombre: "Vienesas personal", cantidad: 1 },
      { nombre: "Chorizo", cantidad: 2 },
    ],
  },
   "3908": {
    codigo: "3908",
    nombre: "SALCHI PAPAS GRANDE",
    ingredientes: [
      { nombre: "Papas grandes 700gr", cantidad: 1 },      
      { nombre: "Vienesas doggi", cantidad: 2 },      
    ],
  },
  "3909": {
    codigo: "3909",
    nombre: "SALCHI PAPAS PERSONA",
    ingredientes: [
      { nombre: "Papas personal 350gr", cantidad: 1 },      
      { nombre: "Vienesas personal", cantidad: 2 },      
    ],
  },
  "4023": {
    codigo: "4023",
    nombre: "CARNE MECHADA C ARRO",
    ingredientes: [{ nombre: "Menú 3 Carne Mechada", cantidad: 1 }      
    ],
  },
  "4024": {
    codigo: "4024",
    nombre: "CARNE MECHADA C PAPA",
    ingredientes: [{ nombre: "Menú 3 Carne Mechada", cantidad: 1 }      
    ],
  },
  "4029": {
    codigo: "4029",
    nombre: "PESCADO/ESCAL/ARROZ",
    ingredientes: [{ nombre: "Menú 2 Pangasius", cantidad: 1 }      
    ],
  },
  "4030": {
    codigo: "4030",
    nombre: "PESCA/ESCALO/ENSALAD",
    ingredientes: [{ nombre: "Menú 2 Pangasius", cantidad: 1 }      
    ],
  },
  "4031": {
    codigo: "4031",
    nombre: "PESCA/ESCALO/PAPAS",
    ingredientes: [{ nombre: "Menú 2 Pangasius", cantidad: 1 }      
    ],
  },
  "4033": {
    codigo: "4033",
    nombre: "COLACION ADMINISTRAD",
    ingredientes: [{ nombre: "Colacion Administrad", cantidad: 1 }      
    ],
  },
  "4036": {
    codigo: "4036",
    nombre: "CHULETAS ARROZ",
    ingredientes: [{ nombre: "Chuleta", cantidad: 1 }      
    ],
  },
  "4037": {
    codigo: "4037",
    nombre: "CHULETAS PAPAS FRITAS",
    ingredientes: [{ nombre: "Chuleta", cantidad: 1 }      
    ],
  },
  "4871": {
    codigo: "4871",
    nombre: "COM PER+PAPAS",
    ingredientes: [{ nombre: "Pan mesa Personal", cantidad: 1 },
        { nombre: "Vienesas personal", cantidad: 1 },
    ],
  },
  "4872": {
    codigo: "4872",
    nombre: "COM GIG+PAPAS",
    ingredientes: [{ nombre: "Pan mesa Gigante", cantidad: 1 },
        { nombre: "Vienesas doggi", cantidad: 1 },
    ],
  },  
  "4874": {
    codigo: "4874",
    nombre: "HAMB+PPS+BEBIDA",
    ingredientes: [{ nombre: "Pan Brioche 12", cantidad: 1 },
        { nombre: "Carne hamburg. Porc.", cantidad: 1 },
        { nombre: "Papas personal 150gr", cantidad: 1 },
    ],
  },
  "4875": {
    codigo: "4875",
    nombre: "LOMOPER+PPS+BEBIDA",
    ingredientes: [{ nombre: "Pan fricas", cantidad: 1 },
        { nombre: "Carne lomo pers.", cantidad: 1 },
    ],
  },
  "4896": {
    codigo: "4896",
    nombre: "LOMO PERSONAL ITALIA",
    ingredientes: [{ nombre: "Pan fricas", cantidad: 1 },
        { nombre: "Carne lomo pers.", cantidad: 1 },
    ],
  },
  "5302": {
    codigo: "5302",
    nombre: "TOSTADAS JAMON HUEVO",
    ingredientes: [{ nombre: "Pan mesa Personal", cantidad: 1 },
        { nombre: "Carne lomo pers.", cantidad: 1 },
    ],
  },

  // WRAPS

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
  "5204": {
    codigo: "5204",
    nombre: "WRAP MEXICANO CARNE",
    ingredientes: [{ nombre: "Tortilla De Wrap", cantidad: 1 },
        { nombre: "Carne para As Gig.", cantidad: 1 },
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
  "5206": {
    codigo: "5206",
    nombre: "WRAP CLASICO CARNE",
    ingredientes: [{ nombre: "Tortilla De Wrap", cantidad: 1 },
        { nombre: "Carne para As Gig.", cantidad: 1 },
    ],    
  },  
  "5208": {
    codigo: "5208",
    nombre: "WRAP AMERICANO POLLO",
    ingredientes: [{ nombre: "Tortilla De Wrap", cantidad: 1 },
        { nombre: "Carne Ave Personal", cantidad: 1 },
    ],
  },
  "5209": {
    codigo: "5209",
    nombre: "WRAP AMERICANO CARNE",
    ingredientes: [{ nombre: "Tortilla De Wrap", cantidad: 1 },
        { nombre: "Carne para As Gig.", cantidad: 1 },
    ],
  },
  "5210": {
    codigo: "5210",
    nombre: "WRAP AMERICANO MIXTO",
    ingredientes: [{ nombre: "Tortilla De Wrap", cantidad: 1 },
        { nombre: "Carne Ave Personal", cantidad: 0.5 },
        { nombre: "Carne para As Gig.", cantidad: 0.5 },
    ],
  },
  //Continuarà...
  
};

// EMPANADAS

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
    codigo: "3605",
    nombre: "EMP NAPOLETANA FRITA",
    ingredientes: [
      { nombre: "Hojarascas", cantidad: 1 }, 
      { nombre: "Chorizo", cantidad: 1, },     
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
      { nombre: "Porcion Pino Marisco", cantidad: 1 },
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
      { nombre: "Menú 3 Carne Mechada", cantidad: 0.5 },      
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
      { nombre: "Carne para As Gig.", cantidad: 0.5 },      
      { nombre: "Champiñones", cantidad: 1, },      
    ],
  },
  
  //Continuarà...
};

export const recetas: (MenuDef | BebestibleDef)[] = [
  ...Object.values(BEBESTIBLES),
  ...Object.values(MENUS),
  ...Object.values(EMPANADAS),
];
