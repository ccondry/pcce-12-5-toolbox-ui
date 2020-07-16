<template>
  <div class="is-horizontal">
    <div class="field-label">
      <label class="label">{{ label }}</label>
    </div>
    <div class="field-body">
      <div class="field">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: String
  }
}
</script>
