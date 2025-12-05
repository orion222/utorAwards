import * as yup from "yup";


export const userSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  role: yup
    .string()
    .required('Role is required'),
  birthday: yup
    .string()
    .nullable()
    .transform((value) => value || null),
  hideUtorid: yup
    .boolean()
    .default(false),
});

export const roleOptions = [
  { value: 'regular', label: 'Regular' },
  { value: 'cashier', label: 'Cashier' },
  { value: 'manager', label: 'Manager' },
  { value: 'superuser', label: 'Superuser' },
];
