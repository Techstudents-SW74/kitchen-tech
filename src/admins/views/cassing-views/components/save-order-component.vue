<template>
  <div class="modal" v-if="isVisible">
    <div class="modal-content">
      <div class="modal-header">
        <p class="title">{{ isUpdate ? 'Update Order' : 'Save Order' }}</p>
        <button class="close" @click="closeModal()">x</button>
      </div>
      <form @submit.prevent="save">
        <div class="form-inputs">
          <div class="form-group account-name">
            <label for="accountName">Account Name</label>
            <input
                type="text"
                id="accountName"
                v-model="accountName"
                @input="handleAccountNameInput"
            />
          </div>
          <div class="form-group table-number">
            <label for="tableNumber">Mesa</label>
            <input
                type="text"
                id="tableNumber"
                v-model="tableNumber"
                :disabled="isUpdate"
            />
          </div>
        </div>
        <button type="submit" class="save-button">
          {{ isUpdate ? 'Update Order' : 'Save Order' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { accountService } from "@/public/services/accountsService";

export default {
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    restaurantId: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      accountName: "",
      tableNumber: "",
      manualAccountName: "",
      isUpdate: false,
      existingAccountData: null
    };
  },

  watch: {
    isVisible(newVal) {
      if (newVal) {
        this.loadExistingData();
      }
    },
    tableNumber(newVal) {
      if (!this.manualAccountName && !this.isUpdate) {
        this.accountName = `Mesa: ${newVal}`;
      }
    },
  },

  methods: {
    loadExistingData() {
      const accountData = JSON.parse(localStorage.getItem('accountData'));
      if (accountData) {
        this.existingAccountData = accountData;
        this.isUpdate = true;
        this.accountName = accountData.accountName;
        this.tableNumber = accountData.table?.tableNumber?.toString() || '';
      } else {
        this.isUpdate = false;
        this.existingAccountData = null;
      }
    },

    handleAccountNameInput(event) {
      if (!this.isUpdate) {
        const prefix = `Mesa: ${this.tableNumber}`;
        this.manualAccountName = event.target.value.startsWith(prefix)
            ? event.target.value.slice(prefix.length).trimStart()
            : event.target.value;

        this.accountName = `${prefix} ${this.manualAccountName}`;
      }
    },

    async updateExistingAccount() {
      try {
        const cartData = JSON.parse(localStorage.getItem('cartData')) || [];

        // Crear el payload completo incluyendo los productos
        const accountUpdatePayload = {
          ...this.existingAccountData,
          accountName: this.accountName,
          dateLog: new Date().toISOString(),
          totalAccount: cartData.reduce((total, item) => total + (item.price * item.quantity), 0),
          // Incluir la lista completa de productos actualizada
          products: cartData.map(product => ({
            id: product.id,
            quantity: product.quantity,
            accountId: this.existingAccountData.id
          }))
        };

        // Realizar una única llamada para actualizar la cuenta con todos sus productos
        await accountService.updateAccount(accountUpdatePayload);

        this.$emit('account-updated');
        this.resetFields();
        localStorage.removeItem('cartData');
      } catch (error) {
        console.error('Error updating account:', error);
        alert('Error updating account. Please try again.');
      }
    },
    
    async save() {
      if (this.isUpdate) {
        await this.updateExistingAccount();
      } else {
        this.$emit("save-sale", this.accountName, this.tableNumber);
      }
      this.closeModal();
    },

    resetFields() {
      this.accountName = "";
      this.tableNumber = "";
      this.manualAccountName = "";
      this.isUpdate = false;
      this.existingAccountData = null;
    },

    closeModal() {
      this.resetFields();
      this.$emit("close-modal");
    }
  },
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background-color: #F6F5FA;
  color: #31304A;
  padding: 30px;
  border-radius: 5px;
  width: 550px;
  max-width: 100%;
}
.modal-header{
  display: flex;
  justify-content: space-between;
}
.close{
  background-color: transparent;
  border: none;
  color: #31304A;
  font-weight: 800;
  padding: 0;
  margin: 0;
  align-self: flex-start;
}

.title{
  font-size: 20px;
  font-weight: 800;
  margin: 0 0 15px 0;
}
.form-inputs{
  display: flex;
}
.form-group {
  margin-bottom: 15px;
}
.account-name{
  width: 410px;
}
.table-number{
  margin-left: 24px;
  max-width: 100px;
}

label{
  font-size: 0.8rem;
  margin-left: 5px;
}
input {
  width: 100%;
  padding: 8px;
  border: none;
  border-radius: 4px;
  background-color: #D3D2E5;
}
.save-button {
  width: 100%;
  padding: 10px;
  background-color: #31304A;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.save-button:active{
  background-color: #201E35;
}
</style>