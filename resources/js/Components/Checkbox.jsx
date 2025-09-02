export default function Checkbox({ className = "", ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                "rounded border-neutral-300 text-primary-500 shadow-sm focus:ring-primary-500 focus:border-primary-500 " +
                className
            }
        />
    );
}
