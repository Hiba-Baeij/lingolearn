export default interface Confirm {
    message: string,
    title: string,
    onConfirm: () => any | Promise<any>,
    onReject?: () => any | null,
}