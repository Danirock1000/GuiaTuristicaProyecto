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
];

// Centro de San Pedro Sula
export const SPS_REGION = {
  latitude: 15.5049,
  longitude: -88.0269,
  latitudeDelta: 0.015,
  longitudeDelta: 0.015,
};
