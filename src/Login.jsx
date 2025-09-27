import React, { useEffect, useState } from 'react'
import { Link, replace, useNavigate } from 'react-router-dom'
import styles from './Login.module.css'   // import CSS module
import axios from 'axios'
import { toast } from 'react-toastify'

export const Login = () => {
  const navigate = useNavigate()
  const initialValue = {  email: "", password: "" }

  const [value, setValue] = useState(initialValue)
  const [error, setError] = useState({})

  useEffect(()=>{
    const isLoged = localStorage.getItem("isLoged") === "true"
    const role = localStorage.getItem("role")

    if(isLoged){
      if(role === "admin"){
        navigate("/Admin",{replace:true})
      }else{
        navigate("/Home",{replace:true})
      }
    }
  },[navigate])

  const handleInput = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value })
  }

  const validation = () => {
    const errvar = {}
    // if (!value.username || value.username.length < 5) {
    //   errvar.username = "Username must contain 5 characters"
    // }
    if (!value.email) {
      errvar.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(value.email)) {
      errvar.email = "Invalid email"
    }
    if (!value.password) {
      errvar.password = "Password is required"
    } else if (value.password.length < 5) {
      errvar.password = "Password must have 5 characters"
    }
    return errvar
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const err = validation()
    setError(err)
    if (Object.keys(err).length === 0) {
      axios.get("http://localhost:3000/user")
      .then((res)=>{
        const userdata = res.data

        const user = userdata.find(u=>
          u.email === value.email && u.password===value.password
         
        )
        if(user.status === "Inactive"){
          setError({general:"User is Inactive"})
          toast.error("User Blocked")
          return
        }
        if(user){
          
          localStorage.setItem("email",user.email)
          localStorage.setItem("isLoged","true")
          localStorage.setItem("role",user.role || "user")
          
          if(user.role === "admin"){
            navigate("/Admin" , {replace:true})
          }else{
            navigate("/Home",{replace:true})
          }

          // alert(`welcome,${user.username}`)
          // setValue({email:"",password:""})
          // setError({}) 
          //  navigate('/Home')

        }else{
          setError({general:"invalied Email or Password"})
        

        }
      })
      .catch((err)=>{
        console.error(err)
      })
    
    }
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>Login</h2>

        {/* <label className={styles.label}>Name</label>
        <input
          type='text'
          name='username'
          value={value.username}
          placeholder='Username'
          onChange={handleInput}
          className={styles.input}
        />
        <p className={styles.error}>{error.username}</p> */}

        <label className={styles.label}>Email</label>
        <input
          type='email'
          name='email'
          value={value.email}
          placeholder='Email'
          onChange={handleInput}
          className={styles.input}
        />
        <p className={styles.error}>{error.email}</p>

        <label className={styles.label}>Password</label>
        <input
          type='password'
          name='password'
          value={value.password}
          placeholder='Password'
          onChange={handleInput}
          className={styles.input}
        />
        <p className={styles.error}>{error.password}</p><p className={styles.error}>{error.general}</p>

        <button type='submit' className={styles.button}>Sign in</button>

        <p className={styles.signupNote}>
          Don't have an account? <Link to={'/Registration'}>Sign Up</Link>
        </p>
      </form>
    </div>
  )
}
