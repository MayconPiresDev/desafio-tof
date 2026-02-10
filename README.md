## 🏗️ Arquitetura do Sistema

Abaixo, apresento o diagrama da infraestrutura e o fluxo de dados da aplicação:

![Diagrama de Arquitetura](./docs/NestJS%20API%20com%20JWT%20Flow-2026-02-10-015148.png)

### Componentes Principais:
* **Nginx (Load Balancer)**: Porta de entrada que distribui as requisições HTTP.
* **NestJS API**: O core da aplicação, rodando em containers stateless, responsável pelas regras de negócio, validação e autenticação.
* **Redis Cache**: Camada estratégica de cache para armazenar os "slugs" (códigos curtos). Isso garante que o redirecionamento ocorra em milissegundos, sem sobrecarregar o banco principal.
* **PostgreSQL (Primary)**: Banco de dados relacional para persistência segura e estruturada de usuários e URLs.

---

## 🌟 Diferenciais Implementados

ara elevar a maturidade técnica do projeto além dos requisitos funcionais, foram implementadas as seguintes práticas:

### 1. Observabilidade Robusta
* **Logs Estruturados (JSON)**: Implementação do **Winston** logger para saída de logs em formato JSON padronizado, facilitando a ingestão por ferramentas como Datadog, ELK ou CloudWatch.
* **Rastreamento de Erros em Tempo Real**: Integração nativa com **Sentry** para monitoramento de exceções e gargalos de performance em produção.
* **Logging Interceptor**: Monitoramento automático da latência e status code de todas as requisições HTTP.

### 2. Infraestrutura como Código (IaC)
* **Terraform**: Manifestos organizados em módulos para provisionamento da infraestrutura na AWS (Instâncias EC2 e banco RDS), validados via `terraform plan`.
* **Kubernetes (K8s)**: Arquivos de manifesto (`Deployment`, `Service`, `HPA`) prontos para orquestração e escalabilidade horizontal em clusters.

### 3. Automação de CI/CD
* **GitHub Actions**: Workflow completo de Integração Contínua que executa automaticamente a cada push:
    * Linting (Padrão de código).
    * Testes Unitários.
    * Testes E2E (usando banco de dados real em serviço isolado).

### 4. Segurança e Arquitetura
* **Global Exception Filter**: Tratamento centralizado de erros que blinda a API, evitando o vazamento de detalhes sensíveis do banco de dados para o cliente.
* **Multi-tenancy (Isolamento Lógico)**: Implementação de isolamento de dados baseado em `ownerId`. Um usuário só consegue acessar e gerenciar as URLs que ele mesmo criou, garantido por Guards e Services.

---

## 🛠️ Stack Tecnológica

| Tecnologia | Categoria | Função Principal |
| :--- | :--- | :--- |
| **NestJS** (Node.js) | Backend Framework | Regras de negócio e API REST. |
| **PostgreSQL** | Database | Persistência relacional confiável. |
| **Redis** | Caching | Performance de redirecionamento. |
| **Docker Compose** | Infraestrutura Local | Orquestração do ambiente de desenvolvimento. |
| **Terraform** | IaC | Provisionamento de nuvem (AWS). |
| **Winston & Sentry** | Observabilidade | Logging e monitoramento de erros. |
| **GitHub Actions** | CI/CD | Automação de qualidade e testes. |

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
* Docker e Docker Compose instalado.

### Passo a Passo

1.  **Clone o repositório**:
    ```bash
    git clone [https://github.com/seu-usuario/desafio-tof.git](https://github.com/seu-usuario/desafio-tof.git)
    cd desafio-tof/shortener-api
    ```

2.  **Configuração de Ambiente**:
    O projeto já contém um arquivo `.env.example`. Para rodar via Docker, as variáveis já estão pré-configuradas no `docker-compose.yml`.

3.  **Inicie a aplicação**:
    ```bash
    docker-compose up --build
    ```

4.  **Acesse a Documentação (Swagger)**:
    Com o container rodando, acesse:
    > `http://localhost:3000/api`

---

## 🧪 Qualidade e Testes

O projeto mantém uma alta cobertura de testes para garantir a estabilidade.

| Comando | Descrição |
| :--- | :--- |
| `npm run test` | Executa os testes unitários (regras de negócio isoladas). |
| `npm run test:e2e` | Executa os testes de ponta-a-ponta (fluxos completos com banco). |
| `npm run lint` | Verifica a padronização do código. |
| `npm run test:cov` | Gera o relatório de cobertura de testes (>90%). |

---

## 📅 Changelog e Versionamento

Este projeto segue o Versionamento Semântico.
* **Versão Atual**: `v1.0.0` (Release Inicial com Diferenciais)
* Detalhes do histórico de mudanças podem ser encontrados no arquivo [CHANGELOG.md](./shortener-api/CHANGELOG.md).

---
**Desenvolvido por Maycon.**