<script>
  import { page } from '$app/stores';
</script>

<nav>
  <ul>
    <li>
      <a href="/form" class:active={$page.url.pathname === '/form'}>Real-life form</a>
    </li>

    <li>
      <a href="/minimal" class:active={$page.url.pathname === '/minimal'}>Minimal uploader</a>
    </li>

    <li>
      <a href="/regular" class:active={$page.url.pathname === '/regular'}>Regular uploader</a>
    </li>
  </ul>
</nav>

<slot/>

<style lang="scss">
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
