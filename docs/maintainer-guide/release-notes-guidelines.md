# Release Notes Guidelines

## Components

### Changelog

The changelog summarizes the changes of significance to the users contained in the release.

---

❗ Only changes relative to the previous release should be mentioned in the changelog. Changes within the release (e.g., fixing a regression introduced by a change made earlier in the release) are not of interest to the target reader.

---

The changes are sorted in descending chronological order within each section.

#### Format

The changelog title has the following format:

```markdown
## Changelog
```

Change list items have the following format:

```markdown
- <!-- TODO: description of change --> (<!-- TODO: #PR number or commit ref -->)
```

---

Insignificant dependency bumps can be aggregated into a single changelog item:

```markdown
- [Various dependency updates](https://github.com/per1234/generator-kb-document/pulls?q=merged%3A<!-- TODO: date after previous release -->..<!-- TODO: date of release -->+author%3Aapp%2Fdependabot)
```

(where `<!-- TODO: date after previous release>` is the YYYY-MM-DD format date of the day after the previous release date and `<!-- TODO: date of release -->` is the date of the current release)

#### Categories

The change lists are separated into the following categories:

---

❗ If there are no changes for a given category, omit the category from the release notes.

---

##### Breaking

A list of changes which will require adjustments to the workflow of dependent projects or users.

Some projects do not have a formal API. In this case, the distinction of what is "breaking" is not so straightforward. However, it is still important to clearly communicate about changes which will require adjustments to the way the project is used.

###### Format

```markdown
### Breaking
```

##### Bug Fix

A list of fixes for defects in any component of the project.

###### Format

```markdown
### Bug Fix
```

##### Enhancement

A list of enhancements to any component of the project.

###### Format

```markdown
### Enhancement
```

### "Full Changeset" Link

Link to a GitHub "three dot diff" between this tag and the previous tag.

#### Format

```markdown
## Full Changeset

https://github.com/per1234/generator-kb-document/compare/<!-- TODO: previous tag -->...<!-- TODO: release tag -->
```

❗ Replace the "`<!-- TODO: ... -->`" placeholders with the correct information for the project and release.

### Contributors

A list of mentions of GitHub users from the community who contributed to the release in any of the following ways:

- Submitted a PR that was merged
- Made a significant review of a PR
- Submitted an issue that was resolved
- Provided significant assistance with the investigation of an issue that was resolved

Sort the list in alphabetical order.

###### Format

```markdown
## Contributors

- @<!-- TODO: username -->
```

## Procedure

1. Open a comparison of the ref to be released against the previous release's tag:
   ```text
   https://github.com/per1234/generator-kb-document/compare/<!-- TODO: previous release ref -->...<!-- TODO: release ref -->
   ```
1. Evaluate each of the listed commits, selecting those of significance to users.
1. Open the page of the significant commit.
1. Open the page of the pull request that introduced the commit.
1. If the pull request introduced multiple commits, determine whether the PR is "atomic" from a changelog perspective.<br />
   If so, use the PR number in the change list item.
   If not, use the ref of the significant commit(s) in the change list item(s).
1. If the pull request was submitted by a community member, add their username to the contributors list.
1. If a community member made a significant review of the PR, add their username to the contributors list.
1. If the pull request resolved issues, open each of their pages.
1. If the issue resolved by the pull request was submitted by a community member, add them to the contributors list.
   If a community member provided significant assistance in the investigation of the issue, add them to the contributors list.

## Example

```markdown
## Changelog

#### Breaking

- Rename the `Foo` function to `Bar` (#42)

#### Bug Fix

- Fix hang on Windows when `baz` is set to false (3b2e6dd)

#### Enhancement

- Specify path to file in output from `qux` command (#123)

## Full Changeset

https://github.com/per1234/generator-kb-document/compare/1.0.0...2.0.0

## Contributors

- @ArduinoBot
- @octocat
```
