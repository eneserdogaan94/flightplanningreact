export const DatePicker = ({ value, onChange, ...props }) => {
    return (
      <input
        type="date"
        value={value}
        onChange={onChange}
        {...props}
        className="p-2 border rounded-md w-full"
      />
    );
  };
  