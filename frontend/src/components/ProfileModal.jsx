import React, { useState } from 'react';
import { X, Check, Edit2 } from 'lucide-react';
import './ProfileModal.css';

const ProfileModal = ({ onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Municipal User',
    address: '123 New Bhagat Chowk, Vashi, India',
    phone: '+91 98765 43210',
    oldPassword: '',
    newPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Save logic here
    setIsEditing(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>My Profile</h2>
          <button className="nav-icon-btn borderless" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-body">
          <div className="profile-section">
            <div className="section-head">
               <h3>Personal Information</h3>
               {!isEditing ? (
                 <button className="btn btn-surface" style={{padding: '0.4rem 0.8rem'}} onClick={() => setIsEditing(true)}>
                   <Edit2 size={14}/> Edit
                 </button>
               ) : (
                 <button className="btn btn-primary" style={{padding: '0.4rem 0.8rem'}} onClick={handleSave}>
                   <Check size={14}/> Save
                 </button>
               )}
            </div>

            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                className="form-input"
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input 
                type="text" 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                className="form-input"
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input 
                type="text" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                className="form-input"
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="profile-section" style={{marginTop: '2rem'}}>
            <div className="section-head">
               <h3>Change Password</h3>
            </div>
            <div className="form-group">
              <label>Old Password</label>
              <input 
                type="password" 
                name="oldPassword" 
                value={formData.oldPassword} 
                onChange={handleChange} 
                className="form-input"
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input 
                type="password" 
                name="newPassword" 
                value={formData.newPassword} 
                onChange={handleChange} 
                className="form-input"
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
