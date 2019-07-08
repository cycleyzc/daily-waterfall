<script>
import { Bar, mixins } from 'vue-chartjs'

export default {
  extends: Bar,
  mixins: [mixins.reactiveProp],
  props: {
    chartTitle: {
      type: String,
      default() {
        return '条形图'
      }
    },
    options: {
      type: Object,
      default() {
        return {
          responsive: true,
          maintainAspectRatio: false,
          title: {
            display: true,
            fontSize: 20,
            // padding: 20,
            text: this.chartTitle
          }
        }
      }
    },
    styles: {
      type: [Object, String],
      default: null
    }
  },
  mounted() {
    this.renderChart(this.chartData, this.options)
  }
}
</script>

<style>
</style>
