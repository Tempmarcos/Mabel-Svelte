<script lang="ts">
    import type { Snippet } from "svelte";

    type PropsData = {
        text: string;
        children: any;
    }
    let { text, children} : PropsData = $props();
</script>
<div class="dropdown">
         <button class="dropbtn">{text}</button>
         <div class="dropdownContent" >
             {@render children?.()}
         </div>
        </div>
<style>
  .dropbtn {
    background-color: #04AA6D;
    color: white;
    padding: 16px;
    font-size: 16px;
    border: none;
  }
  .dropdown {
    position: relative;
    display: inline-block;
    
  }
  .dropdownContent {
    display: none;
    position: absolute;
    background-color: #3e8e41;
    min-width: 160px;
    max-height: 210px;
    overflow-y: auto;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
  }
  .dropdownContent * {
    color: inherit;
    background-color: inherit;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
  }
  .dropdownContent a:hover {
    filter: grayscale(0.4);
  }
  .dropdown:hover .dropdownContent {display: block;}
  
  .dropdown:hover .dropbtn {
    filter: grayscale(0.4);
  }
</style>