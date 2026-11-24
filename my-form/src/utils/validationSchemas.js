import * as yup from 'yup'

export const profileSchema = yup.object().shape({
  profilePhoto: yup.mixed()
    .required('Profile Photo is required')
    .test('fileFormat', 'Only PNG, JPG, and JPEG images are allowed', (value) => {
      if (!value) return false
      return ['image/png', 'image/jpeg', 'image/jpg'].includes(value.type)
    }),
  name: yup.string().required('Name is required'),
  cnic: yup.string().length(13, 'CNIC must be exactly 13 digits').required('CNIC is required'),
  dob: yup.string().required('Date of Birth is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  phoneNumber: yup.string().length(11, 'Phone must be exactly 11 digits').required('Phone Number is required'),
  gender: yup.string().required('Gender is required'),
  maritalStatus: yup.string().required('Marital Status is required'),
  about: yup.string().required('About Me is required'),
})



export const getSchemaByKey = (key) => {
  if (key === 'education') {
    return yup.object().shape({
      degreeLevel: yup.string().required('Level is required'),
      institute: yup.string().required('Board / University is required'),
      startDate: yup.string().required('Start Date is required'),
      endDate: yup.string()
        .required('Completion Date is required')
        .test('is-after-start', 'Completion Date cannot be before Start Date', function (value) {
          if (!value || !this.parent.startDate) return true
          return new Date(value) >= new Date(this.parent.startDate)
        }),
      degreeNameMatric: yup.string().test('is-matric-degree', 'Degree / Group is required', function (value) {
        if (this.parent.degreeLevel === 'Matric' && !value) return false
        return true
      }),
      degreeNameInter: yup.string().test('is-inter-degree', 'Degree / Group is required', function (value) {
        if (this.parent.degreeLevel === 'Intermediate' && !value) return false
        return true
      }),
      degreeNameHigher: yup.string().test('is-higher-degree', 'Degree / Group is required', function (value) {
        if (['Bachelors', 'Masters', 'Other'].includes(this.parent.degreeLevel) && !value) return false
        return true
      }),
      customLevel: yup.string().test('is-custom-level', 'Custom Level is required', function (value) {
        if (this.parent.degreeLevel === 'Other' && !value) return false
        return true
      }),
      customDegree: yup.string().test('is-custom-degree', 'Custom Degree is required', function (value) {
        if (this.parent.degreeNameHigher === 'Other' && !value) return false
        return true
      }),
      obtainedMarks: yup.mixed().test('is-marks-valid', 'Invalid marks', function (value) {
        const isSchool = ['Matric', 'Intermediate'].includes(this.parent.degreeLevel)
        if (isSchool) {
          if (!value) return this.createError({ message: 'Obtained Marks are required' })
          if (parseFloat(value) > parseFloat(this.parent.totalMarks)) {
            return this.createError({ message: 'Obtained Marks cannot exceed Total Marks' })
          }
        }
        return true
      }),
      totalMarks: yup.mixed().test('is-total-required', 'Total Marks are required', function (value) {
        if (['Matric', 'Intermediate'].includes(this.parent.degreeLevel) && !value) return false
        return true
      }),
      cgpa: yup.mixed().test('is-cgpa-valid', 'Invalid CGPA', function (value) {
        const isHigher = ['Bachelors', 'Masters', 'Other'].includes(this.parent.degreeLevel)
        if (isHigher) {
          if (!value) return this.createError({ message: 'CGPA is required' })
          if (parseFloat(value) > 4) {
            return this.createError({ message: 'CGPA cannot be greater than 4' })
          }
        }
        return true
      })
    })
  }
  if (key === 'experience') {
    return yup.object().shape({
      company: yup.string().required('Company is required'),
      role: yup.string().required('Role is required'),
      startDate: yup.string().required('Start Date is required'),
      endDate: yup.string()
        .required('End Date is required')
        .test('is-after-start', 'End Date cannot be before Start Date', function (value) {
          if (!value || !this.parent.startDate) return true
          return new Date(value) >= new Date(this.parent.startDate)
        }),
      description: yup.string().required('Description is required'),
    })
  }
  if (key === 'skills') {
    return yup.object().shape({
      skillName: yup.string().required('Skill Name is required'),
      years: yup.mixed().test('is-years', 'Years are required', function (value) {
        if (!value) return false
        return true
      }),
      proficiency: yup.mixed().test('is-proficiency', 'Proficiency is required', function (value) {
        if (!value) return false
        return true
      }),
    })
  }
  if (key === 'recommendation') {
    return yup.object().shape({
      name: yup.string().required('Name is required'),
      relation: yup.string().required('Relation is required'),
      contact: yup.string()
        .required('Contact is required')
        .test('is-phone-or-email', 'Contact must be a valid 11-digit phone number or a valid email address', function (value) {
          if (!value) return true
          const phoneRegex = /^\d{11}$/
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          return phoneRegex.test(value) || emailRegex.test(value)
        }),
      message: yup.string().required('Message is required'),
    })
  }
  return yup.object()
}

export const validateStepByStep = (schema, data) => {
  try {
    schema.validateSync(data, { abortEarly: false })
    return null
  } catch (err) {
    if (err.inner && err.inner.length > 0) {
      return err.inner[0].message
    }
    return err.message
  }
}


export const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
})

export const registerSchema = yup.object().shape({
  name: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
  role: yup.string().oneOf(['admin', 'user'], 'Role must be admin or user').required('Role is required'),
})