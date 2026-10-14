# Engenharia de Software — Geração Tech 4.0

Repositório com os exercícios práticos do curso de **Software Engineer** do **Geração Tech 4.0**.

## Exercícios

| Exercício | Tema | Pasta |
| --- | --- | --- |
| [Colocando a API de pé](#colocando-a-api-de-pé) | Docker e Docker Compose | [`docker-api/`](docker-api/) |

---

### Colocando a API de pé

Atividade prática e individual para consolidar os conceitos de **Docker** e **Docker Compose**. Uma API de testes em Python (FastAPI) roda em container, integrada a um banco **PostgreSQL**.

#### Estrutura

```
docker-api/
├── main.py             # API FastAPI com o endpoint /health, que consulta o PostgreSQL
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
