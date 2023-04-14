import { React, useContext, useState, useEffect, useRef } from 'react'
import AuthContext from '../context/AuthContext'

function Login() {
    const {authenticateUser} = useContext(AuthContext)
    const [formErrors, setFormErrors] = useState({})
    const buttonRef = useRef(null)
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

                {/* <label htmlFor={field.fieldName}>{field.displayName}</label> */}
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
        buttonRef.current.disabled = true
        event.preventDefault()
        authenticateUser(formData)
        .then(data => {
            if(Object.keys(data).length > 0) {
                setFormData(prevFormData => {
                    return {
                        ...prevFormData,
                        'password': '',
                    }
                })
                if(data.detail){
                    setFormErrors({'username': [], 'password': [data.detail]})
                }
                else{
                    setFormErrors(data)
                }
            }
        })
    }

    useEffect(() => {
        buttonRef.current.disabled = Object.keys(formErrors).length !== 0
    }, [formErrors])


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
            <button type='submit' ref={buttonRef}>Login</button>
        </form>
    )
}

export default Login