import type { LegalCitizen } from "@/interfaces/dtos/LegalCitizen";

export const mockedLegalCitizens: LegalCitizen[] = [
  {
    id: "citizen-1",
    name: "Pablo Silva",
    address: "Rua das Acácias, 142",
    neighborhood: "Nova Esperança",
    registrationDate: "2026-01-01T12:00:00.000Z",
    points: 180,
  },
  {
    id: "citizen-2",
    name: "Maria Clara Souza",
    address: "Avenida Central, 820",
    neighborhood: "Jardim Primavera",
    registrationDate: "2026-01-08T12:00:00.000Z",
    points: 160,
  },
  {
    id: "citizen-3",
    name: "José Antônio da Silva",
    address: "Rua Francisco Melo, 51",
    neighborhood: "Vila Aurora",
    registrationDate: "2026-01-12T12:00:00.000Z",
    points: 120,
  },
  {
    id: "citizen-4",
    name: "André Luiz Pereira",
    address: "Praça da Matriz, 12",
    neighborhood: "Centro",
    registrationDate: "2026-01-19T12:00:00.000Z",
    points: 110,
  },
  {
    id: "citizen-5",
    name: "Helena Aparecida Rocha",
    address: "Rua das Rosas, 204",
    neighborhood: "Parque dos Girassóis",
    registrationDate: "2026-01-22T12:00:00.000Z",
    points: 100,
  },
  {
    id: "citizen-13",
    name: "Roberto Nunes Costa",
    address: "Rua dos Eucaliptos, 90",
    neighborhood: "Jardim Brasil",
    registrationDate: "2026-01-28T12:00:00.000Z",
    points: 95,
  },
  {
    id: "citizen-14",
    name: "Paula Cristina Martins",
    address: "Rua Bahia, 405",
    neighborhood: "Santa Tereza",
    registrationDate: "2026-01-30T12:00:00.000Z",
    points: 92,
  },
  {
    id: "citizen-6",
    name: "Paula Cristina Martins",
    address: "Rua do Comércio, 331",
    neighborhood: "Residencial do Lago",
    registrationDate: "2026-02-02T12:00:00.000Z",
    points: 90,
  },
  {
    id: "citizen-7",
    name: "João Pedro Almeida",
    address: "Avenida das Palmeiras, 76",
    neighborhood: "Bela Vista",
    registrationDate: "2026-02-05T12:00:00.000Z",
    points: 80,
  },
  {
    id: "citizen-8",
    name: "Ana Beatriz Cardoso",
    address: "Rua Minas Gerais, 1023",
    neighborhood: "Santa Mônica",
    registrationDate: "2026-02-11T12:00:00.000Z",
    points: 70,
  },
  {
    id: "citizen-9",
    name: "Carlos Eduardo Mendes",
    address: "Rua Tupinambás, 412",
    neighborhood: "Centro",
    registrationDate: "2026-02-19T12:00:00.000Z",
    points: 60,
  },
  {
    id: "citizen-10",
    name: "Fernanda Silva Lopes",
    address: "Avenida Brasil, 2210",
    neighborhood: "Jardim Atlântico",
    registrationDate: "2026-02-23T12:00:00.000Z",
    points: 50,
  },
  {
    id: "citizen-11",
    name: "Lucas Oliveira",
    address: "Rua das Flores, 89",
    neighborhood: "Vila Nova",
    registrationDate: "2026-03-02T12:00:00.000Z",
    points: 40,
  },
  {
    id: "citizen-12",
    name: "Mariana Santos",
    address: "Rua dos Ipês, 305",
    neighborhood: "Boa Vista",
    registrationDate: "2026-03-09T12:00:00.000Z",
    points: 30,
  },
];

export const getTopLegalCitizens = (limit: number) =>
  [...mockedLegalCitizens]
    .sort((left, right) => right.points - left.points)
    .slice(0, limit);

export const getCitizenById = (id: string) =>
  mockedLegalCitizens.find((citizen) => citizen.id === id);
