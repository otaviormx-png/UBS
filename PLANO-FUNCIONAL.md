# Plano para tornar o protótipo funcional

Este documento descreve o caminho para transformar a amostra da Busca Ativa da UBS Largo da Batalha em um sistema interno funcional para uso da equipe.

## Decisão de acesso

A primeira versão será pensada para rede interna, sem login individual obrigatório.

Mesmo sem login por usuário, o sistema deve ter uma trava simples para evitar abertura acidental por pessoas fora do fluxo de trabalho:

- Rodar apenas em computador ou servidor da rede interna.
- Permitir acesso somente pela rede local da UBS.
- Usar uma senha única de entrada para a equipe, se a gestão achar necessário.
- Evitar publicação em GitHub Pages quando houver dados reais.
- Guardar os dados reais em banco local ou servidor interno, nunca direto no navegador.

## O que falta para sair do protótipo

### 1. Persistência dos dados

Hoje os dados da tela são apenas demonstrativos. A versão funcional precisa salvar:

- pacientes;
- telefones e contatos com parentesco;
- rotas;
- endereços;
- motivo da busca ativa;
- data da VD;
- profissional responsável;
- status da visita;
- observações;
- histórico básico de alterações.

Opção inicial recomendada: banco SQLite em servidor interno.

### 2. Servidor interno

Criar uma aplicação pequena para rodar na rede interna.

Sugestão técnica:

- Backend: Node.js com Express.
- Banco: SQLite.
- Frontend: reaproveitar o HTML/CSS/JS atual.
- Hospedagem: computador/servidor interno da UBS.

### 3. Telas principais

Manter a ideia atual, mas transformar em telas funcionais:

- Mapa territorial.
- Planilha por rota.
- Cadastro de paciente.
- Cadastro de rota.
- Edição de paciente.
- Retirada de paciente da lista.
- Exportação de planilha por rota.
- Conferência de endereço.

### 4. Regras de rotina

O sistema deve permitir:

- cadastrar paciente conforme demanda recebida;
- definir ou criar rota;
- adicionar mais de um telefone;
- registrar nome e parentesco do contato;
- marcar VD como `Não`, `Tentativa`, `Sim` ou `Reagendar`;
- preencher data da VD;
- preencher profissional/equipe;
- filtrar por rota, prioridade, status e microárea;
- exportar planilha parecida com a lista impressa.

### 5. Mapa e área da UBS

Continuar usando a camada oficial de Niterói para a área da UBS.

Camada usada no protótipo:

```text
https://sig.niteroi.rj.gov.br/server/rest/services/Hosted/Area_UBS/FeatureServer/0/query?where=fid%3D10&outFields=tx_nomegen%2Ctx_cnes%2Ctx_regiona%2Ctx_lograd%2Ctx_num%2Ctx_bairro%2Ctx_telefon%2Ctx_email%2Ctx_poliref&returnGeometry=true&outSR=4326&geometryPrecision=5&f=geojson
```

Aplicativo público de referência:

```text
https://geoniteroi.maps.arcgis.com/apps/instant/lookup/index.html?appid=6b957c6c478f47a9a53e2471cf23e4d6
```

### 6. Exportação

A exportação deve ficar parecida com a planilha manual:

- título da UBS;
- blocos por rota;
- pacientes abaixo de cada rota;
- telefones em linhas separadas dentro da célula;
- data da VD;
- profissional;
- status da VD;
- observações.

Próxima melhoria: gerar `.xlsx` real em vez de `.xls` baseado em HTML.

## Primeira versão funcional sugerida

Escopo mínimo:

- servidor interno;
- banco SQLite;
- listar pacientes salvos no banco;
- cadastrar paciente;
- editar paciente;
- retirar paciente;
- cadastrar rota;
- exportar planilha por rota;
- verificar endereço no mapa.

Depois disso, a equipe já consegue testar o fluxo real sem depender da planilha manual.

## Cuidados práticos

Mesmo em rede interna, alguns cuidados evitam dor de cabeça:

- fazer backup do banco;
- não colocar dados reais no GitHub;
- não usar GitHub Pages para a versão real;
- manter o servidor em máquina conhecida da UBS;
- combinar quem pode exportar planilha;
- fechar o navegador ao terminar o uso.

## Próximo passo técnico

Criar a estrutura da aplicação:

```text
server/
  app.js
  database.js
  schema.sql
public/
  index.html
  busca-ativa-ubs.css
  busca-ativa-ubs.js
data/
  busca-ativa.sqlite
```

Com isso, o protótipo deixa de ser apenas uma tela e passa a salvar dados de verdade.

## Status atual

Primeira base funcional iniciada:

- servidor interno Node criado;
- banco local SQLite criado em `data/busca-ativa.sqlite`;
- API para listar rotas e pacientes;
- API para cadastrar rota;
- API para cadastrar paciente;
- API para editar paciente;
- API para marcar VD;
- API para retirar paciente da lista;
- tela pública em `public/` conectada ao servidor.
- geocodificação do endereço no cadastro/edição;
- impressão da lista filtrada e de rota específica;
- reinício da base demo pela interface;
- scripts para iniciar com dois cliques e registrar inicialização no Windows.
