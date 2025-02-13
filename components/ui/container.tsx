interface ContainerProps {
    children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({
    children
}) => {
    return (
        <div className="mx-auto max-w-7xl zoom-enabled">
            {children}
        </div>
    )
}

export default Container
