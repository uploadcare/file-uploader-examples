<script>
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { base } from '$app/paths';

  $: {
    if (browser) {
      goto(`${base}/form`);
    }
  }
</script>
