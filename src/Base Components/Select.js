export const Select = ({ options = [], value, onChange, ...props }) => {
    return (
      <select
        value={value}
        onChange={onChange}
        {...props}
        className="p-2 border rounded-md w-full"
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  };