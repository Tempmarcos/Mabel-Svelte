<script lang="ts">
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
    background-color: inherit;
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
    background: linear-gradient(329deg,rgba(0, 176, 6, 1) 0%, rgba(255, 229, 0, 1) 100%);
    min-width: 160px;
    max-height: 210px;
    overflow-y: auto;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
  }
  .dropdownContent :global(*) {
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    background: transparent;
  }

  .dropdownContent::-webkit-scrollbar {
    width: 8px;
  }

  .dropdownContent::-webkit-scrollbar-track {
    background: none;
    border-radius: 4px;
  }

  .dropdownContent::-webkit-scrollbar-thumb {
    background: #4c9c3c;
    border-radius: 4px;
  }

  .dropdownContent::-webkit-scrollbar-thumb:hover {
    background: #38742c;
  }

  .dropdownContent :global(*:hover) {
    filter: brightness(0.9);
    cursor: pointer;
  }
  .dropdown:hover .dropdownContent {display: flex;}
  
  .dropdown:hover .dropbtn {
    filter: grayscale(0.4);
  }
</style>