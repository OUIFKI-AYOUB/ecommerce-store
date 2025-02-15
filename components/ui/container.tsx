interface ContainerProps {
    children: React.ReactNode;
    className?: string;
}

const Container: React.FC<ContainerProps> = ({
    children,
    className
}) => {
    return (
        <div className={`mx-auto max-w-7xl touch-pan-x touch-pan-y ${className || ''}`}>
            {children}
        </div>
    )
}

export default Container;
