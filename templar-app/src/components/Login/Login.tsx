import React from 'react';
import { useFormik } from 'formik';

import { makeRequest, RequestMethod } from '../../utils/request';
import { LoginInfo } from '../../utils/loginInfo';

function Login(): JSX.Element {
    const formikParameters = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        onSubmit: async (values) => {
            await makeRequest('auth/login', RequestMethod.POST, JSON.stringify({
                username: values.username,
                password: values.password
            }))
                .then(async response => {
                    const json = await response.json();
                    if (json.error != undefined) {
                        return formikParameters.errors.username = json.error;
                    }

                    LoginInfo.sUserid = json.userid as number;
                    LoginInfo.sAccessToken = json.accessToken as string;
                    LoginInfo.sRefreshToken = json.refreshToken as string;

                    console.log(`Userid: ${LoginInfo.sUserid}, accessToken: ${LoginInfo.sAccessToken}, refreshToken: ${LoginInfo.sRefreshToken}`);
                },
                response => console.log(`Error: ${response}`));
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
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
