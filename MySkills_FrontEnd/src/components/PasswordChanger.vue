<template>
    <Form @submit="handleSubmit" :validation-schema="schema">
        <div class="mb-3">
            <label for="currentPassword">Current Password</label>
            <Field name="currentPassword" id="currentPassword" type="password" class="form-control" />
            <ErrorMessage name="currentPassword" class="error-feedback" />
        </div>
        <div class="mb-3">
            <label for="newPassword">New Password</label>
            <Field name="newPassword" id="newPassword" type="password" class="form-control" />
            <ErrorMessage name="newPassword" class="error-feedback" />
        </div>
        <div class="mb-3">
            <label for="confirmPassword">Confirm Password</label>
            <Field name="confirmPassword" id="confirmPassword" type="password" class="form-control" />
            <ErrorMessage name="confirmPassword" class="error-feedback" />
        </div>
        <button class="btn btn-primary" type="submit">Save Changes</button>
    </Form>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

export default {
    name: 'PasswordChanger',
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    data() {
        const schema = yup.object().shape({
            currentPassword: yup.string().required('Current password is required'),
            newPassword: yup.string().min(6, 'New password must be at least 6 characters long').required('New password is required'),
            confirmPassword: yup.string().oneOf([yup.ref('newPassword'), null], 'Passwords must match').required('Please confirm your password')
        });
        return {
            schema,
        }
    },
    methods: {
        handleSubmit(user) {
            this.$emit('password-changed', {
                old_password: user.currentPassword,
                new_password: user.newPassword
            });
        }
    },
};
</script>
<style scoped>
.error-feedback {
    color: red;
}
</style>