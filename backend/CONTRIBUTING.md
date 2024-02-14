# Contributing - Backend

## How to make changes
1. [Fork the repo](https://help.github.com/articles/fork-a-repo/) or clone it if you're a contributor.
2. [Install pnpm](https://pnpm.io/installation) as the package manager. We recommend you install it globally using npm.
3. If you want to use a feature branch, create a new local feature branch using `git checkout -b <your-feature-branch-name>`
4. Test your changes by running the test script in `package.json` using `pnpm run test`
6. Ensure your code passes formatting and lint checks by running `pnpm run prettier` then `pnpm run lint`.
5. Commit your changes using `git commit -m '<commit message>'`
7. Push to a new feature branch using `git push origin <your-local-branch-name>:<target-remote-branch-name>`
8. [Create a pull request](https://help.github.com/articles/creating-a-pull-request). Your PR will need to pass all checks in the CI/CD pipeline to be able to merge.
