import { topics } from './content.js'

export const categories = [
  ['fundamentals', 'Languages & OOP'], ['web', 'HTTP & APIs'], ['data', 'SQL & data'],
  ['quality', 'Clean code & testing'], ['design', 'System design'],
  ['algorithms', 'Algorithms'], ['career', 'Projects & teamwork'],
]

// Concise, independently written explanations. Original reviewed notes and
// sources remain available as deeper detail, rather than filling every card.
const cards = {
  languages: ['fundamentals', 'Separate a language from its runtime and the environment where it executes.', 'Python runs scripts/services; JavaScript runs in browsers and on servers.'],
  runtime: ['fundamentals', 'The JVM runs bytecode; the JDK supplies development tools. Generics describe type parameters.', 'List<String> names a list of strings; javac compiles Java source.'],
  objects: ['fundamentals', 'A class defines a type; an object is an instance with its own state and behavior.', 'class User: ...\nuser = User()\n# OOP: abstraction, encapsulation, inheritance, polymorphism.'],
  collections: ['fundamentals', 'Choose a structure by the operations you need, not by habit.', 'dict: key lookup · set: membership · list: ordered items · deque: queue'],
  git: ['quality', 'Commit records local history; fetch retrieves remote history; merge/rebase integrates it.', 'git status → review diff → test → commit\nA commit is not automatically published.'],
  browser: ['web', 'A page load involves finding the server, securing the connection, requesting resources and rendering them.', 'DNS → connection/TLS → HTTP → HTML/DOM + CSS + JavaScript'],
  http: ['web', 'HTTP methods express request intent; status codes describe the result. HTTPS protects traffic in transit.', 'GET /users/7 → 200\nPOST /users → 201\n401: authentication · 403: permission'],
  'sql-basics': ['data', 'Select the columns and rows you need. Treat missing values explicitly.', 'SELECT name FROM users WHERE active = TRUE;\nWHERE deleted_at IS NULL -- not = NULL'],
  keys: ['data', 'Primary keys identify rows; foreign keys enforce relationships to eligible referenced keys.', 'orders.customer_id → customers.id\nA key can contain more than one column.'],
  joins: ['data', 'INNER JOIN keeps matches; LEFT JOIN also keeps unmatched left rows with NULLs on the right.', 'FROM customers c LEFT JOIN orders o ON o.customer_id = c.id\nFiltering o in WHERE may remove unmatched customers.'],
  grouping: ['data', 'WHERE filters rows before aggregation; HAVING filters groups afterward.', 'SELECT customer_id, COUNT(*) FROM orders\nGROUP BY customer_id HAVING COUNT(*) > 2;'],
  frontend: ['web', 'Components describe UI; state drives updates. Keep rendering, validation and network behavior distinct.', 'JSX: {user.name}\nJSON: {"name": "Ari"}\nThey serve different purposes.'],
  encapsulation: ['fundamentals', 'Abstraction exposes a useful contract; encapsulation protects state and invariants.', 'account.deposit(10) can validate the amount.\nA public balance setter could bypass that rule.'],
  polymorphism: ['fundamentals', 'A shared contract can have several implementations. Overloading and overriding have language-specific rules.', 'storage.save(record) works with different adapters.\nJava overloads differ in parameters, not return type alone.'],
  interfaces: ['fundamentals', 'An interface specifies a contract; an abstract class can also share instance state and implementation.', 'Java: one direct class superclass, multiple interfaces.\nPython permits multiple class bases.'],
  agile: ['career', 'Work in small increments, inspect outcomes and adapt. Scrum is one framework, not a synonym for Agile.', 'Review: inspect the product.\nRetrospective: improve how the team works.'],
  'sort-simple': ['algorithms', 'Insertion sort grows a sorted prefix. Bubble sort repeatedly swaps adjacent inversions.', 'Typical array implementations: O(n²) worst-case time.\nAn early-exit implementation can improve best-case behavior.'],
  'sort-divide': ['algorithms', 'Merge sort combines sorted pieces; quicksort partitions around a pivot.', 'Merge sort: O(n log n) typical/worst time.\nQuicksort: average O(n log n), worst O(n²).'],
  heap: ['algorithms', 'A heap gives efficient repeated access to the highest-priority item; it is not a fully sorted sequence.', 'heapq.heappush(heap, value)\nsmallest = heapq.heappop(heap) # Python 3.12 min-heap'],
  solid: ['quality', 'SOLID helps reason about responsibilities, contracts and dependency direction.', 'S: Single Responsibility · O: Open/Closed\nL: Liskov Substitution · I: Interface Segregation\nD: Dependency Inversion'],
  di: ['quality', 'Inject a dependency instead of constructing it inside the code that uses it.', 'ReportService(storage)\nTests can supply a fake storage implementation.'],
  'database-design': ['data', 'Model relationships and access patterns. Indexes help selected reads but cost storage and write work.', 'Inspect the query plan before adding an index.\nTransactions group changes; isolation controls interactions.'],
  security: ['web', 'Authenticate identity, authorize each operation, validate input and parameterize SQL.', 'WHERE email = ? -- parameter bound separately\nNever trust a hidden UI button as an access-control boundary.'],
  'api-design': ['web', 'Define resources, methods, validation, permissions, pagination and predictable errors.', 'PUT /users/7 repeats the intended replacement effect.\nA retryable POST may need an idempotency key.'],
  patterns: ['algorithms', 'Recognize the constraint and invariant before choosing a code template.', 'Contiguous range → consider sliding window.\nSorted search space → consider binary search.'],
  reasoning: ['algorithms', 'Explain the approach, invariant, edge cases and complexity; trace a small input.', 'What stays true each iteration?\nWhat happens for empty input, duplicates and boundaries?'],
  architecture: ['design', 'Start with requirements, follow the request/data flow, then explain failures and tradeoffs.', 'Browser → authenticated API → database\nWhat happens when the database is slow or unavailable?'],
  stories: ['career', 'Explain a specific problem, your contribution, evidence of the outcome and what you learned.', 'Situation → task → action → result\nDistinguish personal work from team outcomes.'],
  interview: ['career', 'Connect your experience to the role and ask how the team builds and operates software.', 'How are releases tested?\nHow does the team investigate production incidents?'],
}

const extra = (id, category, title, summary, example, notes, sources) => ({ id, category, title, summary, example, notes, sources })
export const referenceTopics = [
  ...topics.map(topic => ({ ...topic, category: cards[topic.id][0], summary: cards[topic.id][1], example: cards[topic.id][2] })),
  extra('testing', 'quality', 'Unit, integration and end-to-end tests', 'Test behavior at the smallest useful boundary, then cover important connections and user journeys.', 'Unit: price calculation\nIntegration: repository + database\nE2E: browser completes a workflow', ['Include failure paths, boundaries and alternate valid inputs. A passing suite proves its assertions for the tested cases, not the absence of defects.', 'Mock external boundaries deliberately; too much mocking can hide integration failures.'], ['testing']),
  extra('debugging', 'quality', 'Debug a production issue', 'Reproduce or characterize the failure, narrow its scope, test a hypothesis and verify the fix.', 'Symptoms → logs/request ID → smallest reproduction\n→ root cause → regression test → monitored rollout', ['Avoid recording credentials or sensitive payloads in diagnostic logs. Distinguish the root cause from a workaround.', 'Change one relevant variable at a time; use measurements rather than guessing where time is spent.'], ['debugging']),
  extra('clean-functions', 'quality', 'Write understandable functions', 'Use specific names, cohesive responsibilities and explicit inputs/outputs. Keep error behavior deliberate.', 'parse_user_input(text)\nvalidate_user(user)\nsave_user(user)', ['Separate pure transformations from I/O where useful. Avoid both giant functions and needless layers.', 'Explain why an abstraction helps this codebase; do not apply a design principle as an automatic rule.'], ['solid']),
  extra('caching', 'design', 'Caching and stale data', 'Reuse a previous result to reduce repeated work; decide how stale it may be and how it expires.', 'Read cache → miss → read database → cache result\nTTL bounds freshness; invalidation handles changes.', ['Consider keys, eviction, invalidation, cache misses and sensitive-data scope. A cache should not accidentally share one user’s result with another.', 'A cache outage or synchronized expiry can push traffic back onto the database.'], ['caching']),
  extra('queues', 'design', 'Queues, retries and idempotency', 'A queue decouples request handling from background work. Plan for duplicates and failures.', 'API → queue → worker → saved result\nJob ID + idempotent write makes retries safer.', ['At-least-once delivery can repeat work. Bound retry attempts, use backoff where appropriate and inspect failed jobs.', 'A queue helps absorb bursts; it does not make slow work disappear or guarantee exactly-once effects.'], ['queues']),
  extra('scaling', 'design', 'Load balancing and availability', 'Distribute traffic across healthy instances and identify the dependencies that still limit availability.', 'Load balancer → stateless application replicas → database\nHealth checks route around unhealthy replicas.', ['Horizontal scaling adds instances; vertical scaling adds resources to an instance. Both have costs and limits.', 'Consider state/session handling, database capacity, timeouts, backups and tested recovery. Replicas alone do not guarantee reliability.'], ['balancing']),
  extra('concurrency', 'design', 'Race conditions and atomic changes', 'Concurrent requests can read the same old state and overwrite each other. Protect the whole operation.', 'Two buyers see stock = 1.\nUse an atomic conditional update or an appropriate transaction.', ['Transactions provide atomic grouping, but isolation and locking choices still matter. Read-modify-write in application code is not automatically atomic.', 'Consider contention, deadlocks and retry behavior. Explain the database’s guarantees rather than assuming them.'], ['transactions']),
]

export const httpCodes = [
  [200, 'OK', 'Successful request'], [201, 'Created', 'New resource created'], [204, 'No Content', 'Success without a response body'],
  [301, 'Moved Permanently', 'Permanent redirect'], [302, 'Found', 'Temporary redirect'], [304, 'Not Modified', 'Reuse a cached representation'],
  [400, 'Bad Request', 'Invalid request'], [401, 'Unauthorized', 'Missing or invalid authentication'], [403, 'Forbidden', 'Request refused; permission may be insufficient'],
  [404, 'Not Found', 'Resource missing or not disclosed'], [405, 'Method Not Allowed', 'Method unsupported for this resource'], [409, 'Conflict', 'Conflict with current resource state'],
  [422, 'Unprocessable Content', 'Valid syntax, instructions cannot be processed'], [429, 'Too Many Requests', 'Rate limit exceeded'],
  [500, 'Internal Server Error', 'Unexpected server failure'], [502, 'Bad Gateway', 'Invalid upstream response'], [503, 'Service Unavailable', 'Temporarily unavailable'], [504, 'Gateway Timeout', 'Upstream response timed out'],
]

export function filterReference(query = '', category = 'all') {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  return referenceTopics.filter(topic => (category === 'all' || topic.category === category) && words.every(word => `${categories.find(([id]) => id === topic.category)?.[1]} ${topic.id} ${topic.title} ${topic.summary} ${topic.example} ${topic.notes.join(' ')}`.toLowerCase().includes(word)))
}
