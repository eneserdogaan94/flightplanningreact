export const Checkbox = ({ label, checked, onChange, ...props }) => {
    return (
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          {...props}
          className="h-4 w-4 border-gray-300 rounded focus:ring-blue-500"
        />
        <span>{label}</span>
      </label>
    );
  };