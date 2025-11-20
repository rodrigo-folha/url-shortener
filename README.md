# URL Shortener

[![Java](https://img.shields.io/badge/Java-21+-red?logo=java\&style=flat-square)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-brightgreen?logo=spring\&style=flat-square)](https://spring.io/projects/spring-boot)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Relational-blue?logo=postgresql\&style=flat-square)
![JPA / Hibernate](https://img.shields.io/badge/JPA%20/%20Hibernate-ORM-orange?style=flat-square)
![MapStruct](https://img.shields.io/badge/MapStruct-1.6.3-9cf?style=flat-square)
![Swagger / OpenAPI](https://img.shields.io/badge/Swagger-OpenAPI-green?logo=swagger\&style=flat-square)

![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black?logo=nextdotjs\&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-Frontend-blue?logo=typescript\&style=flat-square)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Styling-38bdf8?logo=tailwindcss\&style=flat-square)

---

## 📦 Descrição

**url-shortener** é uma aplicação **full stack** para encurtamento de URLs, composta por:

* 🖥 **Backend** em **Java 21 + Spring Boot 3.5.6**, responsável por:

  * gerar códigos curtos aleatórios ou personalizados;
  * registrar cada acesso à URL encurtada;
  * expor estatísticas de uso;
  * gerenciar atualização e remoção de links.
* 🌐 **Frontend** em **Next.js 16 (App Router) + TypeScript + Tailwind CSS**, responsável por:

  * interface para criação das URLs encurtadas;
  * dashboard com listagem paginada, edição, exclusão e visualização de estatísticas;
  * rota de redirecionamento (`/{short}`) que consome o backend e envia o usuário para a URL original.

---

## 🧠 Tecnologias e Frameworks

| Camada          | Ferramenta / Biblioteca         | Propósito                                            |
| --------------- | ------------------------------- | ---------------------------------------------------- |
| ☕ **Backend**   | **Java 21**                     | Linguagem base                                       |
|                 | **Spring Boot 3.5.6**           | Criação da API REST e infraestrutura                 |
|                 | **Spring Web / Validation**     | Controllers REST e validação de entrada              |
|                 | **Spring Data JPA / Hibernate** | Acesso ao PostgreSQL via ORM                         |
|                 | **PostgreSQL**                  | Banco de dados relacional                            |
|                 | **MapStruct 1.6.3**             | Mapeamento entre entidades e DTOs                    |
|                 | **Lombok**                      | Redução de boilerplate (getters, constructors, etc.) |
|                 | **Swagger / OpenAPI**           | Documentação interativa da API                       |
| 🌐 **Frontend** | **Next.js 16.0.3 (App Router)** | Framework React full stack                           |
|                 | **TypeScript**                  | Tipagem estática no frontend                         |
|                 | **Tailwind CSS**                | Estilização rápida e responsiva                      |
|                 | **Fetch API**                   | Comunicação com a API do backend                     |

---

## 📁 Estrutura do Projeto

```bash
url-shortener/
├── url-shortener/                 # Backend - Spring Boot
│   ├── src/main/java/br/com/rodrigofolha/urlshortener/...
│   ├── src/main/resources/
│   ├── pom.xml
│   └── ...
├── url-shortener-frontend/        # Frontend - Next.js 16 (App Router)
│   ├── app/
│   │   ├── page.tsx              # Tela principal (criar URL encurtada)
│   │   ├── dashboard/page.tsx    # Dashboard de URLs
│   │   └── s/[short]/page.tsx    # Redirecionamento baseado no shortCode
│   ├── src/lib/api.ts            # Configuração da base URL da API
│   ├── package.json
│   └── ...
└── README.md
```

---

## 🛠️ Como Executar Localmente

### Pré-requisitos

* **Java 21+**
* **Maven 3.9+**
* **Node.js 20+** (para Next.js 16)
* **PostgreSQL** rodando localmente (ou via Docker)

### 1️⃣ Clonar o repositório

```bash
git clone https://github.com/rodrigo-folha/url-shortener.git
cd url-shortener
```

### 2️⃣ Configurar e subir o backend (Spring Boot)

1. Configure as credenciais do banco em `url-shortener/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/urlshortener
    username: postgres
    password: postgres
  jpa:
    hibernate:
      ddl-auto: update
```

2. Dentro da pasta do backend:

```bash
cd url-shortener
mvn clean spring-boot:run
```

O backend ficará disponível em:
👉 `http://localhost:8080`

A documentação Swagger/OpenAPI ficará disponível em:
👉 `http://localhost:8080/swagger-ui.html`

### 3️⃣ Configurar e subir o frontend (Next.js)

1. Dentro da pasta do frontend:

```bash
cd ../url-shortener-frontend
npm install
```

2. Crie o arquivo `.env.local` apontando para o backend:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

3. Suba o frontend:

```bash
npm run dev
```

O frontend ficará disponível em:
👉 `http://localhost:3000`

---

## 🔌 Fluxo entre Frontend e Backend

| Ação no Frontend               | Rota Next.js                     | Chamada no Backend                   | Observação                           |
| ------------------------------ | -------------------------------- | ------------------------------------ | ------------------------------------ |
| Criar URL encurtada            | `POST` via formulário na `/`     | `POST /shorten`                      | Envia `{ url, urlPersonalizada? }`   |
| Listar URLs no dashboard       | `/dashboard`                     | `GET /shorten/all?pageNo=&pageSize=` | Retorna `Page<ShortenerResponseDTO>` |
| Redirecionar acesso de um link | Rota de servidor `/[short]`    | `GET /shorten/{short}`               | Incrementa contador de acessos       |
| Ver estatísticas de uma URL    | Dialog na `/dashboard`           | `GET /shorten/{short}/stats`         | Retorna `StatisticsResponseDTO`      |
| Atualizar URL original         | Dialog “Editar URL” no dashboard | `PUT /shorten/{short}`               | Atualiza apenas a URL                |
| Deletar URL                    | Ação no dashboard                | `DELETE /shorten/{short}`            | Remove URL e acessos associados      |

---

## ⚙️ Endpoints da API (Spring Boot)

Todos os endpoints abaixo estão sob o prefixo base:

```text
/shorten
```

### 🔹 Criar URL encurtada

**POST `/shorten`**

**Request body** – `ShortenerDTO`:

```json
{
  "url": "https://www.google.com/",
  "urlPersonalizada": "google"
}
```

**Response 201** – `ShortenerResponseDTO`:

```json
{
  "id": 1,
  "url": "https://www.google.com/",
  "shortCode": "google",
  "createdAt": "2025-11-20T15:30:13.123",
  "updatedAt": "2025-11-20T15:30:13.123"
}
```

---

### 🔹 Listar URLs (paginado)

**GET `/shorten/all?pageNo=0&pageSize=10`**

**Response 200** – `Page<ShortenerResponseDTO>`:

```json
{
  "content": [
    {
      "id": 1,
      "url": "https://www.google.com/",
      "shortCode": "google",
      "createdAt": "2025-11-20T15:30:13.123",
      "updatedAt": "2025-11-20T15:30:13.123"
    }
  ],
  "totalPages": 1,
  "totalElements": 1,
  "size": 10,
  "number": 0
}
```

---

### 🔹 Buscar e registrar acesso

**GET `/shorten/{short}`**

Exemplo: `GET /shorten/google`

* Recupera a entidade pelo `shortCode`
* Registra um novo acesso
* Retorna `ShortenerResponseDTO`

---

### 🔹 Estatísticas de acesso

**GET `/shorten/{short}/stats`**

Exemplo: `GET /shorten/google/stats`

**Response 200** – `StatisticsResponseDTO`:

```json
{
  "id": 1,
  "url": "https://www.google.com/",
  "shortCode": "google",
  "createdAt": "2025-11-20T15:30:13.123",
  "updatedAt": "2025-11-20T15:31:00.000",
  "accessCount": 42
}
```

> Esse endpoint é utilizado pelo dialog de estatísticas no dashboard.

---

### 🔹 Atualizar URL

**PUT `/shorten/{short}`**

Request body – `ShortenerDTO` (usado aqui principalmente para a nova URL):

```json
{
  "url": "https://www.google.com.br/",
  "urlPersonalizada": null
}
```

---

### 🔹 Deletar URL

**DELETE `/shorten/{short}`**

Response: `204 No Content` em caso de sucesso.

---

## 📐 Modelo de Domínio – Shortener

### 🧱 Aggregate Root: `Shortener`

| Campo       | Tipo            | Descrição                                 |
| ----------- | --------------- | ----------------------------------------- |
| `id`        | `int`           | Identificador interno                     |
| `url`       | `String`        | URL original                              |
| `shortCode` | `String`        | Código curto (aleatório ou personalizado) |
| `createdAt` | `LocalDateTime` | Data/hora de criação                      |
| `updatedAt` | `LocalDateTime` | Última atualização                        |
| `acessos`   | `List<Acesso>`  | Lista de registros de acesso              |

#### Métodos principais (na Service)

* `salvar(ShortenerDTO dto)` – cria um novo shortCode (ou usa o personalizado)
* `buscar(String shortUrl)` – recupera a entidade, registra acesso e salva
* `buscarSemAumentarAcessCount(String shortUrl)` – busca sem registrar novo acesso
* `buscarEstatisticas(String shortUrl)` – retorna contagem de acessos
* `atualizar(String shortUrl, ShortenerDTO dto)` – atualiza a URL original
* `deletar(String shortUrl)` – remove a URL e seus acessos

---

### 📦 Entidades relacionadas

**Acesso**

```java
- id: int
- dataAcesso: LocalDateTime
```

Cada chamada a `GET /shorten/{short}` gera um novo `Acesso`, permitindo calcular `accessCount`.

---

### 🧭 Fluxo de Redirecionamento (Next.js `/[short]`)

1. Usuário clica em uma URL encurtada:
   `http://localhost:3000/google`
2. Rota de servidor em Next (`app/[short]/page.tsx`) é acionada.
3. O frontend chama o backend:
   `GET http://localhost:8080/shorten/google`
4. O backend:

   * registra acesso;
   * devolve `ShortenerResponseDTO` com a `url` original.
5. A página do Next faz `redirect(data.url)`
   → usuário é enviado para a URL original.

---

## 📡 Melhorias Futuras

Algumas ideias para evolução do projeto:

* Autenticação e URLs por usuário
* Definição de data de expiração da URL
* Limite de acessos / rate limiting
* Gráficos de acessos por período no dashboard
* Customização de domínio (ex.: `https://meudominio.com/{short}`)

---

## 📞 Contato

* GitHub: [@rodrigo-folha](https://github.com/rodrigo-folha)
