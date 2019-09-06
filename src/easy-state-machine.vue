  <template>
  <div>
    <slot
      :success="success"
      :restart="restart"
      :failure="failure"
      :current="current"
      :actions="actions"
      :index="index"
    >
      <div v-for="(value, field) in current" :key="field" v-if="value">
        <h1>State {{field}}</h1>
        <button v-on:click="success">Success</button>
        <button v-on:click="failure">Failure</button>
        <button v-on:click="restart">Restart</button>
      </div>
    </slot>
  </div>
</template>

<script>
import kindof from "kind-of";

export default {
  data() {
    return {
      indexes: [],
      current: {},
      tables: [],
      actions: {}
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
      return kindof(f) == "function";
    },
    isString(x) {
      return kindof(x) == "string";
    },
    restart() {
      this.tables = [];
      this.indexes = [];
      this.current = {};
      this.enterSubState(this.states);
      this.setActions();
    },
    withIndexedSubState(i, s, err) {
      if (i && this.subTable[i]) return s(this.subTable[i]);
      else if (err) err(i);
    },
    enterSubState(t) {
      this.tables.push(t);
      const root = this.index ? this.index + "." : "";
      Object.keys(this.subTable).forEach(k =>
        this.withIndexedSubState(k, s => {
          if (s.entry) this.indexes.push(k);
          this.current[root + k] = !!s.entry;
        })
      );
    },
    withSubState(s, err) {
      return this.withIndexedSubState(this.subIndex, s, err);
    },
    leaveSubState(i) {
      this.indexes.pop();
      this.tables.pop();
      this.next(i);
    },
    setActions() {
      this.withSubState(s => {
        this.actions = {
          success: () => this.success(),
          failure: () => this.failure()
        };
      });
    },
    changeIndex(newIndex) {
      this.current[this.index] = false;
      this.current[newIndex] = true;
      this.$emit("stateChange", this.index, newIndex);
      this.index = newIndex;
    },
    setError(msg) {
      console.error("Error in state table: " + msg);
      this.setNext("error");
    },
    setNext(target) {
      console.log("Go to " + target);

      // Leave current state
      this.withSubState(s => {
        if (this.isFunction(s.onLeave)) s.onLeave();
      });

      // Manage state change
      if (this.isString(target)) {
        this.changeIndex(
          this.indexes.length > 1
            ? this.index.replace("." + this.subIndex, "." + target)
            : target
        );
      } else if (this.isFunction(target)) {
        this.changeIndex(target(this.index));
      } else {
        this.setError("Cannot find state: " + target);
      }

      // Manage substates
      if (!this.subIndex || target == "error") {
        console.log("End of state machine");
      } else if (this.subIndex.startsWith("!")) {
        this.leaveSubState(this.subIndex.substring(1));
      } else {
        this.withSubState(
          s => {
            if (s.states) this.enterSubState(s.states);
          },
          e => this.setError("Cannot find table")
        );
      }

      // Manage possible actions
      this.setActions();

      // Enter current state
      this.withSubState(s => {
        if (this.isFunction(s.onEnter)) s.onEnter();
      });
    },
    success() {
      this.withSubState(
        s => this.setNext(s.success || s),
        e => this.setError("Cannot find table")
      );
    },
    failure() {
      this.withSubState(
        s => this.setNext(s.failure || s.success || s),
        e => this.setError("Cannot find table")
      );
    }
  },
  created: function() {
    this.restart();
  }
};
</script>
