<template>
  <div class="cart-summary">
    <button class="add-customer" @click="addCustomer">Add Customer</button>

    <div class="cart-item" v-for="(item, index) in localCart" :key="item.id">
      <div class="item-info">
        <span class="item-name">{{ item.name }}</span>

        <input
            type="number"
            v-model="item.price"
            @input="updateItemTotal(index)"
            class="price-input"
            min="0"
        />
        <input
            type="number"
            v-model.number="item.quantity"
            @input="updateItemTotal(index)"
            class="quantity-input"
            min="1"
        />
      </div>

      <div class="item-actions">
        <span class="item-total">S/{{ (item.price * item.quantity).toFixed(2) }}</span>
        <button @click="removeItem(index)" class="remove-button">-</button>
      </div>
    </div>

    <div class="footer">
      <button class="save-sale" @click="saveSale">Save Sale</button>
      <div class="summary">
        <span>Subtotal (82%):</span>
        <span>S/{{ localSubtotal.toFixed(2) }}</span>
      </div>
      <div class="summary">
        <span>I.G.V (18%):</span>
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
export default {
  props: {
    cart: Array,
    subtotal: Number,
    igv: Number,
    total: Number
  },
  data() {
    return {
      localCart: JSON.parse(JSON.stringify(this.cart)), // Copiamos el array de cart
      localSubtotal: this.subtotal,
      localIgv: this.igv,
      localTotal: this.total
    };
  },
  methods: {
    addCustomer() {
      this.$emit('add-customer');
    },
    saveSale() {
      this.$emit('save-sale');
    },
    charge() {
      this.$emit('charge');
    },

    updateItemTotal() {
      this.updateCartSummary();
      this.$emit('update-cart', this.localCart); // Enviar al padre la actualización del carrito
    },
    removeItem(index) {
      this.localCart.splice(index, 1); // Remover el producto del array local
      this.updateCartSummary();
      this.$emit('update-cart', this.localCart); // Enviar al padre la actualización del carrito
    },
    updateCartSummary() {
      const rawTotal = this.localCart.reduce((acc, item) => acc + item.price * item.quantity, 0);

      this.localSubtotal = rawTotal * 0.82;
      this.localIgv = rawTotal * 0.18;
      this.localTotal = rawTotal;

      // Emitir los nuevos valores al componente padre
      this.$emit('update-summary', {
        subtotal: this.localSubtotal,
        igv: this.localIgv,
        total: this.localTotal
      });
    }
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
  display: flex;
  justify-content: space-between;
  padding: 10px;
  margin: 10px 20px;
  border-radius: 5px;
}
.item-info {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.item-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.item-total {
  font-weight: bold;
}

.price-input,
.quantity-input {
  width: 100px;
  padding: 5px;
  border: 1px solid #F6F5FA;
  border-radius: 5px;
  font-size: 14px;
  text-align: right;
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
  color: white;
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
