# ENGWEB2026 — Exame de Época Normal

## Exercício 1 — Jogos de Tabuleiro (API de dados)

### Persistência de dados

A informação é persistida numa base de dados MongoDB com os seguintes parâmetros:
- **Database:** `jogostabuleiro`
- **Collection:** `jogos`

Cada documento representa um jogo de tabuleiro com os campos: `id`, `name`, `year`, `category`, `minPlayers`, `maxPlayers`, `playingTimeMinutes`, `descriptionEN`, e arrays embutidos de `autores`, `editoras`, `mecanicas` e `premios`. O campo `_id` de cada documento é o slug do jogo (ex: `"catan"`), derivado do campo `id` do dataset original.

Optou-se por uma única coleção com subdocumentos embutidos (em vez de coleções separadas para autores, editoras, etc.) porque todas as queries e rotas pedidas operam sobre os jogos como unidade principal. As distribuições por autor e editora são obtidas via `$unwind` + `$group` em aggregations sobre a coleção `jogos`.

### Setup da base de dados

O dataset original (`jogos.json`) foi processado pelo script `parse_dataset.py`, que adiciona o campo `_id` a cada documento, produzindo o ficheiro `jogos_import.json` pronto para importação.

Para importar manualmente (com `mongoimport` instalado):
```bash
cd ex1
mongoimport --db jogostabuleiro --collection jogos --type json --file jogos_import.json --jsonArray
```

Quando a aplicação corre via Docker, o seed é feito automaticamente: ao arrancar, o servidor verifica se a coleção está vazia e, se sim, insere os documentos do `jogos_import.json` directamente via Mongoose.

### Queries MongoDB

As queries completas encontram-se no ficheiro `ex1/queries.txt`. Respostas obtidas sobre o dataset:

**1. Quantos jogos estão registados na base de dados?**
```js
db.jogos.countDocuments()
// Resultado: 27
```

**2. Quantos jogos pertencem à categoria "Family"?**
```js
db.jogos.countDocuments({ category: "Family" })
// Resultado: 8
```

**3. Lista de autores (ordenada alfabeticamente e sem repetições):**
```js
db.jogos.aggregate([
  { $unwind: "$autores" },
  { $group: { _id: "$autores.id", name: { $first: "$autores.name" } } },
  { $sort: { name: 1 } },
  { $project: { _id: 0, id: "$_id", name: 1 } }
]).toArray()
// Resultado: 27 autores únicos ordenados alfabeticamente
```

**4. Distribuição de jogos por ano de lançamento:**
```js
db.jogos.aggregate([
  { $group: { _id: "$year", total: { $sum: 1 } } },
  { $sort: { _id: 1 } },
  { $project: { _id: 0, year: "$_id", total: 1 } }
]).toArray()
// Resultado: contagem de jogos por cada ano presente no dataset
```

**5. Distribuição de jogos por editora:**
```js
db.jogos.aggregate([
  { $unwind: "$editoras" },
  { $group: { _id: "$editoras.id", editora: { $first: "$editoras.name" }, total: { $sum: 1 } } },
  { $sort: { editora: 1 } },
  { $project: { _id: 0, editora: 1, total: 1 } }
]).toArray()
// Resultado: 24 editoras únicas com contagem de jogos de cada uma
```

### Instruções de execução

**Com Docker (recomendado):**
```bash
cd ex1
docker-compose up --build
```
- API disponível em: http://localhost:17000
- Swagger UI disponível em: http://localhost:17000/api-docs

**Sem Docker (desenvolvimento local):**
```bash
cd ex1
npm install
node server.js
```
Mas requer que o MongoDB esteja a correr localmente em `mongodb://localhost:27017`.

### Rotas disponíveis

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/jogos` | Lista todos os jogos (id, name, year, category, minPlayers) |
| GET | `/jogos/:id` | Todos os campos do jogo com o id indicado |
| GET | `/jogos?editora=EEEE` | Jogos publicados pela editora EEEE (por nome ou id) |
| GET | `/autores` | Lista de autores ordenada alfabeticamente, com jogos de cada um |
| GET | `/categorias` | Lista de categorias ordenada alfabeticamente, com jogos de cada uma |
| POST | `/jogos` | Adiciona um novo jogo |
| PUT | `/jogos/:id` | Atualiza o jogo com o id indicado |
| DELETE | `/jogos/:id` | Elimina o jogo com o id indicado |

---

## Exercício 2 — A Minha Lista de Leituras

### Persistência de dados

A informação é persistida numa base de dados MongoDB com os seguintes parâmetros:
- **Database:** `leituras`
- **Collection:** `livros`

O modelo de dados foi derivado a partir da análise do `index.html` fornecido. Cada documento tem os campos: `titulo`, `autor`, `paginas`, `genero` (todos obrigatórios) e `lido` (booleano, `false` por omissão). O campo `_id` é gerado automaticamente pelo MongoDB (ObjectId), pois é esse valor que o frontend usa nas operações de PUT e DELETE.

### Setup da base de dados

O dataset inicial encontra-se em `ex2/data/dataset.json` com 7 livros de exemplo e o seed é feito automaticamente ao arrancar, porque se a coleção `livros` estiver vazia, os documentos são inseridos via Mongoose.

O servidor MongoDB **não está exposto ao exterior** e é apenas acessível internamente pela rede Docker `leituras-network`, conforme pedido no enunciado.

### Instruções de execução

**Com Docker (recomendado):**
```bash
cd ex2
docker-compose up --build
```
- Interface (Vue.js via Nginx): http://localhost:19021
- API de dados: http://localhost:19020/api/livros

**Sem Docker (desenvolvimento local):**
```bash
cd ex2
npm install
node server.js
```
Requer MongoDB a correr localmente em `mongodb://localhost:27017`.

### Rotas da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/livros` | Lista todos os livros |
| GET | `/api/livros?search=X` | Filtra por título ou autor (e é case-insensitive) |
| POST | `/api/livros` | Adiciona um novo livro (titulo, autor, paginas, genero) |
| PUT | `/api/livros/:id` | Altera o estado `lido` do livro |
| DELETE | `/api/livros/:id` | Remove o livro |
