# Graph Report - Accounting  (2026-07-07)

## Corpus Check
- 62 files · ~11,086 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 371 nodes · 673 edges · 21 communities (19 shown, 2 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 40 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f17064a6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_WorkItem|WorkItem]]
- [[_COMMUNITY_InvoiceService|InvoiceService]]
- [[_COMMUNITY_Business|Business]]
- [[_COMMUNITY_InvoiceForm.jsx|InvoiceForm.jsx]]
- [[_COMMUNITY_Customer|Customer]]
- [[_COMMUNITY_Invoice|Invoice]]
- [[_COMMUNITY_AuthService.java|AuthService.java]]
- [[_COMMUNITY_devDependencies|devDependencies]]
- [[_COMMUNITY_JwtFilter.java|JwtFilter.java]]
- [[_COMMUNITY_BusinessDto|BusinessDto]]
- [[_COMMUNITY_SecurityConfig.java|SecurityConfig.java]]
- [[_COMMUNITY_mvnw|mvnw]]
- [[_COMMUNITY_CorsConfig.java|CorsConfig.java]]
- [[_COMMUNITY_Getting Started|Getting Started]]
- [[_COMMUNITY_ApplicationTests.java|ApplicationTests.java]]
- [[_COMMUNITY_CLAUDE|CLAUDE.md]]
- [[_COMMUNITY_com.accountingaccounting-application|com.accounting:accounting-application]]

## God Nodes (most connected - your core abstractions)
1. `Invoice` - 18 edges
2. `Business` - 17 edges
3. `WorkItem` - 17 edges
4. `Customer` - 16 edges
5. `InvoiceService` - 16 edges
6. `WorkItemService` - 15 edges
7. `AuthService` - 14 edges
8. `BusinessDto` - 13 edges
9. `InvoiceDto` - 13 edges
10. `WorkItemDto` - 13 edges

## Surprising Connections (you probably didn't know these)
- `SecurityConfig` --references--> `JwtFilter`  [EXTRACTED]
  backend/application/src/main/java/com/accounting/application/config/SecurityConfig.java → backend/application/src/main/java/com/accounting/application/security/JwtFilter.java
- `BusinessController` --references--> `BusinessRepository`  [EXTRACTED]
  backend/application/src/main/java/com/accounting/application/controller/BusinessController.java → backend/application/src/main/java/com/accounting/application/repository/BusinessRepository.java
- `BusinessController` --references--> `UserRepository`  [EXTRACTED]
  backend/application/src/main/java/com/accounting/application/controller/BusinessController.java → backend/application/src/main/java/com/accounting/application/repository/UserRepository.java
- `LoginResponse` --references--> `BusinessDto`  [EXTRACTED]
  backend/application/src/main/java/com/accounting/application/dto/LoginResponse.java → backend/application/src/main/java/com/accounting/application/dto/BusinessDto.java
- `InvoiceDto` --references--> `CustomerDto`  [EXTRACTED]
  backend/application/src/main/java/com/accounting/application/dto/InvoiceDto.java → backend/application/src/main/java/com/accounting/application/dto/CustomerDto.java

## Import Cycles
- None detected.

## Communities (21 total, 2 thin omitted)

### Community 0 - "WorkItem"
Cohesion: 0.08
Nodes (24): trim(), DeleteMapping, GetMapping, PostMapping, RequestMapping, RequiredArgsConstructor, ResponseEntity, RestController (+16 more)

### Community 1 - "InvoiceService"
Cohesion: 0.10
Nodes (20): InvoiceController, DeleteMapping, GetMapping, PostMapping, RequestMapping, RequiredArgsConstructor, ResponseEntity, RestController (+12 more)

### Community 2 - "Business"
Cohesion: 0.08
Nodes (30): ApplicationArguments, ApplicationRunner, AccountingApplication, DataInitializer, Component, Override, PasswordEncoder, RequiredArgsConstructor (+22 more)

### Community 3 - "InvoiceForm.jsx"
Cohesion: 0.11
Nodes (22): api, App(), CustomerAutocomplete(), emptyItem(), InvoiceForm(), InvoiceHistory(), sortByInvoiceNumberDesc(), toTemplateFormat() (+14 more)

### Community 4 - "Customer"
Cohesion: 0.10
Nodes (20): CustomerController, GetMapping, RequestMapping, RequiredArgsConstructor, ResponseEntity, RestController, CustomerDto, Data (+12 more)

### Community 5 - "Invoice"
Cohesion: 0.08
Nodes (23): Invoice, AllArgsConstructor, Builder, Data, Entity, NoArgsConstructor, Table, InvoiceItem (+15 more)

### Community 6 - "AuthService.java"
Cohesion: 0.13
Nodes (19): AuthController, PostMapping, Principal, RequestMapping, RequiredArgsConstructor, ResponseEntity, RestController, Data (+11 more)

### Community 7 - "devDependencies"
Cohesion: 0.09
Nodes (22): dependencies, axios, html2canvas, jspdf, react, react-dom, react-router-dom, devDependencies (+14 more)

### Community 8 - "JwtFilter.java"
Cohesion: 0.16
Nodes (14): Component, Override, RequiredArgsConstructor, UserDetailsService, JwtFilter, Component, JwtUtil, Override (+6 more)

### Community 9 - "BusinessDto"
Cohesion: 0.23
Nodes (10): BusinessController, GetMapping, PostMapping, Principal, RequestMapping, RequiredArgsConstructor, ResponseEntity, RestController (+2 more)

### Community 10 - "SecurityConfig.java"
Cohesion: 0.26
Nodes (10): AuthenticationConfiguration, AuthenticationManager, Bean, Configuration, PasswordEncoder, RequiredArgsConstructor, SecurityConfig, EnableWebSecurity (+2 more)

### Community 11 - "mvnw"
Cohesion: 0.39
Nodes (6): mvnw script, clean(), die(), exec_maven(), set_java_home(), verbose()

### Community 12 - "CorsConfig.java"
Cohesion: 0.53
Nodes (4): CorsConfig, Bean, Configuration, CorsFilter

### Community 13 - "Getting Started"
Cohesion: 0.40
Nodes (4): Getting Started, Guides, Maven Parent overrides, Reference Documentation

### Community 14 - "ApplicationTests.java"
Cohesion: 0.60
Nodes (3): ApplicationTests, SpringBootTest, Test

## Knowledge Gaps
- **25 isolated node(s):** `com.accounting:accounting-application`, `name`, `version`, `private`, `dev` (+20 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `UserRepository` connect `Business` to `BusinessDto`, `Customer`, `AuthService.java`?**
  _High betweenness centrality (0.165) - this node is a cross-community bridge._
- **Why does `BusinessRepository` connect `Business` to `BusinessDto`, `Customer`, `AuthService.java`?**
  _High betweenness centrality (0.121) - this node is a cross-community bridge._
- **Why does `InvoiceService` connect `InvoiceService` to `WorkItem`, `Customer`, `Invoice`?**
  _High betweenness centrality (0.118) - this node is a cross-community bridge._
- **What connects `com.accounting:accounting-application`, `name`, `version` to the rest of the system?**
  _25 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `WorkItem` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `InvoiceService` be split into smaller, more focused modules?**
  _Cohesion score 0.0951219512195122 - nodes in this community are weakly interconnected._
- **Should `Business` be split into smaller, more focused modules?**
  _Cohesion score 0.07564102564102564 - nodes in this community are weakly interconnected._