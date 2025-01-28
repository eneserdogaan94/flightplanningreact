export const Input = ({ type = "text", placeholder, value, onChange, ...props }) => {
    return (
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
        className="p-2 border rounded-md w-full"
      />
    );
  };