import { React, useContext, useState } from 'react'
import AuthContext from '../context/AuthContext'


function Login() {
    const {loginUser} = useContext(AuthContext)
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    })

    function handleSubmit(event){
        event.preventDefault()
        loginUser(formData)
    }

    function handleChange(event){
        const {name, value} = event.target
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name]: value,
            }
        })
    }
    return (
        <form onSubmit={handleSubmit}>
            <input
                onChange={handleChange}
                type='text'
                name='username'
                value={formData.login}
                placeholder='Enter username/email'
            />
            <input
                onChange={handleChange}
                type='password'
                name='password'
                value={formData.password}
                placeholder='Enter password'
            />
            <input
                type='submit'
                value="Login"
            />
        </form>
    )
}

export default Login