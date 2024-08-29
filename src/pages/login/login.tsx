import React, { useState } from 'react';
import './login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e:any) => {
        e.preventDefault();
       
        if (email === '' || password === '') {
            setError('Please fill in all fields');
        } else {
            setError('');
            alert('Login successful');
        }
    };

    return (
        <div className="loginContainer">
<h1 className="text-center">LOGIN</h1>
<form className="form-group mb-3" onSubmit={handleSubmit}>
                <div className="mb-3 p-2">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3 p-2">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className='d-flex  justify-content-center'>
                <button type="submit" className="btn btn-primary">Login</button>

                </div>
                <p className='text-center mt-3'>
                    New user? <a href="/signup">Create an account</a>
                </p>
            </form>
        </div>
    );
}

export default Login;
