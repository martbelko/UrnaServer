import React, { useEffect, useState } from 'react';

import * as Yup from 'yup';
import { FormikErrors, useFormik } from 'formik';

import { minUserNameLen, maxUserNameLen, minPasswordLen, maxPasswordLen } from './../../../../templar-api/src/share';
import { makeAuthRequest, makeRequest, RequestMethod } from '../../utils/request';
import ReCAPTCHA from 'react-google-recaptcha';
import { AuthManager } from '../../utils/auth';

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

async function isFieldUnique(fieldName: string, text: string): Promise<boolean> {
    const userid = AuthManager.getUserid();
    const response = await makeAuthRequest(`api/users?id=${userid}`,
        RequestMethod.GET, undefined);

    if (response == null || !response.ok) {
        console.log((await response?.json()).error);
        return true;
    }

    const currUser = await response.json();
    if (currUser[0].name == text) {
        return true;
    }

    const user = await makeRequest(`api/users?${fieldName}=${text}`, RequestMethod.GET, undefined);
    return await isUnique(user);
}

function Update(): JSX.Element {
    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .min(minUserNameLen, `username must be at least ${minUserNameLen} characters`)
            .max(maxUserNameLen, `username must be at most ${maxUserNameLen} characters`),
        email: Yup.string()
            .email('Not valid email'),
        password: Yup.string()
            .min(minPasswordLen, `password must be at least ${minPasswordLen} characters`)
            .max(maxPasswordLen, `password must be at most ${maxPasswordLen} characters`)
            .test('lower', 'Password does not contain capital letter, lower letter or number', val => {
                if (val != undefined) {
                    return containsLower(val) && containsCapital(val) && containsNumber(val);
                }

                return true;
            }),
        passwordVerify: Yup.string()
            .oneOf([Yup.ref('password')], 'Passwords must match'),
        discordName: Yup.string()
    });

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
            await makeAuthRequest(`api/users/${userid}`,
                RequestMethod.PATCH,
                JSON.stringify({
                    name: values.username,
                    email: values.email,
                    password: values.password,
                    captcha: captcha
                // TODO: Add discord name
                }))
                .then(async response => {
                    if (response == null) {
                        return formikParameters.errors.username = 'Unknown error'; // TODO: General error
                    }

                    const json = await response.json();
                    if (json.error != undefined) {
                        const uniqueTextError = 'Unique constraint failed on the fields: (`';
                        const errorMessage = json.error.detail == undefined ? json.error as string : json.error.detail as string;
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
                            formikParameters.errors.username = errorMessage; // TODO: General error
                        }
                    } else {
                        alert('Success!');
                        history.go(0);
                    }
                },
                reason => console.log(`Error: ${reason}`));
        }
    });

    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            const isUnique = await isFieldUnique('name', formikParameters.values.username);
            console.log(isUnique);
            if (isUnique == false) {
                formikParameters.setErrors({
                    username: 'Username already in use'
                });
            }
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [formikParameters.values.username]);

    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            const isUnique = await isFieldUnique('email', formikParameters.values.email);
            if (!isUnique) {
                formikParameters.setErrors({
                    email: 'Email already in use'
                });
            }
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [formikParameters.values.email]);

    const userid = AuthManager.getUserid();
    const accessToken = AuthManager.getAccessToken();

    const [user, setUser] = useState({
        name: '',
        email: ''
    });

    const [captcha, setCaptcha] = useState('');

    useEffect(() => {
        async function queryUserData() {
            const userid = AuthManager.getUserid();
            const response = await makeAuthRequest(`api/users?id=${userid}`, RequestMethod.GET, undefined);
            if (response != null && response.ok) {
                const json = await response.json();
                setUser({
                    name: json[0].name,
                    email: json[0].email.email
                });
            } else {
                setUser({
                    name: '',
                    email: ''
                });
            }
        }

        queryUserData();
    }, []);

    if (accessToken == null || userid == null) {
        return <div>Not logged</div>;
    }

    if (user.name == '') {
        return <div></div>;
    } else {
        formikParameters.initialValues.username = user.name;
        formikParameters.initialValues.email = user.email;
    }

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
                <button type="submit">Update</button>
            </form>
        </div>
    );
}

export default Update;