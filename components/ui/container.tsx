interface ContainerProps {
    children: React.ReactNode;
    className?: string; // Add this line
}

const Container: React.FC<ContainerProps> = ({
    children,
    className // Retrieve the className
}) => {
    return (
        <div className={`mx-auto max-w-7xl zoom-enabled ${className || ''}`}>
            {children}
        </div>
    )
}

export default Container;
