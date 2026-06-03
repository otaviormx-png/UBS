# Busca Ativa UBS Largo da Batalha

Protótipo de sistema interno para acompanhamento de busca ativa da UBS Largo da Batalha, com mapa territorial, cadastro de rotas, planilha interativa de pacientes e exportação em formato de planilha.

## Recursos

- Mapa com território oficial da UBS em cinza.
- Marcadores de pacientes, UBS e policlínica de referência.
- Conferência de endereço próximo ao mapa.
- Planilha agrupada por rota em formato sanfonado.
- Cadastro manual de rotas e casos.
- Edição de paciente com botão explícito de salvar.
- Remoção de paciente da lista.
- Exportação de planilha `.xls` organizada por rota.

## Observação importante

Este protótipo usa dados fictícios para demonstração. Em uma versão real, pacientes, telefones e registros de atendimento devem ficar protegidos por login, controle de acesso e armazenamento autorizado pela gestão municipal.

## Fonte territorial

Camada oficial consultada:

```text
https://sig.niteroi.rj.gov.br/server/rest/services/Hosted/Area_UBS/FeatureServer/0/query?where=fid%3D10&outFields=tx_nomegen%2Ctx_cnes%2Ctx_regiona%2Ctx_lograd%2Ctx_num%2Ctx_bairro%2Ctx_telefon%2Ctx_email%2Ctx_poliref&returnGeometry=true&outSR=4326&geometryPrecision=5&f=geojson
```

Aplicativo público de referência:

```text
https://geoniteroi.maps.arcgis.com/apps/instant/lookup/index.html?appid=6b957c6c478f47a9a53e2471cf23e4d6
```

## Como abrir

Abra o arquivo `index.html` no navegador ou publique a pasta em um servidor interno/GitHub Pages.

## Como rodar a versão funcional

Esta versão já possui um servidor interno com banco local.

Requisitos:

- Node.js 24 ou superior.

Para iniciar:

```bash
npm start
```

Depois abra:

```text
http://localhost:3000
```

Em outro computador da mesma rede, use o IP do computador servidor:

```text
http://IP-DO-SERVIDOR:3000
```

O banco local fica em:

```text
data/busca-ativa.sqlite
```

Esse arquivo não deve ser enviado ao GitHub quando tiver dados reais.

## Evolução para sistema funcional

O plano para transformar este protótipo em um sistema interno com banco de dados está em [`PLANO-FUNCIONAL.md`](PLANO-FUNCIONAL.md).
