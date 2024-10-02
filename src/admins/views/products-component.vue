<template>
  <sidebar-component :restaurant-name="restaurantName" :role="userRole"/>
  <header>
    <HeaderComponent :restaurant-name="restaurantName" :role="userRole"/>
  </header>
  <div class="page-container">
    <div class="main-content">
    </div>
  </div>
</template>

<script>
import HeaderComponent from "@/admins/components/header-component.vue";
import SidebarComponent from "@/admins/components/sidebar-component.vue";

export default {
  components: {
    HeaderComponent,
    SidebarComponent,
  },
  data() {
    return {
      restaurantName: '',
      userRole: '',
    };
  },
  mounted() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if(userData) {
      this.restaurantName = userData['business-name'];
      this.userRole = userData.role;
    }
  }
}
</script>

<style scoped>

</style>