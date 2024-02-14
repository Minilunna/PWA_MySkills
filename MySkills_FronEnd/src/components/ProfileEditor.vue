<template>
  <form @submit.prevent="saveChanges">
    <div class="row mt-2">
        <div class="col-md-6">
            <label for="name">Name</label>
            <input type="text" class="form-control" placeholder="first name" v-model="currentUser.name" @input="updateField('name', $event.target.value)" name="name" id="name">
        </div>
        <div class="col-md-6">
            <label for="surname">Surname</label>
            <input type="text" class="form-control" v-model="currentUser.surname" placeholder="surname" @input="updateField('surname', $event.target.value)" name="surname" id="surname">
        </div>
    </div>
    <div class="row mt-3">
        <div class="col-md-12">
            <label for="mobileNumber">Mobile Number</label>
            <input type="text" class="form-control" placeholder="Enter mobile number" v-model="currentUser.mobileNumber" @input="updateField('mobileNumber', $event.target.value)" name="mobileNumber" id="mobileNumber">
        </div>
    </div>
    <div class="row mt-3">
        <div class="col-md-12">
            <label for="addressLine1">Address Line 1</label>
            <input type="text" class="form-control" placeholder="Enter address line 1" v-model="currentUser.addressLine1" @input="updateField('addressLine1', $event.target.value)" name="addressLine1" id="addressLine1">
        </div>
        <div class="col-md-12">
            <label for="addressLine2">Address Line 2</label>
            <input type="text" class="form-control" placeholder="Enter address line 2" v-model="currentUser.addressLine2" @input="updateField('addressLine2', $event.target.value)" name="addressLine2" id="addressLine2">
        </div>
        <div class="col-md-12">
            <label for="postcode">Postcode</label>
            <input type="text" class="form-control" placeholder="Enter postcode" v-model="currentUser.postcode" @input="updateField('postcode', $event.target.value)" name="postcode" id="postcode">
        </div>
        <div class="col-md-12">
            <label for="state">State</label>
            <input type="text" class="form-control" placeholder="Enter state" v-model="currentUser.state" @input="updateField('state', $event.target.value)" name="state" id="state">
        </div>
        <div class="col-md-12">
            <label for="area">Area</label>
            <input type="text" class="form-control" placeholder="Enter area" v-model="currentUser.area" @input="updateField('area', $event.target.value)" name="area" id="area">
        </div>
        <div class="col-md-12">
            <label for="email">Email ID</label>
            <input type="text" class="form-control" placeholder="enter email id" v-model="currentUser.email" @input="updateField('email', $event.target.value)" name="email" id="email">
        </div>
        <div class="col-md-12">
            <label for="education">Education</label>
            <input type="text" class="form-control" placeholder="education" v-model="currentUser.education" @input="updateField('education', $event.target.value)" name="education" id="education">
        </div>
    </div>
    <div class="row mt-3">
        <div class="col-md-6">
            <label for="country">Country</label>
            <input type="text" class="form-control" placeholder="country" v-model="currentUser.country" @input="updateField('country', $event.target.value)" name="country" id="country">
        </div>
        <div class="col-md-6">
            <label for="stateRegion">State/Region</label>
            <input type="text" class="form-control" placeholder="state" v-model="currentUser.stateRegion" @input="updateField('stateRegion', $event.target.value)" name="stateRegion" id="stateRegion">
        </div>
    </div>
    <div class="row mt-3">
        <div class="col-md-12">
            <button class="btn btn-primary" type="submit" :disabled="Object.keys(this.editedFields).length == 0">Save Changes</button>
        </div>
    </div>
</form>

</template>
<script>
export default {
  data() {
    return {
      editedFields: {}, // Initialize an object to store the edited form fields
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.users.user;
    },
  },
  methods: {
    saveChanges() {
      // Emit the edited form fields
      this.$emit('profile-updated', this.editedFields);
      // Reset the editedFields object for the next edit
      this.editedFields = {};
    },
    updateField(fieldName, value) {
      // Update the editedFields object when a form field is changed
      this.editedFields[fieldName] = value;
    },
  },
};
</script>
<style></style>