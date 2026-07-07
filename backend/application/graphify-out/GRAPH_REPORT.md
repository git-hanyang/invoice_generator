# Graph Report - application  (2026-07-07)

## Corpus Check
- 40 files · ~4,698 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 300 nodes · 576 edges · 14 communities (13 shown, 1 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 41 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f17064a6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_WorkItem|WorkItem]]
- [[_COMMUNITY_Business|Business]]
- [[_COMMUNITY_InvoiceService|InvoiceService]]
- [[_COMMUNITY_AuthService.java|AuthService.java]]
- [[_COMMUNITY_Customer|Customer]]
- [[_COMMUNITY_Invoice|Invoice]]
- [[_COMMUNITY_BusinessDto|BusinessDto]]
- [[_COMMUNITY_SecurityConfig.java|SecurityConfig.java]]
- [[_COMMUNITY_JwtFilter.java|JwtFilter.java]]
- [[_COMMUNITY_mvnw|mvnw]]
- [[_COMMUNITY_InvoicePayment|InvoicePayment]]
- [[_COMMUNITY_CorsConfig.java|CorsConfig.java]]
- [[_COMMUNITY_ApplicationTests.java|ApplicationTests.java]]
- [[_COMMUNITY_com.accountingaccounting-application|com.accounting:accounting-application]]

## God Nodes (most connected - your core abstractions)
1. `WorkItem` - 19 edges
2. `Business` - 18 edges
3. `Invoice` - 18 edges
4. `Customer` - 16 edges
5. `InvoiceService` - 16 edges
6. `WorkItemService` - 16 edges
7. `AuthService` - 14 edges
8. `BusinessDto` - 13 edges
9. `InvoiceDto` - 13 edges
10. `WorkItemDto` - 13 edges

## Surprising Connections (you probably didn't know these)
- `SecurityConfig` --references--> `JwtFilter`  [EXTRACTED]
  src/main/java/com/accounting/application/config/SecurityConfig.java → src/main/java/com/accounting/application/security/JwtFilter.java
- `BusinessController` --references--> `BusinessRepository`  [EXTRACTED]
  src/main/java/com/accounting/application/controller/BusinessController.java → src/main/java/com/accounting/application/repository/BusinessRepository.java
- `BusinessController` --references--> `UserRepository`  [EXTRACTED]
  src/main/java/com/accounting/application/controller/BusinessController.java → src/main/java/com/accounting/application/repository/UserRepository.java
- `LoginResponse` --references--> `BusinessDto`  [EXTRACTED]
  src/main/java/com/accounting/application/dto/LoginResponse.java → src/main/java/com/accounting/application/dto/BusinessDto.java
- `InvoiceDto` --references--> `CustomerDto`  [EXTRACTED]
  src/main/java/com/accounting/application/dto/InvoiceDto.java → src/main/java/com/accounting/application/dto/CustomerDto.java

## Import Cycles
- None detected.

## Communities (14 total, 1 thin omitted)

### Community 0 - "WorkItem"
Cohesion: 0.08
Nodes (24): trim(), DeleteMapping, GetMapping, PostMapping, RequestMapping, RequiredArgsConstructor, ResponseEntity, RestController (+16 more)

### Community 1 - "Business"
Cohesion: 0.08
Nodes (31): ApplicationArguments, ApplicationRunner, JpaRepository, Slf4j, SpringBootApplication, AccountingApplication, DataInitializer, Component (+23 more)

### Community 2 - "InvoiceService"
Cohesion: 0.10
Nodes (20): InvoiceController, DeleteMapping, GetMapping, PostMapping, RequestMapping, RequiredArgsConstructor, ResponseEntity, RestController (+12 more)

### Community 3 - "AuthService.java"
Cohesion: 0.10
Nodes (22): PutMapping, SecretKey, AuthController, PostMapping, Principal, RequestMapping, RequiredArgsConstructor, ResponseEntity (+14 more)

### Community 4 - "Customer"
Cohesion: 0.10
Nodes (19): CustomerController, GetMapping, RequestMapping, RequiredArgsConstructor, ResponseEntity, RestController, CustomerDto, Data (+11 more)

### Community 5 - "Invoice"
Cohesion: 0.12
Nodes (16): Invoice, AllArgsConstructor, Builder, Data, Entity, NoArgsConstructor, Table, InvoiceItem (+8 more)

### Community 6 - "BusinessDto"
Cohesion: 0.23
Nodes (10): BusinessController, GetMapping, PostMapping, Principal, RequestMapping, RequiredArgsConstructor, ResponseEntity, RestController (+2 more)

### Community 7 - "SecurityConfig.java"
Cohesion: 0.26
Nodes (10): AuthenticationConfiguration, EnableWebSecurity, HttpSecurity, SecurityFilterChain, AuthenticationManager, Bean, Configuration, PasswordEncoder (+2 more)

### Community 8 - "JwtFilter.java"
Cohesion: 0.23
Nodes (11): FilterChain, HttpServletRequest, HttpServletResponse, OncePerRequestFilter, Component, Override, RequiredArgsConstructor, UserDetailsService (+3 more)

### Community 9 - "mvnw"
Cohesion: 0.39
Nodes (6): mvnw script, clean(), die(), exec_maven(), set_java_home(), verbose()

### Community 10 - "InvoicePayment"
Cohesion: 0.25
Nodes (7): InvoicePayment, AllArgsConstructor, Builder, Data, Entity, NoArgsConstructor, Table

### Community 11 - "CorsConfig.java"
Cohesion: 0.53
Nodes (4): CorsFilter, CorsConfig, Bean, Configuration

### Community 12 - "ApplicationTests.java"
Cohesion: 0.60
Nodes (3): SpringBootTest, ApplicationTests, Test

## Knowledge Gaps
- **1 isolated node(s):** `com.accounting:accounting-application`
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `BusinessRepository` connect `Business` to `WorkItem`, `AuthService.java`, `BusinessDto`?**
  _High betweenness centrality (0.265) - this node is a cross-community bridge._
- **Why does `WorkItemService` connect `WorkItem` to `Business`, `InvoiceService`?**
  _High betweenness centrality (0.238) - this node is a cross-community bridge._
- **Why does `InvoiceService` connect `InvoiceService` to `WorkItem`, `Customer`, `Invoice`?**
  _High betweenness centrality (0.200) - this node is a cross-community bridge._
- **What connects `com.accounting:accounting-application` to the rest of the system?**
  _1 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `WorkItem` be split into smaller, more focused modules?**
  _Cohesion score 0.0824829931972789 - nodes in this community are weakly interconnected._
- **Should `Business` be split into smaller, more focused modules?**
  _Cohesion score 0.07682926829268293 - nodes in this community are weakly interconnected._
- **Should `InvoiceService` be split into smaller, more focused modules?**
  _Cohesion score 0.0951219512195122 - nodes in this community are weakly interconnected._