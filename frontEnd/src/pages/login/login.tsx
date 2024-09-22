import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axios/axios'
function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (email === '' || password === ''|| phoneNumber==='') {
            setError('Please fill in all fields');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);
            formData.append('phoneNumber', phoneNumber);

           const res= await axios.post('/login', formData);
          
if(res.status === 200) {
    navigate('/home', { state: { email } });

}
else{
    setError('Something went wrong')
}
        } catch (error) {
            setError('Login failed. Please try again.');
        }
    };
const handleSignUp = () => {
        navigate('/signup');
    };
    return (
        <div className="main-div-container">
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
                        <label htmlFor="phoneNumber" className="form-label"> Phone Number</label>
                        <input
                            type="phoneNumber"
                            className="form-control"
                            id="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
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
                    <div className='d-flex justify-content-center'>
                        <button type="submit" className="btn btn-primary">Login</button>
                    </div>
                    <p className='text-center mt-3'>
            New user? <a href="#" onClick={handleSignUp}>Create an account</a>
        </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
