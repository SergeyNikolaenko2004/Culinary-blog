<template>
  <div class="page-container">
    <div class="filter-panel">
      <div class="q-pa-md">
        <div v-for="country in availableCountries" :key="country">
          <q-toggle
            v-model="selectedCountries"
            :val="country"
            :label="country"
            color="primary"
            class="q-mb-sm"
            dense
          />
        </div>
      </div>
    </div>

    <div class="content-area">
      <div v-if="filteredFoodNames.length > 0" class="row q-col-gutter-md">
        <div 
          v-for="food in filteredFoodNames" 
          :key="food.id" 
          class="col-xs-12 col-sm-6 col-md-4 col-lg-3"
        >
          <q-card 
            bordered
            class="my-card"
            @click="!isEditing(food.id) && $router.push({ name: 'FoodDetailsPage', params: { id: food.id } })"
          >
            <!-- Измененная секция изображения -->
            <div class="image-container">
              <img 
                v-if="food.url_image" 
                :src="food.url_image" 
                :alt="food.food"
                class="card-image"
              >
              <div v-else class="no-image-placeholder flex flex-center">
                <q-icon name="fastfood" size="xl" color="grey-5" />
                <span>Нет изображения</span>
              </div>
            </div>

            <q-card-section class="text-dark card-content">
              <div class="row items-center justify-between">
                <div class="text-h6 food-title">{{ food.food }}</div>
                <div>
                  <q-btn 
                    v-if="isCurrentUserOwner(food.user_id)"
                    flat 
                    round 
                    color="primary" 
                    icon="edit" 
                    @click.stop="startEditing(food.id)"
                  />
                </div>
              </div>
              
              <div v-if="food.country" class="q-mt-sm">
                <q-chip dense color="warning" text-color="dark" icon="public">
                  {{ food.country }}
                </q-chip>
              </div>
            </q-card-section>

            <q-card-actions align="right" class="q-px-md card-actions">
              <q-btn 
                flat 
                color="dark" 
                :icon="expandedDescriptions[food.id] ? 'expand_less' : 'expand_more'" 
                @click.stop="toggleDescription(food.id)"
              />
            </q-card-actions>

            <q-slide-transition>
              <div v-show="expandedDescriptions[food.id]">
                <q-card-section class="text-subtitle2 description-section">
                  <div 
                    v-if="!editingDescriptions[food.id]" 
                    v-html="food.description || 'Описание отсутствует'"
                  ></div>
                  
                  <q-editor
                    v-else
                    @click.stop
                    v-model="editingText"
                    min-height="150px"
                    content-class="text-left"
                    :toolbar="[
                      ['left', 'center', 'right', 'justify'],
                      ['bold', 'italic', 'underline'],
                      ['unordered', 'ordered',],
                      ['undo', 'redo'],
                    ]"
                  />
                  
                  <div v-if="editingDescriptions[food.id]" class="q-mt-sm">
                    <q-btn 
                      color="positive" 
                      label="Сохранить" 
                      @click.stop="saveDescription(food.id)"
                      size="sm"
                    />
                    <q-btn 
                      color="negative" 
                      label="Отмена" 
                      @click.stop="cancelEditing(food.id)"
                      size="sm"
                      class="q-ml-sm"
                    />
                  </div>
                </q-card-section>
              </div>
            </q-slide-transition>
          </q-card>
        </div>
      </div>

      <div v-else class="text-center q-mt-lg">
        <q-icon name="fastfood" size="xl" color="grey-5" />
        <div class="text-grey-5 q-mt-sm">
          {{ selectedCountries.length > 0 ? 'Нет блюд по выбранным фильтрам' : 'Нет блюд в этой категории' }}
        </div>
      </div>
    </div>
    <q-page-sticky position="bottom-left" :offset="[85, 10]">
      <q-btn 
        v-if="isCurrentUserOwner(null)"
        fab 
        color="primary" 
        icon="add" 
        @click="showAddDialog = true"
      />
    </q-page-sticky>

    <q-dialog v-model="showAddDialog" persistent>
      <q-card style="min-width: 400px" class="bg-grey-8 text-white">
        
        <q-card-section class="q-pt-none">
          <q-input 
            v-model="newFood.food" 
            label="Название блюда" 
            color="dark"
            class="q-mb-md"
            :rules="[val => !!val || 'Поле обязательно']"
            dark
          />
        <div>
          <q-select
            v-model="newFood.country"
            :options="availableCountries"            
            label="Страна"
            class="q-mb-md"
            color="dark"
            dark
          />
        </div>
          <q-input
            v-model="newFood.url_image"
            label="URL изображения"
            color="dark"
            class="q-mb-md"
            dark
          />

          <div class="q-mb-xs">Ингредиенты</div>
          <q-editor
            v-model="newFood.description"
            min-height="150px"
            label="Ингридиенты"
            content-class="text-white bg-grey-9"
            class="text-white"
            dark
            :toolbar="[
                  ['left', 'center', 'right', 'justify'],
                  ['bold', 'italic', 'underline'],
                  ['unordered', 'ordered',],
                  ['undo', 'redo'],
              ]"
          />
          <div class="q-mb-xs">Рецепт приготовления</div>
          <q-editor
            v-model="newFood.recipe"
            min-height="150px"
            label="Рецепт"
            content-class="text-white bg-grey-9"
            class="text-white"
            dark
            :toolbar="[
                  ['left', 'center', 'right', 'justify'],
                  ['bold', 'italic', 'underline'],
                  ['unordered', 'ordered',],
                  ['undo', 'redo'],
              ]"
          />
        </q-card-section>

        

        <q-card-actions align="right" class="bg-grey-9">
          <q-btn flat label="Отмена" color="white" v-close-popup />
          <q-btn flat label="Добавить" color="positive" @click="addNewFood" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import http from "/src/http-common";
import { useQuasar } from 'quasar';

export default defineComponent({
  name: "food-list-by-culture",
  props: ['culture_plast_id'],
  setup(props) {
    const $q = useQuasar();
    const foodNames = ref([]);
    const selectedCountries = ref([]);
    const expandedDescriptions = ref({});
    const editingDescriptions = ref({});
    const editingText = ref('');
    const currentEditingId = ref(null);
    const currentUser = ref(JSON.parse(localStorage.getItem('currentUser')) || null);
    const isEditing = (id) => {
      return editingDescriptions.value[id] || currentEditingId.value === id;
    };
    

    const showAddDialog = ref(false);
    const newFood = ref({
      food: '',
      country: '',
      url_image: '',
      description: '',
      culture_plast_id: props.culture_plast_id,
      recipe: '',
      user_id: JSON.parse(localStorage.getItem('currentUser'))?.id || null
    });
    

    const addNewFood = async () => {
      try {
        if (!newFood.value.food) {
          $q.notify({
            message: 'Название блюда обязательно',
            color: 'negative',
            icon: 'error'
          });
          return;
        }

        const response = await http.post('/addfood', {
          food: newFood.value.food,
          culture_plast_id: newFood.value.culture_plast_id,
          user_id: newFood.value.user_id,
          url_image: "/images/foods/" + newFood.value.url_image,
          description: newFood.value.description,
          country: newFood.value.country,
          recipe: newFood.value.recipe
        });

        foodNames.value.push(response.data);
        
        $q.notify({
          message: 'Блюдо успешно добавлено',
          color: 'positive',
          icon: 'check'
        });

        newFood.value = {
          food: '',
          country: '',
          url_image: '',
          description: '',
          culture_plast_id: props.culture_plast_id,
          recipe: '',
          user_id: JSON.parse(localStorage.getItem('currentUser'))?.id || null
        };
        showAddDialog.value = false;
      } catch (e) {
        console.error("Error adding new food:", e);
        $q.notify({
          message: 'Ошибка при добавлении блюда',
          color: 'negative',
          icon: 'error'
        });
      }
    };

    const toggleDescription = (id) => {
      expandedDescriptions.value[id] = !expandedDescriptions.value[id];
    };

    const startEditing = (id) => {
      currentEditingId.value = id;
      editingDescriptions.value[id] = true;
      const food = foodNames.value.find(food => food.id === id);
      editingText.value = food?.description || '';
    };

    const cancelEditing = (id) => {
      editingDescriptions.value[id] = false;
      currentEditingId.value = null;
      editingText.value = '';
    };

    const saveDescription = async (id) => {
      try {
        const food = foodNames.value.find(food => food.id === id);
        if (!food) {
          console.error("еда не найдена");
          return;
        }
        if (food.description === editingText.value) {
          cancelEditing(id);
          return;
        }

        await http.post(`/updatefood_name/${id}`, {
          description: editingText.value
        });
      
        const index = foodNames.value.findIndex(food => food.id === id);
        if (index !== -1) {
          foodNames.value[index].description = editingText.value;
        }

        cancelEditing(id);
      } catch (e) {
        console.error("Error updating description:", e);
        $q.notify({
          message: 'Ошибка при обновлении описания',
          color: 'negative',
          icon: 'error'
        });
      }
    };

    const isCurrentUserOwner = (userId) => {
      return currentUser.value && currentUser.value.role === 'администратор';
    };

    const availableCountries = computed(() => {
      const countries = new Set();
      foodNames.value.forEach(food => {
        if (food.country) countries.add(food.country);
      });
      return Array.from(countries).sort();
    });

    const filteredFoodNames = computed(() => {
      if (selectedCountries.value.length === 0) return foodNames.value;
      return foodNames.value.filter(food => 
        food.country && selectedCountries.value.includes(food.country)
      );
    });

    const getFoodNamesByCulturePlastId = async () => {
      try {
        const response = await http.get(`/food_name/culture_plast_id/${props.culture_plast_id}`);
        foodNames.value = response.data;
        foodNames.value.forEach(food => {
          if (expandedDescriptions.value[food.id] === undefined) {
            expandedDescriptions.value[food.id] = false;
          }
        });
      } catch (e) {
        console.error("Error fetching food data:", e);
      }
    };

    onMounted(getFoodNamesByCulturePlastId);
    watch(() => props.culture_plast_id, () => {
      getFoodNamesByCulturePlastId();
      selectedCountries.value = [];
    });

    return {
      foodNames,
      filteredFoodNames,
      availableCountries,
      selectedCountries,
      expandedDescriptions,
      editingDescriptions,
      editingText,
      toggleDescription,
      startEditing,
      cancelEditing,
      isCurrentUserOwner,
      saveDescription,
      currentUser,
      showAddDialog,
      newFood,
      addNewFood,
      isEditing
    };
  }
});
</script>

<style lang="scss" scoped>
.page-container {
  display: flex;
}

.filter-panel {
  width: 200px;
  padding: 30px;
  position: fixed;
  height: 100%;
  left: 0;
  top: 55px;
  background: dark;
}

.content-area {
  margin-left: 200px;
  padding: 16px;
  flex: 1;
}

.my-card {
  border-radius: 10px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 450px;
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 7px rgb(207, 138, 9);
    cursor: pointer;
  }
}

.image-container {
  width: 100%;
  height: 200px;
  overflow: hidden;
  position: relative;
  background-color: #f5f5f5;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover; 
  display: block;
}

.no-image-placeholder {
  width: 100%;
  height: 100%;
  background-color: #e0e0e0;
  color: #9e9e9e;
  flex-direction: column;
  font-size: 14px;
}

.card-content {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  min-height: 120px;
}

.food-title {
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 8px;
}

.card-actions {
  padding: 8px 16px;
  margin-top: auto;
}

.description-section {
  padding-top: 0;
  padding-bottom: 16px;
  white-space: pre-line;
  color: $dark;
  text-align: left;
  border-top: 1px solid #e0e0e0;
}

.row.q-col-gutter-md > div {
  display: flex;
}

.col-xs-12, .col-sm-6, .col-md-4, .col-lg-3 {
  display: flex;
}

.clickable-element {
  cursor: pointer;
}

.clickable-element:hover {
  cursor: pointer;
}
</style>