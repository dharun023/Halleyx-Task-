import React, { useState } from 'react';
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    subscribeNewsletter: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const RequirementItem = ({ label, valid }) => (
  <div className={`flex items-center gap-1 ${valid ? "text-green-600" : "text-gray-500"}`}>
    {valid ? "✔️" : "❌"} <span>{label}</span>
  </div>
    );

  // Password strength check
  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    const strength = Object.values(requirements).filter(Boolean).length;
    return { requirements, strength };
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const passwordValidation = formData.password ? validatePassword(formData.password) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Password and confirm password must be the same");
      return;
    }

    if (!formData.agreeToTerms) {
      toast.error("You must agree to the terms and privacy policy");
      return;
    }

    setIsLoading(true);

    try {
      const response = await Axios({
        ...SummaryApi.register,
        data: {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        },
      });

      if (response.data.error) {
        toast.error(response.data.message);
      } else if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    formData.name &&
    formData.email &&
    formData.password &&
    formData.confirmPassword;

  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-7">
        <h2 className="text-2xl font-bold mb-4 text-center">Create Account</h2>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="grid gap-1">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="bg-blue-50 p-2 border rounded outline-none focus:border-primary-200"
              placeholder="Enter your name"
            />
          </div>

          {/* Email */}
          <div className="grid gap-1">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-blue-50 p-2 border rounded outline-none focus:border-primary-200"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Field */}
<div className="grid gap-1">
  <label htmlFor="password">Password:</label>
  <div className="bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200">
    <input
      type={showPassword ? "text" : "password"}
      id="password"
      name="password"
      value={formData.password}
      onChange={handleChange}
      className="w-full outline-none"
      placeholder="Enter your password"
    />
    <div
      onClick={() => setShowPassword((prev) => !prev)}
      className="cursor-pointer"
    >
      {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
    </div>
  </div>
</div>

{/* Password Strength Meter */}
{formData.password && passwordValidation && (
  <div className="mt-2 space-y-2">
    {/* Strength label */}
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">Password strength:</span>
      <span
        className={`text-sm font-medium ${
          passwordValidation.strength <= 2
            ? "text-red-500"
            : passwordValidation.strength <= 3
            ? "text-yellow-500"
            : passwordValidation.strength <= 4
            ? "text-blue-500"
            : "text-green-500"
        }`}
      >
        {passwordValidation.strength <= 2
          ? "Weak"
          : passwordValidation.strength <= 3
          ? "Fair"
          : passwordValidation.strength <= 4
          ? "Good"
          : "Strong"}
      </span>
    </div>

    {/* Strength bar */}
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`h-2 rounded-full transition-all duration-300 ${
          passwordValidation.strength <= 2
            ? "bg-red-500"
            : passwordValidation.strength <= 3
            ? "bg-yellow-500"
            : passwordValidation.strength <= 4
            ? "bg-blue-500"
            : "bg-green-500"
        }`}
        style={{ width: `${(passwordValidation.strength / 5) * 100}%` }}
      />
    </div>

    {/* Requirements checklist */}
    <div className="grid grid-cols-2 gap-1 text-sm">
      <RequirementItem label="8+ characters" valid={passwordValidation.requirements.length} />
      <RequirementItem label="Uppercase letter" valid={passwordValidation.requirements.uppercase} />
      <RequirementItem label="Lowercase letter" valid={passwordValidation.requirements.lowercase} />
      <RequirementItem label="Number" valid={passwordValidation.requirements.number} />
      <RequirementItem label="Special character" valid={passwordValidation.requirements.special} />
    </div>
  </div>
    )}


          {/* Confirm Password */}
          <div className="grid gap-1">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <div className="bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full outline-none"
                placeholder="Confirm your password"
              />
              <div
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="cursor-pointer"
              >
                {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
          </div>

          {/* Terms & Newsletter */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
              />
              I agree to the Terms of Service & Privacy Policy
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="subscribeNewsletter"
                checked={formData.subscribeNewsletter}
                onChange={handleChange}
              />
              Subscribe to our newsletter
            </label>
          </div>

          {/* Submit Button */}
          <button
            disabled={!isFormValid || isLoading}
            className={`${
              isFormValid ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"
            } text-white py-2 rounded font-semibold my-3 tracking-wide`}
          >
            {isLoading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="text-center mt-2">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-green-700 hover:text-green-800">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Register;
