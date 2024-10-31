<template>
  <div class="layout">
    <sidebar-component :restaurant-name="restaurantName" :role="userRole" class="sidebar" />
    <div class="main-content">
      <header-component :restaurant-name="restaurantName" :role="userRole" class="header" />
      <div class="page-container">
        <searchbar-component
            v-if="restaurantName"
            :restaurant-name="restaurantName"
            :user-role="userRole"
            />
        <div class="account-cards">
          <template v-if="accounts.length === 0">
            <div class="no-accounts">
              <label>You don't have created any product yet.</label>
            </div>
          </template>
          <template v-else-if="accounts.length !== 0">
            <AccountCardComponent
              v-for="account in accounts"
              :key="account.id"
              :account="account"
              @delete-account="deleteAccount"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderComponent from "@/admins/components/header-component.vue";
import SidebarComponent from "@/admins/components/sidebar-component.vue";
import userService from "@/public/services/userService";
import SearchbarComponent from "@/admins/views/saved-accounts-views/components/searchbar-component.vue";
import AccountCardComponent from "@/admins/views/saved-accounts-views/components/account-card-component.vue";
import {accountService} from "@/public/services/accountsService";

export default {
  components: {
    AccountCardComponent,
    SearchbarComponent,
    HeaderComponent,
    SidebarComponent,
  },
  data() {
    return {
      restaurantName: '',
      userRole: '',
      accounts: [],

    };
  },
  mounted() {
    this.fetchUserData();

    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      this.restaurantName = userData['business-name'];
      this.userRole = userData.role;
      this.restaurantId = localStorage.getItem('restaurantId'); // Obtener el ID del restaurante de localStorage
    }

    this.loadAccounts();
  },
  methods: {
    async fetchUserData() {
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        const restaurantId = userData?.restaurantId;

        if (restaurantId) {
          const restaurantData = await userService.getRestaurantById(restaurantId);
          this.restaurantName = restaurantData.name;
          this.userRole = userData.role;
        }
      } catch (error) {
        console.error("Error fetching restaurant data: ", error);
      }
    },
    async loadAccounts() {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const restaurantId = userData.restaurantId;

      try {
        const accounts = await accountService.getAccountsByRestaurant(restaurantId);
        this.accounts = accounts;
        this.filteredProducts = this.accounts;
      } catch (error) {
        console.error("Failed to load products", error);
      }
    },
    async deleteAccount(accountId) {
      console.log(accountId)
      if (confirm("Are you sure you want to remove this account?")) {
        try {
          const response = await accountService.deleteAccount(accountId);
          console.log(response)
          // Vuelve a cargar los productos después de la eliminación
          await this.loadAccounts();
        } catch (error) {
          console.error('Error during account deletion process:', error);
        }
      } else {
        console.log("Deletion canceled.");
      }
    },
  }
}
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
  background-color: #F6F5FA;
}
.main-content {
  margin-left: 255px; /* Desplaza el contenido a la derecha del sidebar */
  width: calc(100% - 280px); /* Ajusta el ancho para ocupar el resto de la pantalla */
  display: flex;
  flex-direction: column;
}
.page-container {
  margin-top: 70px; /* Desplaza el contenido principal por debajo del header */
  padding: 20px;
  background-color: #F6F5FA; /* Fondo blanco para la zona de contenido */
  height: calc(100vh - 100px); /* Ajusta el alto para evitar desbordamientos */
  font-family: 'Red Hat Display', sans-serif;
}

.account-cards{
  width: 100%;
  max-width: 1000px;
  margin: 20px auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 5px;
}
.no-accounts{
  text-align: center;
  color: #31304A;
}
</style>