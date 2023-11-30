<template>
  <nav>
    <ul>
      <li>
        <router-link
          to="/form"
          active-class="active"
        >Real-life form</router-link>
      </li>

      <li>
        <router-link
          to="/minimal"
          active-class="active"
        >Minimal uploader</router-link>
      </li>

      <li>
        <router-link
          to="/regular"
          active-class="active"
        >Regular uploader</router-link>
      </li>
    </ul>
  </nav>

  <router-view/>
</template>

<style scoped lang="scss">
  nav {
    padding: 0 24px;
    margin: 0 -24px 24px;
    border-bottom: 1px solid var(--ui-control-border-color-default);
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: inline-block;
    margin-right: 24px;
  }

  a {
    display: flex;
    padding: 24px 0;
    text-decoration: none;
    color: var(--ui-control-text-color);
  }

  a:hover {
    opacity: .75;
  }

  a.active {
    box-shadow: 0 1px 0 var(--ui-control-border-color-focus);
  }
</style>
