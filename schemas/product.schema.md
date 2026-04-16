# Schema do Markdown de Produto

Este documento define quais campos do arquivo `.md` de produto são usados pelo agente Developer para gerar o HTML da página de produto.

> Os arquivos `.md` de produto são gerados pelo Otimizador de Produtos com base na Ficha Técnica e Rótulo oficial de cada produto. Apenas as seções abaixo são lidas pelo agente — o restante do markdown (classificação, SEO, kits, promoções etc.) é ignorado na geração do HTML.

---

## Taxonomia e Path de Saída

Cada produto possui 4 campos de taxonomia obrigatórios no cabeçalho do markdown. O MAESTRO os usa para derivar o path de saída dos arquivos gerados.

| Campo no Markdown | Exemplo | Slug gerado |
|---|---|---|
| `Marca::` | `ELASTMENT` | `elastment` |
| `Linha::` | `Reparos` | `reparos` |
| `Produto::` | `SOS Umidade` | `sos-umidade` |
| `Variante::` | `Inject Gel` | `inject-gel` |

**Regra de slug:** minúsculas, espaços substituídos por hífens, caracteres especiais removidos.

**Path de saída:**
```
products/{marca-slug}/{linha-slug}/{produto-slug}/{variante-slug}/
```

**Exemplo completo:**
```
products/elastment/reparos/sos-umidade/inject-gel/
├── product.md    ← input: dados do produto
├── index.html    ← output: HTML gerado pelo Developer
└── log.md        ← rastreabilidade das iterações
```

Esta estrutura espelha diretamente a URL do produto no site:
`/todas-as-marcas/elastment/reparos/sos-umidade/inject-gel/`

---

## Mapeamento: Markdown → HTML Template

### Seção 1.0 — DADOS DO PRODUTO
**Destino no template:** bloco `.product-desc-details` (card "Dados do Produto")

Cada subitem da seção 1.0 gera um `.product-desc-row` com `meta-label` e `meta-value`:

| Campo no Markdown | Label exibida no HTML |
|---|---|
| `1.1) COR/TEXTURA:` | `COR/TEXTURA:` |
| `1.2) COMPOSIÇÃO:` | `COMPOSIÇÃO:` |
| `1.3) CONSUMO:` | `CONSUMO:` |
| `1.4) TEMPO DE CURA:` | `TEMPO DE CURA:` |
| `1.5) RENDIMENTO:` | `RENDIMENTO:` |

- Todos os campos de 1.1 a 1.5 são **obrigatórios**
- Se um campo não existir no markdown, a row correspondente é omitida (não deixar em branco)
- Campos adicionais (1.6, 1.7...) que existirem no markdown devem ser incluídos na ordem em que aparecem
- A nota de rodapé `*Rendimento pode variar...` é texto fixo do template — sempre inclusa

---

### Seção 2.0 — DESTAQUE DO PRODUTO
**Destino no template:** bloco `.product-desc-highlights` (card "Destaques do Produto")

| Campo no Markdown | Elemento HTML |
|---|---|
| `2.1)` (primeiro parágrafo descritivo) | `<p>` dentro de `.product-desc-highlights` |
| `2.2) BENEFÍCIO-CHAVE 01:` | `<li>` com ícone `check_circle` em `.product-desc-feature-list` |
| `2.3) BENEFÍCIO-CHAVE 02:` | `<li>` com ícone `check_circle` em `.product-desc-feature-list` |
| `2.4) BENEFÍCIO-CHAVE 03:` | `<li>` com ícone `check_circle` em `.product-desc-feature-list` |
| `2.5) BENEFÍCIO-CHAVE 04:` | `<li>` com ícone `check_circle` em `.product-desc-feature-list` |

- O campo `2.1` é **obrigatório** — é o texto de introdução do card de destaques
- São esperados no mínimo **2 benefícios-chave** (2.2 e 2.3); demais são opcionais
- Benefícios adicionais (2.6, 2.7...) são incluídos se existirem
- O texto do `<li>` é apenas o valor após `BENEFÍCIO-CHAVE 0X:`, sem o label
- Cada `<li>` deve ter a estrutura: `<span class="material-symbols-outlined product-desc-feature-icon" aria-hidden="true">check_circle</span> Texto do benefício`

---

### Seção 3.0 — PERGUNTAS FREQUENTES
**Destino no template:** bloco `.product-desc-faq` (card "Perguntas Frequentes")

Cada subitem 3.X gera um par `<details>/<summary>`:

| Campo no Markdown | Elemento HTML |
|---|---|
| `3.X) PERGUNTA FREQUENTE XX:` (texto da pergunta) | Texto do `<summary>` em MAIÚSCULAS + ícone `keyboard_arrow_down` |
| Bloco `>` logo abaixo da pergunta (resposta em blockquote) | `.faq-answer` dentro de `<details>` |

- São esperadas no mínimo **3 perguntas**
- Todas as perguntas presentes no markdown devem ser incluídas
- O texto do `<summary>` deve ser em **MAIÚSCULAS** (conforme padrão do template)
- A resposta é o conteúdo do blockquote (`>`) imediatamente abaixo da pergunta
- Cada `<summary>` deve ter a estrutura: `TEXTO DA PERGUNTA? <span class="material-symbols-outlined accordion-icon" aria-hidden="true">keyboard_arrow_down</span>`
- O ícone de accordion rota 180° via CSS quando `details[open]` — sem JavaScript

---

## Campos Ignorados pelo Developer

As seções abaixo existem no markdown de produto mas **não** são usadas na geração do HTML:

- `0.0` — Breve Descrição (usada na meta description, não no HTML)
- `4.0` — Classificação de Produto
- `5.0` — Tipo de Vitrine
- `6.0` — SEO da Categoria
- `7.0` — Ferramentas Necessárias
- `8.0` — Sugestão de Compre Junto
- `9.0` — Variantes (SEO)
- `10.0` — Copy Criativa
- `11.0` — Sugestão de Kits
- `12.0` — Sugestão de Ofertas/Promoção
- Metadados do topo (Drive, Rótulo, Marca, URLs)

---

## Estrutura HTML Gerada

O Developer produz **apenas o bloco de conteúdo HTML** — sem `<html>`, `<head>`, `<body>` ou `<script>`.

O CSS é embutido via `<style>` interno no `.product-desc-page`. O `<style>` inclui obrigatoriamente:
1. Comentário de source apontando para o CSS no repositório GitHub
2. `@import` do Google Material Symbols Outlined (primeira regra CSS)
3. CSS completo copiado do template, incluindo `.material-symbols-outlined` com `text-transform: none`

**Sistema de ícones (Google Material Symbols Outlined):**
| Localização | Ícone | Classe do span |
|---|---|---|
| Cada `<li>` de benefício | `check_circle` | `.product-desc-feature-icon` |
| Header do bloco FAQ | `help` | `.faq-icon` |
| Cada `<summary>` do accordion | `keyboard_arrow_down` | `.accordion-icon` |

Todos os `<span>` de ícone levam `aria-hidden="true"` — são decorativos.

Estrutura de saída:

```
<div class="product-desc-page">
  <style>
    /* Source: ... */
    @import url('https://fonts.googleapis.com/...');
    .material-symbols-outlined { text-transform: none; ... }
    /* restante do CSS */
  </style>
  <div class="product-desc-card">
    <div class="product-desc-grid">
      <div class="product-desc-details">    ← Seção 1.0 (rows de dados)
      <div class="product-desc-highlights"> ← Seção 2.0 (intro + lista com check_circle)
    </div>
    <div class="product-desc-faq">          ← Seção 3.0 (help header + accordion keyboard_arrow_down)
  </div>
</div>
```
