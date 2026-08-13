# Cine Noir — Plataforma de Eventos e Ingressos

Plataforma completa de eventos e ingressos: o **organizador** publica sessões a
partir do catálogo do TMDb; o **cliente** navega, reserva assentos em mapa,
escolhe ingressos inteira/meia por assento, paga de forma simulada, recebe ingresso com
QR e compartilha por link; a **portaria** valida na entrada pela câmera ou por
digitação, com retorno claro (válido, já utilizado, evento errado, inválido).

## Stack

| Camada | Tecnologias |
|---|---|
| Front-end | React + Vite + TypeScript, Tailwind (design system próprio "noir"), TanStack Query, react-hook-form + zod, html5-qrcode, qrcode.react |
| Back-end | Java 17 + Spring Boot (Security, Data JPA, Validation, WebClient), Flyway |
| Banco | PostgreSQL |
| API externa | TMDb (catálogo de filmes) |

## Como executar

### Pré-requisitos
JDK 17+, Maven, Node 18+, PostgreSQL rodando localmente e uma chave gratuita
da API do TMDb (developer.themoviedb.org).

### Back-end (porta 8080)
Criar arquivo **application.properties** 
Em `back-end/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/event_platform
spring.datasource.username=postgres
spring.datasource.password=SUA_SENHA
tmdb.api.key=SUA_CHAVE_TMDB
```
```bash
cd back-end && mvn spring-boot:run
```
- O **Flyway** cria o esquema sozinho (migrations V1–V11).
- Com o **banco vazio**, o `DataSeeder` semeia na primeira inicialização:
  4 contas (abaixo) + eventos publicados com grade de 60
  assentos. É idempotente: se já existir algum usuário, não semeia de novo.

### Front-end (porta 5173)
criar arquivo .env na raiz do projeto Em `front-end/.env`
```
VITE_API_URL=http://localhost:8080
```
```bash
cd front-end && npm install && npm run dev
```

## Contas de demonstração

Mesma senha para todos: **1234** 

| Papel | E-mail |
|---|---|
| Organizador | organizador@email.com |
| Cliente | cliente@teste.com |
| Cliente | cliente@email.com |
| Portaria | portaria@email.com |

## Roteiro de teste

1. **Organizador** → painel → "Novo evento" → busca por filme do TMDb
   → escolhe o filme → define data/local/capacidade/preço → publica.
2. **Cliente** → catálogo com busca → abre o evento → "Comprar ingresso" →
   mapa de assentos (livre/selecionado/ocupado) → escolhe inteira ou meia **por
   assento** → confirma a reserva → checkout.
3. No checkout, **aprova** (gera ingressos e cai na tela de sucesso) ou
   **recusa** (reserva cancelada, assentos devolvidos ao mapa).
4. **Meus ingressos** → card com QR, assento e tipo → **Compartilhar** copia um
   link público que funciona até deslogado.
5. **Minhas reservas** → pagamentos pendentes ficam listados com "Continuar
   pagamento" (checkout abandonado segura o assento até lá).
6. **Portaria** → escaneia o QR pela câmera (ou digita o código) →
   ENTRADA LIBERADA; segunda leitura → JÁ UTILIZADO; ingresso de outra
   sessão → EVENTO ERRADO; código inexistente → INVÁLIDO.

## Decisões de arquitetura (o "porquê" das coisas)

- **Reserva por assento, não por quantidade.** No início do projeto, tinha
  definido que a compra de ingresso não possuiria assentos, seria definido
  adicionando quantidade, porém percebi que o projeto seria mais
  profissional implementando também a seleção de assentos, assim
  como nos sites de vendas de ingressos reais, então optei por fazer
  alterações no projeto para pôr seleção de assentos e inclusão de ingressos
  nos valores de inteira e meia. Cada `ReservationSeat` carrega
  tipo (FULL/HALF) e preço congelado.
- **Ninguém vende o mesmo lugar:** três camadas — lock pessimista no evento
  durante a reserva, consulta de assentos ocupados (PENDING_PAYMENT e
  CONFIRMED bloqueiam) e unique constraint `uk_reservation_seat` no banco.
- **QR não forjável = bearer token de alta entropia validado só no servidor.**
  O código é aleatório e só vale se existir no banco; HMAC assinado ficou no
  roadmap como evolução documentada.
- **Ingresso 1:1 com assento** (unique): o mesmo QR que a portaria valida é o
  que mostra assento/tipo em Meus Ingressos e no link compartilhado.
- **Share é link puro:** o `shareToken` nasce com o ingresso; o botão só copia
  a URL — sem endpoint extra, sem estado, sem expiração para gerenciar.
- **Erros com significado:** 404/403/409/422 mapeados; violação de integridade
  vira 409 legível, nunca 500 mudo.
- **Front com tema próprio ("noir")** Defini que identidade do front-end
  seria estilo noir, além de possuir cores elegantes, não incomodam os olhos
  em ambientes escuros. 
- **Performance:** Para melhorias de performance, implementei rotas lazy, debounce
  de 400 ms na busca TMDb, pôsteres em lotes de 5 com `loading="lazy"`.

## O que NÃO foi implementado
- **Testes unitários** — Por conta do tempo, acabou não sendo implementado.
- **Pagamento é simulado por requisito** — nenhum provedor real integrado.
- **Sem recuperação de senha/e-mail** — Implementação não inclusa no momento.

## Uso de IA

Ferramenta: **Qwen3.8**e **ChatGPT**, como par de programação e revisão.
**Com IA:** discussão de modelagem de dados, implementação de segurança do Spring Boot
auxílio de resolução de problemas de funcionamento e de performance, geração de 
código sob minha especificação e debugging, organização de código e de layouts.
**Sem IA:** Desenvolvimento de CRUDs, implementação de telas do front-end e
tema visual.
