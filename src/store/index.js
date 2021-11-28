import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const convertMercTiersToCollection = function(obj, maxtiers) {
  return Object.keys(obj).reduce(
    (o, key) => ({ ...o, [key]: maxtiers - obj[key].tiers.length + 1 }),
    {}
  );
};

const ABILITY_MAX_TIER = 5;
const ITEM_MAX_TIER = 4;

export default new Vuex.Store({
  strict: true,
  state: {
    collection: {},
    mercenaries: {},
  },
  mutations: {
    setCollection(state, loadedCollection) {
      state.collection = loadedCollection;
    },
    setMercenaries(state, loadedMercenaries) {
      state.mercenaries = loadedMercenaries;
    },
    addToCollection(state, merc) {
      if (state.collection[merc.name]) {
        if (merc.collected !== undefined) {
          state.collection[merc.name].collected = merc.collected;
        }
      } else {
        const newmerc = {
          collected: merc.collected || false,
          level: 1,
          tasksCompleted: 0,
          itemEquiped: "",
          abilities: convertMercTiersToCollection(
            state.mercenaries[merc.name].abilities,
            5
          ),
          equipment: convertMercTiersToCollection(
            state.mercenaries[merc.name].equipment,
            4
          ),
        };
        state.collection = {
          ...state.collection,
          [merc.name]: newmerc,
        };
      }
    },
    decrementAbility(state, { mercName, abilityName }) {
      this.commit("addToCollection", { name: mercName });
      if (
        state.collection[mercName].abilities[abilityName] >
        ABILITY_MAX_TIER -
          state.mercenaries[mercName].abilities[abilityName].tiers.length +
          1
      ) {
        state.collection[mercName].abilities[abilityName]--;
      } else {
        return false;
      }
    },
    incrementAbility(state, { mercName, abilityName }) {
      this.commit("addToCollection", { name: mercName });
      if (
        state.collection[mercName].abilities[abilityName] < ABILITY_MAX_TIER
      ) {
        state.collection[mercName].abilities[abilityName]++;
      } else {
        return false;
      }
    },
    decrementItem(state, { mercName, itemName }) {
      this.commit("addToCollection", { name: mercName });
      if (
        state.collection[mercName].equipment[itemName] >
        ITEM_MAX_TIER -
          state.mercenaries[mercName].equipment[itemName].tiers.length +
          1
      ) {
        state.collection[mercName].equipment[itemName]--;
      } else {
        return false;
      }
    },
    incrementItem(state, { mercName, itemName }) {
      this.commit("addToCollection", { name: mercName });
      if (state.collection[mercName].equipment[itemName] < ITEM_MAX_TIER) {
        state.collection[mercName].equipment[itemName]++;
      } else {
        return false;
      }
    },
  },
  actions: {},
  getters: {},
});
