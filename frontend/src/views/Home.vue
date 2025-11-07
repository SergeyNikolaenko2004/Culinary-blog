<template>
  <q-page class="q-pa-md">
    <div class="fixed-counter">
      <div class="counter-content">
        <div v-if="loading" class="text-center">
          <q-spinner color="dark" size="2em" />
        </div>
        <div v-else class="counter-text text-dark">
          У нас есть уже <span class="counter-number">{{ count }}</span> блюд
        </div>
      </div>
    </div>

    <div class="q-mt-xl">
      <div class="row q-mb-xl items-center">
        <div class="col-md-6 col-sm-12 q-pr-md">
          <q-img
            src="/public/images/foods/ppp.jpg"
            alt="Блюдо 1"
            ratio="1"
            class="rounded-borders shadow-5 "
          />
        </div>
        <div class="col-md-6 col-sm-12 q-pa-md">
          <h3 class="text-h5">Пицца (Италия) 🍕</h3>
          <p class="text-body1">
            Каждую секунду в мире съедают 350 кусков пиццы!
          </p>
          <q-chip color="orange" text-color="white" icon="star">
            Популярность: 32%
          </q-chip>
        </div>
      </div>

      <div class="row q-mb-xl items-center">
        <div class="col-md-6 col-sm-12 order-md-first order-sm-last q-pr-md">
          <h2 class="text-h5">Бургер (США) 🍔</h2>
          <p class="text-body1">
            Самый большой бургер весил 913 кг (включён в Книгу рекордов Гиннесса).
          </p>
          <q-chip color="orange" text-color="white" icon="star">
            Популярность:  28%
          </q-chip>
        </div>
        <div class="col-md-6 col-sm-12 order-md-last order-sm-first q-pl-md">
          <q-img
            src="/public/images/foods/bbb.jpg"
            alt="Блюдо 2"
            ratio="1"
            class="rounded-borders shadow-5"
          />
        </div>
      </div>
      
      <div class="row q-mb-xl items-center">
        <div class="col-md-6 col-sm-12 q-pr-md">
          <q-img
            src="/public/images/foods/sss.jpg"
            alt="Блюдо 3"
            ratio="1"
            class="rounded-borders shadow-5"
          />
        </div>
        <div class="col-md-6 col-sm-12 q-pl-md">
          <h2 class="text-h5">Суши (Япония) 🍣</h2>
          <p class="text-body1">
            Самые дорогие суши — с золотой фольгой и трюфелями (до $2000 за порцию).
          </p>
          <q-chip color="orange" text-color="white" icon="star">
            Популярность: 15%
          </q-chip>
        </div>
      </div>

      <div class="row q-mb-xl items-center">
        <div class="col-md-6 col-sm-12 order-md-first order-sm-last q-pr-md">
          <h2 class="text-h5">Паста/Спагетти 🍝</h2>
          <p class="text-body1">
            Хотя паста ассоциируется с Италией, первые упоминания о лапше из пшеничной муки найдены в Китае (4,000 лет назад)
          </p>
          <q-chip color="orange" text-color="white" icon="star">
            Популярность:  9%
          </q-chip>
        </div>
        <div class="col-md-6 col-sm-12 order-md-last order-sm-first q-pl-md">
          <q-img
            src="/public/images/foods/papa.jpg"
            alt="Блюдо 2"
            ratio="1"
            class="rounded-borders shadow-5"
          />
        </div>
      </div>

      <div class="row q-mb-xl items-center">
        <div class="col-md-6 col-sm-12 q-pr-md">
          <q-img
            src="/public/images/foods/tatata.jpg"
            alt="Блюдо 3"
            ratio="1"
            class="rounded-borders shadow-5"
          />
        </div>
        <div class="col-md-6 col-sm-12 q-pl-md">
          <h2 class="text-h5">Тако/Буррито 🌮 6%</h2>
          <p class="text-body1">
            В 1985 году буррито стало первой мексиканской едой в космосе — NASA включило его в меню шаттла Atlantis из-за удобства в невесомости.
          </p>
          <q-chip color="orange" text-color="white" icon="star">
            Популярность: 6%
          </q-chip>
        </div>
      </div>


    </div>
  </q-page>
</template>

<script>
import http from "/src/http-common";
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import { useQuasar } from 'quasar';


export default {
  name: "HomePage",
  setup() {
    const count = ref(0)
    const loading = ref(false)

    const fetchCount = async () => {
      loading.value = true
      try {
        const response = await http.get('/food_name')
        count.value = response.data.length
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchCount()
    })

    return {
      count,
      loading
      
    }
  }
}
</script>

<style scoped>
.fixed-counter {
  position: fixed;
  left: 0;
  top: 80px;
  background: rgba(255, 255, 255);
  padding: 5px;
  border-radius: 0 10px 10px 0;
  box-shadow: 0 1px 7px rgb(207, 138, 9);
  max-width: 200px;
  z-index: 100;
}

.counter-content {
  padding: 10px;
}

.counter-text {
  font-size: 1rem;
  line-height: 1.4;
  text-align: center;
}

.counter-number {
  font-weight: bold;
  font-size: 1.5rem;
  color: inherit;
  display: block;
  margin: 5px;
}


</style>