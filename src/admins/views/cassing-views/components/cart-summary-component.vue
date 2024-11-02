<template>
  <div class="cart-summary">
    <button class="add-customer" @click="addCustomer">Add Customer</button>

    <div class="cart-item" v-for="(item, index) in localCart" :key="item.id">
      <div class="item-header" @click="toggleItemInputs(index)">
        <div class="item-info">
          <span class="item-name">{{ item.productName }}</span>
          <span class="item-unit">{{ item.quantity }} Un - S/{{ item.productPrice }}</span>
        </div>
        <button class="remove-button" @click.stop="removeItem(index)">
          <i>-</i>
        </button>
      </div>
      <div v-if="item.showInputs" class="item-body">
        <div class="input-group">
          <label>Quantity</label>
          <input type="number" v-model.number="item.quantity" @input="updateItemTotal(index)" @blur="validateQuantity(index)" />
        </div>

        <div class="input-group">
          <label>Unit Price</label>
          <input type="number" v-model="item.price" @input="updateItemTotal(index)" @blur="validatePrice(index)" />
        </div>
      </div>
    </div>
    <div class="footer">
      <button class="save-sale" @click="showModal = true">Save Sale</button>
      <save-order-component
          :is-visible="showModal"
          :restaurant-id="restaurantId"
          @save-sale="saveOrder"
          @close-modal="closeModal"
      />
      <div class="summary">
        <span>Subtotal</span>
        <span>S/{{ localSubtotal.toFixed(2) }}</span>
      </div>
      <div class="summary">
        <span>I.G.V:</span>
        <span>S/{{ localIgv.toFixed(2) }}</span>
      </div>
    </div>
    <button class="charge-button" @click="charge">
      <span>Charge</span>
      <span>S/{{ localTotal.toFixed(2) }}</span>
    </button>
  </div>
</template>

<script>
import SaveOrderComponent from "@/admins/views/cassing-views/components/save-order-component.vue";
import {accountService} from "@/public/services/accountsService";
import {tablesService} from "@/public/services/tablesService";

export default {
  components: {SaveOrderComponent},
  props: {
    cart: Array,
    subtotal: Number,
    igv: Number,
    total: Number,
    restaurantId: Number,
  },
  data() {
    return {
      localCart: this.cart.map(item => ({
        ...item,
        showInputs: false
      })),
      localSubtotal: this.subtotal,
      localIgv: this.igv,
      localTotal: this.total,
      discountType: 'amount',
      showModal: false,
    };
  },
  methods: {
    addCustomer() {
      this.$emit('add-customer');
    },

    toggleItemInputs(index) {
      // Alternar la visibilidad de los inputs
      this.localCart[index].showInputs = !this.localCart[index].showInputs;
    },

    validateQuantity(index) {
      const item = this.localCart[index];
      if (item.quantity === 0 || item.quantity === "") {
        item.quantity = 1;
      }
      this.updateItemTotal(index);
    },
    validatePrice(index) {
      const item = this.localCart[index];
      if (item.price === 0 || item.price === "") {
        item.price = 1;
      }
      this.updateItemTotal(index);
    },
    updateItemTotal(index) {
      const item = this.localCart[index];

      const total = item.price * item.quantity;
      item.total = total > 0 ? total : 0;
      this.updateCartSummary();
    },
    removeItem(index) {
      this.localCart.splice(index, 1); // Remover el producto del array local
      this.updateCartSummary();
      this.$emit('update-cart', this.localCart); // Enviar al padre la actualización del carrito
    },
    async saveOrder(accountName, tableNumber) {
      if (accountName || tableNumber) {
        try {
          const tables = await tablesService.getTablesByRestaurant(this.restaurantId);
          const table = tables.find(t => String(t.tableNumber) === String(tableNumber));

          if (table) {
            this.tableId = table.id;
            const accountPayload = {
              accountName: this.accountName || `Mesa: ${tableNumber}`,
              table: { id: table.id },
              restaurantId: this.restaurantId,
              state: 0,
              totalAccount: this.localTotal.toFixed(2),
              products: [],
            };

            const createdAccount = await accountService.addAccount(accountPayload);

            if(createdAccount && createdAccount.id) {
              table.tableStatus = 1;
              await tablesService.updateTable(table);

              for(const item of this.localCart) {
                const accountProductPayload = {
                  accountId: createdAccount.id,
                  productId: item.id,
                  quantity: item.quantity,
                };
                await accountService.addAccountProduct(accountProductPayload);
              }
              this.$emit("save-sale", accountPayload);
              this.closeModal();
              this.$router.push(`/${this.restaurantName}/${this.userRole}/saved-accounts`)
            }
          } else {
            alert("Table not found");
          }
        } catch (error) {
          console.error("Error saving account or updating table status:", error);
        }
      } else {
        alert("Please, complete one input at least");
      }
    },
    closeModal(){
      this.showModal = false;
    },
    updateCartSummary() {
      const rawTotal = this.localCart.reduce((acc, item) => acc + item.price * item.quantity, 0);

      this.localSubtotal = rawTotal * 0.909;
      this.localIgv = rawTotal * 0.091;
      this.localTotal = rawTotal;

      // Emitir los nuevos valores al componente padre
      this.$emit('update-summary', {
        subtotal: this.localSubtotal,
        igv: this.localIgv,
        total: this.localTotal
      });
    },
    charge() {
      this.$emit('charge');
    },
  },
  watch: {
    cart: {
      handler(newCart) {
        this.localCart = JSON.parse(JSON.stringify(newCart));
        this.updateCartSummary();
      },
      deep: true
    },
    subtotal(newSubtotal) {
      this.localSubtotal = newSubtotal;
    },
    igv(newIgv) {
      this.localIgv = newIgv;
    },
    total(newTotal) {
      this.localTotal = newTotal;
    }
  }
};
</script>

<style scoped>
.cart-summary {
  flex: 1;
  padding: 20px 0;
  border-radius: 5px;
  display: flex;
  background-color: #D3D2E5;
  color: #31304A;
  flex-direction: column;
  font-family: "Red-hat-display", sans-serif;
}
.cart-summary button {
  padding: 10px;
  background: #31304A;
  color: #F6F5FA;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  justify-content: center;
}
button.add-customer {
  background-color: transparent;
  border: 1px solid #31304A;
  color: #31304A;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 100;
  margin: 0 20px 20px 20px;
}
.cart-item{
  border-top: 1px solid #F6F5FA;
  border-bottom: 1px solid #F6F5FA;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px 20px;
}

.item-header {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  margin-bottom: 10px;
}
.item-info{
  display: flex;
  flex-direction: column;
}
.item-name {
  font-weight: bold;
  margin-bottom: 5px;
}
.item-unit {
  font-size: 0.8rem;
}
.remove-button {
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
  background-color: #31304A;
  color: #F6F5FA;
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
  max-height: 25px;
}

.item-body {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 5px;
}
.input-group {
  flex-direction: column;
  max-width: 150px;
  border: none;
  border-radius: 5px;
}
input[type="number"]{
  -moz-appearance: textfield;
  appearance: textfield;
  padding: 5px;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input {
  width: 100%;
  max-width: 138px;
  border: none;
  border-radius: 5px;
  font-family: 'Red-hat-display', sans-serif;
}

label{
  font-size: 0.7rem;
}

.remove-button {
  background-color: #31304A;
  color: #F6F5FA;
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
}
.cart-summary .summary {
  display: flex;
  justify-content: space-between;
  margin: 10px 20px;
  font-weight: 100;
  font-size: 16px;
  color: #31304A;
}
button.save-sale {
  width: 100%;
  background-color: #31304A;
  color: white;
  padding: 15px 0;
  font-weight: bold;
  margin: 10px 0;
  font-size: 16px;
  border-radius: 0;
}
button.charge-button{
  width: 90%;
  display: flex;
  justify-content: space-between;
  background-color: #31304A;
  color: #F6F5FA;
  border: none;
  cursor: pointer;
  font-weight: 100;
  font-size: 0.8rem;
  margin-top: 20px;
  margin-left: 5%;
  align-items: center;
}
.cart-summary .footer{
  margin-top: auto;
}
</style>
