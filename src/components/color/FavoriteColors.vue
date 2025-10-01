<template>
  <Swatch :favorites='true'></Swatch>
</template>
<script>
import Swatch from '@/components/color/Swatch'

export default {
  name: 'Saved',
  components: {
    Swatch
  }
}
</script>
