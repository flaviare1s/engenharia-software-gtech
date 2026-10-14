# Engenharia de Software — Geração Tech 4.0

Repositório com os exercícios práticos do curso de **Software Engineer** do **Geração Tech 4.0**.

## Exercícios

| Exercício | Tema | Pasta |
| --- | --- | --- |
| [Colocando a API de pé](#colocando-a-api-de-pé) | Docker e Docker Compose | [`docker-api/`](docker-api/) |
| [Fluxo completo em um repositório](#fluxo-completo-em-um-repositório) | Git, GitHub e Conventional Commits | [`docker-api/`](docker-api/) |
| [Modelar um carrinho](#modelar-um-carrinho) | Programação orientada a objetos em TypeScript | [`shopping-cart/`](shopping-cart/) |

---

### Colocando a API de pé

Atividade prática e individual para consolidar os conceitos de **Docker** e **Docker Compose**. Uma API de testes em Python (FastAPI) roda em container, integrada a um banco **PostgreSQL**.

#### Estrutura

```
docker-api/
├── main.py             # API FastAPI com os endpoints /health (consulta o PostgreSQL) e /version
├── requirements.txt    # Dependências Python com versões fixas
├── Dockerfile          # Imagem da API, executada com o usuário não-root appuser
├── .dockerignore       # Arquivos que ficam fora do contexto de build
└── docker-compose.yml  # Serviços app (API) e db (PostgreSQL) com healthchecks
```

#### Como rodar

Pré-requisito: [Docker Desktop](https://docs.docker.com/desktop/) instalado e em execução.

```bash
cd docker-api
docker compose up -d --build
```

As credenciais do banco têm valores padrão para desenvolvimento (`api`/`api`). Para trocar, crie um `.env` dentro de `docker-api/` com `POSTGRES_DB`, `POSTGRES_USER` e `POSTGRES_PASSWORD`.

#### Validação

| Comando | Retorno esperado |
| --- | --- |
| `docker compose up -d --build` | Serviços `app` e `db` ativos e saudáveis (`healthy`) |
| `curl -s http://localhost:8000/health` | `{"status":"ok"}` |
| `curl -s http://localhost:8000/version` | `"1.1.0"` |
| `docker compose exec app whoami` | `appuser` (usuário não-root) |

Se o banco estiver fora do ar, o `/health` responde `503` com `{"detail":"database unavailable"}`.

#### Decisões

- **Usuário não-root:** o `USER appuser` vem depois do `pip install`, que precisa de root, e antes do `CMD`. Assim a aplicação roda sem privilégios.
- **Cache de camadas:** o `requirements.txt` é copiado e instalado antes do `main.py`. Uma mudança no código não força reinstalar as dependências.
- **Healthchecks:** o `db` usa `pg_isready`, e o `app` só sobe depois que o banco fica saudável (`depends_on` com `condition: service_healthy`). O healthcheck do `app` chama o próprio `/health`, que executa um `SELECT 1` no banco.
- **Persistência:** os dados do PostgreSQL ficam no volume nomeado `db-data`.

#### Encerrando

```bash
docker compose down      # para e remove os containers
docker compose down -v   # também apaga o volume com os dados do banco
```

---

### Fluxo completo em um repositório

Exercício de **Git** e **GitHub**: o ciclo completo de uma mudança, da branch até a release, usando a API do exercício anterior.

#### Etapas

1. **Branch e commits:** a branch `feature/health-com-versao` adiciona o endpoint `GET /version`, que retorna a versão da API como string (`"1.1.0"`). Os commits seguem o [Conventional Commits](https://www.conventionalcommits.org/pt-br/), e o corpo de cada um explica o motivo da mudança, não só o que mudou.
2. **Pull Request:** a branch é publicada no GitHub e integrada à `main` por uma Pull Request com título e descrição.
3. **Conflito simulado:** um segundo clone altera na `main` a mesma linha que a branch mudou (`app = FastAPI(...)`). Ao trazer a `main` para a branch com `git merge`, o conflito é resolvido mantendo as duas mudanças: o título novo e a versão.
4. **Tag:** depois do merge da PR, a `main` recebe a tag anotada `v1.1.0`.

#### Validação

| Comando | Saída esperada |
| --- | --- |
| `git log --oneline -3` (na branch) | Três commits começando com `feat:`, `fix:`, `docs:` ou `refactor:` |
| `git tag` | `v1.1.0` |
| `git show v1.1.0 --stat` | Commit de merge da PR na `main` |
| `git status` (após o merge) | `nothing to commit, working tree clean` |

---

### Modelar um carrinho

Exercício de **programação orientada a objetos**: um carrinho de compras em **TypeScript** que aplica encapsulamento, abstração, polimorfismo e herança.

#### Regras

- Um item tem nome, preço unitário e quantidade. A quantidade precisa ser inteira e positiva.
- O carrinho não aceita novos itens depois de finalizado.
- Um cupom de desconto é um contrato com o método `apply(total: number): number`. Há dois cupons: percentual e de valor fixo.
- O total nunca é negativo.

Seguindo o padrão de nomes em inglês, `aplicar()` virou `apply()`, `total()` virou `calculateTotal()` e `finalizar()` virou `finalize()`.

#### Estrutura

```
shopping-cart/
├── src/
│   ├── cart.ts                 # Carrinho: guarda os itens e o cupom, calcula o total
│   ├── cart-item.ts            # Item com validação de quantidade e preço
│   ├── cart-errors.ts          # InvalidQuantityError e FinalizedCartError
│   ├── discount-coupon.ts      # Contrato (interface) DiscountCoupon
│   ├── percentage-coupon.ts    # Cupom percentual
│   └── fixed-amount-coupon.ts  # Cupom de valor fixo
├── test/
│   └── cart.test.ts            # Casos de teste do exercício e de encapsulamento
├── package.json
└── tsconfig.json
```

#### Como rodar

Pré-requisito: Node.js 23.6 ou mais recente, que executa TypeScript sem compilação.

```bash
cd shopping-cart
npm install
npm test            # roda os testes com o test runner nativo do Node
npm run typecheck   # checa os tipos com o tsc
```

#### Casos de teste

| Entrada | Ação | Saída esperada |
| --- | --- | --- |
| Item "Livro", preço 50, quantidade 2 | `calculateTotal()` | `100` |
| Mesmo carrinho com cupom de 10% | `calculateTotal()` após aplicar | `90` |
| Item com quantidade 0 | `addItem()` | `InvalidQuantityError` |
| Adicionar item após `finalize()` | `addItem()` | `FinalizedCartError` |
| Cupom de valor fixo de 150 sobre total de 100 | `calculateTotal()` | `0` |

#### Decisões

- **Encapsulamento:** os campos usam `#`, que é privado também em tempo de execução, e não só para o compilador. O `getItems()` devolve uma cópia da lista, e os itens não têm setters. A única forma de mudar o carrinho é pelos métodos dele.
- **Abstração e polimorfismo:** o carrinho só conhece a interface `DiscountCoupon` e chama `coupon.apply(subtotal)`, sem saber qual cupom recebeu. Um cupom novo não exige mudar o `Cart`.
- **Total nunca negativo:** o limite em zero fica no `Cart`, e não em cada cupom. Assim nenhuma implementação de cupom consegue quebrar essa regra.
- **Herança:** `InvalidQuantityError` estende `RangeError` e `FinalizedCartError` estende `Error`. Os testes verificam o tipo exato de cada erro.
- **Carrinho finalizado:** além de novos itens, o carrinho finalizado também recusa cupons, porque o total de uma compra fechada não deve mudar.
