import API from "../../API";
import Wrapper from "../../components/wrapper";
import React, { useState, useEffect } from "react";

// Your configured Axios instance

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get("/api/profile/");
        const userData = response.data;
        setUser(userData);
        setFormData({
          username: userData.username,
          email: userData.email,
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile.");
      }
    };

    fetchProfile();
  }, []);

  // Handle profile picture update
  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png"];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!validTypes.includes(file.type)) {
      alert("Only JPEG and PNG images are allowed.");
      return;
    }

    if (file.size > maxSize) {
      alert("File size must be less than 2MB.");
      return;
    }

    setLoading(true);
    try {
      const formDataFile = new FormData();
      formDataFile.append("profile_picture", file);
      const response = await API.post(
        "/api/profile/profile_picture/",
        formDataFile,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      // Update profile picture URL from response
      setUser((prev) => ({ ...prev, ...response.data }));
    } catch (err) {
      console.error("Error uploading profile picture:", err);
      setError("Failed to upload profile picture.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Update profile details (username and email)
  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await API.put("/api/profile/", formData); //waiting for api
      setUser((prev) => ({ ...prev, ...response.data }));
      setEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  // Handle changes in password form fields
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  // Change password
  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await API.post("/api/profile/change_password/", {
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
        confirm_new_password: passwordData.confirmPassword,
      });
      setPasswordSuccess(
        response.data.detail || "Password updated successfully."
      );
      setPasswordError("");
      setShowPasswordForm(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setPasswordError(
        err.response?.data?.detail ||
          "Failed to update password. Check your current password."
      );
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <Wrapper>
      <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-center">My Profile</h2>
        </div>
        <div>
          {error && (
            <div
              style={{
                backgroundColor: "#FEE2E2",
                color: "#B91C1C",
                padding: "12px",
                borderRadius: "6px",
                marginBottom: "16px",
              }}
            >
              {error}
            </div>
          )}

          <div className="flex flex-col items-center mb-6">
            <div style={{ position: "relative" }}>
              <img
                src={user.profile_picture || "/default-profile.png"}
                alt="Profile"
                style={{
                  width: "128px",
                  height: "128px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginBottom: "16px",
                }}
              />
              <input
                type="file"
                accept="image/jpeg, image/png"
                onChange={handleProfilePictureChange}
                disabled={loading}
                style={{ display: "none" }}
                id="profile-picture-upload"
              />
              <label
                htmlFor="profile-picture-upload"
                style={{
                  position: "absolute",
                  bottom: "0",
                  right: "0",
                  backgroundColor: "#172554",
                  color: "white",
                  padding: "8px",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
              >
                Edit
              </label>
            </div>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <p className="mt-1 text-sm">{user.full_name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              {editing ? (
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={loading}
                  style={{
                    marginTop: "4px",
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid #D1D5DB",
                    outline: "none",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                  }}
                />
              ) : (
                <p className="mt-1 text-sm">{user.username}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              {editing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                  style={{
                    marginTop: "4px",
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid #D1D5DB",
                    outline: "none",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                  }}
                />
              ) : (
                <p className="mt-1 text-sm">{user.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <p className="mt-1 text-sm">{user.role}</p>
            </div>

            {user.role !== "admin" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  College
                </label>
                <p className="mt-1 text-sm">{user.college}</p>
              </div>
            )}

            <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
              {editing ? (
                <button
                  onClick={handleSave}
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: "8px 16px",
                    backgroundColor: "#172554",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    opacity: loading ? 0.5 : 1,
                  }}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: "8px 16px",
                    backgroundColor: "#172554",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    opacity: loading ? 0.5 : 1,
                  }}
                >
                  Edit Profile
                </button>
              )}
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "8px 16px",
                  backgroundColor: "#6B7280",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  opacity: loading ? 0.5 : 1,
                }}
              >
                Change Password
              </button>
            </div>

            {showPasswordForm && (
              <div
                style={{
                  marginTop: "24px",
                  padding: "16px",
                  backgroundColor: "#F9FAFB",
                  borderRadius: "6px",
                }}
              >
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: 600,
                    marginBottom: "16px",
                  }}
                >
                  Change Password
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword.currentPassword ? "text" : "password"}
                      name="currentPassword"
                      placeholder="Current Password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      disabled={loading}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        paddingRight: "40px",
                        borderRadius: "6px",
                        border: "1px solid #D1D5DB",
                        outline: "none",
                        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        togglePasswordVisibility("currentPassword")
                      }
                      style={{
                        position: "absolute",
                        right: "8px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#6B7280",
                      }}
                    >
                      {showPassword.currentPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword.newPassword ? "text" : "password"}
                      name="newPassword"
                      placeholder="New Password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      disabled={loading}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        paddingRight: "40px",
                        borderRadius: "6px",
                        border: "1px solid #D1D5DB",
                        outline: "none",
                        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("newPassword")}
                      style={{
                        position: "absolute",
                        right: "8px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#6B7280",
                      }}
                    >
                      {showPassword.newPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword.confirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm New Password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      disabled={loading}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        paddingRight: "40px",
                        borderRadius: "6px",
                        border: "1px solid #D1D5DB",
                        outline: "none",
                        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        togglePasswordVisibility("confirmPassword")
                      }
                      style={{
                        position: "absolute",
                        right: "8px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#6B7280",
                      }}
                    >
                      {showPassword.confirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  {passwordError && (
                    <p
                      style={{
                        color: "#EF4444",
                        fontSize: "14px",
                        marginTop: "8px",
                      }}
                    >
                      {passwordError}
                    </p>
                  )}
                  {passwordSuccess && (
                    <p
                      style={{
                        color: "#10B981",
                        fontSize: "14px",
                        marginTop: "8px",
                      }}
                    >
                      {passwordSuccess}
                    </p>
                  )}

                  <button
                    onClick={handleChangePassword}
                    disabled={loading}
                    style={{
                      width: "100%",
                      padding: "8px 16px",
                      backgroundColor: "#172554",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      opacity: loading ? 0.5 : 1,
                    }}
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default ProfilePage;
