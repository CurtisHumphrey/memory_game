[![license](https://img.shields.io/github/license/CurtisHumphrey/memory_game.svg)](https://github.com/CurtisHumphrey/memory_game/blob/master/LICENSE)
[![CircleCI](https://circleci.com/gh/CurtisHumphrey/memory_game/tree/master.svg?style=svg)](https://circleci.com/gh/CurtisHumphrey/memory_game/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/CurtisHumphrey/memory_game/badge.svg?branch=master)](https://coveralls.io/github/CurtisHumphrey/memory_game?branch=master)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

# Memory Game
Play classic memory with a friend with two additions:
* Cards move between piles dealer --> board --> winning piles --> repeat, which is mimics a physical game
* Players are remote from each other (uses [Firebase](https://firebase.google.com/) as backend)

This game uses kid-friend rules
* meaning that after every two cards flips the player switches (i.e., winner does *not* get another round)

# To Play
1. Open the game as the "host" [https://memory-game-3c1b1.firebaseapp.com/](https://memory-game-3c1b1.firebaseapp.com/)
2. The game will give the host a url to send to the "friend"
3. Friend opens the url and will auto join the game
4. Play memory!

## Technology used
This project is mostly to showcase both good design, delightful animations, and good code quality.

### Highlights
1. Used React
2. Used CSS-Modules with SASS and babel-plugin-react-css-modules for styling
3. Used Redux and redux_helpers for state management
4. Used react-overdrive and react-pose for animations
5. Used yarn for package management
6. Used webpack for building
7. Used storybook for component testing and development
8. Used Karma, Mocha, Chai, Enzyme, Sinon, and Istanbul for TDD and code coverage
9. Used ESLINT for code quality
10. Used Firebase, redux_firebase, and targaryen for backend and testing

## Run locally
1. make sure yarn, node 10, and chrome installed
2. clone repo
3. run `yarn`
4. To launch local `yarn run dev` then open [http://localhost:3000/](http://localhost:3000/)
5. To launch TDD `yarn run tdd`
6. To launch storybook `yarn run storybook`

### Images
* All house images where from [Unsplash](https://unsplash.com) and are [free](https://unsplash.com/license)
* Vector images where made by Curtis M. Humphrey, Ph.D. and are [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/)
