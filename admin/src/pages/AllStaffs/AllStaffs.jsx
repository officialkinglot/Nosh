import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AllStaffs.css';

const roles = ["admin", "dispatcher", "chef", "security", "manager", "ceo"];
const roleRanking = { "ceo": 1, "manager": 2, "admin": 3, "dispatcher": 4, "chef": 5, "security": 6 };
const genders = ["Male", "Female", "Other"];

const fetchStaffsFromStorage = () => {
  const allStaffs = roles
    .map(role => {
      const data = JSON.parse(localStorage.getItem(role)) || [];
      return data.map(staff => ({ ...staff, role }));
    })
    .flat();
  return allStaffs;
};

const saveStaffsToDatabase = async (staffs) => {
  // Simulate saving to a database
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Data saved to database:", staffs);
      resolve();
    }, 1000);
  });
};

const deleteStaffFromDatabase = async (staffId) => {
  // Simulate deleting from a database
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Staff deleted from database:", staffId);
      resolve();
    }, 1000);
  });
};

const AllStaff = () => {
  const [staffs, setStaffs] = useState([]);
  const [newStaff, setNewStaff] = useState({ name: "", phone: "", location: "", role: roles[0], gender: genders[0] });
  const [error, setError] = useState("");
  const [rankedStaffs, setRankedStaffs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const staffs = fetchStaffsFromStorage();
    setStaffs(staffs);
    setRankedStaffs(sortStaffsByRank(staffs));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStaff({ ...newStaff, [name]: value });
    setIsEditing(true);
  };

  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.phone || !newStaff.location || !newStaff.gender) {
      setError("All fields are required!");
      return;
    }
    if (!/^\d{11}$/.test(newStaff.phone)) {
      setError("Phone number must be 10 digits.");
      return;
    }
    const updatedStaffs = [...staffs, { ...newStaff, id: Date.now() }];
    setStaffs(updatedStaffs);
    setNewStaff({ name: "", phone: "", location: "", role: roles[0], gender: genders[0] });
    setError("");
    setIsEditing(true);

    // Update local storage
    roles.forEach(role => {
      const filtered = updatedStaffs.filter(staff => staff.role === role);
      localStorage.setItem(role, JSON.stringify(filtered));
    });

    // Show toast notification
    toast.success("New staff added successfully!");
  };

  const handleSave = async () => {
    await saveStaffsToDatabase(staffs);
    setRankedStaffs(sortStaffsByRank(staffs));
    toast.success("Staff information saved successfully!");
    setIsEditing(false);
  };

  const handleDelete = async (index) => {
    const staffToDelete = staffs[index];
    await deleteStaffFromDatabase(staffToDelete.id);

    const updatedStaffs = staffs.filter((_, i) => i !== index);
    setStaffs(updatedStaffs);

    // Update local storage
    roles.forEach(role => {
      const filtered = updatedStaffs.filter(staff => staff.role === role);
      localStorage.setItem(role, JSON.stringify(filtered));
    });

    setRankedStaffs(sortStaffsByRank(updatedStaffs));
    toast.success("Staff deleted successfully!");
  };

  const sortStaffsByRank = (staffs) => {
    return staffs.sort((a, b) => roleRanking[a.role] - roleRanking[b.role]);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'dispatcher':
        return '🚐';
      case 'chef':
        return '☕';
      case 'security':
        return '🔒';
      case 'manager':
        return '👔';
      case 'ceo':
        return '👑';
      case 'admin':
        return '💼';
      default:
        return '👤';
    }
  };

  return (
    <div className="all-staff">
      <ToastContainer />
      <h1>All Staffs</h1>
      <table>
        <thead>
          <tr>
            <th>Role</th>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Location</th>
            <th>Gender</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {staffs.map((staff, index) => (
            <tr key={index}>
              <td>{staff.role}</td>
              <td>{staff.name}</td>
              <td>{staff.phone}</td>
              <td>{staff.location}</td>
              <td>{staff.gender}</td>
              <td>
                <button className="delete-button" onClick={() => handleDelete(index)}>Delete</button>
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <select name="role" value={newStaff.role} onChange={handleChange}>
                {roles.map(role => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </td>
            <td>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={newStaff.name}
                onChange={handleChange}
              />
            </td>
            <td>
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={newStaff.phone}
                onChange={handleChange}
              />
            </td>
            <td>
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={newStaff.location}
                onChange={handleChange}
              />
            </td>
            <td>
              <select name="gender" value={newStaff.gender} onChange={handleChange}>
                {genders.map(gender => (
                  <option key={gender} value={gender}>
                    {gender}
                  </option>
                ))}
              </select>
            </td>
            <td>
              <button onClick={handleAddStaff}>Add</button>
            </td>
          </tr>
        </tbody>
      </table>
      {error && <div className="error">{error}</div>}
      {isEditing && <button onClick={handleSave}>Save Changes</button>}

      <div className="ranked-list">
        <h2>Ranked Staff List</h2>
        <ul className='ul'>
          {rankedStaffs.map((staff, index) => (
            <li key={index}>
              {index + 1}. <span className="role-title">{getRoleIcon(staff.role)} {staff.role.toUpperCase()}:</span> 👤 {staff.name} - ({staff.phone}) {staff.gender}, {staff.location}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AllStaff;
