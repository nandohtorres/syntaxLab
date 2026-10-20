# Python Path: first-exercise mockup

A standalone, interactive preview for UI feedback. The existing application and
question API are unchanged. Only the first exercise is implemented; the path
sidebar is an outline, and Next shows the end of this preview.

From the `synlab-codex` worktree root:

```powershell
node frontend/mockups/python-path/serve.mjs
```

Open **http://127.0.0.1:4315/**. Ctrl+C stops the local server.
The helper reads existing dependencies from this frontend's `node_modules`, or
the sibling `synlab/frontend/node_modules` when used in this worktree. It does
not install packages or change the sibling checkout. No backend is needed.

Task: create `retries` with the integer value `3`. Type real Python in Monaco,
then use Run code or Ctrl/Cmd+Enter. Try `retries = "3"`, `retries = 2`,
`retries == 3`, `print(3)`, and `retries = 3` to compare feedback. Hints, reset,
an example solution and the post-success transition are interactive.

Python executes in a browser worker using the existing Pyodide 0.26.4 version.
Its initial runtime download requires internet access to jsDelivr. Each attempt
gets a fresh namespace. A five-second timeout or Stop terminates/restarts the
worker, keeping the editor responsive. This first-exercise checker is not a
general security sandbox or a complete course runner. Drafts/progress are not
persisted or sent to a backend; no analytics are initialized here.

Approach follows the [Pyodide worker guide](https://pyodide.org/en/0.26.4/usage/webworker.html).
The preview has a large Monaco bundle and a cold runtime download; performance
optimization and a full section integration are outside this review slice.

Screenshots: [desktop](preview-desktop.png), [feedback](preview-feedback.png),
[mobile](preview-mobile.png).

Validation: production preview build passed. A local browser smoke check used
real Python to exercise wrong type/value, assignment versus comparison, syntax
errors, a correct answer, a valid alternative expression, empty-code state
isolation, printed output, hint/reveal, reset/next, stop/recovery and mobile
overflow. The original app's tests were not run because its source is unchanged.
The temporary verification script/logs are ignored under `.cache/`.
