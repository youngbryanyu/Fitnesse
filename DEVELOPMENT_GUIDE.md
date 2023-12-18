# Development Guide
Some resources and things to keep in mind while contributing to this project. 

## Branches
There are currently 2 branches:
- `main`
- `development`

All work should be done on the remote `development` branch. Commits from the `development` branch will be merged onto `main` later.

#### Merging Development onto Main Branch
When merging from `development` to `main`, make sure to choose the option `rebase and merge`.

## Before Creating a PR
1. Run `git pull --rebase` to pull any changes from the remote branch. Alternatively, you can run `git config --global pull.rebase true` to auto rebase when running `git pull`.
2. Run `pnpm run lint` to perform lint checks then run  `pnpm run lint --fix` to fix them if there are any, or else pipeline checks will fail on GitHub actions when the PR is made.
