<script setup lang="ts">
// import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'
import { ref } from 'vue'
const visible = ref(false)
const message = ref(false)
const messageIcon = ref(false)
const tooltip = ref(false)
const tooltipAutoClose= ref(false)
</script>

<template>
  <header>
    <TButton @click="visible = !visible">Modal</TButton>
    <TButton @click="message = !message">Message</TButton>
    <TButton @click="messageIcon = !messageIcon">Message with Icon</TButton>
    <br/>
    <br/>
    <br/>
    <VLayer v-model:visible="visible"></VLayer>
    <VLayer v-model:visible="visible" :area="[300, 600]" :offset="[200, 300]"></VLayer>
    <VLayer v-model:visible="messageIcon" type="message" :icon="4"></VLayer>
    <VLayer v-model:visible="message" type="message"></VLayer>
    <div style="display: flex;flex-direction: row; justify-content: space-between">
      <VLayer v-model:visible="tooltipAutoClose" type="tips" content="RRRR" :time="3000">
        <TButton>Default(R)</TButton>
      </VLayer>
      <VLayer v-model:visible="tooltip" tips="t" type="tips" content="TTTTT">
        <TButton>Default(T)</TButton>
      </VLayer>
      <VLayer v-model:visible="tooltip" tips="l" type="tips" content="LLLL">
        <TButton>Default(L)</TButton>
      </VLayer>
      <VLayer v-model:visible="tooltip" tips="b" type="tips" content="BBBB">
        <TButton>Default(B)</TButton>
      </VLayer>
    </div>
    <!--    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />-->

    <!--    <div class="wrapper">-->
    <!--      <HelloWorld msg="You did it!" />-->

    <!--      <nav>-->
    <!--        <RouterLink to="/">Home</RouterLink>-->
    <!--        <RouterLink to="/about">About</RouterLink>-->
    <!--      </nav>-->
    <!--    </div>-->
  </header>

  <!--  <RouterView />-->
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
