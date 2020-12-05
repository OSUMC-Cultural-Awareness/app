<div align="center">
  <h2 align="center">OSUMC Cultural Awareness App</h2>

  <p align="center">
    Frontend for the OSUMC Cultural Awareness Application for Android, iOS, and Web
  </p>
  <a href="https://github.com/OSUMC-Cultural-Awareness/app/actions?query=workflow%3ACI"><img src="https://github.com/OSUMC-Cultural-Awareness/app/workflows/CI/badge.svg" alt="CI"/></a>
  <a href="https://github.com/OSUMC-Cultural-Awareness/app/actions?query=workflow%3ACD"><img src="https://github.com/OSUMC-Cultural-Awareness/app/workflows/CD/badge.svg" alt="CD"/></a>
  <a href="https://osumc-cultural-awareness.github.io/app"><img src="https://img.shields.io/badge/App-View%20Live%20Web-blue" alt="Live"/></a>
  <a href="https://github.com/prettier/prettier"><img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square" alt="Prettier"></a>
</div>

## Getting Started

1. install [nodejs](https://nodejs.org/en/download/), [yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable) and [git](https://git-scm.com/downloads)

2. Clone this repository and [api](https://github.com/OSUMC-Cultural-Awareness/api)

```sh
git clone https://github.com/OSUMC-Cultural-Awareness/app
git clone https://github.com/OSUMC-Cultural-Awareness/api
```

3. Follow instructions for [api](https://github.com/OSUMC-Cultural-Awareness/api/#getting-started)
4. Install yarn packages

```sh
yarn install
```

5. Start Expo through Yarn

Development should be done using a local instance of the [api](https://github.com/OSUMC-Cultural-Awareness/api), but using the production [api](https://github.com/OSUMC-Cultural-Awareness/api) is possible.

```sh
# Local Api
yarn start

# Production Api
yarn env:prod
yarn run expo start
```

## Deployment

### Web Deployment

Deployment to web should be handled by [Continuous Deployment](https://github.com/OSUMC-Cultural-Awareness/app/actions?query=workflow%3ACD), but in order to deploy manually

```sh
# To deploy Web to Github Pages
yarn env:prod
yarn deploy
```

### Expo Deployment

In order to deploy to Expo first you must have an account [sign up](https://expo.io/signup)

```sh
# Login to Expo on the command line
yarn run expo login

# To deploy Mobile to Expo
yarn env:prod
yarn run expo publish
```

## New to React Native?

We all started here at some point, here's a collection of resources we found helpful in getting started!

- [React Tutorial](https://reactjs.org/tutorial/tutorial.html) Nowhere better to start than the Tutorial
  React enables you to write a declarative UI in JavaScript/Typescript in a syntax called "jsx" which looks a lot like Html.

  If you're wondering where to put your state, favor putting it in the parent component. Avoid using `ref`s and other hacks to get the state
  of a child component.

- [Typescript Tutorial](https://www.typescriptlang.org/docs/handbook/release-notes/overview.html) JavaScript, but Better
  Large applications without types can become hard to maintain and Typescript helps prevent those sleepless night bugs that can plague applications.

  **In order to get the most of Typescript we suggest:**

  VSCode: builtin Typescript Language Server **[preferred]**
  Vim: [coc-tsserver](https://github.com/neoclide/coc-tsserver)

  - [Style guide](https://github.com/airbnb/javascript) best practices exist for a reason

- [React Functional Components and Hooks](https://reactjs.org/docs/hooks-intro.html)
  Previously React used to have a paradigm of Class based components, but recently the project has moved to Functional Components. These components use "hooks" to manage state, call Apis and more. They're used extensively in the application so having a good grasp on hooks is necessary.

- [React Native Paper](https://callstack.github.io/react-native-paper/index.html) Awesome Material Design Components
  These Components should be used over the default React Native components for things like Buttons, TextInput, etc.

- [Redux Tutorial](https://react-redux.js.org/introduction/basic-tutorial)
  Redux is a tricky to understand, but crucial component of the application allowing the storage of [User Credentials](https://github.com/OSUMC-Cultural-Awareness/app/blob/main/src/redux/UserReducer.ts) and more between screens.

  - [In depth walk through](https://www.valentinog.com/blog/redux/) explains Reducers, passing state to components and more

**If there was an article that really helped you learn don't be afraid to open an Pull Request!**

## Documentation

Interested in why a decision was made or more about the project read the [documentation](https://github.com/OSUMC-Cultural-Awareness/docs).

## Found a Bug?

Please open a [bug report](https://github.com/OSUMC-Cultural-Awareness/app/issues/new?assignees=&labels=app%2C+bug&template=bug_report.md&title=) and be as descriptive and explicit as possible!

_note:_ If the bug isn't reproducible the issue will be closed.

## Product Owner

[rdunfee2](https://github.com/rdunfee2)

## License

Yet to be decided upon but discussion is [taking place](https://github.com/OSUMC-Cultural-Awareness/app/issues/17).
