# Interview Prep archive

Frozen before Learning Hub replaced Interview Prep in SyntaxLab on 2026-10-27.

- `source/python-path/interview/`: both reference and older recall interfaces,
  original content, source links, corrections and recall helpers.
- `source/python-path/progress.js` and `editorSupport.js`: local dependencies
  used by the older interface, with the original relative directory structure.
- `data/interview-content.json`: portable snapshot containing 36 reference
  topics, 29 original topics, 66 recall drills, HTTP lookup rows and 40 sources.
- `docs/interview-reference.md`: the authored reference document.
- `manifest.json`: original paths, byte sizes and SHA-256 hashes. All nine copied
  source/document files were compared byte for byte with their originals.

This is a recoverable content/source archive, not a deployed standalone app.
The reference page needs React and MUI; the older recall interface also uses
Monaco. A future app needs its own entry point, theme and package setup.
Existing browser recall/progress storage keys were left untouched. The JSON
snapshot contains authored curriculum data, not personal browser answers.

Legacy source remains in the original folder for compatibility with older
entry points and content tests. The main site now loads Learning Hub instead.
