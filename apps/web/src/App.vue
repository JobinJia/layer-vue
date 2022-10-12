<script setup lang="ts">
// import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'
import { ref } from 'vue'
const visible = ref(false)
const visible2 = ref(false)
const visible3 = ref(false)
const innerVisible = ref(false)
const message = ref(false)
const messageIcon = ref(false)
const tooltip = ref(false)
const tooltipAutoClose = ref(false)
</script>

<template>
  <header>
    <TButton @click="visible = !visible">visible</TButton>
    <TButton @click="visible3 = !visible3">visible3</TButton>
    <TButton @click="visible2 = !visible2">Modal & InnerModal & Visible2</TButton>
    <TButton @click="message = !message">Message</TButton>
    <TButton @click="messageIcon = !messageIcon">Message with Icon</TButton>
    <br />
    <br />
    <br />
    <VLayer v-model:visible="visible3" title="呆萌呆萌的" maxmin type="page" :area="[300, 300]" :anim="2" :minStack="false">
      <div>
        <p>叮叮叮叮</p>
        <p>叮叮叮叮</p>
        <p>叮叮叮叮</p>
        <p>叮叮叮叮</p>
        <p>叮叮叮叮</p>
        <p>叮叮叮叮</p>
        <p>叮叮叮叮</p>
        <p>叮叮叮叮</p>
      </div>
    </VLayer>
    <VLayer v-model:visible="visible" :anim="1" title="这是标题" :minStack="false" :icon="6">
      这是内容
    </VLayer>
    <VLayer
      v-model:visible="visible2"
      maxmin
      type="page"
      title="v2"
      :area="[500, 600]"
      :offset="[10, 20]"
      :shade="false"
      :minStack="false"
    >
      <TButton @click.stop="innerVisible = !innerVisible"></TButton>
      <VLayer v-model:visible="innerVisible" :shade="false">
        <div>
          <p>123</p>
          <p>4aa</p>
        </div>
      </VLayer>
    </VLayer>
    <VLayer v-model:visible="messageIcon" type="message" :icon="4"></VLayer>
    <VLayer v-model:visible="message" type="message"></VLayer>
    <div style="display: flex; flex-direction: row; justify-content: space-between">
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
