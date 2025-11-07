<template>
  <q-page padding>
    <div v-if="loading" class="text-center q-pt-lg">
      <q-spinner color="primary" size="3em" />
      <div class="q-mt-sm">Загрузка...</div>
    </div>
    
    <div v-else-if="error" class="text-negative text-center q-pt-lg">
      {{ error }}
    </div>
    
    <div v-else class="column justify-center">
      <div class="col-12 col-md-8">
        <q-card flat bordered class="q-mb-lg no-padding">
          <div class="row items-stretch no-wrap">
            <div class="col-12 col-sm-6 no-padding">
              <img 
                v-if="food.url_image" 
                :src="food.url_image" 
                :alt="food.food"
                class="card-image"
              >
            </div>

            <div class="col-12 col-sm-6 q-pa-md">
              <div class="text-h3 text-dark text-weight-bold">{{ food.food }}</div> 
                <div v-if="food.country" class="q-mt-sm">
                  <q-chip color="warning" text-color="dark" icon="public">
                    {{ food.country }}
                  </q-chip>
                </div>
              </div>
            </div>
        </q-card>
        
      <div class="q-mb-lg">
        <q-card flat bordered>
          <q-expansion-item
            expand-separator
            label="Ингредиенты"
            header-class="text-dark q-pa-md"
            expand-icon-class="text-dark"
          >
              <template v-slot:header>
                <div class="row items-center justify-between full-width">
                  <div class="text-h6 text-dark text-weight-bold">Ингредиенты</div>
                  <q-btn
                    v-if="isEditable"
                    flat
                    round
                    color="primary"
                    icon="edit"
                    @click.stop="startEditing('description')"
                  />
                </div>
              </template>
              
              <q-separator class="q-mb-sm"/>
              <div v-if="!editing.description" v-html="food.description || 'Описание отсутствует'" class="q-pa-md text-dark"></div>
              <q-editor
                v-else
                v-model="editing.descriptionText"
                min-height="150px"
                class="q-pa-md text-dark"
                :toolbar="[
                  ['left', 'center', 'right', 'justify'],
                  ['bold', 'italic', 'underline'],
                  ['unordered', 'ordered',],
                  ['undo', 'redo'],
              ]"
              />
              <div v-if="editing.description" class="q-pa-md row justify-end">
                <q-btn color="positive" label="Сохранить" @click="saveChanges('description')" class="q-mr-sm"/>
                <q-btn color="negative" label="Отмена" @click="cancelEditing('description')"/>
              </div>
            </q-expansion-item>
          </q-card>
        </div>
        
        <div v-if="food.recipe" class="q-mb-lg">
          <q-card flat bordered>
            <q-card-section>
              <div class="row items-center justify-between">
                <div class="text-h6 text-dark text-weight-bold">Рецепт</div>
                <q-btn
                  v-if="isEditable"
                  flat
                  round
                  color="primary"
                  icon="edit"
                  @click.stop="startEditing('recipe')"
                />
              </div>
              <q-separator class="q-mb" />
              <div v-if="!editing.recipe" v-html="food.recipe" class="text-h6 q-mt-sm text-dark"></div>
              <q-editor
                v-else
                v-model="editing.recipeText"
                min-height="150px"
                class="q-pa-md text-dark"
                :toolbar="[
                  ['left', 'center', 'right', 'justify'],
                  ['bold', 'italic', 'underline'],
                  ['unordered', 'ordered',],
                  ['undo', 'redo'],
              ]"
                
              />
              <div v-if="editing.recipe" class="q-mt-sm row justify-end">
                <q-btn color="positive" label="Сохранить" @click="saveChanges('recipe')" class="q-mr-sm"/>
                <q-btn color="negative" label="Отмена" @click="cancelEditing('recipe')" class="q-mr-sm"/>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
    
    <q-page-sticky position="top-left" :offset="[5, 10]">
      <q-btn 
        round 
        color="primary" 
        icon="arrow_back" 
        @click="$router.go(-1)" 
      />
    </q-page-sticky>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import http from "/src/http-common";
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'FoodDetailsPage',
  setup() {
    const $q = useQuasar();
    const route = useRoute();
    const food = ref({ id: null });
    const loading = ref(true);
    const error = ref(null);
    
    const editing = ref({
      description: false,
      recipe: false,
      descriptionText: '',
      recipeText: ''
    });
    
    const currentUser = ref(JSON.parse(localStorage.getItem('currentUser')));
    const isEditable = computed(() => {
      return currentUser.value && (currentUser.value.role === 'администратор' || currentUser.value.id === food.value.user_id);
    });

    onMounted(async () => {
      try {
        const response = await http.get(`/food/${route.params.id}`);
        food.value = response.data[0] || { id: null };
        
        if (!food.value.id) {
          error.value = 'Блюдо не найдено';
        }
      } catch (err) {
        error.value = 'Не удалось загрузить информацию о блюде';
        console.error("Error:", err);
      } finally {
        loading.value = false;
      }
    });

    const startEditing = (field) => {
      editing.value[field] = true;
      editing.value[`${field}Text`] = food.value[field] || '';
    };

    const cancelEditing = (field) => {
      editing.value[field] = false;
      editing.value[`${field}Text`] = '';
    };

    const saveChanges = async (field) => {
      try {
        const response = await http.post(`/updatefood_name/${food.value.id}`, {
          [field]: editing.value[`${field}Text`]
        });
        
        food.value[field] = editing.value[`${field}Text`];
        $q.notify({
          message: 'Изменения сохранены',
          color: 'positive',
          icon: 'check'
        });
        cancelEditing(field);
      } catch (err) {
        $q.notify({
          message: 'Ошибка при сохранении изменений',
          color: 'negative',
          icon: 'error'
        });
        console.error("Error saving changes:", err);
      }
    };

    return { 
      food, 
      loading, 
      error,
      editing,
      isEditable,
      startEditing,
      cancelEditing,
      saveChanges
    };
  }
});
</script>

<style scoped>
.text-h3 {
  font-size: 2rem;
  line-height: 2.5rem;
  margin-bottom: 12px;

}
.text-h9 {
  margin: 0px;
  font-size: 2rem;
}
.text-h6{
  margin: 0px;
}
.card-image {
  width: 100%;
  height: 100%;
  max-height: 400px;
  object-fit: cover;
  display: block;
}

.no-padding {
  padding: 0 !important;
}

.row.items-stretch {
  align-items: center;
}

.q-card {
  border-radius: 10px;
  overflow: hidden;
}

.q-pa-md {
  padding: 10px;
}


</style>