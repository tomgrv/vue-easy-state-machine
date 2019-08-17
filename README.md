# vue-easy-state-machine
Light state machine packaged as a vue component

## Installation

```bash
$ npm install vue-easy-state-machine
```

## Overview

This packages provides a `<easy-state-machine>` component managing a small state machine, idealy for forms

## Usage

Declare as Vue plugin:

```js
import VueStateMachine from 'vue-easy-state-machine';
Vue.use(VueStateMachine);
```

In your component `<script>` section, declare your state table with steps & associated behavior:


```js
export default {
    data() {
        return {
            states: {
                askEmail: {
                    entry: true,
                    success: 'askPassword',
                    failure: 'askEmail'
                },
                askPassword: {
                    success: 'login',
                    failure: 'askEmail'
                },
                login: {
                    success: this.initSession,
                    failure: 'askEmail'
                },

                //...

                stepXXX:{
                    success: 'stepYYY',
                    failure: 'stepZZZ',
                },

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

In your component `<template>` section, wrap the state machine arround components:
* State table is provide through `states` property
* Each declared step is available through `step.current.XXX` boolean variable to trigger display of corresponding items with `v-if` or `v-show`
* Component exposes `success()` and `failure()` methods to trigger evolution. You can use `restart()` to ... restart.

```html
<easy-state-machine :states="states" #default="step">
    <div v-if="step.current.askEmail">
        <input type="email" placeholder="Email" />
        <button type="button" @click="step.success">Next</button>
    </div>
    <div v-if="step.current.askPassword">
        <input type="password" placeholder="Password" />
        <button type="button" @click="step.success">Next</button>
        <button type="button" @click="step.failure">Previous</button>
    </div>
    <div v-if="step.current.login">
        <strong>You are logged</strong>
        <button type="button" @click="step.success">Init Session</button>
        <button type="button" @click="step.failure">Restart</button>
    </div>
</easy-state-machine>
```

And that's it !

## State Table Advanced Configuration

Each step can handle following items:

```js
{
   "entry": true,
   "onEnter" : () => {},
   "success": "stateXXX",
   "failure": "stateYYY",
   "onLeave" : () => {},
}
```

#### `entry`

* Type: `Boolean`
* Default: `false`
* Details: Indicates step to start with
* Restrictions: Only one entry per state table. If multiple entries, only the first one is taken.

#### `success`

* Type: `String` or `Function`
* Default: `undefined`
* Details: Indicates step to go to in case of successful operation at current step. Can be a function returning step name.
* Restrictions: Will trigger state machine error if pointing nowhere....

#### `failure`

* Type: `String` or `Function`
* Default: value of `success` entry
* Details: Indicates step to go to in case of failed operation at current step. Can be a function returning step name. 
* Restrictions: Will trigger state machine error if pointing nowhere...


#### `onEnter`

* Type: `Function`
* Default: `undefined`
* Details: Function to call on state arrival
* Restrictions: Must be current component functions, not called if empty

#### `onLeave`

* Type: `Function`
* Default: `undefined`
* Details: Function to call on state leaving
* Restrictions: Must be current component functions, not called if empty

## Advanced usage & Tips

### Complex branching

You can manage complex branching with `success` and `failure` functions:

```js
{
   "success": () => { return this.isOnline ? 'stepXXX' : 'stepYYY' },
   "failure": this.myBrancingFunction,
}
```

Where `myBrancingFunction` is defined in `methods` block:

```js
methods: {}
    myBrancingFunction() {
        if ( /****/ )
            return 'stepXXX';
        else
            return 'setpYYY';
    }
}
```

### Events

#### `stateChange`

* When: On each state change, after `onLeave` and before `onEnter` are called
* First argument: previous index name
* Second argument: next index name

### Transitions

You can use with `<transition>` for a beautiful effect:

```html
<easy-state-machine :states="states" #default="step">
    <transition name="transition-login" 
        enter-active-class="animated fadeIn" 
        leave-active-class="animated fadeOut"
        mode="out-in">
        <div v-if="step.current.askEmail" key="askEmail">
            ...
        </div>
        <div v-if="step.current.askPassword" key="askPassword">
            ...
        </div>
        <div v-if="step.current.login" key="login">
            ...
        </div>
    </transition>
</easy-state-machine>
```
