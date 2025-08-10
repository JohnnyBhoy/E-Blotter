type Station = {
  name: string;
  contact: string;
};

type Agency = {
  type: number; // 1 = PNP, 2 = FIRE, etc.
  stations: Station[];
};

export const agencies: Agency[] = [
  {
    type: 1,
    stations: [
      { name: "Tobias Fornier MPS", contact: "0910 641 3330" },
      { name: "San Remigio MPS", contact: "0930 241 0726" },
      { name: "Laua-an MPS", contact: "0926 116 0449" },
      { name: "Culasi MPS", contact: "(036) 277 8066" },
      { name: "Pandan MPS", contact: "(036) 278 9066" },
      { name: "Valderrama MPS", contact: "0927 936 6327" },
      { name: "Caluya MPS", contact: "0919 931 1460" },
      { name: "Anini-y MPS", contact: "0921 290 4820" },
      { name: "Libertad MPS", contact: "(036) 278 1506" },
      { name: "Patnongon MPS", contact: "0917 717 9529" },
      { name: "Tibiao MPS", contact: "0905 250 4091" },
      { name: "Antique Provincial Police Office", contact: "0908 377 0118" },
      { name: "Barbaza Police Station", contact: "N/A" },
      { name: "Belison Police Station", contact: "N/A" },
      { name: "Sebaste Police Station", contact: "N/A" },
      { name: "Sibalom Police Station", contact: "N/A" },
      { name: "San Jose de Buenavista Police Station", contact: "N/A" }
    ]
  },
  {
    type: 2,
    stations: [
      { name: "San Jose Fire Station", contact: "(036) 540 9794" },
      { name: "Sibalom Fire Station", contact: "(036) 543 8493" },
      { name: "Hamtic Fire Station", contact: "(036) 543 8743" },
      { name: "Tobias Fornier Fire Station", contact: "N/A" },
      { name: "Patnongon Fire Station", contact: "N/A" },
      { name: "Pandan Fire Station", contact: "N/A" },
      { name: "Culasi Fire Station", contact: "N/A" },
      { name: "Antique Provincial Fire Office (BFP)", contact: "N/A" }
    ]
  },
  {
    type: 3,
    stations: [
      { name: "Antique Provincial Hospital (San Jose)", contact: "(036) 540 7194" },
      { name: "Angel Salazar Memorial General Hospital", contact: "(036) 540 7214" },
      { name: "Medicare Community Hospital (Sibalom)", contact: "(036) 543 8202" },
      { name: "Caluya Municipal Hospital", contact: "N/A" },
      { name: "Valderrama Rural Health Unit", contact: "N/A" },
      { name: "Belison Municipal Health Office", contact: "N/A" },
      { name: "Antique Provincial Health Office", contact: "(036) 540 9871" }
    ]
  },
  {
    type: 4,
    stations: [
      { name: "Antique PDRRMO", contact: "(036) 540 8763" },
      { name: "San Jose MDRRMO", contact: "N/A" },
      { name: "Sibalom MDRRMO", contact: "N/A" },
      { name: "Pandan MDRRMO", contact: "N/A" },
      { name: "Caluya MDRRMO", contact: "N/A" }
    ]
  }
];
