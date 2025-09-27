import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './Registration.module.css'
import axios from 'axios'

export const Registration = () => {
  const navigate = useNavigate()
  const initialState = { username: "", email: "", password: "", confirmpassword: "" }
  const [formValue, setFormValue] = useState(initialState)
  const [error, setError] = useState({})

  const handleInput = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value })
  }
  const validation = () => {
    const errvar = {}
    if (!formValue.username || formValue.username.length < 5) {
      errvar.username = "Username must contain 5 character"
    }
    if (!formValue.email) {
      errvar.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formValue.email)) {
      errvar.email = "Invalid email"
    }
    if (!formValue.password) {
      errvar.password = "Password is required"
    } else if (formValue.password.length < 5) {
      errvar.password = "Password must have 5 characters"
    }
    if (formValue.password !== formValue.confirmpassword) {
      errvar.confirmpassword = "Passwords do not match"
    }
    return errvar
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const err = validation()
    setError(err)
    if (Object.keys(err).length === 0) {
      axios.post("http://localhost:3000/user", {
        username: formValue.username,
        email: formValue.email,
        password: formValue.password,
        confirmpassword: formValue.confirmpassword,
        cart:[],
        role:"user"

      })
        .then(() => {
          alert("Successfully Registered")
          setFormValue(initialState)
          setError({})
         localStorage.setItem("isLoged",true)
         localStorage.setItem("email",formValue.email)
         localStorage.setItem("role","user")
        

          navigate('/Home')
       
        

        })
        .catch(error => {
          console.error("Error occurred", error)
        })
    }
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>Registration Page</h2>
        
        <input type='text' name='username' value={formValue.username} placeholder='Username' onChange={handleInput} className={styles.input} />
        <p className={styles.error}>{error.username}</p>

        <input type='email' name='email' value={formValue.email} placeholder='Email' onChange={handleInput} className={styles.input} />
        <p className={styles.error}>{error.email}</p>

        <input type='password' name='password' value={formValue.password} placeholder='Password' onChange={handleInput} className={styles.input} />
        <p className={styles.error}>{error.password}</p>

        <input type='password' name='confirmpassword' value={formValue.confirmpassword} placeholder='Confirm Password' onChange={handleInput} className={styles.input} />
        <p className={styles.error}>{error.confirmpassword}</p>

        <button type='submit' className={styles.button}>Submit</button>
        
      <p className={styles.footer}>
        Already a member? <Link to={'/Login'} className={styles.link}>Sign in</Link>
      </p>
      </form>

    </div>
  )
}
