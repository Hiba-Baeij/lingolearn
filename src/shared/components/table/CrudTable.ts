export type HeadsType<T> = {
    key: keyof T & { id: number };
    label: string;
    numeric?: boolean,
    disablePadding?: boolean,
    customRenderer?: (value: T & { id: string }) => React.ReactNode;
}
