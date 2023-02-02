import { React, useContext, useState } from 'react'
import AuthContext from '../context/AuthContext'
import '../css/GlobalStyles.css'

function Login() {
    const {authenticateUser} = useContext(AuthContext)
    const [formErrors, setFormErrors] = useState({})
    const canSubmit = Object.keys(formErrors).length !== 0
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    })
    const inputFields = [
        {fieldType: 'text', fieldName: 'username', displayName: "Username or email"},
        {fieldType: 'password', fieldName: 'password', displayName: "Password"},
    ]
    const inputElements = inputFields.map(field => {
        let errors
        if(formErrors?.[field.fieldName]){
            errors = formErrors?.[field.fieldName].map(error => (
                <p key={error}>{error}</p>
            ))
        }
        return (
            <div
                key={field.fieldName}
                className={formErrors?.[field.fieldName] ? 'form-field error': 'form-field'}
            >

                <label htmlFor={field.fieldName}>{field.displayName}</label>
                <input
                    onChange={handleChange}
                    type={field.fieldType}
                    name={field.fieldName}
                    value={formData[field.fieldName]}
                    placeholder={field.displayName}
                />
                {errors}
            </div>
        )
        }

    )

    function handleSubmit(event){
        event.preventDefault()
        authenticateUser(formData)
        .then(data => {
            if(data.detail){
                setFormErrors({'username': [], 'password': [data.detail]})
            }
            else{
                setFormErrors(data)
            }
        })
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                'password': '',
            }
        })
    }

    function handleChange(event){
        const {name, value} = event.target
        setFormErrors(prevFormErros => {
            return {}
        })
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name]: value,
            }
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            {inputElements}
            <button type='submit' disabled={canSubmit}>Login</button>
        </form>
    )
}

export default Login