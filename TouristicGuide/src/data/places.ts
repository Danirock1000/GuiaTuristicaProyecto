export type Place = {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  horario: string;
  latitud: number;
  longitud: number;
  emoji: string;
};

export const PLACES: Place[] = [
  {
    id: 1,
    nombre: "Museo de Antropología e Historia",
    descripcion:
      "Uno de los museos más importantes de Honduras. Exhibe piezas arqueológicas de la civilización maya, arte colonial y artefactos históricos que cuentan la rica historia del Valle de Sula.",
    categoria: "Museo",
    horario: "Mar - Dom: 9:00 AM - 4:00 PM",
    latitud: 15.5049,
    longitud: -88.0254,
    emoji: "🏛️",
  },
  {
    id: 2,
    nombre: "Parque Central",
    descripcion:
      "El corazón de San Pedro Sula. Un espacio público rodeado de arquitectura histórica, la Catedral San Pedro Apóstol y la Municipalidad. Ideal para pasear y conocer la vida local.",
    categoria: "Parque",
    horario: "Abierto 24 horas",
    latitud: 15.5042,
    longitud: -88.0251,
    emoji: "🌳",
  },
  {
    id: 3,
    nombre: "Mercado Guamilito",
    descripcion:
      "El mercado de artesanías más famoso de San Pedro Sula. Aquí encontrarás souvenirs, cerámica Lenca, café hondureño, puros y productos típicos a precios accesibles.",
    categoria: "Mercado",
    horario: "Lun - Sáb: 7:00 AM - 5:00 PM",
    latitud: 15.5078,
    longitud: -88.0289,
    emoji: "🛍️",
  },
  {
    id: 4,
    nombre: "Catedral San Pedro Apóstol",
    descripcion:
      "La iglesia principal de la ciudad, ubicada frente al Parque Central. Su arquitectura colonial y sus vitrales la convierten en un punto de referencia obligatorio.",
    categoria: "Iglesia",
    horario: "Lun - Dom: 6:00 AM - 7:00 PM",
    latitud: 15.5038,
    longitud: -88.0256,
    emoji: "⛪",
  },
  {
    id: 5,
    nombre: "Parque Naciones Unidas",
    descripcion:
      "Amplio parque recreativo con zoológico, áreas verdes, juegos infantiles y espacios para hacer deporte. Muy popular entre familias sampedranas los fines de semana.",
    categoria: "Parque",
    horario: "Mar - Dom: 8:00 AM - 5:00 PM",
    latitud: 15.4965,
    longitud: -88.0201,
    emoji: "🦁",
  },
  {
    id: 6,
    nombre: "Mall Multiplaza",
    descripcion:
      "Uno de los centros comerciales más grandes de Honduras. Cuenta con tiendas internacionales, cines, restaurantes y una gran variedad de entretenimiento para toda la familia.",
    categoria: "Centro Comercial",
    horario: "Lun - Dom: 10:00 AM - 9:00 PM",
    latitud: 15.4889,
    longitud: -88.0412,
    emoji: "🛒",
  },
  {
    id: 7,
    nombre: "Estadio Olímpico Metropolitano",
    descripcion:
      "El estadio de fútbol más importante de Honduras. Sede de los partidos de la selección nacional y del Marathón. Capacidad para más de 35,000 espectadores.",
    categoria: "Deportes",
    horario: "Según evento",
    latitud: 15.5112,
    longitud: -88.0198,
    emoji: "⚽",
  },
  {
    id: 8,
    nombre: "Lago de Sula",
    descripcion:
      "Hermoso lago natural en las afueras de la ciudad. Ideal para pesca deportiva, paseos en lancha y disfrutar del paisaje natural del Valle de Sula con su fauna y flora típica.",
    categoria: "Naturaleza",
    horario: "Abierto 24 horas",
    latitud: 15.5320,
    longitud: -87.9980,
    emoji: "🏞️",
  },
  {
    id: 9,
    nombre: "Copantl Hotel & Convention Center",
    descripcion:
      "El hotel más emblemático de San Pedro Sula. Con piscinas, restaurantes, casino y salas de convenciones. Punto de referencia para eventos empresariales y turismo de alto nivel.",
    categoria: "Hotel",
    horario: "Abierto 24 horas",
    latitud: 15.5021,
    longitud: -88.0348,
    emoji: "🏨",
  },
  {
    id: 10,
    nombre: "Terminal Metropolitana de Buses",
    descripcion:
      "Principal terminal de transporte terrestre de la ciudad. Conecta San Pedro Sula con el resto de Honduras y con países de Centroamérica. Punto de partida para viajeros.",
    categoria: "Transporte",
    horario: "Abierto 24 horas",
    latitud: 15.4978,
    longitud: -88.0289,
    emoji: "🚌",
  },
];

// Centro de San Pedro Sula
export const SPS_REGION = {
  latitude: 15.5049,
  longitude: -88.0269,
  latitudeDelta: 0.015,
  longitudeDelta: 0.015,
};
