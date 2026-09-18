import express from "express";
import cors from "cors";
import { produtos } from "./produtos.js";
import { categorias } from "./categorias.js";

const app = express();
const PORT = 3000;

app.use(express.json());

// O front React roda em http://localhost:8094 (origem diferente desta API,
// que responde em http://localhost:8093). Por isso liberamos essa origem no CORS.
app.use(cors({ origin: "http://localhost:8094" }));

// Log didático: deixe o terminal aberto e veja cada requisição do React chegar.
app.use((req, res, next) => {
  const inicio = Date.now();
  res.on("finish", () => {
    console.log(`[API] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${Date.now() - inicio}ms`);
  });
  next();
});

// GET /api/produtos — lista de produtos (a "listagem").
app.get("/api/produtos", (req, res) => {
  res.json(produtos);
});

// GET /api/produtos/:id — detalhe de um produto (ou 404).
app.get("/api/produtos/:id", (req, res) => {
  const id = Number(req.params.id);
  const produto = produtos.find((p) => p.id === id);

  if (!produto) {
    return res.status(404).json({ error: "Produto não encontrado" });
  }

  res.json(produto);
});

// GET /api/categorias — lista de categorias (a "listagem").
app.get("/api/categorias", (req, res) => {
  res.json(categorias);
});

// GET /api/categorias/:id — detalhe de uma categoria, incluindo os produtos
// que pertencem a ela (ou 404 se a categoria não existir).
app.get("/api/categorias/:id", (req, res) => {
  const id = Number(req.params.id);
  const categoria = categorias.find((c) => c.id === id);

  if (!categoria) {
    return res.status(404).json({ error: "Categoria não encontrada" });
  }

  const produtosDaCategoria = produtos.filter((p) => p.categoria === categoria.nome);

  res.json({
    ...categoria,
    produtos: produtosDaCategoria,
  });
});

app.listen(PORT, () => {
  console.log(`API da Loja rodando na porta ${PORT}`);
  console.log(`Ex.: http://localhost:8093/api/produtos`);
});
