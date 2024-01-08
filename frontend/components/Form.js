import React, { useEffect, useState } from 'react'
import * as yup from 'yup'




// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
 
}

// 👇 Here you will create your schema.
const userSchema = yup.object().shape({
  fullName: yup.string()
    .required('full name must be at least 3 characters')
    .matches(/^\S+$/, 'full name must be at least 3 characters')
    .min(3, 'full name must be at least 3 characters')
    .max(20, 'full name must be at most 20 characters'),

  size: yup.string()
    .required('Size is required')
    .oneOf(['S', 'M', 'L'], 'Size must be S or M or L'),
  toppings: yup.array().of(yup.string()),
});

const getInitialValues = () => ({
  fullName: '',
  size: '',
  toppings: [],
});
const getInitialErrors = () => ({
  fullName: '',
  size: '',
  toppings: [],
});


// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]

export default function Form() {
    const [values, setValues] = useState(getInitialValues())
    const [errors, setErrors] = useState(getInitialErrors())
    const [serverSuccess, setServerSuccess] = useState()
    const [serverFailure, setServerFailure] = useState()
    const [formEnabled, setFormEnabled] = useState(false)

    useEffect(() => {
      userSchema.isValid(values).then((isValid) => setFormEnabled(isValid));
    }, [values])

    const onChange = (evt) => {
        let { type, name, value, checked } = evt.target
        
        if (type === 'checkbox') {
          // Update toppings array based on checkbox changes
          setValues((prevValues) => ({
            ...prevValues,
            toppings: checked
            ? [...prevValues.toppings, name]
            : prevValues.toppings.filter((toppingId) => toppingId !== name),
          }))
        } else {
          setValues((prevValues) => ({ ...prevValues, [name]: value}))
        }
        
          yup.reach(userSchema, name)
          .validate(value)
          .then(() => setErrors((prevErrors) => ({ ...prevErrors, [name]:'' })))
          .catch((err) => {
          
          setErrors((prevErrors) => ({ ...prevErrors, [name]: err.errors[0] }))
      });
        }

    const onSubmit = (evt) => {
      evt.preventDefault()

      userSchema
    .validate({ fullName: values.fullName, size: values.size })
    .then(() => {

      const sizeMapping = {
        'S': 'small',
        'M': 'medium',
        'L': 'large',
      };

      const toppingsMessage = values.toppings.length > 0
        ? ` with ${values.toppings.length} toppings `
        : ' with no toppings';

        const sizeDisplay = sizeMapping[values.size] || values.size; 

        setServerSuccess(`Thank you for your order, ${values.fullName}! Your ${sizeDisplay} pizza${toppingsMessage} is on the way.`);
        setServerFailure('');
        setValues(getInitialValues());
        setErrors(getInitialErrors()); // Clear errors state
      })
      .catch(() => {
        setServerFailure('Server validation failed');
        setServerSuccess('');
      });
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Order Your Pizza</h2>
      {serverSuccess && <div className='success'>{serverSuccess}</div>}
      {serverFailure && <div className='failure'>{serverFailure}</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input value={values.fullName} onChange={onChange} placeholder="Type full name" id="fullName" type="text" name="fullName"/>
        </div>
        {errors.fullName && <div className='error'>{errors.fullName}</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select value={values.size || ''} onChange={onChange} id="size" name="size">
            <option value="" >----Choose Size----</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
            
          </select>
        </div>
        {errors.size && <div className='error'>{errors.size}</div>}
      </div>

      <div className="input-group">
        {/* 👇 Maybe you could generate the checkboxes dynamically */}

       {toppings.map((topping) => (
        <label key={topping.topping_id}>
          <input 
            checked={values.toppings.includes(topping.topping_id)}
            name={topping.topping_id}
            type="checkbox"
            onChange={onChange}
            />
            {topping.text} <br/>

        </label>
       ))}

        {errors.toppings && <div className='error'>{errors.toppings}</div>}

      </div>


      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input disabled={!formEnabled} type="submit" />
    </form>
  );
}
