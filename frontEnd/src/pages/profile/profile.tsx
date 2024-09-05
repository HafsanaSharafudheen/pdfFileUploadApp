import React, { useEffect, useState } from 'react';
import axios from '../../axios/axios'; 
import { useLocation } from 'react-router-dom';

function ProfilePage() {
    const location = useLocation();
    const { email } = location.state || {};
    const defaultProfilePicture = 'https://img.freepik.com/premium-vector/business-global-economy_24877-41082.jpg?w=740';

    const [profile, setProfile] = useState({
        fullName: '',
        email: '',
        phoneNumber:'',
        password:''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`/profile?email=${email}`);
                
                setProfile(response.data.userDetails);
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            }
        };

        if (email) {
            fetchProfile();
        }
    }, [email]);

   
    

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-4">
                    <div className="text-center">
                    <img 
            src={defaultProfilePicture}
            alt="Profile"
            className="profile-image" 
        />
                        <h2 className="mt-2">{profile.fullName}</h2>
                    </div>
                </div>
                <div className="col-md-8">
                    <form >
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="fullName"
                                value={profile.fullName}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={profile.email}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phoneNumber" className="form-label">phoneNumber</label>
                            <input
                                type="phoneNumber"
                                className="form-control"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={profile.phoneNumber}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                value={profile.password}
                                required
                            />
                        </div>
                        <div>
                <a href="/change-password" className="text-primary">Change Password</a>
            </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
