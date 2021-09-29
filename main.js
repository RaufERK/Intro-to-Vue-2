Vue.config.devtools = true;

var eventBus = new Vue();

Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  template: `
      <div class="product">

        <div class="product-image">
          <img :src="image" />
        </div>

        <div class="product-info">

          <h1>{{title}}</h1>
          <p v-if="inStock">In Stock</p>
          <p v-else>Out of Stock</p>
          <p>Shippping : {{shipping}}</p>

          <ul>
            <li v-for="item in details">{{item}}</li>
          </ul>

          <div
            v-for="variant,index in variants"
            :key="variant.variantId"
            class="color-box"
            :style="{ backgroundColor: variant.variantColor}"
            @mouseover="modifyProduct(index)"
          ></div>


          <button
            @click="addToCart"
            :disabled="!inStock"
            :class="{disabledButton: !inStock}"
          >
            Add to Cart
          </button>

          </div>
        <review-tabs :reviews="reviews"></review-tabs>
    </div>
  `,
  components: ['review-tabs'],
  data() {
    return {
      brand: 'Vue Mastery',
      product: 'Socks',
      details: ['80% cotton', '20% polyster', 'Gender-neutral'],
      variants: [
        {
          variantId: 2234,
          variantColor: 'green',
          variantImage: './vmSocks-green-onWhite.jpeg',
          volume: 222,
        },
        {
          variantId: 2235,
          variantColor: 'blue',
          variantImage: './vmSocks-blue-onWhite.jpeg',
          volume: 0,
        },
      ],
      selectedVariant: 0,
      reviews: [{ name: 'rauf', review: 'IUSUIYDSUYDO', rating: 3 }],
    };
  },
  methods: {
    addToCart() {
      this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
    },
    modifyProduct(index) {
      this.selectedVariant = index;
    },
    setNewReview(obj) {
      this.reviews.push(obj);
    },
  },
  computed: {
    title() {
      return this.brand + ' ' + this.product;
    },
    image() {
      return this.variants[this.selectedVariant].variantImage;
    },
    inStock() {
      return !!this.variants[this.selectedVariant].volume;
    },
    shipping() {
      if (this.premium) {
        return 'FREE';
      }
      return 2.99;
    },
  },
  mounted() {
    eventBus.$on('submit-review', (reviewObj) => this.setNewReview(reviewObj));
  },
});

Vue.component('review', {
  template: `
    <form @submit.prevent="submitForm" class="review-form">

      <p v-if="errors.length">
        <b>Please correct the folowing error(s):</b>
        <ul>
          <li class="red" v-for="error,index in errors">{{error}}</li>
        </ul>
      </p>

      <p>
        <label>
          Enter You Name
          <input v-model="name" placeholder="name">
        </label>
      </p>
      
      <p>
        <label for="review">Review:</label>     
        <textarea id="review" v-model.trim="review" placeholder="you review"/>
      </p>

      <p>
      <label for="raiting">Raiting:</label>
        <select id="raiting" v-model.number="rating" value="0">
          <option value='1'>1</option>
          <option value='2'>2</option>
          <option value='3'>3</option>
          <option value='4'>4</option>
        </select>
      </p>
 
      <p>
       <input type="submit" value="Submit">
      </p>

    </form>
    `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      errors: [],
    };
  },
  methods: {
    submitForm() {
      this.errors = [];
      if (this.name && this.review && this.rating) {
        const reviewObj = {
          name: this.name,
          review: this.review,
          rating: this.raiting,
        };
        eventBus.$emit('submit-review', reviewObj);
        this.$emit('add');
        this.name = '';
        this.review = '';
        this.rating = '';
      } else {
        if (!this.name) this.errors.push('Name required.');
        if (!this.review) this.errors.push('Review required.');
        if (!this.rating) this.errors.push('Rating required.');
      }
    },
  },
});

Vue.component('review-tabs', {
  props: {
    reviews: {
      type: Array,
      required: true,
    },
  },
  template: `
  <div>
    <span 
      v-for="(tab,index) in tabs"
      :key="index"
      class="tab"
      :class="{ activeTab: selectedTab===tab}"
      @click="{ selectedTab = tab }"
      >{{ tab }}</span>

      <div v-show="selectedTab==tabs[0]">
        <h2>Reviews:</h2>
        <p v-if="!reviews.length">No rewiev for now!!</p>
        <ul>
          <li v-for="review in reviews">
          <p>{{review.name}}</p>
          <p>{{review.review}}</p>
          <p>raiting: {{review.rating}}</p>
          </li>
        </ul>
      </div>
      <review v-show="selectedTab==tabs[1]" @add="selectedTab='reviews'"></review>
  </div>
  `,
  components: ['review'],
  data() {
    return {
      tabs: ['reviews', 'add review'],
      selectedTab: 'reviews',
    };
  },
});

var app = new Vue({
  el: '#app',
  data: {
    premium: true,
    cart: [],
  },
  methods: {
    addToCart(id) {
      this.cart.push(id);
    },
  },
});
