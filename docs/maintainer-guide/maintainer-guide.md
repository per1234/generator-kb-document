# Maintainer Guide

This is the documentation for subjects related to maintenance of the project.

---

For information about project development, see the [**Development Guide**](../development.md).

For information about contributing to the project, see the [**Contributor Guide**](../CONTRIBUTING.md).

---

## Release Procedure

### A. Prepare for Release

#### Validation

##### Evaluate CI Status

1. Open https://github.com/per1234/generator-kb-document/actions?query=branch%3Amain
1. For each of the workflows listed at the left side of the page, do the following:
   1. Click on the workflow name.
   1. Check the status of the latest run.
   1. If the run was not successful, investigate the cause and determine if it is of significance to the release.

#### Versioning

Determine the version number for the release.

Versioning must follow [the semver specification](https://semver.org/).

##### Prereleases

In some cases it might be desirable to have control over the package versions used by beta testers. This is done by creating "release candidate" prereleases.

These are created via the same release process described below, except that the version number has an `-rc.N` suffix (where `N` is an integer indicating the sequence of prereleases) on the tag name. This suffix indicates it is a prerelease release candidate of that version. For example, `1.2.3-rc.2` is the second release candidate for the `1.2.3` release.

---

**ⓘ** The prerelease versions of the package will not be published to the **npm** registry. Beta testers can install it using the [`npm install <git remote url>`](https://docs.npmjs.com/cli/commands/npm-install#:~:text=npm%20install%20%3Cgit%20remote%20url%3E) syntax. For example:

```text
npm install git://github.com/per1234/generator-kb-document.git#1.2.3-rc.2
```

### B. Compose Release Notes

Compose the release notes, following the [**Release Notes Guidelines**](release-notes-guidelines.md).

### C. Update Version Metadata

The value of the `version` field of the package's [`package.json`](https://docs.npmjs.com/cli/configuring-npm/package-json) metadata file must be updated before making the release.

1. Run the following command from the terminal:
   ```text
   assets/bump-package.sh "<version number>"
   ```
   (where `<version number>` is the version of the release.
   - ❗ `<version number>` must use the `X.Y.Z` format (e.g., `1.2.3`).
   - ❗ Versioning must follow [the **SemVer** specification](https://semver.org/).
1. Open the GitHub repository:<br />
   https://github.com/per1234/generator-kb-document
1. Submit the pull request from the `bump-package` branch that was pushed in by the command in step (1) of this procedure.
1. Merge the pull request.

### D. Tag

1. Open a Bash terminal in your local clone of the `per1234/generator-kb-document` repository.
1. [Checkout](https://git-scm.com/docs/git-checkout) the ref for the release.
   This will usually be the tip of the `main` branch, but it can be an earlier commit from the branch if there is development work not yet ready for release.
   - ❗ The ref must contain the version bump from [**step (C)**](#c-update-version-metadata) of this procedure.
1. Run the following command from the terminal:
   ```text
   VERSION="<version number>"
   ```
   (where `<version number>` is the version of the release.
   - ❗ `<version number>` must use the `X.Y.Z` format (e.g., `1.2.3`).
   - ❗ Versioning must follow [the **SemVer** specification](https://semver.org/).
1. Run the following command from the terminal:
   ```text
   REPO_URL="https://github.com/per1234/generator-kb-document"
   ```
1. Run the following command from the terminal:
   ```text
   METADATA_VERSION="$(npm pkg get version)" && \
   if [ "$METADATA_VERSION" != "\"$VERSION\"" ]; then \
     echo "error: version metadata ($METADATA_VERSION) does not match tag ($VERSION)"; \
     false; \
   fi && \
   git tag "$VERSION" -m "$VERSION" && \
     read -rsp $'\n'"Tag $VERSION at $(git rev-list --max-count=1 --abbrev-commit $VERSION) will be pushed to $REPO_URL."$'\n'"Press any key to proceed, or ^C to cancel..."$'\n' -n 1 && \
     git push $REPO_URL "$VERSION"
   ```
1. A prompt will be shown that describes the action that will be performed if confirmed. Check all is as expected.
1. Press the <kbd>**Enter**</kbd> key.<br />
   The tag will be pushed to GitHub.
1. Open the following URL in your web browser:<br />
   https://github.com/per1234/generator-kb-document/actions/workflows/release-npm.yml<br />
   You will see a list of the runs of the "**Release npm package**" workflow. This workflow is triggered by the tag push and automatically handles the creation of the [GitHub release](https://docs.github.com/repositories/releasing-projects-on-github/about-releases) and publishing the release to the **npm** package registry.
1. Click on the first item in the list of workflow runs.<br />
   The summary page for the workflow run will open.
1. Monitor the progress of the workflow run until you see it has completed successfully.

### E. Publish Release Notes

1. Open the release page:<br />
   https://github.com/per1234/generator-kb-document/releases/latest
1. Click the **🖉** icon near the top right corner of the page.<br />
   The edit page for the release will open.
1. Paste the release notes composed during [**step (B)**](#b-compose-release-notes) of this procedure into the "**Describe this release**" field.
1. Click the "**Update release**" button at the bottom of the page.

### F. Update Version Metadata Post-release

In order to facilitate the identification of development versions of the package that might be used by beta testers and other users, the value of the `version` field of the package's [`package.json`](https://docs.npmjs.com/cli/configuring-npm/package-json) metadata file is set to a prerelease version between releases.

1. Run the following command from the terminal:
   ```text
   assets/bump-package.sh "prerelease"
   ```
1. Open the GitHub repository:<br />
   https://github.com/per1234/generator-kb-document
1. Submit the pull request from the `bump-package` branch that was pushed in by the command in step (1) of this procedure.
1. Merge the pull request.
