import React, { useState } from 'react';

const UserProfile = () => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    emergencyContacts: [
      { name: 'Jane Doe', phone: '+1 (555) 987-6543', relationship: 'Spouse' },
      { name: 'Building Security', phone: '+1 (555) 555-5555', relationship: 'Security' }
    ]
  });

  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    relationship: ''
  });

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setNewContact(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addEmergencyContact = () => {
    if (newContact.name && newContact.phone) {
      setProfile(prev => ({
        ...prev,
        emergencyContacts: [...prev.emergencyContacts, newContact]
      }));
      setNewContact({ name: '', phone: '', relationship: '' });
    }
  };

  const removeContact = (index) => {
    setProfile(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      
      <div className="profile-section">
        <h3>Personal Information</h3>
        <div className="profile-info">
          <div className="info-item">
            <label>Name</label>
            <p>{profile.name}</p>
          </div>
          <div className="info-item">
            <label>Email</label>
            <p>{profile.email}</p>
          </div>
          <div className="info-item">
            <label>Phone</label>
            <p>{profile.phone}</p>
          </div>
        </div>
      </div>

      <div className="profile-section">
        <h3>Emergency Contacts</h3>
        <div className="emergency-contacts">
          {profile.emergencyContacts.map((contact, index) => (
            <div key={index} className="contact-card">
              <div className="contact-info">
                <h4>{contact.name}</h4>
                <p>{contact.relationship}</p>
                <p>{contact.phone}</p>
              </div>
              <button 
                className="remove-contact"
                onClick={() => removeContact(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="add-contact-form">
          <h4>Add New Emergency Contact</h4>
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={newContact.name}
              onChange={handleContactChange}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={newContact.phone}
              onChange={handleContactChange}
            />
            <input
              type="text"
              name="relationship"
              placeholder="Relationship"
              value={newContact.relationship}
              onChange={handleContactChange}
            />
            <button onClick={addEmergencyContact}>Add Contact</button>
          </div>
        </div>
      </div>

      <div className="profile-section">
        <h3>Emergency Protocols</h3>
        <div className="protocols">
          <div className="protocol-item">
            <label>
              <input type="checkbox" defaultChecked />
              Automatically notify emergency contacts during alerts
            </label>
          </div>
          <div className="protocol-item">
            <label>
              <input type="checkbox" defaultChecked />
              Share location with emergency services
            </label>
          </div>
          <div className="protocol-item">
            <label>
              <input type="checkbox" />
              Enable voice alerts during emergencies
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;