# Software engineering interview reference

Generated from the same content as the reference-only site. No quiz is included.

## HTTP quick lookup

| Code | Meaning | Use |
| --- | --- | --- |
| 200 | OK | Successful request |
| 201 | Created | New resource created |
| 204 | No Content | Success without a response body |
| 301 | Moved Permanently | Permanent redirect |
| 302 | Found | Temporary redirect |
| 304 | Not Modified | Reuse a cached representation |
| 400 | Bad Request | Invalid request |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Request refused; permission may be insufficient |
| 404 | Not Found | Resource missing or not disclosed |
| 405 | Method Not Allowed | Method unsupported for this resource |
| 409 | Conflict | Conflict with current resource state |
| 422 | Unprocessable Content | Valid syntax, instructions cannot be processed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server failure |
| 502 | Bad Gateway | Invalid upstream response |
| 503 | Service Unavailable | Temporarily unavailable |
| 504 | Gateway Timeout | Upstream response timed out |

## Languages & OOP

### Know what each language is for

Separate a language from its runtime and the environment where it executes.

```text
Python runs scripts/services; JavaScript runs in browsers and on servers.
```

- C is commonly used for procedural systems programming. C++ supports procedural, object-oriented and generic styles; it is not simply C with classes. C# is a separate language targeting .NET, with garbage collection.
- PHP commonly executes on the server to build responses. HTML/CSS describe browser content/presentation; JavaScript can run in browsers and on servers. Python supports scripts, services and data work.
- Name the language and runtime before making a rule about typing, inheritance or memory. PHP supports type declarations even though variables are dynamically typed.

Sources: [C# language overview](https://learn.microsoft.com/en-us/dotnet/csharp/tour-of-csharp/overview), [PHP type declarations](https://www.php.net/manual/en/language.types.declarations.php), [Python classes](https://docs.python.org/3.12/tutorial/classes.html)

### Java runtime and generic types

The JVM runs bytecode; the JDK supplies development tools. Generics describe type parameters.

```text
List<String> names a list of strings; javac compiles Java source.
```

- The JVM executes Java bytecode. A JDK supplies development tools such as javac plus runtime support. JRE is the runtime-environment concept; distribution packaging varies.
- Generics parameterize types: List<String> communicates the element type and enables compile-time checks. A generic is not a sorting algorithm.

Sources: [Java platform overview](https://docs.oracle.com/javase/8/docs/technotes/guides/), [Java classes and overriding](https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html)

### Classes, objects and methods

A class defines a type; an object is an instance with its own state and behavior.

```text
class User: ...
user = User()
# OOP: abstraction, encapsulation, inheritance, polymorphism.
```

- A class describes a type; an object is an instance. Instantiation creates an instance: Python uses ClassName(...), while Java commonly uses new ClassName(...).
- Methods operate through an object or class. Instance state belongs to a particular object; class-level mutable state can accidentally be shared.
- The common four OOP teaching concepts are abstraction, encapsulation, inheritance and polymorphism. Explain a concrete example, not just the list.

Sources: [Python classes](https://docs.python.org/3.12/tutorial/classes.html), [Java classes and overriding](https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html)

### Choose a collection

Choose a structure by the operations you need, not by habit.

```text
dict: key lookup · set: membership · list: ordered items · deque: queue
```

- Use a sequence for ordered values, a set for uniqueness/membership, and a dictionary for key/value lookup or counts.
- A stack is LIFO; a queue is FIFO. In Python, list append/pop supports a stack; deque append/popleft supports a queue without shifting every remaining element.
- A heap supports repeated access to the highest-priority item without fully sorting all values. Python 3.12 heapq is a min-heap.

Sources: [Python Counter and deque](https://docs.python.org/3.12/library/collections.html), [Python heapq](https://docs.python.org/3.12/library/heapq.html)

### Abstraction and encapsulation in practice

Abstraction exposes a useful contract; encapsulation protects state and invariants.

```text
account.deposit(10) can validate the amount.
A public balance setter could bypass that rule.
```

- Abstraction exposes an understandable contract while hiding irrelevant details. Encapsulation controls how state can be accessed/changed and protects invariants.
- A deposit(amount) operation can reject a negative amount. An unrestricted setBalance(value) can bypass the same invariant even though it is a setter.
- Composition supplies collaborators; inheritance creates a subtype relationship. Prefer a relationship that matches the contract you need rather than inheriting solely for code reuse.

Sources: [Java classes and overriding](https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html), [Python classes](https://docs.python.org/3.12/tutorial/classes.html)

### Polymorphism, overloading and overriding

A shared contract can have several implementations. Overloading and overriding have language-specific rules.

```text
storage.save(record) works with different adapters.
Java overloads differ in parameters, not return type alone.
```

- Polymorphism lets callers use a shared contract with different implementations. For example, several storage adapters can implement save(record).
- Java overloading uses different parameter signatures under the same name. Overriding supplies a subtype implementation of an inherited instance method with compatible signature and return rules.
- Return type alone cannot distinguish Java overloads. Python does not implement Java-style runtime overloads by repeating def with the same name; the later definition replaces the earlier binding.

Sources: [Java classes and overriding](https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html), [Python classes](https://docs.python.org/3.12/tutorial/classes.html)

### Interfaces and abstract classes: Java scope

An interface specifies a contract; an abstract class can also share instance state and implementation.

```text
Java: one direct class superclass, multiple interfaces.
Python permits multiple class bases.
```

- A Java abstract class can share instance state and implementations but cannot be directly instantiated. It can be abstract even without abstract methods.
- A modern Java interface defines a contract and can also have default, static and private methods plus constants. It has no instance fields.
- A Java class has one direct class superclass and can implement multiple interfaces. This is not universal across languages; Python permits multiple class bases.

Sources: [Java interface specification](https://docs.oracle.com/javase/specs/jls/se25/html/jls-9.html), [Java classes and overriding](https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html)

## HTTP & APIs

### From URL to a rendered page

A page load involves finding the server, securing the connection, requesting resources and rendering them.

```text
DNS → connection/TLS → HTTP → HTML/DOM + CSS + JavaScript
```

- A browser locates a server, establishes a connection, requests resources and processes responses. HTTPS adds TLS protection. Caches can avoid some network requests.
- HTML is parsed into a DOM tree; CSS styles content; JavaScript handles behavior. Not every click needs a new server-rendered page.
- The DOM is a document programming interface, not the JavaScript language. <!doctype html> selects standards rendering; it does not validate your markup.

Sources: [How the internet works (MDN)](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/How_does_the_Internet_work), [DOM (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model), [DOCTYPE (MDN)](https://developer.mozilla.org/en-US/docs/Glossary/Doctype)

### HTTP requests and responses

HTTP methods express request intent; status codes describe the result. HTTPS protects traffic in transit.

```text
GET /users/7 → 200
POST /users → 201
401: authentication · 403: permission
```

- GET retrieves a representation with intended read-only semantics. POST asks the target resource to process submitted content. Method semantics do not guarantee secrecy.
- 200: success; 201: created; 400: bad request; 401: authentication needed/invalid; 403: forbidden; 404: resource not found/disclosed; 405: method not allowed; 500: server error.
- Headers, URL and body all carry request information. A POST body is observable to endpoints and potentially logs; protect sensitive traffic with HTTPS and appropriate logging.

Sources: [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html), [HTTP methods (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods)

### React, JSX, forms and CSS

Components describe UI; state drives updates. Keep rendering, validation and network behavior distinct.

```text
JSX: {user.name}
JSON: {"name": "Ari"}
They serve different purposes.
```

- React components describe UI. JSX is syntax transformed into JavaScript; braces embed JavaScript expressions. JSON exchanges data; it is not JSX.
- State changes schedule UI updates. Form UI, state handling and validation are different responsibilities. Yup supplies schema parsing/validation, not form widgets.
- A CSS class is reusable across elements. An HTML id should be unique in the document. Flexbox lays out one main axis at a time; grid supports two-dimensional layouts.

Sources: [React: writing JSX](https://react.dev/learn/writing-markup-with-jsx), [Yup schema validation](https://github.com/jquense/yup), [CSS flexbox (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox)

### API security and repeatable requests

Authenticate identity, authorize each operation, validate input and parameterize SQL.

```text
WHERE email = ? -- parameter bound separately
Never trust a hidden UI button as an access-control boundary.
```

- Prevent SQL injection by binding values with parameterized statements; do not concatenate untrusted input into SQL. Dynamically chosen table/column names need allowlisting or supported identifier composition.
- Authentication identifies the caller; authorization checks that caller’s permitted action on a particular resource. Validate inputs server-side and minimize sensitive logging.
- Safe methods request read-only behavior. Idempotent methods have the same intended effect when repeated; GET, PUT and DELETE are idempotent by HTTP semantics, while POST is not inherently so. Response codes may differ across repeats.

Sources: [OWASP: SQL injection](https://community.owasp.org/attacks/SQL_Injection), [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html), [Fielding: REST architectural style](https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm)

### REST, SOAP and the web contract

Define resources, methods, validation, permissions, pagination and predictable errors.

```text
PUT /users/7 repeats the intended replacement effect.
A retryable POST may need an idempotency key.
```

- REST is an architectural style with client/server separation, stateless requests, caching constraints, a uniform interface and layers (optional code on demand). JSON over HTTP alone does not prove REST compliance.
- SOAP defines an XML envelope/messaging framework with transport bindings, commonly HTTP. It does not inherently force a stateful session or HTML messages.
- For an HTTP resource API, define representations, methods, status codes, validation, pagination, permissions and error behavior. Stateless requests do not mean the database stores no state.

Sources: [Fielding: REST architectural style](https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm), [SOAP 1.2 messaging specification](https://www.w3.org/TR/soap12-part1/), [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html)

## SQL & data

### Read and modify relational data

Select the columns and rows you need. Treat missing values explicitly.

```text
SELECT name FROM users WHERE active = TRUE;
WHERE deleted_at IS NULL -- not = NULL
```

- SELECT projects columns; FROM chooses input; WHERE filters rows; INSERT adds rows; UPDATE changes rows; DELETE removes rows. DDL such as CREATE/ALTER/DROP changes schema objects.
- Use explicit columns and a deliberate WHERE for modifications. NULL represents missing/unknown data; compare with IS NULL rather than = NULL.
- SQL keyword case, identifier case, string comparison and statement terminators are different concerns. PostgreSQL details are examples, not rules for every engine.

Sources: [SQL lexical structure (PostgreSQL)](https://www.postgresql.org/docs/current/sql-syntax-lexical.html), [Database constraints (PostgreSQL)](https://www.postgresql.org/docs/current/ddl-constraints.html)

### Keys and referential integrity

Primary keys identify rows; foreign keys enforce relationships to eligible referenced keys.

```text
orders.customer_id → customers.id
A key can contain more than one column.
```

- A primary key identifies rows through unique, non-null column values; it can be composite. A foreign key requires a matching referenced key unless its null semantics permit otherwise.
- Referenced keys need not be the primary key: eligible unique keys can be referenced. A self-reference can model an employee manager.
- Integrity and performance are separate. PostgreSQL creates a primary-key index, but a key does not guarantee every query will be fast.

Sources: [Database constraints (PostgreSQL)](https://www.postgresql.org/docs/current/ddl-constraints.html)

### Join rows without losing the unmatched ones

INNER JOIN keeps matches; LEFT JOIN also keeps unmatched left rows with NULLs on the right.

```text
FROM customers c LEFT JOIN orders o ON o.customer_id = c.id
Filtering o in WHERE may remove unmatched customers.
```

- INNER retains matches. LEFT retains every left row and matching right rows. RIGHT is the mirrored case. FULL retains matches and unmatched rows from both sides.
- An unmatched outer-join side becomes NULL. Two matching right rows produce two joined rows; joins are not simply set-intersection diagrams.
- A right-side WHERE filter can remove NULL-padded rows from a LEFT join. Put the condition in ON when you intend to preserve unmatched left rows.

Sources: [Joins and grouping (PostgreSQL)](https://www.postgresql.org/docs/current/queries-table-expressions.html)

### Aggregate, group and handle missing values

WHERE filters rows before aggregation; HAVING filters groups afterward.

```text
SELECT customer_id, COUNT(*) FROM orders
GROUP BY customer_id HAVING COUNT(*) > 2;
```

- GROUP BY creates groups for aggregate calculations. WHERE filters input rows; HAVING filters groups. MAX returns the largest non-null value in a group.
- COUNT(*) counts rows; COUNT(column) counts non-null values. In a LEFT join, count the child key to avoid counting a NULL-padded row as a child.

Sources: [Joins and grouping (PostgreSQL)](https://www.postgresql.org/docs/current/queries-table-expressions.html)

### Model data and query performance

Model relationships and access patterns. Indexes help selected reads but cost storage and write work.

```text
Inspect the query plan before adding an index.
Transactions group changes; isolation controls interactions.
```

- Normalization uses dependencies to separate facts and reduce update anomalies. Intentional denormalization can trade more complex writes for faster reads; measure and keep a consistency plan.
- Relational and NoSQL systems both have schemas and constraints in practice. Choose based on access patterns, integrity, transactions, scale and operational needs rather than SQL versus unstructured slogans.
- Indexes cost storage and write maintenance. Inspect a query plan and actual workload before adding one. EXPLAIN ANALYZE executes the query; use it carefully with mutations.
- Clustering can mean physical row organization, a group of servers, or statistical grouping. Clarify which. PostgreSQL CLUSTER reorders a table once and does not keep that ordering automatically.
- Transactions group changes into an all-or-nothing unit; concurrency/isolation still needs deliberate design. This extends the source notes into practical architecture reasoning.

Sources: [Database indexes (PostgreSQL)](https://www.postgresql.org/docs/current/indexes.html), [CLUSTER (PostgreSQL)](https://www.postgresql.org/docs/current/sql-cluster.html), [Reading query plans (PostgreSQL)](https://www.postgresql.org/docs/current/using-explain.html), [Transactions (PostgreSQL)](https://www.postgresql.org/docs/current/tutorial-transactions.html)

## Clean code & testing

### Git and collaboration

Commit records local history; fetch retrieves remote history; merge/rebase integrates it.

```text
git status → review diff → test → commit
A commit is not automatically published.
```

- Git tracks repository history locally. GitHub is a hosting/collaboration service. A commit is local until published to a remote.
- clone creates a local repository; fetch updates remote-tracking information; pull fetches and integrates using its selected strategy. push publishes refs/commits when authorized.
- A branch is a ref within a repository; a fork is a separate hosted repository. Review a diff and tests before proposing a merge.

Sources: [Git pull documentation](https://git-scm.com/docs/git-pull)

### SOLID as design reasoning

SOLID helps reason about responsibilities, contracts and dependency direction.

```text
S: Single Responsibility · O: Open/Closed
L: Liskov Substitution · I: Interface Segregation
D: Dependency Inversion
```

- S: group responsibilities that change for the same reason. O: provide extension points for expected variation. Neither principle requires a separate class for every line.
- L: subtypes preserve the promises of the base contract. I: expose focused interfaces so clients need not depend on unrelated operations.
- D: high-level policy and low-level details depend on abstractions. This is Dependency Inversion. Apply it where change/testing justify the indirection.

Sources: [Architectural principles (Microsoft)](https://learn.microsoft.com/en-gb/dotnet/architecture/modern-web-apps-azure/architectural-principles), [Liskov and Wing: behavioral subtyping](https://www.cs.cmu.edu/afs/cs/project/venari/www/subtype-tr.html)

### Inject collaborators and control coupling

Inject a dependency instead of constructing it inside the code that uses it.

```text
ReportService(storage)
Tests can supply a fake storage implementation.
```

- Dependency injection means providing a collaborator externally. Constructor injection makes required collaborators explicit; method or property injection can fit other lifetimes/frameworks.
- The composition boundary still creates objects, possibly with new. The goal is to move concrete wiring away from business policy, not ban object creation.
- A fake storage adapter lets a test exercise report generation without a live database. Too many dependencies can signal too many responsibilities.

Sources: [Dependency injection (.NET)](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection/overview), [Architectural principles (Microsoft)](https://learn.microsoft.com/en-gb/dotnet/architecture/modern-web-apps-azure/architectural-principles)

### Unit, integration and end-to-end tests

Test behavior at the smallest useful boundary, then cover important connections and user journeys.

```text
Unit: price calculation
Integration: repository + database
E2E: browser completes a workflow
```

- Include failure paths, boundaries and alternate valid inputs. A passing suite proves its assertions for the tested cases, not the absence of defects.
- Mock external boundaries deliberately; too much mocking can hide integration failures.

Sources: [Testing strategies (Microsoft)](https://learn.microsoft.com/en-us/dotnet/core/testing/)

### Debug a production issue

Reproduce or characterize the failure, narrow its scope, test a hypothesis and verify the fix.

```text
Symptoms → logs/request ID → smallest reproduction
→ root cause → regression test → monitored rollout
```

- Avoid recording credentials or sensitive payloads in diagnostic logs. Distinguish the root cause from a workaround.
- Change one relevant variable at a time; use measurements rather than guessing where time is spent.

Sources: [Debugging (Python)](https://docs.python.org/3.12/library/pdb.html)

### Write understandable functions

Use specific names, cohesive responsibilities and explicit inputs/outputs. Keep error behavior deliberate.

```text
parse_user_input(text)
validate_user(user)
save_user(user)
```

- Separate pure transformations from I/O where useful. Avoid both giant functions and needless layers.
- Explain why an abstraction helps this codebase; do not apply a design principle as an automatic rule.

Sources: [Architectural principles (Microsoft)](https://learn.microsoft.com/en-gb/dotnet/architecture/modern-web-apps-azure/architectural-principles)

## System design

### Explain a small system for a customer

Start with requirements, follow the request/data flow, then explain failures and tradeoffs.

```text
Browser → authenticated API → database
What happens when the database is slow or unavailable?
```

- Start with users, core operations, data sensitivity, scale and reliability needs. Trace browser → API → data store, then discuss one failure path and one measurable tradeoff. This is an application exercise extending the source material.
- MVC separates model/data-domain behavior, view/presentation and controller/input coordination. Frameworks apply these boundaries differently.
- A dynamic address is typically leased by DHCP and may remain the same for long periods. Static configuration or a reservation provides predictable addressing; dynamic does not mean every request gets a new IP.

Sources: [Fielding: REST architectural style](https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm), [Transactions (PostgreSQL)](https://www.postgresql.org/docs/current/tutorial-transactions.html), [DHCP, RFC 2131](https://www.rfc-editor.org/rfc/rfc2131)

### Caching and stale data

Reuse a previous result to reduce repeated work; decide how stale it may be and how it expires.

```text
Read cache → miss → read database → cache result
TTL bounds freshness; invalidation handles changes.
```

- Consider keys, eviction, invalidation, cache misses and sensitive-data scope. A cache should not accidentally share one user’s result with another.
- A cache outage or synchronized expiry can push traffic back onto the database.

Sources: [Cache-aside pattern (Microsoft)](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)

### Queues, retries and idempotency

A queue decouples request handling from background work. Plan for duplicates and failures.

```text
API → queue → worker → saved result
Job ID + idempotent write makes retries safer.
```

- At-least-once delivery can repeat work. Bound retry attempts, use backoff where appropriate and inspect failed jobs.
- A queue helps absorb bursts; it does not make slow work disappear or guarantee exactly-once effects.

Sources: [Competing consumers (Microsoft)](https://learn.microsoft.com/en-us/azure/architecture/patterns/competing-consumers)

### Load balancing and availability

Distribute traffic across healthy instances and identify the dependencies that still limit availability.

```text
Load balancer → stateless application replicas → database
Health checks route around unhealthy replicas.
```

- Horizontal scaling adds instances; vertical scaling adds resources to an instance. Both have costs and limits.
- Consider state/session handling, database capacity, timeouts, backups and tested recovery. Replicas alone do not guarantee reliability.

Sources: [Load-balancing concepts (AWS)](https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html)

### Race conditions and atomic changes

Concurrent requests can read the same old state and overwrite each other. Protect the whole operation.

```text
Two buyers see stock = 1.
Use an atomic conditional update or an appropriate transaction.
```

- Transactions provide atomic grouping, but isolation and locking choices still matter. Read-modify-write in application code is not automatically atomic.
- Consider contention, deadlocks and retry behavior. Explain the database’s guarantees rather than assuming them.

Sources: [Transactions (PostgreSQL)](https://www.postgresql.org/docs/current/tutorial-transactions.html)

## Algorithms

### Insertion and bubble sort

Insertion sort grows a sorted prefix. Bubble sort repeatedly swaps adjacent inversions.

```text
Typical array implementations: O(n²) worst-case time.
An early-exit implementation can improve best-case behavior.
```

- Insertion sort grows a sorted prefix by inserting the next value. Typical stable array insertion sort uses O(n²) worst-case time and O(1) extra storage; already-sorted input can be O(n).
- Ordinary bubble sort swaps adjacent out-of-order values and settles an extreme at one end per pass. With an early-exit flag its best case is O(n), but its worst case remains O(n²).
- For nearly sorted data, insertion sort is usually the stronger teaching/default choice between these two. Do not choose an algorithm only from its best-case bound.

Sources: [Princeton algorithms summary](https://algs4.cs.princeton.edu/cheatsheet/)

### Merge sort and quicksort

Merge sort combines sorted pieces; quicksort partitions around a pivot.

```text
Merge sort: O(n log n) typical/worst time.
Quicksort: average O(n log n), worst O(n²).
```

- Typical array merge sort divides, sorts and merges. It guarantees O(n log n) worst-case time and usually needs O(n) auxiliary storage; stable merging preserves equal-key order.
- Quicksort partitions around a pivot. Randomized/ordinary average analysis gives O(n log n), but very unbalanced partitions can produce O(n²). Recursion space depends on partition balance and implementation.
- Median-of-three is a pivot heuristic, not a universal worst-case guarantee. State the implementation before calling a sort stable or in-place.

Sources: [Princeton algorithms summary](https://algs4.cs.princeton.edu/cheatsheet/)

### Binary heaps and heapsort

A heap gives efficient repeated access to the highest-priority item; it is not a fully sorted sequence.

```text
heapq.heappush(heap, value)
smallest = heapq.heappop(heap) # Python 3.12 min-heap
```

- A binary heap is a complete binary tree represented conveniently as an array. In a max-heap each parent is at least its children; siblings and distant nodes need not be ordered.
- Bottom-up heap construction is O(n). Sift-down at a node is O(log n) assuming its child subtrees already satisfy the heap property.
- Heapsort swaps the max root with the end of the active heap and repairs the reduced heap. It gives O(n log n) worst-case time and O(1) auxiliary array storage; ordinary heapsort is not stable.

Sources: [Python heapq](https://docs.python.org/3.12/library/heapq.html), [Princeton algorithms summary](https://algs4.cs.princeton.edu/cheatsheet/)

### Turn source coding notes into Blind 75 preparation

Recognize the constraint and invariant before choosing a code template.

```text
Contiguous range → consider sliding window.
Sorted search space → consider binary search.
```

- First clarify output meaning and edge cases. Frequency maps solve counting/mode/anagram checks; sets handle membership; two pointers handle ordered scans; a queue supports breadth-first traversal.
- Use the fixed Blind 75 path for full coding practice. Historical non-Blind-75 links are source context, not additions to the required problem inventory. Old COMPLETED labels do not imply current recall.
- For a maximum number of disjoint teams needing one p,c,m,b,z each, the bottleneck is the minimum of their counts. Distinguish maximum simultaneous teams from counting every possible combination.
- The source’s second team input includes o and cannot support its stated answer of 3. Reject invalid symbols under the stated contract. A corrected valid example bbbbcccmmmmppppzzzz yields 3.

Sources: [Python Counter and deque](https://docs.python.org/3.12/library/collections.html)

### Explain a solution and its boundaries

Explain the approach, invariant, edge cases and complexity; trace a small input.

```text
What stays true each iteration?
What happens for empty input, duplicates and boundaries?
```

- For an engineering interview, state inputs/outputs, an invariant, data structure, time/space and at least one boundary case. A passing sample is not proof of correctness.
- Fibonacci: define F0=0,F1=1, then reuse earlier states instead of exponential repeated recursion. For primes below N, the sieve marks composite multiples; test N<=2.
- For duplicate item records, clarify whether you count extra occurrences or every matching pair, and which attributes define identity. For matrices, distinguish unique-row storage from repeated shared references.

Sources: [Python Counter and deque](https://docs.python.org/3.12/library/collections.html), [Princeton algorithms summary](https://algs4.cs.princeton.edu/cheatsheet/)

## Projects & teamwork

### Agile and Scrum without the slogans

Work in small increments, inspect outcomes and adapt. Scrum is one framework, not a synonym for Agile.

```text
Review: inspect the product.
Retrospective: improve how the team works.
```

- Agile emphasizes working software, collaboration, adaptation and feedback. It is not a prescribed sequential checklist and does not require Scrum.
- Scrum uses fixed-length Sprints of one month or less. Planning sets the Sprint Goal; Daily Scrum inspects progress; Review inspects outcomes; Retrospective improves how the team works.
- Product Owner, Scrum Master and Developers have distinct accountabilities. The Daily Scrum is not primarily a manager status report. An increment must meet the Definition of Done.

Sources: [Agile Manifesto principles](https://agilemanifesto.org/principles.html), [The Scrum Guide](https://scrumguides.org/scrum-guide.html)

### Tell a truthful project and teamwork story

Explain a specific problem, your contribution, evidence of the outcome and what you learned.

```text
Situation → task → action → result
Distinguish personal work from team outcomes.
```

- Use a short situation → task → your action → result → lesson outline. Explain what you personally did and what evidence supports the result; do not invent metrics or borrow somebody else’s outcome.
- Prepare distinct examples for learning something unfamiliar, a technical setback, collaboration/conflict, leadership, failure and a meaningful achievement. Historical source stories are private prompts, not verified scripts.
- Describe constraints professionally. Explain your response, tradeoff and learning instead of blaming teammates or making unverifiable accusations. Update career stage and current experience before rehearsing.

### Motivation, role fit and questions to ask

Connect your experience to the role and ask how the team builds and operates software.

```text
How are releases tested?
How does the team investigate production incidents?
```

- For “why this company,” connect verified current work to your relevant experience and the contribution you want to make. Replace dated company claims and vague “nothing to lose” wording with a concrete fit.
- State Python experience honestly: distinguish what you can read, build independently, explain with help and are still practicing. For engineering emphasize implementation; for solutions architecture emphasize customer needs and tradeoffs while keeping technical depth.
- Useful questions cover actual projects, onboarding, success measures, collaboration, technical ownership, SQL/data expectations, customer feedback and growth. Historical hiring anecdotes are not promises about the next interview.
