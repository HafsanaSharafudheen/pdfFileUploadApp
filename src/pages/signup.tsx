import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
    const [fullName, setFullName] = useState<string>('');

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
const navigate=useNavigate()
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (fullName=== ''||email === '' || password === '' || confirmPassword === '') {
            setError('Please fill in all fields');
        } else if (password !== confirmPassword) {
            setError('Passwords do not match');
        } else {
            setError('');
            const url = `/signup/signup?email=${email}`;
             await axios.post(url);

            navigate('/')
        }
    };

    return (
        <>
        <div className="loginContainer">
        <h1 className="text-center">SIGNUP</h1>
        <form className="form-group" onSubmit={handleSubmit}>
        <div className="mb-3">
                    <label htmlFor="fullName" className="form-label">FullName</label>
                    <input
                        type="fullName"
                        className="form-control"
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
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
                <div className="mb-3">
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
                <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className='d-flex  justify-content-center'>

                <button type="submit" className="btn btn-primary">Signup</button>
                </div>
            </form>
        </div>
        </>
    );
}

export default Signup;
