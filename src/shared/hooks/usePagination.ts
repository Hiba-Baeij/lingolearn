import { useMemo, useState } from "react"

export type PaginationProps = {
    page: number
    pageSize: number
    total?: number
    isServerBased?: boolean,
}

const defaultProps = { page: 1, pageSize: 10 }

export const usePagination = <DT>(data: DT[] = [], props: PaginationProps = defaultProps) => {
    const [page, setPage] = useState(props.page ?? defaultProps.page);
    const [pageSize, setPageSize] = useState(props.pageSize ?? defaultProps.pageSize);

    const isServerBased = useMemo(() => props.isServerBased ?? !!props.total, [props.total])
    const actualDataSize = useMemo(() => isServerBased ? props.total as number : data.length, [props.total, data, isServerBased])
    const pagesCount = useMemo(() => Math.ceil(actualDataSize / pageSize), [actualDataSize, pageSize])
    const pageData = useMemo(() => isServerBased ? data : data.slice((page - 1) * pageSize, page * pageSize), [page, pageSize, data, isServerBased])


    return { page, setPage, pageSize, setPageSize, actualDataSize, pageData, isServerBased, pagesCount }

}