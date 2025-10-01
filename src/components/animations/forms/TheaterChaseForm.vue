<template>
  <div>
    <v-text-field
      required
      :rules="timeRules"
      label="Speed (ms)"
      v-model="data.time"
      @input="updateStoreInput"
      :placeholder="`Default: ${this.defaults.time}`"      
    ></v-text-field>
    <v-text-field
      required
      :rules="iterationsRules"
      label="Iterations"
      v-model="data.iterations"
      @input="updateStoreInput"
      :placeholder="`Default: ${this.defaults.iterations}`"
    ></v-text-field>
    <color-option 
      @colorChange="updateColorAndStore" 
      :maxColors="5" 
      :minColors="0"
    ></color-option>
  </div>
</template>

<script>
import AnimationService from '@/services/AnimationService'
import AnimationFormStore from '@/stores/animationFormStore.js'
import ColorOption from '@/components/animations/ColorOption'

const fields = ['time', 'color', 'iterations']

export default {
  name: 'TheaterChaseForm',
  props: {
    dialog: {
      required: true,
      type: Boolean,
    },
    template: {
      required: true,
      type: String
    },
    animation: {
      type: Object
    }
  },
  components: {
    ColorOption
  },
  data () {
    return {
      data: {},
      defaults: {},
      timeRules: [
        v => !!v || 'Time is required',
        v => (v.length > 0 && /^[0-9]+$/.test(v)) || 'Integers only'
      ],
      // NEW VALIDATION RULES
      iterationsRules: [
        v => !!v || 'Iterations is required',
        v => (v.length > 0 && /^[0-9]+$/.test(v)) || 'Integers only'
      ],
    }
  },
  methods: {
    updateDataAndStore () {
      for (let i = 0; i<fields.length; i++) {
        // we have to use $set here because Vue cannot track object properties by default
        this.$set(this.data, fields[i], this.animation[fields[i]]);
        AnimationFormStore.data[fields[i]] = this.animation[fields[i]];
      }
    },
    // helper function to avoid direct mapping of component data to store
    updateStoreInput () {
      AnimationFormStore.data = this.data;
    },

    updateColorAndStore (colors) {
      let colorPayload;
    
      if (colors && colors.length > 0) {
        // Convert hex strings to an array of integers if colors are present
        colorPayload = colors.map(hex => {
          // Remove the '#' symbol and parse the hex string to a decimal integer (base 16)
          return this.convertHexToRgbObject(hex);
        });
      } else {
        // If no colors are selected (0 colors), send an empty array or null/0 
        // depending on what your backend expects for "no color." 
        // Using an empty array [] is a common practice for multi-color fields.
        colorPayload = null; 
      }
    
      // Assign the resulting payload to the 'color' field in local data
      this.$set(this.data, 'color', colorPayload);
      console.log(this.data)
    
      // Synchronize the local data with the global store
      this.updateStoreInput();
    },

    convertHexToRgbObject(hex) {
      // Ensure the '#' is present if it's missing, though ColorOption returns it.
      var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
      });
    
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    },

    async loadDefaults () {
      let template = await AnimationService.retrieveTemplate(this.template);
      this.defaults = JSON.parse(template.defaults);
    }
  },
  async mounted () {
    await this.loadDefaults();
    // put data in the store and the form field
    if (this.animation) {
      this.updateDataAndStore(this.animation);
    } else {
      this.data = JSON.parse(JSON.stringify(this.defaults));
      this.data.time = String(this.data.time); // Convert to string
      this.data.iterations = String(this.data.iterations); // Convert to string
      this.updateStoreInput();
    }
  },
  watch: {
    // we watch dialog so we can update the field when someone clicks out of the box
    dialog: function () {
      if (this.animation) {
        this.updateDataAndStore(this.animation);
      } else {
        //this.data = this.defaults;
          // FIX 2: Ensure time and iterations are strings when resetting from defaults
        this.data = JSON.parse(JSON.stringify(this.defaults)); // Deep copy
        this.data.time = String(this.data.time); 
        this.data.iterations = String(this.data.iterations);
        this.updateStoreInput();
      }
    }
  }
}
</script>

<style>

</style>
