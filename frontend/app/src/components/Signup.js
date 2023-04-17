import React, { useContext, useEffect, useState, useRef } from 'react'
import AuthContext from '../context/AuthContext'

function Signup() {
    const {authenticateUser} = useContext(AuthContext)
    const [formErrors, setFormErrors] = useState({})
    const buttonRef = useRef(null)
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password1: '',
        password2: '',
    })
    const inputFields = [
        {fieldType: 'text', fieldName: 'username', displayName: "Username"},
        {fieldType: 'email', fieldName: 'email', displayName: "Email"},
        {fieldType: 'password', fieldName: 'password1', displayName: "Password"},
        {fieldType: 'password', fieldName: 'password2', displayName: "Repeat password"},
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
        authenticateUser(formData, true)
        .then(data => {
            if(data.password1 || data.password2){
                setFormData(prevFormData => {
                    return {
                        ...prevFormData,
                        'password1': '',
                        'password2': '',
                    }
                })
            }
            setFormErrors(data)
        })
    }

    function handleChange(event){
        const {name, value} = event.target
        if(name !== 'password1' && name !== 'password2'){
            setFormErrors(prevFormErros => {
                const {
                    [name]: _,
                    ...rest
                } = prevFormErros
                return rest
            })
        }
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name]: value,
            }
        })
    }

    useEffect(() => {
        buttonRef.current.disabled = Object.keys(formErrors).length !== 0
    }, [formErrors])

    useEffect(() => {
        if(formData.password2 && formData.password1 !== formData.password2){
            setFormErrors(prevFormErros => {
                return {
                    ...prevFormErros,
                    password1: [' '],
                    password2: ['Passwords don\'t match'],
                }
            })
        // Condition prevents clearing of errors when removing passwords in handleSubmit
        } else if(formData.password1 !== '' || formData.password2 !== ''){
            setFormErrors(prevFormErros => {
                const {
                    password1,
                    password2,
                    ...rest
                } = prevFormErros
                return rest
            })
        }
    }, [formData.password2, formData.password1])

    return (
        <form onSubmit={handleSubmit}>
            {inputElements}
            <button type='submit' ref={buttonRef}>Signup</button>
        </form>
    )
}

export default Signup