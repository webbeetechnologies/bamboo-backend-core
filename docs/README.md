@webbeetechnologies/blueprint-nodejs / [Exports](modules.md)

# blueprint-nodejs
The blueprint-nodejs project is a boilerplate for creating backend libraries with consistent tooling, code style, and structure. It includes npm scripts, GitHub workflows, Jest for testing, and Google's Typescript Style guide (gts). To use this project, follow the getting started section, which include creating a dev branch on GitHub and setting up branch rules to ensure code quality. This project also includes rules for writing unit and e2e tests, as well as creating a clear readme for users.

## Goal:
- You have less work setting up all the boilerplate code for a new backend library
- Consistent tooling, code style and structure among all backend libraries
- Enforced pull request and code review workflow
- Enforced code quality with automated tests

## Getting started
- Create a new repo using this repo as a template
- Checkout your repo, create a `dev`branch and push it to github. This is important before the next step as the next step requires that the `tests.yml` github action has run at least once.
- Go to Settings -> Branches -> Add rule -> Branch name pattern: `main` -> tick
  - Require branches to be up to date before merging
  - Require status checks to pass before merging
  - Select `tests` action
  - Do not allow bypassing the above settings
- Click save

## Included
- Npm scripts
  - `npm run start` - starts the sample/index.ts in watch mode with nodemon, restarts it if the code changes
  - `npm run test` - runs tests including code coverage requirements
  - `npm run compile` - compiles the code to the build folder, runs automatically on release
  - `npm run fix` - runs gts fix to normalize code style, runs automatically on push
- Github workflows
  - `format.yml` - runs gts fix on push to normalize code style
  - `release.yml` - to publish to our private registry if you create a release in github
  - `tests.yml` - runs tests if you push or pull
- Jest
  - Runs tests in the `__tests__` folder or with the .spec.ts extension
  - 80 % coverage requirement
- [gts (Google Typescript Style)](https://github.com/google/gts)
  - Typescript code style including prettier, eslint, tsconfig etc according to what google thinks makes sense.
- .run folder with debugging configuration for Intelij

## Rules
- Have a sample application in the sample folder which uses your library. This is for you to play around with it while developing and for others to see how to use it.
- Write unit tests directly in your code and not in a separate directory. Postfix them with `NAME_OF_YOUR_FILE.spec.ts`.
- Write e2e tests in the `__tests__` directory.
- Create a readme.md for your project which includes a "getting started" section with instructions on how to install and use your library. Make sure that getting started is easy.
- If you did not follow this rules, your epics are not considered to be done.

## Debugging with IntelliJ
- debug configuration is included in the `.run` folder and should work out of the box

## Credit

- [Jest and github actions by Pedro Fonseca](https://medium.com/swlh/jest-and-github-actions-eaf3eaf2427d)
- [Jest and github actions by Joel Hooks](https://joelhooks.com/jest-and-github-actions/)
- [Auto formatting code using prettier and github actions by Mike Skelton](https://mskelton.medium.com/auto-formatting-code-using-prettier-and-github-actions-ed458f58b7df)
- [Github checks documentation](https://docs.github.com/en/rest/checks?apiVersion=2022-11-28)
- [Google Typescript Style](https://google.github.io/styleguide/tsguide.html)

## ToDo:
- Add debug tutorial for vscode
- Add CI&CD 
- Add API reference generation action
