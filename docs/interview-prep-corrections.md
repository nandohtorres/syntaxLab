# Interview notes: corrections and scope

Source snapshots read on 2026-10-19; originals remain unchanged:

1. User-provided Google Docs download, `C:\Users\ferna\Downloads\Paycom Interview.pdf`, dated 2026-04-22, 21 pages. SHA-256: `67f179d434fdef94c32e381e6b60642a8918af26ce6474cb82aa932735340d3b`.
2. `career/interview-prep/INTERVIEW_STUDY_GUIDE.md`, the reusable derivative. SHA-256: `554153eaa8cc318c7a08908b58121ce2b1a1fe747b7cce0ac6cb9f4b926ecef0`.

The guide is a derivative of the PDF, not independent confirmation. Section/page references preserve provenance. This rewrite checks technical traps against primary documentation, labels added application/coaching exercises, omits private stories and company hiring claims, and keeps the required coding inventory at the original Blind 75. No historical COMPLETED marks are imported into progress.

Company-specific claims and private example answers are intentionally not reproduced. This is a new reusable rewrite; it does not overwrite either source. References were checked on 2026-10-19. Java-specific claims use Java scope; database examples identify PostgreSQL rather than generalizing every vendor.

## SQL case sensitivity

Source: Guide §3; PDF p3.

SQL keywords are generally case insensitive. Quoted identifiers, text comparisons and collations have engine-specific rules. Statement terminators depend on the client/context.

Verification: [SQL lexical structure (PostgreSQL)](https://www.postgresql.org/docs/current/sql-syntax-lexical.html).

## Primary and foreign keys

Source: Guide §3; PDF p4.

A primary key enforces uniqueness and non-nullness, not universal query speed. Foreign keys may reference eligible unique keys, including in the same table.

Verification: [Database constraints (PostgreSQL)](https://www.postgresql.org/docs/current/ddl-constraints.html).

## Outer joins

Source: Guide §3; PDF p4.

FULL OUTER JOIN retains matched rows and unmatched rows from both sides, padding missing values with NULL. Multiple matches can multiply rows.

Verification: [Joins and grouping (PostgreSQL)](https://www.postgresql.org/docs/current/queries-table-expressions.html).

## SOLID D

Source: Guide §4; PDF p6.

D means Dependency Inversion. Dependency injection is a technique that can support it, not the name of the principle.

Verification: [Architectural principles (Microsoft)](https://learn.microsoft.com/en-gb/dotnet/architecture/modern-web-apps-azure/architectural-principles), [Dependency injection (.NET)](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection/overview).

## Liskov substitution

Source: Guide §4; PDF p6.

Preserve the behavioral contract of the base type. Merely keeping method names or adding features does not establish substitutability.

Verification: [Liskov and Wing: behavioral subtyping](https://www.cs.cmu.edu/afs/cs/project/venari/www/subtype-tr.html).

## Interfaces

Source: Guide §§4,11; PDF pp5,14.

Modern Java interfaces can declare default, static and private methods plus constants. They have no per-instance fields. Abstraction percentages are not a useful rule.

Verification: [Java interface specification](https://docs.oracle.com/javase/specs/jls/se25/html/jls-9.html).

## Inheritance scope

Source: Guide §§4,11; PDF p14.

One class superclass is a Java rule, not a universal OOP rule. Python supports multiple class inheritance.

Verification: [Java classes and overriding](https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html), [Python classes](https://docs.python.org/3.12/tutorial/classes.html).

## Overriding

Source: Guide §11; PDF p12.

In Java, overriding preserves the method signature and permits a covariant reference return. It does not permit arbitrary parameter-type changes. Return type alone cannot overload a method.

Verification: [Java classes and overriding](https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html).

## Encapsulation

Source: Guide §§4,11; PDF pp5,13.

Controlled access and invariant preservation matter; adding unrestricted getters/setters alone does not protect state.

Verification: [Python classes](https://docs.python.org/3.12/tutorial/classes.html), [Java classes and overriding](https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html).

## Dependency injection

Source: Guide §11; PDF p14.

Supply collaborators externally. Constructor injection is often useful, but not the only form. Object creation with new still happens at a composition boundary.

Verification: [Dependency injection (.NET)](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection/overview).

## Agile and Scrum

Source: Guide §5; PDF p7.

Agile does not require Sprints. Scrum has Sprints of one month or less, an explicit Sprint Goal, Review and Retrospective; it does not guarantee faster delivery.

Verification: [Agile Manifesto principles](https://agilemanifesto.org/principles.html), [The Scrum Guide](https://scrumguides.org/scrum-guide.html).

## Git versus GitHub

Source: Guide §6; PDF p7.

Git is the version-control system. GitHub hosts repositories and collaboration. Pull fetches and then integrates according to options/configuration, potentially by rebase.

Verification: [Git pull documentation](https://git-scm.com/docs/git-pull).

## PHP types

Source: Guide §7; PDF p8.

PHP is dynamically typed and supports parameter, return and property declarations; coercion and strict_types affect scalar calls. Type declarations are not universally absent.

Verification: [PHP type declarations](https://www.php.net/manual/en/language.types.declarations.php).

## Yup and JSX

Source: Guide §8; PDF pp8,13.

Yup validates/parses schemas; it does not create form UI. JSON is a data format. JSX is a JavaScript syntax extension for UI markup, not the usual REST data format.

Verification: [Yup schema validation](https://github.com/jquense/yup), [React: writing JSX](https://react.dev/learn/writing-markup-with-jsx).

## GET and POST

Source: Guide §11; PDF p12.

Safe means intended read-only semantics, not zero logging or security. POST is not inherently secret and need not always mutate data; HTTPS protects either method in transit.

Verification: [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html), [HTTP methods (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods).

## HTTP 405

Source: Guide §11; PDF p15.

405 means Method Not Allowed, not Method Not Found. A 404 can also intentionally conceal a resource; it is not always a malformed URL.

Verification: [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html).

## DOCTYPE

Source: Guide §11; PDF p16.

The HTML doctype selects standards/no-quirks rendering. It does not validate the page or guarantee future compatibility.

Verification: [DOCTYPE (MDN)](https://developer.mozilla.org/en-US/docs/Glossary/Doctype).

## SOAP and REST

Source: Guide §11; PDF pp16–17.

SOAP is an XML messaging protocol with transport bindings; REST is an architectural style. SOAP does not inherently require sessions, and neither label guarantees scalability.

Verification: [SOAP 1.2 messaging specification](https://www.w3.org/TR/soap12-part1/), [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html).

## Database clustering

Source: Guide §11; PDF pp14–15.

Clarify the context: indexed physical row ordering, multiple database servers, and statistical clustering are distinct meanings. PostgreSQL CLUSTER is a one-time table reordering.

Verification: [CLUSTER (PostgreSQL)](https://www.postgresql.org/docs/current/sql-cluster.html).

## Heaps and sorting

Source: Guide §2; PDF pp2–3.

A binary heap is complete and partially ordered, with non-strict parent inequalities. Sift-down assumes child subtrees are heaps, not sorted arrays. Ordinary bubble sort settles one end per pass; it is rarely the preferred nearly-sorted choice.

Verification: [Python heapq](https://docs.python.org/3.12/library/heapq.html), [Princeton algorithms summary](https://algs4.cs.princeton.edu/cheatsheet/).

## Teams example

Source: Guide §13; PDF p19.

mppzombpzcmpmzz contains an invalid o and counts p=4,c=1,m=4,b=1,z=4. It cannot establish an answer of 3. Under the stated alphabet rule reject it; with an explicit ignore-other policy it yields 1. The separate string bbbbcccmmmmppppzzzz yields 3.

Verification: source-text inspection; counts reproduced with Python Counter and sorting.

## Historical interview notes

Source: Guide §§0,9,10,12,13; PDF pp1,9–12,17–21.

Company awards, hiring rounds, completed-problem marks and personal stories are historical notes, not current verified promises or evidence of retained skill. Use truthful, updated examples; personal prose is not bundled here.

Scope decision: preserve these as historical/private source context, rather than verified reusable facts.

## Coverage and additions

All reusable source topic groups appear in the cheat sheet: sorting/heaps; SQL and DBMS; OOP/SOLID; Agile/Scrum; Git; language/runtime distinctions; React/JSX/DOM/HTML/CSS; HTTP/REST/SOAP; collection/pattern reasoning; general networking/MVC; behavioral/team answers and interviewer questions. Added examples extend these notes into practice: NULL/counting traps, transaction/failure reasoning, per-resource authorization, a short architecture explanation and explicit self-check criteria. These additions are not claims that the original PDF covered them in depth.

The duplicate-count/team exercises train prerequisite reasoning; they do not add non-Blind-75 problems to Python Path. Sieve/Fibonacci and other source topics are explanatory refreshers. Full runnable coding practice remains in Python Path.
