  <template>
  <div>
    <slot
      :success="success"
      :restart="restart"
      :failure="failure"
      :current="current"
      :index="index"
    >
      <div v-for="(value, field) in current" :key="field" v-if="value">
        {{field}}
        <button v-on:click="success">Success</button>
        <button v-on:click="failure">Failure</button>
        <button v-on:click="restart">Restart</button>
      </div>
    </slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      indexes: [],
      current: {},
      tables: []
    };
  },
  props: {
    states: {
      type: Object
    }
  },
  computed: {
    index: {
      get() {
        return this.indexes.join(".");
      },
      set(v) {
        this.indexes = v ? v.split(".") : [];
      }
    },
    subIndex: function() {
      return this.indexes[this.indexes.length - 1];
    },
    subTable: function() {
      return this.tables[this.tables.length - 1];
    }
  },
  methods: {
    isFunction(f) {
      return f && {}.toString.call(f) === "[object Function]";
    },
    isString(x) {
      return Object.prototype.toString.call(x) === "[object String]";
    },
    restart() {
      this.tables = [];
      this.indexes = [];
      this.enterSubState(this.states);
    },
    enterSubState(t) {
      this.tables.push(t);
      const root = this.index ? this.index + "." : "";
      Object.keys(this.subTable).forEach(k => {
        if (this.subTable[k].entry) this.indexes.push(k);
        this.current[root + k] = !!this.subTable[k].entry;
      });
    },
    leaveSubState() {
      this.indexes.pop();
      this.tables.pop();
    },
    success() {
      if (this.subIndex) {
        this.next(
          this.subTable[this.subIndex].success || this.subTable[this.subIndex]
        );
      } else {
        log.error("State Machine Ended, cannot success");
      }
    },
    failure() {
      if (this.subIndex) {
        this.next(
          this.subTable[this.subIndex].failure ||
            this.subTable[this.subIndex].success ||
            this.subTable[this.subIndex]
        );
      } else {
        log.error("State Machine Ended, cannot fail");
      }
    },
    changeIndex(newIndex) {
      this.current[this.index] = false;
      this.current[newIndex] = true;
      this.$emit("stateChange", this.index, newIndex);
      this.index = newIndex;
    },
    next(target) {
      // Leave current state
      if (this.isFunction(this.subTable[this.subIndex].onLeave)) {
        this.subTable[this.subIndex].onLeave();
      }

      // Manage state change
      if (this.isString(target)) {
        const newIndex =
          this.indexes.length > 1
            ? this.index.replace("." + this.subIndex, "." + target)
            : target;
        this.changeIndex(newIndex);
      } else if (this.isFunction(target)) {
        const result = target(this.index);
        const newIndex = this.isString(result) ? result : undefined;
        this.changeIndex(newIndex);
      } else {
        console.error("Cannot find next state : " + target);
      }

      // Manage substates
      if (!this.subIndex) {
        //console.log("End of state machine");
      } else if (this.subIndex.startsWith("!")) {
        // console.log("Leave substate");
        const newIndex = this.subIndex.substring(1);
        this.leaveSubState();
        this.next(newIndex);
      } else if (!this.subTable[this.subIndex]) {
        //console.log("Error");
        throw "Error in state definition";
      } else if (this.subTable[this.subIndex].states) {
        //console.log("Enter substate");
        this.enterSubState(this.subTable[this.subIndex].states);
      }

      // Enter current state
      if (this.isFunction(this.subTable[this.subIndex].onEnter)) {
        this.subTable[this.subIndex].onEnter();
      }
    }
  },
  created: function() {
    this.restart();
  }
};
</script>
