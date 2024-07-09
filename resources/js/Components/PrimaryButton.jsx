export default function PrimaryButton({
    className = "",
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className="text-center bg-blue-600 hover:bg-blue-800 rounded text-white w-full p-3"
        >
            {children}
        </button>
    );
}
