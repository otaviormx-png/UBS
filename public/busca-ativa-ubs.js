let routes = [
      {code:"Rota 01", name:"João Fonseca"},
      {code:"Rota 02", name:"Camilo Pereira"},
      {code:"Rota 03", name:"Rede Economia / região próxima"},
      {code:"Rota 04", name:"Barra Mansa"},
      {code:"Rota 05", name:"Reta / Alburquerque"},
      {code:"Rota 06", name:"Pacheco de Carvalho"},
      {code:"Rota 07", name:"Horto / Handa Hayasa"},
      {code:"Fora?", name:"Conferir território"}
    ];
    let patients = [
      {id:1,route:"Rota 01",name:"Maria de Souza",birth:"22/11/1937",age:88,doc:"713.160.357-00",contacts:["(21) 99911-0001 (Rosa - filha)","(21) 98888-0001 (vizinha)"],address:"Rua João Fonseca, 76",area:"01",reason:"VD / coleta",visit:"VD: coleta sanguínea",visitDate:"04/06/2026",professional:"Enf. Kelly / ACS Rosa",visitDone:"Não",priority:"Alta",status:"Pendente",last:"28/05/2026",lat:-22.9040,lng:-43.0360},
      {id:2,route:"Rota 02",name:"João dos Santos",birth:"03/10/1969",age:56,doc:"032.286.357-64",contacts:["(21) 99911-0002 (próprio)"],address:"Rua Camilo Pereira, 03",area:"02",reason:"VD",visit:"Demanda antiga",visitDate:"05/06/2026",professional:"ACS Viviane",visitDone:"Tentativa",priority:"Média",status:"Contato realizado",last:"30/05/2026",lat:-22.9006,lng:-43.0328},
      {id:3,route:"Rota 03",name:"Ana Oliveira",birth:"28/01/1941",age:85,doc:"378.890.467-00",contacts:["(21) 99911-0003 (Marin - filha)","(21) 98888-0003 (neto)"],address:"Comunidade Reunida, 26",area:"01",reason:"Coleta de material",visit:"Coleta de material",visitDate:"03/06/2026",professional:"Tec. enfermagem + ACS",visitDone:"Sim",priority:"Alta",status:"Visita agendada",last:"01/06/2026",lat:-22.9056,lng:-43.0388},
      {id:4,route:"Rota 04",name:"Carlos Pereira",birth:"15/06/1956",age:69,doc:"037.247.597-38",contacts:["(21) 99911-0004 (esposa)","(21) 98247-9885"],address:"Rua Camilo Pereira, 111",area:"03",reason:"VD 04/01",visit:"Alta hospitalar",visitDate:"06/06/2026",professional:"Enf. Patrícia",visitDone:"Reagendar",priority:"Alta",status:"Pendente",last:"22/05/2026",lat:-22.9078,lng:-43.0305},
      {id:5,route:"Rota 05",name:"Luciana Almeida",birth:"17/01/1913",age:82,doc:"111.178.267-91",contacts:["(21) 99911-0005","(21) 99971-0053 (familiar)"],address:"São Rafael, 70",area:"04",reason:"VD",visit:"Consulta 2019",visitDate:"03/06/2026",professional:"ACS Maria Luiza",visitDone:"Sim",priority:"Baixa",status:"Concluído",last:"31/05/2026",lat:-22.9112,lng:-43.0352},
      {id:6,route:"Rota 06",name:"Pedro Martins",birth:"18/04/1945",age:80,doc:"622.009.927-34",contacts:["(21) 99911-0006 (filha)"],address:"Rua Amadeu Gomes, 14",area:"03",reason:"HAS/DM",visit:"Consulta 2019",visitDate:"07/06/2026",professional:"ACS Quintino",visitDone:"Não",priority:"Média",status:"Pendente",last:"20/05/2026",lat:-22.9010,lng:-43.0255},
      {id:7,route:"Rota 07",name:"Renata Costa",birth:"18/04/1940",age:85,doc:"068.843.007-22",contacts:["(21) 99911-0007","(21) 98997-7295"],address:"Capim Melado, 34",area:"02",reason:"HAS / acamado",visit:"Sem registro recente",visitDate:"05/06/2026",professional:"ACS Kátia",visitDone:"Tentativa",priority:"Média",status:"Contato realizado",last:"29/05/2026",lat:-22.8969,lng:-43.0354},
      {id:8,route:"Fora?",name:"Antônio Ribeiro",birth:"12/06/1939",age:86,doc:"917.354.477-34",contacts:["(21) 99911-0008 (cuidadora)"],address:"Rua Prefeito Silvio Picanço, 50",area:"-",reason:"Conferir território",visit:"Assistência social acionada; endereço pode ser fora da UBS",visitDate:"A definir",professional:"Assistência social",visitDone:"Não",priority:"Baixa",status:"Verificar",last:"27/05/2026",lat:-22.9188,lng:-43.0825}
    ];
    const expandedRoutes = new Set(["Rota 01"]);
    const map = L.map("map", {zoomControl:true}).setView([-22.9045,-43.0345], 14);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {maxZoom:19, attribution:"&copy; OpenStreetMap"}).addTo(map);
    const officialTerritoryUrl = "https://sig.niteroi.rj.gov.br/server/rest/services/Hosted/Area_UBS/FeatureServer/0/query?where=fid%3D10&outFields=tx_nomegen%2Ctx_cnes%2Ctx_regiona%2Ctx_lograd%2Ctx_num%2Ctx_bairro%2Ctx_telefon%2Ctx_email%2Ctx_poliref&returnGeometry=true&outSR=4326&geometryPrecision=5&f=geojson";
    const officialLookupLayers = [
      {
        type:"UBS",
        title:"Setor de Atendimento (UBS)",
        url:"https://sig.niteroi.rj.gov.br/server/rest/services/Hosted/Area_UBS/FeatureServer/0"
      },
      {
        type:"PMF",
        title:"Setor de Atendimento (PMF)",
        url:"https://sig.niteroi.rj.gov.br/server/rest/services/PTG_SMS/FESAUDE_A_ATENDIMENTO_PMF_SETOR_PUBLICO/FeatureServer/0"
      }
    ];
    const ubsReferencePoint = [-43.06729615695398, -22.907409581097973];
    const polyclinicReferencePoint = [-43.067258039055, -22.907730984924];
    let territoryLayer;
    let territoryGeoJSON = null;
    let checkMarker = null;
    const officialLookupCache = new Map();
    fetch(officialTerritoryUrl)
      .then(response => response.json())
      .then(data => {
        territoryGeoJSON = data;
        territoryLayer = L.geoJSON(data, {
          style: {color:"#59666a",weight:2,fillColor:"#8d9698",fillOpacity:.42}
        }).addTo(map);
        territoryLayer.bindPopup("<b>Área oficial de atendimento</b><br><b>UBS Largo da Batalha</b><br><small>CNES 4064208 | Regional Pendotiba<br>Rua Vereador Armando Ferreira, 30<br>Telefone: (21) 96955-5788<br>Policlínica Regional do Largo da Batalha</small>");
        map.fitBounds(territoryLayer.getBounds(), {padding:[18,18]});
        render();
      })
      .catch(() => {
        document.querySelector(".map-note").innerHTML="<b>Área oficial indisponível</b><br>Não foi possível consultar temporariamente a camada pública da Prefeitura.";
      });
    const unitIcon = L.divIcon({html:'<div class="unit-icon">+</div>',className:"",iconSize:[34,34],iconAnchor:[17,17]});
    L.marker([-22.907409581097973,-43.06729615695398],{icon:unitIcon}).addTo(map).bindPopup("<b>UBS Largo da Batalha</b><br>Unidade Básica de Saúde<br><small>Ponto oficial da camada pública de UBS<br>Rua Vereador Armando Ferreira, 30</small>");
    const polyclinicIcon = L.divIcon({html:'<div class="poly-icon">P</div>',className:"",iconSize:[36,38],iconAnchor:[18,30]});
    L.marker([-22.907730984924,-43.067258039055],{icon:polyclinicIcon}).addTo(map).bindPopup("<b>Policlínica Regional do Largo da Batalha</b><br>Referência da UBS<br><small>Rua Reverendo Armando Ferreira, 30<br>CNES 0012734 | Telefone: (21) 2710-1053</small>");
    const markers = {};
    const icon = p => L.divIcon({html:`<div class="case-dot ${p.priority==="Alta"?"alta":p.priority==="Média"?"media":"baixa"}">${p.area}</div>`,className:"",iconSize:[26,26],iconAnchor:[13,13]});
    let apiAvailable = false;
    let selectedId = null;
    let lastNewAddressPoint = null;
    let lastNewAddressLookup = null;
    let lastNewAddressValue = "";
    async function loadState(){
      try {
        const state = await apiRequest("/api/state");
        routes = state.routes;
        patients = state.patients;
        apiAvailable = true;
        document.querySelector(".demo-banner").innerHTML = "<b>SISTEMA INTERNO:</b> alterações salvas no banco local deste servidor.";
      } catch {
        apiAvailable = false;
        document.querySelector(".demo-banner").innerHTML = "<b>MODO DEMONSTRAÇÃO:</b> abra pelo servidor interno para salvar no banco local.";
      }
      render();
      refreshOfficialAreaForPatients();
    }
    async function apiRequest(path, options={}){
      const response = await fetch(path, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {})
        }
      });
      const data = await response.json().catch(() => ({}));
      if(!response.ok) throw new Error(data.error || "Falha ao comunicar com o servidor.");
      return data;
    }
    function filteredPatients(){
      const term=document.getElementById("search").value.toLowerCase();
      return patients.filter(p=>(!term||`${p.route} ${p.name} ${p.address} ${p.reason} ${p.visit} ${contactsText(p)}`.toLowerCase().includes(term))&&(!priorityFilter.value||p.priority===priorityFilter.value)&&(!statusFilter.value||p.status===statusFilter.value)&&(!areaFilter.value||p.area===areaFilter.value));
    }
    function render(){
      syncMarkers();
      const list=filteredPatients();
      patientRows.innerHTML=groupedRows(list);
      resultCount.textContent=`${list.length} de ${patients.length} pacientes exibidos`;
      Object.values(markers).forEach(m=>m.remove());
      list.forEach(p=>markers[p.id].addTo(map));
      totalMetric.textContent=patients.length;
      highMetric.textContent=patients.filter(p=>p.priority==="Alta").length;
      scheduledMetric.textContent=patients.filter(p=>p.status==="Visita agendada").length;
      doneMetric.textContent=patients.filter(p=>p.status==="Concluído").length;
      pendingMetric.textContent=patients.filter(p=>["Pendente","Verificar"].includes(p.status)||["Não","Tentativa","Reagendar"].includes(p.visitDone)).length;
      outsideMetric.textContent=patients.filter(p=>areaText(p)==="Não").length;
      renderRoutes();
    }
    async function refreshOfficialAreaForPatients(){
      if(!patients.length) return;
      await Promise.all(patients.map(async p => {
        const key = pointKey([p.lng,p.lat]);
        if(officialLookupCache.has(key)){
          p.officialLookup = officialLookupCache.get(key);
          return;
        }
        try {
          const result = await lookupOfficialSite([p.lng,p.lat]);
          officialLookupCache.set(key, result);
          p.officialLookup = result;
        } catch {
          p.officialLookup = null;
        }
      }));
      render();
    }
    function syncMarkers(){
      const activeIds = new Set(patients.map(p => String(p.id)));
      Object.keys(markers).forEach(id => {
        if(!activeIds.has(id)){
          markers[id].remove();
          delete markers[id];
        }
      });
      patients.forEach(p => {
        const popup = `<b>${p.name}</b><br>${p.reason}<br><small>${p.address} | Microárea ${p.area}</small>`;
        if(!markers[p.id]){
          markers[p.id]=L.marker([p.lat,p.lng],{icon:icon(p)}).bindPopup(popup);
          markers[p.id].on("click",()=>selectPatient(p.id,false));
        } else {
          markers[p.id].setLatLng([p.lat,p.lng]);
          markers[p.id].setIcon(icon(p));
          markers[p.id].bindPopup(popup);
        }
      });
    }
    function groupedRows(list){
      const routeOrder = routes.map(route => route.code);
      const ordered = [...list].sort((a,b) => {
        const ai = routeOrder.indexOf(a.route), bi = routeOrder.indexOf(b.route);
        return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi) || a.name.localeCompare(b.name);
      });
      let currentRoute = null;
      const forceExpanded = search.value.trim().length > 0;
      return ordered.map(p => {
        const routeChanged = p.route !== currentRoute;
        const header = routeChanged ? routeHeaderRow(p.route, ordered.filter(item => item.route === p.route).length) : "";
        currentRoute = p.route;
        if(!forceExpanded && !expandedRoutes.has(p.route)) return header;
        return `${header}<tr class="${selectedId===p.id?"active":""}" onclick="selectPatient(${p.id},true)"><td><b>${p.name}</b><br><small>${p.route}</small></td><td>${p.birth}<br><small>${p.age} anos</small></td><td>${p.doc}</td><td>${p.address}</td><td>${areaPill(p)}</td><td>${contactsHtml(p)}</td><td>${p.visitDate}</td><td>${p.professional}</td><td>${visitDoneSelect(p)}</td><td>${p.visit}</td></tr>`;
      }).join("");
    }
    function routeHeaderRow(routeCode,count){
      const route = routes.find(item => item.code === routeCode);
      const label = route ? `${route.code} (${route.name})` : routeCode;
      const expanded = expandedRoutes.has(routeCode);
      return `<tr class="route-row"><td colspan="10"><button class="route-toggle" type="button" aria-expanded="${expanded}" data-route="${escapeAttr(routeCode)}"><span><span class="chevron">›</span>${label}</span><small>${count} paciente${count === 1 ? "" : "s"}</small></button></td></tr>`;
    }
    async function removePatient(id){
      const patient = patients.find(p=>p.id===id);
      if(!patient) return;
      if(!confirm(`Retirar ${patient.name} da lista de busca ativa?`)) return;
      if(apiAvailable) await apiRequest(`/api/patients/${id}`, { method:"DELETE" });
      const index = patients.findIndex(p=>p.id===id);
      patients.splice(index,1);
      if(markers[id]){ markers[id].remove(); delete markers[id]; }
      selectedId = null;
      selectedHint.textContent = "Paciente retirado da lista. Selecione outro atendimento.";
      detailGrid.innerHTML = "";
      render();
    }
    function resetFilters(){ search.value="";priorityFilter.value="";statusFilter.value="";areaFilter.value="";render(); territoryLayer ? map.fitBounds(territoryLayer.getBounds(), {padding:[18,18]}) : map.setView([-22.9045,-43.0345],14); }
    function toggleRoute(routeCode){
      if(expandedRoutes.has(routeCode)) expandedRoutes.delete(routeCode);
      else expandedRoutes.add(routeCode);
      render();
    }
    function renderRoutes(){
      if(!window.newRoute) return;
      const selected = newRoute.value;
      newRoute.innerHTML = routes.map(route => `<option value="${route.code}">${route.code} - ${route.name}</option>`).join("");
      if([...newRoute.options].some(option => option.value === selected)) newRoute.value = selected;
      if(window.printRouteSelect){
        const printSelected = printRouteSelect.value;
        printRouteSelect.innerHTML = `<option value="">Todas as rotas filtradas</option>${routes.map(route => `<option value="${route.code}">${route.code} - ${route.name}</option>`).join("")}`;
        if([...printRouteSelect.options].some(option => option.value === printSelected)) printRouteSelect.value = printSelected;
      }
      routeNote.textContent = `Rotas cadastradas: ${routes.map(route => route.code).join(", ")}.`;
    }
    async function addRoute(){
      const code = newRouteCode.value.trim();
      const name = newRouteName.value.trim();
      if(!code || !name){ routeNote.textContent = "Preencha o número/nome da rota e a descrição."; return; }
      if(routes.some(route => route.code.toLowerCase() === code.toLowerCase())){
        routeNote.textContent = "Essa rota já existe. Use outro nome ou número.";
        return;
      }
      const route = apiAvailable ? await apiRequest("/api/routes", { method:"POST", body:JSON.stringify({code,name}) }) : {code,name};
      routes.push(route);
      newRouteCode.value = "";
      newRouteName.value = "";
      routeNote.textContent = `${code} cadastrada.`;
      renderRoutes();
      newRoute.value = code;
    }
    function exportCSV(){
      const list = filteredPatients();
      const routeOrder = routes.map(route => route.code);
      const ordered = [...list].sort((a,b) => {
        const ai = routeOrder.indexOf(a.route), bi = routeOrder.indexOf(b.route);
        return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi) || a.name.localeCompare(b.name);
      });
      const rowsByRoute = ordered.reduce((groups, patient) => {
        if(!groups[patient.route]) groups[patient.route] = [];
        groups[patient.route].push(patient);
        return groups;
      }, {});
      const columns = ["Nº","Nome","DN / Idade","CNS/CPF","Endereço","Área UBS?","Telefone(s)","Data VD","Profissional","VD feita?","Observações / motivo"];
      const routeBlocks = Object.entries(rowsByRoute).map(([routeCode, items]) => {
        const route = routes.find(item => item.code === routeCode);
        const label = route ? `${route.code} (${route.name})` : routeCode;
        const body = items.map((p,index) => `
          <tr>
            <td>${index + 1}</td>
            <td><b>${escapeHtml(p.name)}</b></td>
            <td>${escapeHtml(p.birth)}<br>${escapeHtml(p.age)} anos</td>
            <td>${escapeHtml(p.doc)}</td>
            <td>${escapeHtml(p.address)}</td>
            <td>${escapeHtml(areaText(p))}</td>
            <td>${escapeHtml(contactsText(p)).replaceAll(" / ","<br>")}</td>
            <td>${escapeHtml(p.visitDate)}</td>
            <td>${escapeHtml(p.professional)}</td>
            <td>${escapeHtml(p.visitDone)}</td>
            <td>${escapeHtml(`${p.reason} | ${p.visit} | Status: ${p.status}`)}</td>
          </tr>`).join("");
        return `
          <tr class="route-title"><td colspan="${columns.length}">${escapeHtml(label).toUpperCase()}</td></tr>
          <tr class="header">${columns.map(column => `<th>${escapeHtml(column)}</th>`).join("")}</tr>
          ${body}
          <tr class="blank"><td colspan="${columns.length}"></td></tr>`;
      }).join("");
      const html = `<!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; font-size: 11px; }
            h1 { font-size: 18px; margin: 0 0 4px; text-align: center; }
            .subtitle { margin: 0 0 12px; text-align: center; font-size: 12px; }
            th, td { border: 1px solid #777; padding: 6px; vertical-align: top; }
            th { background: #e5e5e5; font-weight: 700; text-align: center; }
            .route-title td { background: #d9ead3; font-size: 16px; font-weight: 700; text-align: center; }
            .blank td { height: 14px; border-left: 0; border-right: 0; }
          </style>
        </head>
        <body>
          <h1>BUSCA ATIVA - UBS LARGO DA BATALHA</h1>
          <p class="subtitle">Planilha interna por rota | exportado em ${new Date().toLocaleDateString("pt-BR")}</p>
          <table>${routeBlocks || `<tr><td>Nenhum paciente encontrado nos filtros atuais.</td></tr>`}</table>
        </body>
        </html>`;
      const blob=new Blob(["\ufeff"+html],{type:"application/vnd.ms-excel;charset=utf-8"});
      const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="busca-ativa-ubs-largo-da-batalha-por-rotas.xls";a.click();URL.revokeObjectURL(a.href);
    }
    function areaText(p){
      if(!p.officialLookup) return "Aguardando site";
      return p.officialLookup.isLargoDaBatalha ? "Sim" : "Não";
    }
    function contactsText(p){ return (p.contacts || []).join(" / ") || "Não informado"; }
    function contactsHtml(p){ return `<ul class="phone-list">${(p.contacts || ["Não informado"]).map(item=>`<li>${item}</li>`).join("")}</ul>`; }
    function visitDoneSelect(p){
      return `<select class="visit-select" aria-label="VD feita" onchange="event.stopPropagation(); updateVisitDone(${p.id},this.value)"><option ${p.visitDone==="Não"?"selected":""}>Não</option><option ${p.visitDone==="Tentativa"?"selected":""}>Tentativa</option><option ${p.visitDone==="Sim"?"selected":""}>Sim</option><option ${p.visitDone==="Reagendar"?"selected":""}>Reagendar</option></select>`;
    }
    function areaPill(p){
      if(!p.officialLookup) return '<span class="pill pending">Aguardando site</span>';
      const inside = p.officialLookup.isLargoDaBatalha;
      const title = p.officialLookup.matches.length ? officialLookupLabel(p.officialLookup) : "Sem resultado no Aqui tem Saúde";
      return `<span class="pill ${inside ? "inside" : "outside"}" title="${escapeAttr(title)}">${inside ? "Sim" : "Não"}</span>`;
    }
    function normalizeText(value){
      return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    }
    function distanceMeters(a,b){
      const toRad = value => value * Math.PI / 180;
      const [lng1,lat1] = a;
      const [lng2,lat2] = b;
      const dLat = toRad(lat2 - lat1);
      const dLng = toRad(lng2 - lng1);
      const s1 = Math.sin(dLat / 2);
      const s2 = Math.sin(dLng / 2);
      const h = s1 * s1 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * s2 * s2;
      return 6371000 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
    }
    function pointInTerritory(point){
      if(!territoryGeoJSON?.features?.length) return false;
      return territoryGeoJSON.features.some(feature => geometryContainsPoint(feature.geometry, point));
    }
    function geometryContainsPoint(geometry, point){
      if(!geometry) return false;
      if(geometry.type === "Polygon") return pointInRing(point, geometry.coordinates[0]);
      if(geometry.type === "MultiPolygon") return geometry.coordinates.some(poly => pointInRing(point, poly[0]));
      return false;
    }
    function pointInRing(point, ring){
      const [x,y]=point; let inside=false;
      for(let i=0,j=ring.length-1;i<ring.length;j=i++){
        const xi=ring[i][0], yi=ring[i][1], xj=ring[j][0], yj=ring[j][1];
        const intersect=((yi>y)!==(yj>y)) && (x < (xj-xi)*(y-yi)/(yj-yi)+xi);
        if(intersect) inside=!inside;
      }
      return inside;
    }
    function pointKey(point){
      return `${Number(point[0]).toFixed(6)},${Number(point[1]).toFixed(6)}`;
    }
    async function lookupOfficialSite(point){
      const results = await Promise.all(officialLookupLayers.map(async layer => {
        const params = new URLSearchParams({
          f:"json",
          geometry:`${point[0]},${point[1]}`,
          geometryType:"esriGeometryPoint",
          inSR:"4326",
          spatialRel:"esriSpatialRelIntersects",
          outFields:"*",
          returnGeometry:"false"
        });
        const response = await fetch(`${layer.url}/query?${params.toString()}`);
        const data = await response.json();
        return (data.features || []).map(feature => ({
          layer: layer.type,
          title: layer.title,
          attributes: feature.attributes || {}
        }));
      }));
      const matches = results.flat();
      return {
        matches,
        isLargoDaBatalha: matches.some(match => match.layer === "UBS" && isLargoDaBatalhaFeature(match.attributes))
      };
    }
    function isLargoDaBatalhaFeature(attributes){
      const text = normalizeText(`${attributes.tx_nomegen || ""} ${attributes.tx_nome || ""} ${attributes.tx_cnes || ""}`);
      return text.includes("ubs largo da batalha") || text.includes("largo da batalha") && text.includes("4064208");
    }
    function officialLookupLabel(lookup){
      if(!lookup?.matches?.length) return "Sem resultado no Aqui tem Saúde";
      return lookup.matches.map(match => {
        const a = match.attributes;
        const name = a.tx_nomegen || a.tx_nome || a.tx_nomequip || "Sem nome";
        const setor = a.tx_setor ? ` | Setor ${a.tx_setor}` : "";
        return `${match.layer}: ${name}${setor}`;
      }).join(" / ");
    }
    async function geocodeAddress(value){
      const query = encodeURIComponent(`${value}, Niterói, RJ, Brasil`);
      const response = await fetch(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=${query}&f=json&outFields=*&maxLocations=1&countryCode=BRA`);
      const data = await response.json();
      const candidate = data.candidates && data.candidates[0];
      if(!candidate) throw new Error("Endereço não localizado. Confira rua, número e bairro.");
      const point = [candidate.location.x, candidate.location.y];
      const officialLookup = await lookupOfficialSite(point);
      return { candidate, point, officialLookup, accepted: officialLookup.isLargoDaBatalha };
    }
    function showAddressResult(result, target){
      const { candidate, point, officialLookup, accepted } = result;
      const officialLabel = officialLookupLabel(officialLookup);
      const statusText = accepted ? "UBS Largo da Batalha pelo Aqui tem Saúde" : "Não é UBS Largo da Batalha pelo Aqui tem Saúde";
      const resultText = accepted ? "Sim, o Aqui tem Saúde retorna UBS Largo da Batalha." : "Não, o Aqui tem Saúde não retorna UBS Largo da Batalha para este ponto.";
      if(checkMarker) checkMarker.remove();
      checkMarker = L.marker([point[1], point[0]]).addTo(map).bindPopup(`<b>Endereço consultado</b><br>${candidate.address}<br><b>${statusText}</b>`);
      map.setView([point[1], point[0]], 16);
      checkMarker.openPopup();
      target.innerHTML = `<b>${resultText}</b><br><small>${candidate.address}</small><br><br><b>Resultado oficial:</b><br><small>${escapeHtml(officialLabel)}</small>`;
    }
    async function checkAddress(){
      const value = addressCheck.value.trim();
      if(!value){ checkResult.textContent = "Digite um endereço para verificar."; return; }
      checkResult.textContent = "Consultando endereço...";
      try {
        showAddressResult(await geocodeAddress(value), checkResult);
      } catch (error) {
        checkResult.textContent = error.message || "Não foi possível consultar o endereço agora.";
      }
    }
    async function geocodeNewAddress(){
      const value = newAddress.value.trim();
      if(!value){ intakeNote.textContent = "Preencha o endereço antes de conferir."; return; }
      intakeNote.textContent = "Conferindo endereço no mapa...";
      try {
        const result = await geocodeAddress(value);
        lastNewAddressPoint = result.point;
        lastNewAddressLookup = result.officialLookup;
        lastNewAddressValue = value;
        showAddressResult(result, checkResult);
        intakeNote.textContent = result.accepted ? "Endereço conferido e ponto preparado para salvar no paciente." : "Endereço localizado, mas ficou fora da área oficial. O ponto será salvo mesmo assim para conferência.";
      } catch (error) {
        lastNewAddressPoint = null;
        lastNewAddressLookup = null;
        lastNewAddressValue = "";
        intakeNote.textContent = error.message || "Não foi possível conferir o endereço agora.";
      }
    }
    async function addManualCase(){
      const name = newName.value.trim();
      const address = newAddress.value.trim();
      if(!name || !address){
        intakeNote.textContent = "Preencha pelo menos nome e endereço para adicionar o caso.";
        return;
      }
      if(lastNewAddressValue !== address){
        lastNewAddressPoint = null;
        lastNewAddressLookup = null;
        lastNewAddressValue = "";
      }
      let addressLookupResult = lastNewAddressLookup ? { point:lastNewAddressPoint, officialLookup:lastNewAddressLookup } : null;
      if(!lastNewAddressPoint){
        try {
          addressLookupResult = await geocodeAddress(address);
          lastNewAddressPoint = addressLookupResult.point;
          showAddressResult(addressLookupResult, checkResult);
        } catch {
          lastNewAddressPoint = null;
        }
      }
      const id = patients.length ? Math.max(...patients.map(p => p.id)) + 1 : 1;
      const newCase = {
        id,
        route:newRoute.value,
        name,
        birth:newBirth.value.trim() || "Não informado",
        age:"-",
        doc:newDoc.value.trim() || "Não informado",
        contacts:parseContacts(newPhones.value),
        address,
        area:"-",
        reason:newProblem.value.trim() || "Busca ativa",
        visit:newAssist.value.trim() || "Assistência social / observação pendente",
        visitDate:newVisitDate.value.trim() || "A definir",
        professional:newProfessional.value.trim() || "A definir",
        priority:newPriority.value,
        visitDone:newVisitDone.value,
        status:newVisitDone.value === "Sim" ? "Concluído" : "Pendente",
        last:new Date().toLocaleDateString("pt-BR"),
        lat:lastNewAddressPoint ? lastNewAddressPoint[1] : -22.9045,
        lng:lastNewAddressPoint ? lastNewAddressPoint[0] : -43.0345
      };
      const savedCase = apiAvailable ? await apiRequest("/api/patients", { method:"POST", body:JSON.stringify(newCase) }) : newCase;
      if(addressLookupResult) savedCase.officialLookup = addressLookupResult.officialLookup;
      patients.push(savedCase);
      [newName,newBirth,newDoc,newPhones,newAddress,newVisitDate,newProfessional,newProblem,newAssist].forEach(field => field.value = "");
      lastNewAddressPoint = null;
      lastNewAddressLookup = null;
      lastNewAddressValue = "";
      intakeNote.textContent = apiAvailable ? "Caso salvo no banco local. Use a conferência de endereço para validar a área da UBS." : "Caso adicionado nesta tela. Abra pelo servidor para salvar no banco.";
      selectedId = savedCase.id;
      render();
      selectPatient(savedCase.id,false);
    }
    function parseContacts(value){
      const contacts = value.split(/\n|;/).map(item => item.trim()).filter(Boolean);
      return contacts.length ? contacts : ["Não informado"];
    }
    // Editor com salvamento explícito: campos não alteram a planilha até clicar em salvar.
    function selectPatient(id,openPopup){
      const p=patients.find(item=>item.id===id);
      selectedId=id;
      expandedRoutes.add(p.route);
      render();
      map.setView([p.lat,p.lng],16);
      if(openPopup) markers[id].openPopup();
      selectedHint.innerHTML=`<b>${p.name}</b> | ${p.route} | ${p.reason}`;
      detailGrid.innerHTML=patientEditor(p);
    }
    function patientEditor(p){
      return `
        <div><span>Nome</span><input id="editName" value="${escapeAttr(p.name)}"></div>
        <div><span>Data de nascimento</span><input id="editBirth" value="${escapeAttr(p.birth)}"></div>
        <div><span>CNS/CPF</span><input id="editDoc" value="${escapeAttr(p.doc)}"></div>
        <div><span>Telefones</span><textarea id="editContacts" rows="3">${escapeHtml((p.contacts || []).join("\n"))}</textarea></div>
        <div><span>Endereço</span><input id="editAddress" value="${escapeAttr(p.address)}"></div>
        <div><span>Área UBS?</span><strong>${areaText(p)}</strong></div>
        <div><span>Data da VD</span><input id="editVisitDate" value="${escapeAttr(p.visitDate)}"></div>
        <div><span>Profissional/equipe</span><input id="editProfessional" value="${escapeAttr(p.professional)}"></div>
        <div><span>VD / Observação</span><textarea id="editVisit" rows="3">${escapeHtml(p.visit)}</textarea></div>
        <div><span>VD feita?</span><select id="editVisitDone">${selectOptions(["Não","Tentativa","Sim","Reagendar"],p.visitDone)}</select></div>
        <div><span>Status atual</span><select id="editStatus">${selectOptions(["Verificar","Pendente","Visita agendada","Contato realizado","Concluído"],p.status)}</select></div>
        <div><span>Ações</span><button class="button" onclick="saveSelectedChanges()">Salvar alterações</button> <button class="button danger" onclick="removePatient(${p.id})">Retirar da lista</button></div>`;
    }
    async function saveSelectedChanges(){
      if(!selectedId) return;
      const p=patients.find(item=>item.id===selectedId);
      const previousAddress = p.address;
      p.name=editName.value.trim();
      p.birth=editBirth.value.trim();
      p.doc=editDoc.value.trim();
      p.contacts=parseContacts(editContacts.value);
      p.address=editAddress.value.trim();
      if(p.address && p.address !== previousAddress){
        try {
          const result = await geocodeAddress(p.address);
          p.lng = result.point[0];
          p.lat = result.point[1];
          p.officialLookup = result.officialLookup;
          showAddressResult(result, checkResult);
        } catch {
          selectedHint.innerHTML=`<b>${p.name}</b> | endereço salvo, mas não foi possível atualizar o ponto no mapa`;
        }
      }
      p.visitDate=editVisitDate.value.trim();
      p.professional=editProfessional.value.trim();
      p.visit=editVisit.value.trim();
      p.visitDone=editVisitDone.value;
      p.status=editStatus.value;
      if(apiAvailable){
        const saved = await apiRequest(`/api/patients/${p.id}`, { method:"PUT", body:JSON.stringify(p) });
        Object.assign(p, saved);
      }
      selectedHint.innerHTML=`<b>${p.name}</b> | ${p.route} | alterações salvas`;
      render();
      detailGrid.innerHTML=patientEditor(p);
    }
    async function updateVisitDone(id,value){
      const p=patients.find(item=>item.id===id);
      if(!p) return;
      p.visitDone=value;
      if(apiAvailable){
        const saved = await apiRequest(`/api/patients/${id}/visit`, { method:"PATCH", body:JSON.stringify({visitDone:value}) });
        Object.assign(p, saved);
      }
      render();
      if(selectedId===id) detailGrid.innerHTML=patientEditor(p);
    }
    function printSelectedRoute(){
      const route = printRouteSelect.value;
      if(route){
        search.value = "";
        priorityFilter.value = "";
        statusFilter.value = "";
        areaFilter.value = "";
        expandedRoutes.clear();
        expandedRoutes.add(route);
      }
      render();
      window.print();
    }
    function printCurrentTable(){
      render();
      window.print();
    }
    async function resetDemoData(){
      if(!apiAvailable){
        alert("Abra pelo servidor interno para reiniciar a base demo.");
        return;
      }
      if(!confirm("Zerar a base atual e voltar para os dados fictícios de demonstração? Use isso só em teste/treinamento.")) return;
      const state = await apiRequest("/api/reset-demo", { method:"POST", body:"{}" });
      routes = state.routes;
      patients = state.patients;
      selectedId = null;
      detailGrid.innerHTML = "";
      selectedHint.textContent = "Base demo reiniciada. Selecione um paciente na planilha ou no mapa.";
      render();
    }
    function selectOptions(values,selected){
      return values.map(value=>`<option ${value===selected?"selected":""}>${value}</option>`).join("");
    }
    function escapeHtml(value){
      return String(value ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
    }
    function escapeAttr(value){
      return escapeHtml(value).replaceAll('"',"&quot;");
    }
    Object.assign(window, {
      addManualCase,
      addRoute,
      checkAddress,
      exportCSV,
      geocodeNewAddress,
      printCurrentTable,
      printSelectedRoute,
      removePatient,
      render,
      resetFilters,
      resetDemoData,
      saveSelectedChanges,
      selectPatient,
      toggleRoute,
      updateVisitDone
    });
    patientRows.addEventListener("click", event => {
      const button = event.target.closest(".route-toggle");
      if(!button) return;
      event.stopPropagation();
      toggleRoute(button.dataset.route);
    });
    loadState();
