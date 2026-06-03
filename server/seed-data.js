const routes = [
  {code:"Rota 01", name:"João Fonseca"},
  {code:"Rota 02", name:"Camilo Pereira"},
  {code:"Rota 03", name:"Rede Economia / região próxima"},
  {code:"Rota 04", name:"Barra Mansa"},
  {code:"Rota 05", name:"Reta / Alburquerque"},
  {code:"Rota 06", name:"Pacheco de Carvalho"},
  {code:"Rota 07", name:"Horto / Handa Hayasa"},
  {code:"Fora?", name:"Conferir território"}
];

const patients = [
  {route:"Rota 01",name:"Maria de Souza",birth:"22/11/1937",age:88,doc:"713.160.357-00",contacts:["(21) 99911-0001 (Rosa - filha)","(21) 98888-0001 (vizinha)"],address:"Rua João Fonseca, 76",area:"01",reason:"VD / coleta",visit:"VD: coleta sanguínea",visitDate:"04/06/2026",professional:"Enf. Kelly / ACS Rosa",visitDone:"Não",priority:"Alta",status:"Pendente",last:"28/05/2026",lat:-22.9040,lng:-43.0360},
  {route:"Rota 02",name:"João dos Santos",birth:"03/10/1969",age:56,doc:"032.286.357-64",contacts:["(21) 99911-0002 (próprio)"],address:"Rua Camilo Pereira, 03",area:"02",reason:"VD",visit:"Demanda antiga",visitDate:"05/06/2026",professional:"ACS Viviane",visitDone:"Tentativa",priority:"Média",status:"Contato realizado",last:"30/05/2026",lat:-22.9006,lng:-43.0328},
  {route:"Rota 03",name:"Ana Oliveira",birth:"28/01/1941",age:85,doc:"378.890.467-00",contacts:["(21) 99911-0003 (Marin - filha)","(21) 98888-0003 (neto)"],address:"Comunidade Reunida, 26",area:"01",reason:"Coleta de material",visit:"Coleta de material",visitDate:"03/06/2026",professional:"Tec. enfermagem + ACS",visitDone:"Sim",priority:"Alta",status:"Visita agendada",last:"01/06/2026",lat:-22.9056,lng:-43.0388},
  {route:"Rota 04",name:"Carlos Pereira",birth:"15/06/1956",age:69,doc:"037.247.597-38",contacts:["(21) 99911-0004 (esposa)","(21) 98247-9885"],address:"Rua Camilo Pereira, 111",area:"03",reason:"VD 04/01",visit:"Alta hospitalar",visitDate:"06/06/2026",professional:"Enf. Patrícia",visitDone:"Reagendar",priority:"Alta",status:"Pendente",last:"22/05/2026",lat:-22.9078,lng:-43.0305},
  {route:"Rota 05",name:"Luciana Almeida",birth:"17/01/1913",age:82,doc:"111.178.267-91",contacts:["(21) 99911-0005","(21) 99971-0053 (familiar)"],address:"São Rafael, 70",area:"04",reason:"VD",visit:"Consulta 2019",visitDate:"03/06/2026",professional:"ACS Maria Luiza",visitDone:"Sim",priority:"Baixa",status:"Concluído",last:"31/05/2026",lat:-22.9112,lng:-43.0352},
  {route:"Rota 06",name:"Pedro Martins",birth:"18/04/1945",age:80,doc:"622.009.927-34",contacts:["(21) 99911-0006 (filha)"],address:"Rua Amadeu Gomes, 14",area:"03",reason:"HAS/DM",visit:"Consulta 2019",visitDate:"07/06/2026",professional:"ACS Quintino",visitDone:"Não",priority:"Média",status:"Pendente",last:"20/05/2026",lat:-22.9010,lng:-43.0255},
  {route:"Rota 07",name:"Renata Costa",birth:"18/04/1940",age:85,doc:"068.843.007-22",contacts:["(21) 99911-0007","(21) 98997-7295"],address:"Capim Melado, 34",area:"02",reason:"HAS / acamado",visit:"Sem registro recente",visitDate:"05/06/2026",professional:"ACS Kátia",visitDone:"Tentativa",priority:"Média",status:"Contato realizado",last:"29/05/2026",lat:-22.8969,lng:-43.0354},
  {route:"Fora?",name:"Antônio Ribeiro",birth:"12/06/1939",age:86,doc:"917.354.477-34",contacts:["(21) 99911-0008 (cuidadora)"],address:"Rua Prefeito Silvio Picanço, 50",area:"-",reason:"Conferir território",visit:"Assistência social acionada; endereço pode ser fora da UBS",visitDate:"A definir",professional:"Assistência social",visitDone:"Não",priority:"Baixa",status:"Verificar",last:"27/05/2026",lat:-22.9188,lng:-43.0825}
];

module.exports = { routes, patients };
