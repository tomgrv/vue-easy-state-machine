<template>
  <div class="container">
    <div class="card" style="width: 50rem;">
      <img src="https://fakeimg.pl/50x10/" class="card-img-top" alt="..." />
      <div class="card-body">
        <h5 class="card-title">Default Implementation</h5>
        <easy-state-machine :states="states" #default="steps"></easy-state-machine>
      </div>
    </div>
    <hr />
    <div class="card" style="width: 50rem;">
      <img src="https://fakeimg.pl/50x10/" class="card-img-top" alt="..." />
      <div class="card-body">
        <h5 class="card-title">Custom Implementation</h5>
        <easy-state-machine :states="states" #default="steps">
          <h2>{{steps.index}}</h2>
          <div v-if="steps.current.step1" key="step1">
            <h3>This is step 1 - Simple link</h3>
            <a href="#" class @click="steps.success">Go to step 2 with success call</a>
          </div>
          <div v-if="steps.current.step2" key="step2">
            <h3>This is step 2 - Form</h3>
            <form @submit.prevent="post(steps)">
              <div class="form-group form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="exampleCheck1"
                  v-model="form.check"
                />
                <label class="form-check-label" for="exampleCheck1">Check me out</label>
              </div>

              <a href="#" class @click="steps.failure">Go to step 1 with failure call</a>
              <hr />
              <button
                type="submit"
                class="btn btn-primary"
              >Go to step 2 (box unchecked) of 3 (box checked) with form submit</button>
            </form>
          </div>
          <div v-if="steps.current.step3" key="step3">
            <h3>This is step 3</h3>
          </div>
        </easy-state-machine>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      states: {
        step1: {
          entry: true,
          success: "step2"
        },
        step2: {
          success: "step3",
          failure: "step1"
        },
        step3: {
          onEnter: this.endofmachine
        }
      },
      form: { check: false }
    };
  },
  methods: {
    post(s) {
      if (this.form.check) {
        alert("Success");
        s.success();
      } else {
        alert("Failure");
        s.failure();
      }
    },
    endofmachine() {
      alert("End of Machine!");
    }
  }
};
</script>