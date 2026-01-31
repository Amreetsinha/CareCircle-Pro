import React, { useState, useEffect } from "react";

const PasswordInput = ({
    id,
    value,
    onChange,
    placeholder = "Password",
    showStrengthMeter = true,
    className = ""
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [strength, setStrength] = useState(0); // 0-4
    const [strengthLabel, setStrengthLabel] = useState("");

    const calculateStrength = (pass) => {
        let score = 0;
        if (!pass) return 0;

        if (pass.length > 5) score += 1;
        if (pass.length > 8) score += 1;
        if (/[0-9]/.test(pass)) score += 1;
        if (/[^A-Za-z0-9]/.test(pass)) score += 1;

        return score;
    };

    useEffect(() => {
        const score = calculateStrength(value);
        setStrength(score);

        switch (score) {
            case 0: setStrengthLabel(""); break;
            case 1: setStrengthLabel("Weak"); break;
            case 2: setStrengthLabel("Fair"); break;
            case 3: setStrengthLabel("Strong"); break;
            case 4: setStrengthLabel("Very Strong"); break;
            default: setStrengthLabel("");
        }
    }, [value]);

    const getStrengthColor = () => {
        switch (strength) {
            case 1: return "bg-red-400";
            case 2: return "bg-orange-400";
            case 3: return "bg-blue-400";
            case 4: return "bg-green-500";
            default: return "bg-gray-200";
        }
    };

    return (
        <div className={`w-full ${className}`}>
            <div className="input-group-dynamic relative">
                <input
                    id={id}
                    type={showPassword ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    placeholder=" "
                    className="input-dynamic peer pr-12" // Added pr-12 for icon space
                    required
                />
                <label htmlFor={id} className="label-dynamic">
                    {placeholder}
                </label>

                {/* Toggle Visibility Button */}
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0071e3] transition-colors focus:outline-none"
                    tabIndex="-1"
                >
                    {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7c.44 0 .87-.03 1.28-.08" />
                            <line x1="2" x2="22" y1="2" y2="22" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Strength Meter */}
            {showStrengthMeter && value && (
                <div className="mt-2 animate-fade-in">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-gray-500">Security</span>
                        <span className={`text-xs font-semibold ${strength <= 1 ? "text-red-500" :
                                strength === 2 ? "text-orange-500" :
                                    strength === 3 ? "text-blue-500" : "text-green-600"
                            }`}>
                            {strengthLabel}
                        </span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-300 ease-out ${getStrengthColor()}`}
                            style={{ width: `${(strength / 4) * 100}%` }}
                        ></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PasswordInput;
