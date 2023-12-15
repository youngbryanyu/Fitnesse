# Development Documentation

## Checks to make before creating a PR
1. Run `git pull --rebase` to pull any changes from the remote branch.
2. Run `pnpm run lint` to perform lint checks then run  `pnpm run lint --fix` to fix them if there are any, or else pipeline checks will fail on GitHub actions when the PR is made.
