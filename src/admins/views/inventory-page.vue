<template>
  <div class="layout">
    <sidebar-component :restaurant-name="restaurantName" :role="userRole" class="sidebar" />
    <div class="main-content">
      <header-component :restaurant-name="restaurantName" :role="userRole" class="header" />
      <div class="page-container">
        <main class="supplies-page">
          <div class="content-wrapper">
            <div class="supplies-header">
              <input
                class="search-bar"
                type="text"
                v-model="searchQuery"
                placeholder="Search supplies..."
                @input="filterSupplies"
              />
              <button class="add-button" @click="openSupplyConfig">Add Supply</button>
            </div>
            <div class="supply-table-container">
              <template v-if="filteredSupplies.length === 0">
                <div class="no-supplies">
                  <label>No supplies available.</label>
                </div>
              </template>
              <template v-else>
                <table class="supply-table">
                  <thead>
                    <tr>
                      <th>Supply Name</th>
                      <th>Category</th>
                      <th>Metric Unit</th>
                      <th>Stock</th>
                      <th>Cost per Unit</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="supply in filteredSupplies" :key="supply.id">
                      <td>{{ supply.supplyName }}</td>
                      <td>{{ supply.supplyCategory }}</td>
                      <td>{{ supply.metricUnit }}</td>
                      <td>{{ supply.currentlyOnStock }}</td>
                      <td>${{ supply.costPerUnit.toFixed(2) }}</td>
                      <td>{{ supply.stateOfSupply }}</td>
                      <td>
                        <button class="edit-button" @click="editSupply(supply)">Edit</button>
                        <button class="delete-button" @click="deleteSupply(supply.id)">Delete</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </template>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- Supply Config Overlay -->
    <div v-if="isSupplyConfigOpen" class="supply-config-overlay">
      <div class="supply-config-modal">
        <h2>Supply Configuration</h2>
        
        <div class="form-group">
          <label for="supply-name">Supply Name</label>
          <input type="text" v-model="newSupplyName" id="supply-name" />
        </div>

        <div class="form-group">
          <label for="supply-category">Category</label>
          <input type="text" v-model="newSupplyCategory" id="supply-category" />
        </div>

        <div class="form-group">
          <label for="metric-unit">Metric Unit</label>
          <select v-model="newSupplyMetricUnit" id="metric-unit">
            <option v-for="(unit, key) in MetricUnit" :key="key" :value="unit">
              {{ unit }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="stock">Stock</label>
          <input type="number" v-model="newSupplyStock" id="stock" />
        </div>

        <div class="form-group">
          <label for="cost">Cost per Unit</label>
          <input type="number" v-model="newSupplyCostPerUnit" id="cost" />
        </div>

        <div class="form-group">
          <label for="state">State</label>
          <select v-model="newSupplyState" id="state">
            <option v-for="(state, key) in SupplyState" :key="key" :value="state">
              {{ state }}
            </option>
          </select>
        </div>

        <div class="modal-actions">
          <button class="close-button" @click="closeSupplyConfig">Close</button>
          <button @click="addSupply">{{ supplyToEdit ? 'Update' : 'Save' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderComponent from "@/admins/components/header-component.vue";
import SidebarComponent from "@/admins/components/sidebar-component.vue";
import { supplyService } from "@/public/services/supplyService"; // Cambia según tu servicio

export default {
  components: {
    HeaderComponent,
    SidebarComponent,
  },
  data() {
    return {
      restaurantName: '',
      userRole: '',
      supplies: [],
      searchQuery: '',
      filteredSupplies: [],
      isSupplyConfigOpen: false,  // Control for overlay visibility
      newSupplyMetricUnit: '', // Selección del usuario
      newSupplyState: '', // Selección del usuario
      

      // Enums
      MetricUnit: {
        Kg: 'Kg',
        G: 'g',
        L: 'L',
        Ml: 'ml',
        Unit: 'u',
      },
      SupplyState: {
        OnStock: 'OnStock',
        OffStock: 'OffStock',
      },
    };
  },
  beforeMount() {
    this.fetchUserData();

    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      this.restaurantName = userData['business-name']; // Si no tienes 'business-name' puedes colocar un valor predeterminado.
      this.userRole = userData.role;
      this.restaurantId = userData.restaurantId;  // Asegúrate de que restaurantId está aquí.
      //console.log('Restaurant ID:', this.restaurantId);
    }
    this.loadSupplies();
  },
  methods: {
    async fetchUserData() {
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        const restaurantId = userData?.restaurantId;

        if (restaurantId) {
          this.restaurantName = "Mock Restaurant"; // Cambia según tu lógica
          this.userRole = userData.role;
        }
      } catch (error) {
        console.error("Error fetching restaurant data: ", error);
      }
    },

    async loadSupplies() {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const restaurantId = userData.restaurantId;

      try {
        const supplies = await supplyService.getSuppliesByRestaurant(restaurantId);
        this.supplies = supplies;
        this.filteredSupplies = this.supplies;
      } catch (error) {
        console.error("Failed to load supplies", error);
      }
      this.filteredSupplies = this.supplies;
    },

    filterSupplies() {
      const query = this.searchQuery.toLowerCase();
      this.filteredSupplies = this.supplies.filter((supply) =>
        supply.supplyName.toLowerCase().includes(query)
      );
    },

    async addSupply() {
      // Validar las selecciones del usuario
      if (!Object.values(this.SupplyState).includes(this.newSupplyState) || 
          !Object.values(this.MetricUnit).includes(this.newSupplyMetricUnit)) {
        alert("Invalid data selected.");
        return;
      }

      const isNameTaken = this.supplies.some(supply => supply.supplyName.toLowerCase() === this.newSupplyName.toLowerCase());
      if (isNameTaken) {
        alert("A supply with this name already exists.");
        return;
      }

      if (this.supplyToEdit) {
        // Si estamos editando, actualiza el suministro existente
        await this.updateSupply();
      } else {
        // Crear un nuevo suministro
        const newSupply = {
          supplyName: this.newSupplyName,
          supplyCategory: this.newSupplyCategory,
          metricUnit: this.newSupplyMetricUnit,
          currentlyOnStock: this.newSupplyStock,
          costPerUnit: this.newSupplyCostPerUnit,
          stateOfSupply: this.newSupplyState,
          restaurantId: this.restaurantId,
        };
        
        console.log(this.restaurantId);

        try {
          const response = await supplyService.addSupply(newSupply);
          if (response) {
            this.supplies.push(response);
            this.filterSupplies(); // Actualiza la lista filtrada
            this.closeSupplyConfig(); // Cierra el modal
          }
        } catch (error) {
          console.error("Error adding supply:", error);
        }
      }
    },

    openSupplyConfig() {
      this.isSupplyConfigOpen = true; // Show the overlay
      this.newSupplyName = '';
      this.newSupplyCategory = '';
      this.newSupplyMetricUnit = '';
      this.newSupplyStock = 0;
      this.newSupplyCostPerUnit = 0;
      this.newSupplyState = '';
    },

    closeSupplyConfig() {
      this.isSupplyConfigOpen = false;
      this.newSupplyName = '';
      this.newSupplyCategory = '';
      this.newSupplyMetricUnit = '';
      this.newSupplyStock = 0;
      this.newSupplyCostPerUnit = 0;
      this.newSupplyState = '';
      this.supplyToEdit = null; // Limpiar referencia
    },

    editSupply(supply) {
      // Prellenar el formulario con los datos existentes
      this.newSupplyName = supply.supplyName;
      this.newSupplyCategory = supply.supplyCategory;
      this.newSupplyMetricUnit = supply.metricUnit;
      this.newSupplyStock = supply.currentlyOnStock;
      this.newSupplyCostPerUnit = supply.costPerUnit;
      this.newSupplyState = supply.stateOfSupply;

      // Guardar la referencia del suministro que estamos editando
      this.supplyToEdit = supply;
      //console.log("supply: ", supply)
      //console.log("supply edit: ", this.supplyToEdit)

      // Mostrar el formulario de configuración
      this.isSupplyConfigOpen = true;
    },

    async updateSupply() {

      if (!Object.values(this.SupplyState).includes(this.newSupplyState)) {
        alert("Invalid supply state selected.");
        return;
      }
      if (!Object.values(this.MetricUnit).includes(this.newSupplyMetricUnit)) {
        alert("Invalid metric unit selected.");
        return;
      }

      const updatedSupply = {
        id: this.supplyToEdit.id,
        supplyName: this.newSupplyName,
        supplyCategory: this.newSupplyCategory,
        metricUnit: this.newSupplyMetricUnit,
        currentlyOnStock: this.newSupplyStock,
        costPerUnit: this.newSupplyCostPerUnit,
        stateOfSupply: this.newSupplyState,
      };

      try {
        // Llamada al servicio para actualizar el suministro
        await supplyService.updateSupply(updatedSupply.id, updatedSupply);
        
        // Actualizar el suministro en la lista
        const index = this.supplies.findIndex(s => s.id === updatedSupply.id);
        if (index !== -1) {
          this.supplies.splice(index, 1, updatedSupply);
          this.filteredSupplies.splice(index, 1, updatedSupply);
        }
        
        // Cerrar el formulario de configuración
        this.closeSupplyConfig();
      } catch (error) {
        console.error("Error updating supply:", error);
      }
    },

    async deleteSupply(id) {
      try {
        // Llamada al servicio para eliminar el suministro
        await supplyService.deleteSupply(id);

        // Eliminarlo del arreglo local
        this.supplies = this.supplies.filter(supply => supply.id !== id);
        this.filteredSupplies = this.filteredSupplies.filter(supply => supply.id !== id);
      } catch (error) {
        console.error("Error deleting supply:", error);
      }
    }
    
  },
};
</script>

<style scoped>
  .layout {
    display: flex;
    height: 100vh;
    background-color: #F6F5FA;
  }
  .main-content {
    margin-left: 255px;
    width: calc(100% - 280px);
    display: flex;
    flex-direction: column;
  }
  .page-container {
    margin-top: 70px;
    padding: 20px;
    background-color: #F6F5FA;
    height: calc(100vh - 100px);
    font-family: 'Red Hat Display', sans-serif;
  }
  .no-supplies {
    text-align: center;
    color: #31304A;
  }
  .supplies-header {
    display: flex;
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
    max-width: 1000px;
  }
  .add-button {
    padding: 13px 20px;
    background: #D3D2E5;
    color: #31304A;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 800;
    flex-shrink: 0;
  }
  .supply-table-container {
    width: 100%;
    max-width: 1000px;
    margin: 20px auto;
  }
  .supply-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  .supply-table th, .supply-table td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #D3D2E5;
  }
  .supply-table th {
    background-color: #D3D2E5;
    color: #31304A;
  }
  .supply-table td {
    vertical-align: middle;
  }
  .edit-button,
  .delete-button {
    padding: 5px 10px;
    margin: 0 5px;
    border: none;
    border-radius: 3px;
    font-weight: bold;
    cursor: pointer;
  }
  .edit-button {
    background-color: #c7ab10;
    color: white;
  }
  .delete-button {
    background-color: #FF6347;
    color: white;
  }

  /* Supply Config Overlay Styles */
  .supply-config-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .supply-config-modal {
    background-color: #ffffff;
    padding: 20px;
    border-radius: 8px;
    width: 50%;
    text-align: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  h2 {
    font-size: 24px;
    margin-bottom: 20px;
    color: #333;
  }

  .form-group {
    margin-bottom: 15px;
    text-align: left;
  }

  .form-group label {
    font-size: 14px;
    color: #555;
    margin-bottom: 5px;
    display: block;
  }

  .form-group input {
    width: 90%;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 16px;
    color: #333;
  }

  .modal-actions {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
  }

  .close-button {
    padding: 10px 20px;
    background-color: #f2f2f2;
    color: #333;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .close-button:hover {
    background-color: #e0e0e0;
  }

  .modal-actions button {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .modal-actions button:hover {
    background-color: #45a049;
  }
</style>
