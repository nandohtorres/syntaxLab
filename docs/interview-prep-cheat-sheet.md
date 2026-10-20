# Interview cheat sheet and recall drills

Source snapshots read on 2026-10-19; originals remain unchanged:

1. User-provided Google Docs download, `C:\Users\ferna\Downloads\Paycom Interview.pdf`, dated 2026-04-22, 21 pages. SHA-256: `67f179d434fdef94c32e381e6b60642a8918af26ce6474cb82aa932735340d3b`.
2. `career/interview-prep/INTERVIEW_STUDY_GUIDE.md`, the reusable derivative. SHA-256: `554153eaa8cc318c7a08908b58121ce2b1a1fe747b7cce0ac6cb9f4b926ecef0`.

The guide is a derivative of the PDF, not independent confirmation. Section/page references preserve provenance. This rewrite checks technical traps against primary documentation, labels added application/coaching exercises, omits private stories and company hiring claims, and keeps the required coding inventory at the original Blind 75. No historical COMPLETED marks are imported into progress.

Use this in order: understand a short note, say it in your own words, write a quick response without looking, then compare. The standalone app's **Interview prep** tab provides the same material and editor-based rapid drills. SQL/code snippets here are self-reviewed, not executed or AI-graded. Answers/progress are stored only in your browser; use export/import to move devices.

## How to practice

Aim for 20–60 seconds for a small recall rep; take longer for code or stories. Use rounds of ten. If a criterion is missing, mark Needs another rep and revisit it after other prompts. Self-rated independent recall is scheduled after 1/3/7/14 days; assisted recall returns after ten minutes. These are practice heuristics, not validated proficiency scores.

## 1. Fundamentals

### Know what each language is for

- C is commonly used for procedural systems programming. C++ supports procedural, object-oriented and generic styles; it is not simply C with classes. C# is a separate language targeting .NET, with garbage collection.
- PHP commonly executes on the server to build responses. HTML/CSS describe browser content/presentation; JavaScript can run in browsers and on servers. Python supports scripts, services and data work.
- Name the language and runtime before making a rule about typing, inheritance or memory. PHP supports type declarations even though variables are dynamically typed.

Source notes: Guide §7; PDF pp7–8. Technical references: [C# language overview](https://learn.microsoft.com/en-us/dotnet/csharp/tour-of-csharp/overview), [PHP type declarations](https://www.php.net/manual/en/language.types.declarations.php), [Python classes](https://docs.python.org/3.12/tutorial/classes.html).

### Java runtime and generic types

- The JVM executes Java bytecode. A JDK supplies development tools such as javac plus runtime support. JRE is the runtime-environment concept; distribution packaging varies.
- Generics parameterize types: List<String> communicates the element type and enables compile-time checks. A generic is not a sorting algorithm.

Source notes: Guide §7; PDF pp1–2,8. Technical references: [Java platform overview](https://docs.oracle.com/javase/8/docs/technotes/guides/), [Java classes and overriding](https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html).

### Classes, objects and methods

- A class describes a type; an object is an instance. Instantiation creates an instance: Python uses ClassName(...), while Java commonly uses new ClassName(...).
- Methods operate through an object or class. Instance state belongs to a particular object; class-level mutable state can accidentally be shared.
- The common four OOP teaching concepts are abstraction, encapsulation, inheritance and polymorphism. Explain a concrete example, not just the list.

Source notes: Guide §§4,11,13; PDF pp5,13–15,20. Technical references: [Python classes](https://docs.python.org/3.12/tutorial/classes.html), [Java classes and overriding](https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html).

### Choose a collection

- Use a sequence for ordered values, a set for uniqueness/membership, and a dictionary for key/value lookup or counts.
- A stack is LIFO; a queue is FIFO. In Python, list append/pop supports a stack; deque append/popleft supports a queue without shifting every remaining element.
- A heap supports repeated access to the highest-priority item without fully sorting all values. Python 3.12 heapq is a min-heap.

Source notes: Guide §13; PDF pp18–20. Technical references: [Python Counter and deque](https://docs.python.org/3.12/library/collections.html), [Python heapq](https://docs.python.org/3.12/library/heapq.html).

### Git and collaboration

- Git tracks repository history locally. GitHub is a hosting/collaboration service. A commit is local until published to a remote.
- clone creates a local repository; fetch updates remote-tracking information; pull fetches and integrates using its selected strategy. push publishes refs/commits when authorized.
- A branch is a ref within a repository; a fork is a separate hosted repository. Review a diff and tests before proposing a merge.

Source notes: Guide §6; PDF p7. Technical references: [Git pull documentation](https://git-scm.com/docs/git-pull).

### From URL to a rendered page

- A browser locates a server, establishes a connection, requests resources and processes responses. HTTPS adds TLS protection. Caches can avoid some network requests.
- HTML is parsed into a DOM tree; CSS styles content; JavaScript handles behavior. Not every click needs a new server-rendered page.
- The DOM is a document programming interface, not the JavaScript language. <!doctype html> selects standards rendering; it does not validate your markup.

Source notes: Guide §§8,11,13; PDF pp8–9,13,15–16,20. Technical references: [How the internet works (MDN)](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/How_does_the_Internet_work), [DOM (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model), [DOCTYPE (MDN)](https://developer.mozilla.org/en-US/docs/Glossary/Doctype).

### HTTP requests and responses

- GET retrieves a representation with intended read-only semantics. POST asks the target resource to process submitted content. Method semantics do not guarantee secrecy.
- 200: success; 201: created; 400: bad request; 401: authentication needed/invalid; 403: forbidden; 404: resource not found/disclosed; 405: method not allowed; 500: server error.
- Headers, URL and body all carry request information. A POST body is observable to endpoints and potentially logs; protect sensitive traffic with HTTPS and appropriate logging.

Source notes: Guide §11; PDF pp12–13,15. Technical references: [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html), [HTTP methods (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods).

### Read and modify relational data

- SELECT projects columns; FROM chooses input; WHERE filters rows; INSERT adds rows; UPDATE changes rows; DELETE removes rows. DDL such as CREATE/ALTER/DROP changes schema objects.
- Use explicit columns and a deliberate WHERE for modifications. NULL represents missing/unknown data; compare with IS NULL rather than = NULL.
- SQL keyword case, identifier case, string comparison and statement terminators are different concerns. PostgreSQL details are examples, not rules for every engine.

Source notes: Guide §3; PDF pp3–4. Technical references: [SQL lexical structure (PostgreSQL)](https://www.postgresql.org/docs/current/sql-syntax-lexical.html), [Database constraints (PostgreSQL)](https://www.postgresql.org/docs/current/ddl-constraints.html).

## 2. Apply the concepts

### Keys and referential integrity

- A primary key identifies rows through unique, non-null column values; it can be composite. A foreign key requires a matching referenced key unless its null semantics permit otherwise.
- Referenced keys need not be the primary key: eligible unique keys can be referenced. A self-reference can model an employee manager.
- Integrity and performance are separate. PostgreSQL creates a primary-key index, but a key does not guarantee every query will be fast.

Source notes: Guide §3; PDF p4. Technical references: [Database constraints (PostgreSQL)](https://www.postgresql.org/docs/current/ddl-constraints.html).

### Join rows without losing the unmatched ones

- INNER retains matches. LEFT retains every left row and matching right rows. RIGHT is the mirrored case. FULL retains matches and unmatched rows from both sides.
- An unmatched outer-join side becomes NULL. Two matching right rows produce two joined rows; joins are not simply set-intersection diagrams.
- A right-side WHERE filter can remove NULL-padded rows from a LEFT join. Put the condition in ON when you intend to preserve unmatched left rows.

Source notes: Guide §§3,13; PDF pp4,19. Technical references: [Joins and grouping (PostgreSQL)](https://www.postgresql.org/docs/current/queries-table-expressions.html).

### Aggregate, group and handle missing values

- GROUP BY creates groups for aggregate calculations. WHERE filters input rows; HAVING filters groups. MAX returns the largest non-null value in a group.
- COUNT(*) counts rows; COUNT(column) counts non-null values. In a LEFT join, count the child key to avoid counting a NULL-padded row as a child.

Source notes: Guide §§3,13; PDF pp3–4,19. Technical references: [Joins and grouping (PostgreSQL)](https://www.postgresql.org/docs/current/queries-table-expressions.html).

### React, JSX, forms and CSS

- React components describe UI. JSX is syntax transformed into JavaScript; braces embed JavaScript expressions. JSON exchanges data; it is not JSX.
- State changes schedule UI updates. Form UI, state handling and validation are different responsibilities. Yup supplies schema parsing/validation, not form widgets.
- A CSS class is reusable across elements. An HTML id should be unique in the document. Flexbox lays out one main axis at a time; grid supports two-dimensional layouts.

Source notes: Guide §§8,11,13; PDF pp8–9,15,20. Technical references: [React: writing JSX](https://react.dev/learn/writing-markup-with-jsx), [Yup schema validation](https://github.com/jquense/yup), [CSS flexbox (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox).

### Abstraction and encapsulation in practice

- Abstraction exposes an understandable contract while hiding irrelevant details. Encapsulation controls how state can be accessed/changed and protects invariants.
- A deposit(amount) operation can reject a negative amount. An unrestricted setBalance(value) can bypass the same invariant even though it is a setter.
- Composition supplies collaborators; inheritance creates a subtype relationship. Prefer a relationship that matches the contract you need rather than inheriting solely for code reuse.

Source notes: Guide §§4,11; PDF pp5,13. Technical references: [Java classes and overriding](https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html), [Python classes](https://docs.python.org/3.12/tutorial/classes.html).

### Polymorphism, overloading and overriding

- Polymorphism lets callers use a shared contract with different implementations. For example, several storage adapters can implement save(record).
- Java overloading uses different parameter signatures under the same name. Overriding supplies a subtype implementation of an inherited instance method with compatible signature and return rules.
- Return type alone cannot distinguish Java overloads. Python does not implement Java-style runtime overloads by repeating def with the same name; the later definition replaces the earlier binding.

Source notes: Guide §§4,11; PDF pp5,12,15. Technical references: [Java classes and overriding](https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html), [Python classes](https://docs.python.org/3.12/tutorial/classes.html).

### Interfaces and abstract classes: Java scope

- A Java abstract class can share instance state and implementations but cannot be directly instantiated. It can be abstract even without abstract methods.
- A modern Java interface defines a contract and can also have default, static and private methods plus constants. It has no instance fields.
- A Java class has one direct class superclass and can implement multiple interfaces. This is not universal across languages; Python permits multiple class bases.

Source notes: Guide §§4,11; PDF pp5–6,14. Technical references: [Java interface specification](https://docs.oracle.com/javase/specs/jls/se25/html/jls-9.html), [Java classes and overriding](https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html).

### Agile and Scrum without the slogans

- Agile emphasizes working software, collaboration, adaptation and feedback. It is not a prescribed sequential checklist and does not require Scrum.
- Scrum uses fixed-length Sprints of one month or less. Planning sets the Sprint Goal; Daily Scrum inspects progress; Review inspects outcomes; Retrospective improves how the team works.
- Product Owner, Scrum Master and Developers have distinct accountabilities. The Daily Scrum is not primarily a manager status report. An increment must meet the Definition of Done.

Source notes: Guide §5; PDF p7. Technical references: [Agile Manifesto principles](https://agilemanifesto.org/principles.html), [The Scrum Guide](https://scrumguides.org/scrum-guide.html).

## 3. Reason about tradeoffs

### Insertion and bubble sort

- Insertion sort grows a sorted prefix by inserting the next value. Typical stable array insertion sort uses O(n²) worst-case time and O(1) extra storage; already-sorted input can be O(n).
- Ordinary bubble sort swaps adjacent out-of-order values and settles an extreme at one end per pass. With an early-exit flag its best case is O(n), but its worst case remains O(n²).
- For nearly sorted data, insertion sort is usually the stronger teaching/default choice between these two. Do not choose an algorithm only from its best-case bound.

Source notes: Guide §2; PDF p2. Technical references: [Princeton algorithms summary](https://algs4.cs.princeton.edu/cheatsheet/).

### Merge sort and quicksort

- Typical array merge sort divides, sorts and merges. It guarantees O(n log n) worst-case time and usually needs O(n) auxiliary storage; stable merging preserves equal-key order.
- Quicksort partitions around a pivot. Randomized/ordinary average analysis gives O(n log n), but very unbalanced partitions can produce O(n²). Recursion space depends on partition balance and implementation.
- Median-of-three is a pivot heuristic, not a universal worst-case guarantee. State the implementation before calling a sort stable or in-place.

Source notes: Guide §2; PDF p2. Technical references: [Princeton algorithms summary](https://algs4.cs.princeton.edu/cheatsheet/).

### Binary heaps and heapsort

- A binary heap is a complete binary tree represented conveniently as an array. In a max-heap each parent is at least its children; siblings and distant nodes need not be ordered.
- Bottom-up heap construction is O(n). Sift-down at a node is O(log n) assuming its child subtrees already satisfy the heap property.
- Heapsort swaps the max root with the end of the active heap and repairs the reduced heap. It gives O(n log n) worst-case time and O(1) auxiliary array storage; ordinary heapsort is not stable.

Source notes: Guide §2; PDF pp2–3. Technical references: [Python heapq](https://docs.python.org/3.12/library/heapq.html), [Princeton algorithms summary](https://algs4.cs.princeton.edu/cheatsheet/).

### SOLID as design reasoning

- S: group responsibilities that change for the same reason. O: provide extension points for expected variation. Neither principle requires a separate class for every line.
- L: subtypes preserve the promises of the base contract. I: expose focused interfaces so clients need not depend on unrelated operations.
- D: high-level policy and low-level details depend on abstractions. This is Dependency Inversion. Apply it where change/testing justify the indirection.

Source notes: Guide §4; PDF p6. Technical references: [Architectural principles (Microsoft)](https://learn.microsoft.com/en-gb/dotnet/architecture/modern-web-apps-azure/architectural-principles), [Liskov and Wing: behavioral subtyping](https://www.cs.cmu.edu/afs/cs/project/venari/www/subtype-tr.html).

### Inject collaborators and control coupling

- Dependency injection means providing a collaborator externally. Constructor injection makes required collaborators explicit; method or property injection can fit other lifetimes/frameworks.
- The composition boundary still creates objects, possibly with new. The goal is to move concrete wiring away from business policy, not ban object creation.
- A fake storage adapter lets a test exercise report generation without a live database. Too many dependencies can signal too many responsibilities.

Source notes: Guide §11; PDF p14. Technical references: [Dependency injection (.NET)](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection/overview), [Architectural principles (Microsoft)](https://learn.microsoft.com/en-gb/dotnet/architecture/modern-web-apps-azure/architectural-principles).

### Model data and query performance

- Normalization uses dependencies to separate facts and reduce update anomalies. Intentional denormalization can trade more complex writes for faster reads; measure and keep a consistency plan.
- Relational and NoSQL systems both have schemas and constraints in practice. Choose based on access patterns, integrity, transactions, scale and operational needs rather than SQL versus unstructured slogans.
- Indexes cost storage and write maintenance. Inspect a query plan and actual workload before adding one. EXPLAIN ANALYZE executes the query; use it carefully with mutations.
- Clustering can mean physical row organization, a group of servers, or statistical grouping. Clarify which. PostgreSQL CLUSTER reorders a table once and does not keep that ordering automatically.
- Transactions group changes into an all-or-nothing unit; concurrency/isolation still needs deliberate design. This extends the source notes into practical architecture reasoning.

Source notes: Guide §§3,11,13; PDF pp3,14–15,19–20. Technical references: [Database indexes (PostgreSQL)](https://www.postgresql.org/docs/current/indexes.html), [CLUSTER (PostgreSQL)](https://www.postgresql.org/docs/current/sql-cluster.html), [Reading query plans (PostgreSQL)](https://www.postgresql.org/docs/current/using-explain.html), [Transactions (PostgreSQL)](https://www.postgresql.org/docs/current/tutorial-transactions.html).

### API security and repeatable requests

- Prevent SQL injection by binding values with parameterized statements; do not concatenate untrusted input into SQL. Dynamically chosen table/column names need allowlisting or supported identifier composition.
- Authentication identifies the caller; authorization checks that caller’s permitted action on a particular resource. Validate inputs server-side and minimize sensitive logging.
- Safe methods request read-only behavior. Idempotent methods have the same intended effect when repeated; GET, PUT and DELETE are idempotent by HTTP semantics, while POST is not inherently so. Response codes may differ across repeats.

Source notes: Guide §§3,11; PDF pp4,12–13,15–16. Technical references: [OWASP: SQL injection](https://community.owasp.org/attacks/SQL_Injection), [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html), [Fielding: REST architectural style](https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm).

### REST, SOAP and the web contract

- REST is an architectural style with client/server separation, stateless requests, caching constraints, a uniform interface and layers (optional code on demand). JSON over HTTP alone does not prove REST compliance.
- SOAP defines an XML envelope/messaging framework with transport bindings, commonly HTTP. It does not inherently force a stateful session or HTML messages.
- For an HTTP resource API, define representations, methods, status codes, validation, pagination, permissions and error behavior. Stateless requests do not mean the database stores no state.

Source notes: Guide §11; PDF pp13,16–17. Technical references: [Fielding: REST architectural style](https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm), [SOAP 1.2 messaging specification](https://www.w3.org/TR/soap12-part1/), [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html).

### Turn source coding notes into Blind 75 preparation

- First clarify output meaning and edge cases. Frequency maps solve counting/mode/anagram checks; sets handle membership; two pointers handle ordered scans; a queue supports breadth-first traversal.
- Use the fixed Blind 75 path for full coding practice. Historical non-Blind-75 links are source context, not additions to the required problem inventory. Old COMPLETED labels do not imply current recall.
- For a maximum number of disjoint teams needing one p,c,m,b,z each, the bottleneck is the minimum of their counts. Distinguish maximum simultaneous teams from counting every possible combination.
- The source’s second team input includes o and cannot support its stated answer of 3. Reject invalid symbols under the stated contract. A corrected valid example bbbbcccmmmmppppzzzz yields 3.

Source notes: Guide §13; PDF pp18–20. Technical references: [Python Counter and deque](https://docs.python.org/3.12/library/collections.html).

## 4. Interview application

### Explain a solution and its boundaries

- For an engineering interview, state inputs/outputs, an invariant, data structure, time/space and at least one boundary case. A passing sample is not proof of correctness.
- Fibonacci: define F0=0,F1=1, then reuse earlier states instead of exponential repeated recursion. For primes below N, the sieve marks composite multiples; test N<=2.
- For duplicate item records, clarify whether you count extra occurrences or every matching pair, and which attributes define identity. For matrices, distinguish unique-row storage from repeated shared references.

Source notes: Guide §§11,13; PDF pp18–20. Technical references: [Python Counter and deque](https://docs.python.org/3.12/library/collections.html), [Princeton algorithms summary](https://algs4.cs.princeton.edu/cheatsheet/).

### Explain a small system for a customer

- Start with users, core operations, data sensitivity, scale and reliability needs. Trace browser → API → data store, then discuss one failure path and one measurable tradeoff. This is an application exercise extending the source material.
- MVC separates model/data-domain behavior, view/presentation and controller/input coordination. Frameworks apply these boundaries differently.
- A dynamic address is typically leased by DHCP and may remain the same for long periods. Static configuration or a reservation provides predictable addressing; dynamic does not mean every request gets a new IP.

Source notes: Guide §§11,13; PDF pp13,16,20. Technical references: [Fielding: REST architectural style](https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm), [Transactions (PostgreSQL)](https://www.postgresql.org/docs/current/tutorial-transactions.html), [DHCP, RFC 2131](https://www.rfc-editor.org/rfc/rfc2131).

### Tell a truthful project and teamwork story

- Use a short situation → task → your action → result → lesson outline. Explain what you personally did and what evidence supports the result; do not invent metrics or borrow somebody else’s outcome.
- Prepare distinct examples for learning something unfamiliar, a technical setback, collaboration/conflict, leadership, failure and a meaningful achievement. Historical source stories are private prompts, not verified scripts.
- Describe constraints professionally. Explain your response, tradeoff and learning instead of blaming teammates or making unverifiable accusations. Update career stage and current experience before rehearsing.

Source notes: Guide §§0,9–10; PDF pp1,9–12,20–21. Coaching guidance; adapt to truthful personal facts.

### Motivation, role fit and questions to ask

- For “why this company,” connect verified current work to your relevant experience and the contribution you want to make. Replace dated company claims and vague “nothing to lose” wording with a concrete fit.
- State Python experience honestly: distinguish what you can read, build independently, explain with help and are still practicing. For engineering emphasize implementation; for solutions architecture emphasize customer needs and tradeoffs while keeping technical depth.
- Useful questions cover actual projects, onboarding, success measures, collaboration, technical ownership, SQL/data expectations, customer feedback and growth. Historical hiring anecdotes are not promises about the next interview.

Source notes: Guide §§0,9,12; PDF pp1,9,11,17,20–21. Coaching guidance; adapt to truthful personal facts.

## Drill quiz (66 reps)

Write one short answer before revealing the reference. Grade the reasoning against the criteria, not exact wording. Check a criterion only if your original answer already contained it. Any missing criterion means another rep. Personal-example prompts have a rubric rather than an invented model biography.

### Rep 1: Know what each language is for

A PHP page sends HTML to a browser. Where did PHP execute, and what renders the HTML?

<details>
<summary>Reference and self-check</summary>

PHP usually executes on the server; the browser parses and renders the resulting HTML.

- [ ] Server runs PHP
- [ ] Browser renders the response

</details>

### Rep 2: Know what each language is for

Correct this claim: C#, C++ and C are just three versions of one language.

<details>
<summary>Reference and self-check</summary>

They are distinct languages. C++ supports multiple paradigms including OOP and generics; C# commonly targets .NET and has managed memory.

- [ ] Distinct languages
- [ ] One meaningful runtime or paradigm distinction

</details>

### Rep 3: Java runtime and generic types

You have Java source and need to compile and run it. Distinguish JDK, JVM and JRE.

<details>
<summary>Reference and self-check</summary>

Use JDK development tools to compile source into bytecode. The JVM executes it; JRE describes runtime libraries and execution support.

- [ ] JDK compiles
- [ ] JVM executes bytecode
- [ ] JRE is runtime support

</details>

### Rep 4: Java runtime and generic types

What does List<String> tell a Java caller?

<details>
<summary>Reference and self-check</summary>

This is a list whose declared element type is String, with compiler checks on compatible use.

- [ ] Parameterized element type
- [ ] Compile-time type checking

</details>

### Rep 5: Classes, objects and methods

In Python, what is the difference between CounterBox and CounterBox()?

<details>
<summary>Reference and self-check</summary>

CounterBox names the class. CounterBox() calls it to create an instance, initialized through its constructor machinery.

- [ ] Class versus instance
- [ ] Python instantiates without new

</details>

### Rep 6: Classes, objects and methods

Name the four common OOP pillars, then describe one with an example.

<details>
<summary>Reference and self-check</summary>

Abstraction, encapsulation, inheritance and polymorphism. For encapsulation, an account exposes deposit(amount) that validates a positive amount instead of allowing arbitrary balance changes.

- [ ] All four concepts
- [ ] Specific behavior in an example

</details>

### Rep 7: Choose a collection

Choose structures for undo history, breadth-first traversal and counting repeated names.

<details>
<summary>Reference and self-check</summary>

Undo history: stack. Breadth-first traversal: queue. Repeated-name counts: dictionary or Counter.

- [ ] LIFO stack for undo
- [ ] FIFO queue for BFS
- [ ] Counts keyed by name

</details>

### Rep 8: Choose a collection

For values [5, 1, 4] in a Python 3.12 min-heap, which value is popped first? Is the whole heap sorted?

<details>
<summary>Reference and self-check</summary>

1 is popped first. A heap is partially ordered, not a fully sorted sequence.

- [ ] Minimum first
- [ ] Heap is not fully sorted

</details>

### Rep 9: Git and collaboration

You committed locally. Has GitHub changed? What would publish the branch?

<details>
<summary>Reference and self-check</summary>

A local commit does not update GitHub. An explicitly authorized push publishes the branch to its configured remote.

- [ ] Commit stays local
- [ ] Push publishes

</details>

### Rep 10: Git and collaboration

Explain fetch versus pull without assuming pull always merges.

<details>
<summary>Reference and self-check</summary>

Fetch obtains objects and updates remote-tracking refs. Pull also integrates the selected remote branch, using merge or rebase as configured/requested.

- [ ] Fetch does not itself integrate
- [ ] Pull integrates with a strategy

</details>

### Rep 11: From URL to a rendered page

Explain a page load from request to visible content in three steps.

<details>
<summary>Reference and self-check</summary>

Request resources from a server (or cache), receive responses, then parse HTML/build DOM and apply CSS/execute JavaScript to render and interact.

- [ ] Request/response
- [ ] HTML and DOM
- [ ] CSS/JavaScript roles

</details>

### Rep 12: From URL to a rendered page

What does <!doctype html> accomplish, and what does it not guarantee?

<details>
<summary>Reference and self-check</summary>

It selects standards/no-quirks rendering. It does not prove the HTML is valid or guarantee cross-browser perfection.

- [ ] Standards rendering
- [ ] Not a validator

</details>

### Rep 13: HTTP requests and responses

An existing endpoint supports GET, but you send DELETE. What status describes that method mismatch?

<details>
<summary>Reference and self-check</summary>

405 Method Not Allowed. The response should identify allowed methods through Allow.

- [ ] 405
- [ ] Method is not allowed on this resource

</details>

### Rep 14: HTTP requests and responses

Does a POST body make a password secret? Explain.

<details>
<summary>Reference and self-check</summary>

No. Use HTTPS for transport encryption and avoid leaking sensitive fields in logs. A body is not a security boundary.

- [ ] POST alone is not secrecy
- [ ] HTTPS protects transit

</details>

### Rep 15: Read and modify relational data

Given employees(name, active), write a query for names where active is the integer 1.

<details>
<summary>Reference and self-check</summary>

SELECT name FROM employees WHERE active = 1;

- [ ] SELECT name
- [ ] FROM employees
- [ ] WHERE active = 1

</details>

### Rep 16: Read and modify relational data

Correct: SQL is never case sensitive, and semicolons are never necessary.

<details>
<summary>Reference and self-check</summary>

Keywords are generally case insensitive. Identifier quoting and text comparison follow engine/collation rules. Terminators depend on the execution context.

- [ ] Keywords versus identifiers/text
- [ ] Context matters for terminators

</details>

### Rep 17: Keys and referential integrity

orders.customer_id references customers.id. What does the foreign key prevent?

<details>
<summary>Reference and self-check</summary>

It prevents an order from referencing a non-existent customer key, subject to the constraint/null rules. It is a data-integrity relationship.

- [ ] Matching referenced key
- [ ] Integrity rather than universal speed

</details>

### Rep 18: Keys and referential integrity

Can a foreign key reference the same table or an eligible unique non-primary key?

<details>
<summary>Reference and self-check</summary>

Yes to both, where the engine and referenced constraint support it.

- [ ] Self-reference is possible
- [ ] Eligible unique key can be referenced

</details>

### Rep 19: Join rows without losing the unmatched ones

Customer A has two orders and B has none. How many rows does customers LEFT JOIN orders produce?

<details>
<summary>Reference and self-check</summary>

Three rows: two for A and one NULL-padded order side for B.

- [ ] Two matches for A
- [ ] One retained unmatched B
- [ ] Total three

</details>

### Rep 20: Join rows without losing the unmatched ones

Write a join returning every customer name and any order ID. Tables: customers(id,name), orders(id,customer_id).

<details>
<summary>Reference and self-check</summary>

SELECT c.name, o.id FROM customers c LEFT JOIN orders o ON o.customer_id = c.id;

- [ ] LEFT JOIN
- [ ] Correct key condition
- [ ] Select customer name and order ID

</details>

### Rep 21: Join rows without losing the unmatched ones

What does FULL OUTER JOIN add beyond LEFT JOIN?

<details>
<summary>Reference and self-check</summary>

It also preserves unmatched right-side rows with a NULL-padded left side.

- [ ] Unmatched right rows
- [ ] NULL padding

</details>

### Rep 22: Aggregate, group and handle missing values

Write department maximum salary from employees(department,salary), keeping groups whose max exceeds 100000.

<details>
<summary>Reference and self-check</summary>

SELECT department, MAX(salary) FROM employees GROUP BY department HAVING MAX(salary) > 100000;

- [ ] GROUP BY department
- [ ] MAX(salary)
- [ ] HAVING filters aggregate

</details>

### Rep 23: Aggregate, group and handle missing values

After customers LEFT JOIN orders, why might COUNT(*) incorrectly report one order for a customer with none?

<details>
<summary>Reference and self-check</summary>

The outer join still produces one padded row. COUNT(o.id) counts only non-null matching order IDs.

- [ ] Padded row exists
- [ ] Count non-null child key

</details>

### Rep 24: React, JSX, forms and CSS

An API returns JSON, and a React component uses JSX. Explain the difference.

<details>
<summary>Reference and self-check</summary>

JSON represents data. JSX expresses UI markup inside JavaScript and is transformed before execution.

- [ ] Data format versus UI syntax
- [ ] JSX transforms to JavaScript

</details>

### Rep 25: React, JSX, forms and CSS

You need a form and field validation. Does adding Yup create the form UI?

<details>
<summary>Reference and self-check</summary>

No. Build the form UI/state handling, and use Yup if schema validation fits the requirements.

- [ ] Yup validates/parses
- [ ] UI/state remain separate

</details>

### Rep 26: React, JSX, forms and CSS

Which CSS selector is reusable: .notice or #notice? How would you align a row of buttons?

<details>
<summary>Reference and self-check</summary>

.notice is a reusable class; #notice identifies an element with that id. A flex container can align a row with gap and align-items.

- [ ] Class versus unique id
- [ ] Appropriate flex layout

</details>

### Rep 27: Abstraction and encapsulation in practice

A class has private balance and setBalance(any_number). Is encapsulation automatically good?

<details>
<summary>Reference and self-check</summary>

No. Private storage plus an unrestricted setter may still violate invariants. Expose validated operations such as deposit(positive_amount).

- [ ] Getters/setters are not enough
- [ ] Protect an invariant

</details>

### Rep 28: Abstraction and encapsulation in practice

Distinguish abstraction from encapsulation using a payment service.

<details>
<summary>Reference and self-check</summary>

Abstraction offers charge(amount) without revealing provider details. Encapsulation controls internal credentials/state and validates transitions.

- [ ] Simple external contract
- [ ] Controlled internal state

</details>

### Rep 29: Polymorphism, overloading and overriding

In Java, are calculate(int) and calculate(double) overriding or overloading? What about a child replacing calculate(int)?

<details>
<summary>Reference and self-check</summary>

Different parameter signatures are overloads. A compatible child implementation of the inherited instance method is an override.

- [ ] Different parameters means overload
- [ ] Subtype implementation means override

</details>

### Rep 30: Polymorphism, overloading and overriding

Can a Java override freely change its parameter types? Can an overload differ only in return type?

<details>
<summary>Reference and self-check</summary>

No to both. Overriding preserves the relevant signature; Java permits covariant reference returns. Overloading requires distinct signatures.

- [ ] Parameters are not arbitrary
- [ ] Return alone does not overload

</details>

### Rep 31: Interfaces and abstract classes: Java scope

Correct: Java interfaces contain only public abstract methods and cannot contain implementations.

<details>
<summary>Reference and self-check</summary>

They may include default/static implementations and private helper methods. They lack per-instance fields, but may declare constants.

- [ ] Implemented methods exist
- [ ] Private methods can exist
- [ ] No instance fields

</details>

### Rep 32: Interfaces and abstract classes: Java scope

You need shared per-instance state plus a partial implementation in Java. Which construct fits, and can you instantiate it directly?

<details>
<summary>Reference and self-check</summary>

An abstract base class can provide that state/implementation. Instantiate a concrete subclass, not the abstract class directly.

- [ ] Abstract base class
- [ ] Concrete subclass instance

</details>

### Rep 33: Agile and Scrum without the slogans

Does every Agile team have Sprints? Give the distinction.

<details>
<summary>Reference and self-check</summary>

No. Agile is a set of values/principles. Scrum is a specific framework that uses Sprints.

- [ ] Agile is broader
- [ ] Scrum uses Sprints

</details>

### Rep 34: Agile and Scrum without the slogans

Distinguish a Sprint Review from a Retrospective.

<details>
<summary>Reference and self-check</summary>

Review inspects the product outcome with stakeholders and adapts future work; Retrospective improves the team’s ways of working.

- [ ] Product outcome and feedback
- [ ] Team process improvement

</details>

### Rep 35: Insertion and bubble sort

After inserting 2 into the sorted prefix [1,4] of [1,4,2,3], show the array.

<details>
<summary>Reference and self-check</summary>

[1,2,4,3]. The sorted prefix is now [1,2,4].

- [ ] Correct array
- [ ] Sorted-prefix invariant

</details>

### Rep 36: Insertion and bubble sort

Why does bubble sort remain a weak default even if early exit makes sorted input linear?

<details>
<summary>Reference and self-check</summary>

Many inputs still require quadratic comparisons/swaps; insertion sort generally handles small/nearly-sorted data more effectively. Best case does not describe every workload.

- [ ] Worst case O(n²)
- [ ] Best-case limitation

</details>

### Rep 37: Merge sort and quicksort

Choose between ordinary array merge sort and quicksort when guaranteed O(n log n) time matters. State a tradeoff.

<details>
<summary>Reference and self-check</summary>

Merge sort gives the worst-case bound, usually with O(n) auxiliary storage. Ordinary quicksort has quadratic worst cases.

- [ ] Merge sort worst-case bound
- [ ] Extra memory tradeoff

</details>

### Rep 38: Merge sort and quicksort

Does median-of-three make ordinary quicksort immune to quadratic behavior?

<details>
<summary>Reference and self-check</summary>

No. It can improve pivot choice in practice, but does not guarantee balanced partitions for every input.

- [ ] No worst-case guarantee
- [ ] Partition balance matters

</details>

### Rep 39: Binary heaps and heapsort

Is [9,7,8,1,2] a valid max-heap despite 7 coming before 8?

<details>
<summary>Reference and self-check</summary>

Yes. Each parent is at least its children; heap order does not require siblings or the entire array to be sorted.

- [ ] Valid heap
- [ ] Parent-child invariant

</details>

### Rep 40: Binary heaps and heapsort

State bottom-up heap-build time, one sift-down time and heapsort worst-case time.

<details>
<summary>Reference and self-check</summary>

O(n), O(log n), O(n log n), respectively.

- [ ] Build O(n)
- [ ] Sift-down O(log n)
- [ ] Sort O(n log n)

</details>

### Rep 41: SOLID as design reasoning

Expand SOLID, especially D, then give a small dependency example.

<details>
<summary>Reference and self-check</summary>

Single Responsibility; Open/Closed; Liskov Substitution; Interface Segregation; Dependency Inversion. A report service depends on a storage contract rather than constructing a specific database client.

- [ ] Correct D: Inversion
- [ ] Other four named
- [ ] Contract-based example

</details>

### Rep 42: SOLID as design reasoning

A subtype keeps every method name but throws unsupported errors for valid parent operations. Does that establish Liskov substitution?

<details>
<summary>Reference and self-check</summary>

No. Clients relying on the base behavior can break. Substitution is about behavior/contracts, not method-name count.

- [ ] Behavioral contract
- [ ] Client can break

</details>

### Rep 43: Inject collaborators and control coupling

Refactor ReportService creating its own DatabaseClient into a DI design. A short Python sketch is enough.

<details>
<summary>Reference and self-check</summary>

```text
class ReportService:
    def __init__(self, store):
        self.store = store

Wire ReportService(real_store) in the composition code; pass a fake store in tests.
```

- [ ] Collaborator passed from outside
- [ ] Test can supply fake
- [ ] Creation remains somewhere

</details>

### Rep 44: Inject collaborators and control coupling

Is Dependency Injection identical to Dependency Inversion? Must DI remove every new expression?

<details>
<summary>Reference and self-check</summary>

No. Inversion is a principle about dependency direction/abstractions; injection supplies dependencies. Objects still have to be constructed.

- [ ] Principle versus technique
- [ ] Object creation remains

</details>

### Rep 45: Model data and query performance

Every order repeats customer_email. What anomaly can occur, and how can normalization help?

<details>
<summary>Reference and self-check</summary>

Updating only some orders produces inconsistent customer facts. Store customer data once and reference the customer key; still consider historical snapshot requirements.

- [ ] Inconsistent repeated updates
- [ ] Separate customer fact/reference
- [ ] Acknowledge business meaning

</details>

### Rep 46: Model data and query performance

A query is slow. Why not add an index on every column?

<details>
<summary>Reference and self-check</summary>

Indexes use space and slow writes. Inspect filters, joins, selectivity and the plan, then measure a suitable index against the workload.

- [ ] Write/storage cost
- [ ] Measure/query plan

</details>

### Rep 47: Model data and query performance

Two account updates must succeed together. Which concept helps, and what should you clarify when someone says database clustering?

<details>
<summary>Reference and self-check</summary>

Use a transaction for atomic updates. Ask whether clustering means physical organization, server topology or statistical grouping.

- [ ] Atomic transaction
- [ ] Clarify clustering context

</details>

### Rep 48: API security and repeatable requests

A login query concatenates a username into SQL. Describe the fix and why escaping alone is a weak default.

<details>
<summary>Reference and self-check</summary>

Use parameter binding so input is treated as data, not executable SQL syntax. Validate inputs too, but do not replace binding with ad hoc escaping.

- [ ] Parameterized values
- [ ] Data separated from SQL syntax

</details>

### Rep 49: API security and repeatable requests

A user is logged in and requests another user’s private record. Which check is missing?

<details>
<summary>Reference and self-check</summary>

Resource-level authorization. Authentication alone does not grant permission to access every object.

- [ ] Authorization
- [ ] Specific resource ownership/permission

</details>

### Rep 50: API security and repeatable requests

Can DELETE remain idempotent if the first response is 204 and the second is 404?

<details>
<summary>Reference and self-check</summary>

Yes. Idempotence concerns the intended server-side effect, not identical response status. The resource remains deleted.

- [ ] Same effect
- [ ] Responses may differ

</details>

### Rep 51: REST, SOAP and the web contract

Correct: SOAP is always stateful, REST is always faster, and SOAP sends HTML.

<details>
<summary>Reference and self-check</summary>

SOAP uses XML envelopes and does not inherently require sessions. REST is a style; performance depends on workload, protocol use and implementation. HTML is not the SOAP envelope format.

- [ ] SOAP XML
- [ ] No mandatory stateful session
- [ ] No universal performance winner

</details>

### Rep 52: REST, SOAP and the web contract

Design a short contract for creating an order and later fetching it.

<details>
<summary>Reference and self-check</summary>

POST /orders with validated input; return 201 plus a resource location/representation on creation. GET /orders/{id} reads it. Check caller permissions and define errors.

- [ ] Creation and retrieval methods
- [ ] 201/resource identity
- [ ] Validation and authorization

</details>

### Rep 53: Turn source coding notes into Blind 75 preparation

Given [1,4,8,2,1,7,4,1], return the most frequent value, not the numerically largest duplicate. Explain the approach.

<details>
<summary>Reference and self-check</summary>

1 occurs three times. Count values using a dictionary/Counter, then select the maximum count; define tie behavior before coding.

- [ ] Returns 1
- [ ] Counts frequency
- [ ] Clarifies ties

</details>

### Rep 54: Turn source coding notes into Blind 75 preparation

For pcmbzpcmbz, find the maximum number of disjoint teams needing one of each letter. Why minimum count?

<details>
<summary>Reference and self-check</summary>

2. Every team consumes one of each required skill, so the least available skill limits the number; pairing arbitrary members constructs that many teams.

- [ ] Answer 2
- [ ] Bottleneck argument

</details>

### Rep 55: Turn source coding notes into Blind 75 preparation

The source says mppzombpzcmpmzz yields three teams. What must be corrected before implementing?

<details>
<summary>Reference and self-check</summary>

It contains invalid o and only one c and b. Reject it under the specified alphabet. If explicitly ignoring invalid symbols, the minimum required count is 1; the separate valid sorted example yields 3.

- [ ] Invalid symbol
- [ ] c and b counts are 1
- [ ] Contract and answer corrected

</details>

### Rep 56: Explain a solution and its boundaries

Two Sum: what invariant does a seen-value map maintain, and what complexity do you expect?

<details>
<summary>Reference and self-check</summary>

The map contains values/indices processed before the current index. Look up target-current before storing the current item to avoid reusing it; expected O(n) time and O(n) space with ordinary hash behavior.

- [ ] Previously seen indices
- [ ] Do not reuse one item
- [ ] Expected time/space

</details>

### Rep 57: Explain a solution and its boundaries

How do you improve naive repeated-recursion Fibonacci, and which base convention should you state?

<details>
<summary>Reference and self-check</summary>

Memoize subproblems or keep the previous two values iteratively. State F0=0 and F1=1; iterative computation uses O(n) time/O(1) auxiliary space under the usual unit-cost arithmetic model.

- [ ] Reuse earlier results
- [ ] Explicit base cases
- [ ] Complexity with model

</details>

### Rep 58: Explain a solution and its boundaries

A list contains the same item three times. How many duplicates are there?

<details>
<summary>Reference and self-check</summary>

Clarify the definition: two extra occurrences beyond the first, or three unordered equal pairs. Both are plausible; agree on the contract first.

- [ ] Ambiguity identified
- [ ] Two extra or three pairs

</details>

### Rep 59: Explain a small system for a customer

Explain a small reporting web app to a non-specialist, including one failure case and one tradeoff.

<details>
<summary>Reference and self-check</summary>

The browser asks an API for a report; the API checks permission, reads data and returns a result. Show a clear retry/error state on failure. A cached report can be faster but may be stale.

- [ ] Clear request/data flow
- [ ] Permission and failure behavior
- [ ] One explicit tradeoff

</details>

### Rep 60: Explain a small system for a customer

Does a DHCP client necessarily change IP on every connection or request? Distinguish static addressing.

<details>
<summary>Reference and self-check</summary>

No. DHCP leases can be renewed with the same address. Static configuration or a reservation is used when predictable assignment is needed.

- [ ] Leases can stay the same
- [ ] Predictable/static or reserved assignment

</details>

### Rep 61: Tell a truthful project and teamwork story

Write a five-line outline for a real project challenge. Use placeholders for facts you still need to verify.

<details>
<summary>Reference and self-check</summary>

Situation: [context]. Task: [responsibility]. Action: [your specific choices]. Result: [verifiable outcome]. Lesson: [what changed in your approach].

- [ ] Specific personal action
- [ ] Truthful outcome/evidence
- [ ] Lesson or changed behavior

</details>

### Rep 62: Tell a truthful project and teamwork story

Your failure answer is only “I persevere.” What is missing?

<details>
<summary>Reference and self-check</summary>

A specific failure, your responsibility, what you changed, and evidence of a later improvement. A slogan alone does not demonstrate behavior.

- [ ] Concrete event and ownership
- [ ] Changed action
- [ ] Evidence or honest limitation

</details>

### Rep 63: Tell a truthful project and teamwork story

Outline a respectful conflict answer without criticizing a teammate.

<details>
<summary>Reference and self-check</summary>

Explain the shared goal, the differing views, how you listened/clarified constraints, the agreed action and the observed result. Own your contribution.

- [ ] Shared goal/difference
- [ ] Listening and resolution
- [ ] Result without blame

</details>

### Rep 64: Motivation, role fit and questions to ask

Draft a brief motivation answer without inventing company facts or claiming experience you do not have.

<details>
<summary>Reference and self-check</summary>

I am interested in [verified work/problem] because [real connection]. I have worked on [truthful relevant example], and want to contribute [specific value] while developing [skill].

- [ ] Verified company connection
- [ ] Truthful experience
- [ ] Contribution and growth

</details>

### Rep 65: Motivation, role fit and questions to ask

Choose three useful questions to ask about either an engineering or solutions architect role.

<details>
<summary>Reference and self-check</summary>

What would I own in the first three months? How is success measured? How do engineers/architects clarify customer requirements and review tradeoffs?

- [ ] Concrete responsibilities
- [ ] Success/onboarding
- [ ] Collaboration or customer context

</details>

### Rep 66: Motivation, role fit and questions to ask

How would you describe early Python experience honestly in an interview?

<details>
<summary>Reference and self-check</summary>

I am building fluency through scripts and algorithm exercises. I can demonstrate [specific verified task] independently; I am still practicing [specific area]. Then show or explain actual code.

- [ ] Specific demonstrated capability
- [ ] Clear limits
- [ ] Avoid exaggerated fluency

</details>
