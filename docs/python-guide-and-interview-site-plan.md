# Learning Hub and separate Interview Prep site

Status: Learning Hub implemented locally on 2026-10-27; not deployed.

The tabs are Python Basics, LeetCode Patterns and Learning Hub. The first two
remain coding practice. Learning Hub is a reading companion, with concise
examples rather than a third exercise track.

Implemented: 21 ordered Python topics covering values, collections, control
flow, functions, methods and later language concepts; all 15 pattern groups
have visuals and short explanations. Intro cards cover Python's uses and
background, and four example cards explain useful quirks. Desktop topic lists
become dropdowns on phones. The page follows the site theme and scrolls normally.

See [Learning Hub details](learning-hub.md) for files and verification.

## Interview Prep becomes a different website

The old page, recall interface, content, references and local dependencies are
copied into `archives/interview-prep/`, with portable JSON and a hash manifest.
Existing browser answers are untouched and are not included in the authored
snapshot. Legacy source remains for old entry points/tests. The main site loads
Learning Hub instead; old `#interview` links resolve to the Hub.

A future Interview Prep website still needs its own entry point, theme,
dependencies, name and hosting. No separate website was created or deployed.
