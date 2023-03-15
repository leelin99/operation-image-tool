<template>
  <div class="table_wrapper">
    <table border="" class="mytable">
      <thead class="thead">
        <tr>
          <th v-for="item in columns" :key="item.key">
            {{ item.name }}
          </th>
        </tr>
      </thead>
      <tbody v-if="data.length > 0">
        <tr v-for="record in data" :key="record.key">
          <td v-for="items in columns" :key="items.key">
            <!-- 插槽部分: item.key定义的值要和请求到的字段属性名相等-->
            <slot :record="record" :text="record[items.key]" :name="items.key">
              {{ record[items.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td :colspan="columns.length">暂无数据</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Image } from "vant";
//props:
//columns表头数据
//data:表格数据
const props = defineProps<{
  columns:{name:string, key:string}[],
  data:{
    [key:string]: string;
  }[]
}>();
</script>

<style lang="scss" scoped>
.table_wrapper {
  .mytable {
    font-size: 10px;
    width: 100%;
    height: 150px;
    border-collapse: collapse;
    text-align: center;
    font-size: 13px;
    font-weight: 900;
    .thead {
      background: rgba($color: #fff, $alpha: 0.4);
      font-size: 14px;
    }
    td,th{
      padding: 7px 0;
    }
  }
}
</style>