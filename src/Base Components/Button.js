export const Button = ({ label, onClick, type = "button", ...props }) => {
    return (
      <button
        type={type}
        onClick={onClick}
        {...props}
        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        {label}
      </button>
    );
  };