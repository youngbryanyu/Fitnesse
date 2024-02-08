# Contributing - Backend

## How to make changes
1. [Fork the repo](https://help.github.com/articles/fork-a-repo/) or clone it if you're a contributor.
2. [Install pnpm](https://pnpm.io/installation)
3. Create a new local feature branch using `git checkout -b <your-feature-branch-name>`
4. Commit your changes using `git commit -m '<commit message>'`
5. Test your changes by running the test script in `package.json` using `pnpm run test`
6. Ensure your code passes formatting and lint checks by running `pnpm run prettier` then `pnpm run lint`.
7. Push to a new feature branch using `git push origin <your-local-branch-name>:<target-remote-branch-name>`
8. [Create a pull request](https://help.github.com/articles/creating-a-pull-request). Your PR will need to pass all checks in the CI/CD pipeline to be able to merge.
