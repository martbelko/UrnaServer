import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

import * as Yup from 'yup';
import { useFormik } from 'formik';

import { minUserNameLen, maxUserNameLen, minPasswordLen, maxPasswordLen } from './../../../../templar-api/src/share';
import { makeRequest, RequestMethod } from '../../utils/request';
import { useHistory } from 'react-router-dom';

function containsCapital(str: string): boolean {
    const capitals = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (const ch of str) {
        if (capitals.includes(ch))
            return true;
    }

    return false;
}

function containsNumber(str: string): boolean {
    const numbers = '0123456789';
    for (const ch of str) {
        if (numbers.includes(ch))
            return true;
    }

    return false;
}

function containsLower(str: string): boolean {
    const lower = 'abcdefghijklmnopqrtsuvwxyz';
    for (const ch of str) {
        if (lower.includes(ch))
            return true;
    }

    return false;
}

async function isUnique(responseObject: Response): Promise<boolean> {
    const json = await responseObject.json();
    if (json != undefined) {
        if (json.error != undefined) {
            return true;
        }

        try {
            if (json.length > 0) {
                return false;
            }

            return true;
        } catch (e) {
            return true;
        }
    }

    return true;
}

const validationSchema = Yup.object().shape({
    username: Yup.string()
        .required('Required')
        .min(minUserNameLen, `username must be at least ${minUserNameLen} characters`)
        .max(maxUserNameLen, `username must be at most ${maxUserNameLen} characters`)
        .test('unique', 'username already in use', async val => {
            const user = await makeRequest(`api/users?name=${val}`, RequestMethod.GET, undefined);
            return await isUnique(user);
        }),
    email: Yup.string()
        .required('Required')
        .email('Not valid email')
        .test('unique', 'email already in use', async val => {
            const user = await makeRequest(`api/users?email=${val}`, RequestMethod.GET, undefined);
            return await isUnique(user);
        }),
    password: Yup.string()
        .required('Required')
        .min(minPasswordLen, `password must be at least ${minPasswordLen} characters`)
        .max(maxPasswordLen, `password must be at most ${maxPasswordLen} characters`)
        .test('lower', 'Password does not contain capital letter, lower letter or number', val => {
            if (val != undefined) {
                return containsLower(val) && containsCapital(val) && containsNumber(val);
            }

            return false;
        }),
    passwordVerify: Yup.string()
        .required('Required')
        .oneOf([Yup.ref('password')], 'Passwords must match'),
    discordName: Yup.string()
});

function Register(): JSX.Element {
    const [captcha, setCaptcha] = useState('');
    const history = useHistory();

    const formikParameters = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            passwordVerify: '',
            discordName: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            await makeRequest('api/users', RequestMethod.POST, JSON.stringify({
                name: values.username,
                email: values.email,
                password: values.password,
                captcha: captcha
                // TODO: Add discord name
            }))
                .then(async response => {
                    const json = await response.json();
                    if (json.error != undefined) {
                        const uniqueTextError = 'Unique constraint failed on the fields: (`';
                        const errorMessage = json.error.detail as string;
                        const uniqueIndex = errorMessage.indexOf(uniqueTextError);
                        if (uniqueIndex >= 0) {
                            const fieldIndex = uniqueIndex + uniqueTextError.length;
                            const field = errorMessage.substr(fieldIndex);
                            if (field.indexOf('name') >= 0) {
                                formikParameters.errors.username = 'Username already in use';
                            } else if (field.indexOf('email') >= 0) {
                                formikParameters.errors.email = 'Email already in use';
                            }
                        } else {
                            formikParameters.errors.username = json.error.detail; // TODO: General error
                        }
                    } else {
                        alert('Success!');
                        history.push('/login');
                        history.go(0);
                    }
                },
                reason => console.log(`Error: ${reason}`));
        }
    });

    return (
        <div>
            <form onSubmit={formikParameters.handleSubmit}>
                <div>
                    <label>
                    Username:
                        <input
                            onChange={formikParameters.handleChange}
                            value={formikParameters.values.username}
                            type="text"
                            name="username"
                            id="username"
                        />
                    </label>
                    {formikParameters.errors.username && <span>{formikParameters.errors.username}</span>}
                </div>
                <div>
                    <label>
                    Email:
                        <input
                            onChange={formikParameters.handleChange}
                            value={formikParameters.values.email}
                            type="text"
                            name="email"
                            id="email"
                        />
                    </label>
                    {formikParameters.errors.email && <span>{formikParameters.errors.email}</span>}
                </div>
                <div>
                    <label>
                    Password:
                        <input
                            onChange={formikParameters.handleChange}
                            value={formikParameters.values.password}
                            type="password"
                            name="password"
                            id="password"
                        />
                    </label>
                    {formikParameters.errors.password && <span>{formikParameters.errors.password}</span>}
                </div>
                <div>
                    <label>
                    Password repeat:
                        <input
                            onChange={formikParameters.handleChange}
                            value={formikParameters.values.passwordVerify}
                            type="password"
                            name="passwordVerify"
                            id="passwordVerify"
                        />
                    </label>
                    {formikParameters.errors.passwordVerify && <span>{formikParameters.errors.passwordVerify}</span>}
                </div>
                <div>
                    <label>
                    Discord Name:
                        <input
                            onChange={formikParameters.handleChange}
                            value={formikParameters.values.discordName}
                            type="text"
                            name="discordName"
                            id="discordName"
                        />
                    </label>
                    {formikParameters.errors.discordName && <span>{formikParameters.errors.discordName}</span>}
                </div>
                <ReCAPTCHA
                    sitekey='6Ld-NDUcAAAAAGKyQbqz7AhOM4m1gixE6k9O1-7h'
                    onChange={value => setCaptcha(value == null ? '' : value)}
                />
                {captcha == '' && <span>Captcha needs to be filled!</span>}
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;