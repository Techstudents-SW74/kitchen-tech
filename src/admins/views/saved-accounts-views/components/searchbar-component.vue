<template>
  <div class="products-header">
    <input
        class="search-bar"
        type="text"
        v-model="searchQuery"
        placeholder="Search accounts..."
        @input="filterAccounts"
        @focus="onSearchFocus"
    />
    <ul v-if="filteredAccounts.length && searchQuery" class="dropdown">
      <li v-for="account in filteredAccounts" :key="account.id" class="account-card" @click="$emit('view-account')">
        <div class="card-content">
          <span class="account-name">{{ account.accountName }}</span>
          <span class="account-client">{{ account.client }}</span>
        </div>
        <span class="total-account">S/.{{ account.totalAccount }}</span>
      </li>
    </ul>
    <ul v-else-if="accounts.length === 0 && searchQuery" class="dropdown">
      <li class="account-card">
        <div class="card-content">
          <div class="no-products">
            <label>You don't have created any product yet.</label>
          </div>
        </div>
      </li>
    </ul>
    <button class="table-button" @click="toggleTablesMode">Show tables</button>
    <button class="account-button" @click="toggleAccountsMode">Show Account</button>
  </div>
</template>

<script>
import {accountService} from "@/public/services/accountsService";

export default {
  props: {
    restaurantName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      searchQuery: '',
      accounts: [],
      filteredAccounts: [],
    };
  },
  mounted() {
    if(this.restaurantName) {
      this.loadAccounts();
    } else {
      console.error('Restaurant name is required');
    }
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
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
    filterAccounts() {
      try{
        const query = this.searchQuery.toLowerCase();
        this.filteredAccounts = this.accounts.filter((account) =>
            account.accountName.toLowerCase().includes(query)
        );
      } catch (error){
        console.log("There are not accounts to show")
      }
    },
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.filteredAccounts = [];
      }
    },
    onSearchFocus() {
      if (this.searchQuery) {
        this.filterAccounts();
      }
    },
    toggleTablesMode() {
      this.$emit('toggle-tables-mode');
    },
    toggleAccountsMode() {
      this.$emit('toggle-accounts-mode');
    },
  }
}
</script>

<style scoped>
.products-header {
  display: flex;
  width: 100%;
  position: relative;
  max-width: 1000px;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  padding-bottom: 10px;
  gap: 10px;
}
.search-bar {
  width: 100%;
  padding: 15px;
  border-radius: 5px;
  border: none;
  color: #31304A;
  background-color: #D3D2E5;
}
.dropdown{
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #D3D2E5;
  border: 1px solid #31304A;
  border-radius: 5px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  list-style: none;
  padding: 0;
  margin: 0;
  max-width: 705px;
}
.dropdown li {
  padding: 10px;
  display: flex;
  justify-content: space-between;
}
.dropdown button {
  background-color: #31304A;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.account-card{
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid #F6F5FA;
}
.account-card:last-child{
  border-bottom: none;
}
.card-content{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  font-family: 'Red-hat-display', sans-serif;
}
.account-name {
  font-size: 14px;
  font-weight: 700;
}
button{
  padding: 13px 20px;
  background: #D3D2E5;
  color: #31304A;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 800;
  flex-shrink: 0;
}
</style>