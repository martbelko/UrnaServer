import React from 'react';
import { useFormik } from 'formik';

import { makeRequest, RequestMethod } from '../../utils/request';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { accessTokenAtom, refreshTokenAtom, useridAtom } from '../../store/atoms';

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
                        formikParameters.errors.username = json.error.detail;
                    }

                    const setUserid = useSetRecoilState(useridAtom);
                    const setAccessToken = useSetRecoilState(accessTokenAtom);
                    const setRefreshToken = useSetRecoilState(refreshTokenAtom);

                    setUserid(json.userid as number);
                    setAccessToken(json.accessToken as string);
                    setRefreshToken(json.refreshToken as string);

                    const userid = useRecoilValue(useridAtom);
                    const accessToken = useRecoilValue(accessTokenAtom);
                    const refreshToken = useRecoilValue(refreshTokenAtom);

                    console.log(`Userid: ${userid}, accessToken: ${accessToken}, refreshToken: ${refreshToken}`);
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
