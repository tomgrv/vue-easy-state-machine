<div align="center">

[![npm version](https://img.shields.io/npm/v/vue-easy-state-machine.svg)](https://www.npmjs.com/package/vue-easy-state-machine)
[![npm downloads](https://img.shields.io/npm/dt/vue-easy-state-machine.svg)](https://www.npmjs.com/package/vue-easy-state-machine)
[![license](https://img.shields.io/github/license/tomgrv/vue-easy-state-machine.svg)](https://github.com/tomgrv/vue-easy-state-machine/blob/master/LICENSE)

</div>

# vue-easy-state-machine

Light state machine packaged as a vue component

## Installation

```bash
$ npm install vue-easy-state-machine
```

## Overview

This packages provides a `<easy-state-machine>` component managing a small state machine for UI management

## Usage

Declare as Vue plugin:

```js
import VueEasyStateMachine from "vue-easy-state-machine";
Vue.use(VueEasyStateMachine);
```

In your component `<script>` section, declare your state table with states & associated behavior:

```js
export default {
  data() {
    return {
      states: {
        askEmail: {
          entry: true,
          success: "askPassword",
          failure: "askEmail"
        },
        askPassword: {
          success: "login",
          failure: "askEmail"
        },
        login: {
          success: this.initSession,
          failure: "askEmail"
        },

        //...

        stateXXX: {
          success: "stateYYY",
          failure: "stateZZZ"
        }

        //...
      }
    };
  },
  methods: {
    initSession() {
      //...
    }
  }
};
```

In your component `<template>` section, wrap the state machine around components related to each state:

- State table is provide through `states` prop.
- Each declared state value is available through `#default` variable, in `current` array; Only the active state is set to `true`, all other are set to `false`.
- `easy-state-machine` component exposes `success()` and `failure()` methods to trigger evolution; You can use `restart()` to ... restart.

```html
<easy-state-machine :states="states" #default="state">
  <div v-if="state.current.askEmail">
    <input type="email" placeholder="Email" />
    <button type="button" @click="state.success">Next</button>
  </div>
  <div v-if="state.current.askPassword">
    <input type="password" placeholder="Password" />
    <button type="button" @click="state.success">Next</button>
    <button type="button" @click="state.failure">Previous</button>
  </div>
  <div v-if="state.current.login">
    <strong>You are logged</strong>
    <button type="button" @click="state.success">Init Session</button>
    <button type="button" @click="state.failure">Restart</button>
  </div>
</easy-state-machine>
```

And that's it !

## State Table Advanced Configuration

Each state can handle following items:

```js
{
   "entry": true,
   "onEnter" : () => {},
   "success": "stateXXX",
   "failure": "stateYYY",
   "onLeave" : () => {},
}
```

### `entry`

- Type: `Boolean`
- Default: `false`
- Details: Indicates state to start with
- Restrictions: Only one `true` entry per state table. If multiple entries, only the first one is taken.

### `success`

- Type: `String` or `Function`
- Default: `undefined`
- Details: Indicates state to go to in case of successful operation at current state. Can be a function returning state name.
- Restrictions: Will trigger state machine error if pointing nowhere....

### `failure`

- Type: `String` or `Function`
- Default: value of `success` entry
- Details: Indicates state to go to in case of failed operation at current state. Can be a function returning state name.
- Restrictions: Will trigger state machine error if pointing nowhere...

### `onEnter`

- Type: `Function`
- Default: `undefined`
- Details: Function to call on state arrival
- Restrictions: Must be current component functions, not called if empty

### `onLeave`

- Type: `Function`
- Default: `undefined`
- Details: Function to call on state leaving
- Restrictions: Must be current component functions, not called if empty

## Advanced usage & Tips

### Complex branching

You can manage complex branching with `success` and `failure` functions:

```js
{
   "success": () => { return this.myBooleanValue ? 'stateXXX' : 'stateYYY' },
   "failure": this.myBranchingFunction,
}
```

Where `myBranchingFunction` is defined in `methods` block:

```js
methods: {}
    myBranchingFunction() {
        if ( /** my test **/ )
            return 'stateXXX';
        else
            return 'stateYYY';
    }
}
```

### Events

#### `stateChange`

- When: On each state change, after `onLeave` and before `onEnter` are called
- First argument: previous state name
- Second argument: next state name

### Transitions

You can use with `<transition>` for a beautiful effect:

```html
<easy-state-machine :states="states" #default="state">
  <transition
    name="transition-login"
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
    mode="out-in"
  >
    <div v-if="state.current.askEmail" key="askEmail">
      ...
    </div>
    <div v-if="state.current.askPassword" key="askPassword">
      ...
    </div>
    <div v-if="state.current.login" key="login">
      ...
    </div>
  </transition>
</easy-state-machine>
```

### Validating/Testing

Sample application provided in `sample` direcory for testing purpose:

```bash
$ npm run sample
```

Add then open ./sample/index.html in your browser
