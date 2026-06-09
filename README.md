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
- Histórico de pacientes retirados da planilha, com data/hora da retirada.
- Exportação de planilha `.xls` organizada por rota.
- Impressão da lista filtrada ou de uma rota específica.
- Geocodificação do endereço para posicionar o paciente no mapa.
- Reinício da base fictícia de demonstração para treino/teste.

## Observação importante

Este protótipo usa dados fictícios para demonstração. Em uma versão real, pacientes, telefones e registros de atendimento devem ficar protegidos por login, controle de acesso e armazenamento autorizado pela gestão municipal.

## Fonte territorial

Camada oficial consultada:

```text
https://sig.niteroi.rj.gov.br/server/rest/services/Hosted/Area_UBS/FeatureServer/0/query?where=fid%3D10&outFields=tx_nomegen%2Ctx_cnes%2Ctx_regiona%2Ctx_lograd%2Ctx_num%2Ctx_bairro%2Ctx_telefon%2Ctx_email%2Ctx_poliref&returnGeometry=true&outSR=4326&geometryPrecision=5&f=geojson
```

Para conferir se um endereço pertence à UBS Largo da Batalha, o sistema usa o mesmo lookup do app oficial, consultando:

```text
https://sig.niteroi.rj.gov.br/server/rest/services/Hosted/Area_UBS/FeatureServer/0
https://sig.niteroi.rj.gov.br/server/rest/services/PTG_SMS/FESAUDE_A_ATENDIMENTO_PMF_SETOR_PUBLICO/FeatureServer/0
```

Ou seja: se o app oficial retornar PMF, fora da área, ou outra unidade, o sistema também considera como não pertencente à UBS Largo da Batalha.

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

No Windows, tambem pode dar dois cliques em:

```text
iniciar-busca-ativa.bat
```

Depois abra:

```text
http://localhost:3000
```

Em outro computador da mesma rede, use o IP do computador servidor:

```text
http://192.168.200.175:3000
```

Se outro computador da rede nao abrir, clique com o botao direito em `liberar-firewall-admin.bat` e escolha **Executar como administrador**.

## Iniciar junto com o Windows

Para deixar o sistema iniciar quando o Windows abrir, clique com o botao direito em:

```text
instalar-inicializacao-admin.bat
```

E escolha **Executar como administrador**.

Para desfazer:

```text
remover-inicializacao-admin.bat
```

O banco local fica em:

```text
data/busca-ativa.sqlite
```

Esse arquivo não deve ser enviado ao GitHub quando tiver dados reais.

## Backup do banco

Para criar uma copia manual do banco, execute:

```text
backup-banco.bat
```

Os backups ficam na pasta `backups/`, que tambem nao deve ser enviada ao GitHub.

## Recursos operacionais

Na tela principal:

- `Imprimir rota`: escolhe uma rota e abre a impressão só daquela lista.
- `Imprimir lista filtrada`: imprime o que estiver aparecendo na planilha.
- `Conferir endereço do cadastro`: busca o endereço do paciente novo e prepara o ponto no mapa antes de salvar.

Para zerar a base ficticia de treinamento, use fora da tela:

```text
resetar-base-demo.bat
```

Esse comando apaga a base atual e recria os pacientes ficticios de demonstracao. Use apenas em teste.
Ele tenta reiniciar pelo servidor aberto; se o servidor estiver fechado, reinicia direto no banco local e abre a pagina novamente.

## Evolução para sistema funcional

O plano para transformar este protótipo em um sistema interno com banco de dados está em [`PLANO-FUNCIONAL.md`](PLANO-FUNCIONAL.md).
