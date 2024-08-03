import React from 'react'
import {
    Box,
    FormHelperText,
    InputLabel,
    TextField,
    TextFieldProps,
    Typography,
    colors,
} from "@mui/material";
import {
    ChangeEvent,
    ReactNode,
    useCallback,
    useId,
} from "react";
import {
    Controller,
    FieldValues,
    UseFormClearErrors,
    Control,
    Path,
    RegisterOptions,
    ControllerRenderProps,
    PathValue,
} from "react-hook-form";
import FilesPreview, { Preview } from "./FilesPreview";
import { useFile } from "@/shared/hooks/useFile";
import { MdOutlineAttachFile } from "react-icons/md";
// import { useTranslation } from "react-i18next";
// import { AttachFileIcon } from "@/app/components/Icons";

type FileType = File[] | File | undefined;

type ControllerFileInput<T extends Omit<FieldValues, 'children'>> = {
    clearErrors?: UseFormClearErrors<T>;
    control: Control<T>;
    name: Path<T>;
    disabled?: boolean;
    rules?: Omit<RegisterOptions<T, Path<T>>, "deps">
    multiple?: boolean;
    value?: File | undefined;
    noPreview?: boolean;
    attachedFiles?: Preview[] | undefined,
    defaultValue?: PathValue<T, Path<T>> | undefined,
    removePreviewList?: (id: number) => void,
    children?: (
        field: ControllerRenderProps,
        filesPreviw: Preview[],
        handleDelete: (idx: number, values: FieldValues, onChange: (file: FileType) => any) => void,
        defalutContent: ReactNode,
        getFilePreview: (file: File) => Preview,
    ) => ReactNode;

} & Omit<TextFieldProps, 'children'>;

export default function FileInput<T extends FieldValues>({
    control,
    label,
    name,
    rules,
    disabled,
    noPreview,
    removePreviewList,
    multiple,
    defaultValue,
    children,
    attachedFiles = [],
    ...muiProps
}: ControllerFileInput<T>) {
    const id = useId();
    const { getFileExt, getFileType } = useFile();
    function handleChange(
        event: ChangeEvent<HTMLInputElement>,
        onChange: (file: FileType) => any
    ) {
        if (event.target.files && event.target.files.length > 0) {
            const files = event.target.files;
            onChange?.(multiple ? Array.from(files) : files[0]);
        }
    }

    const getFilePreview = useCallback(
        (file: File): Preview => {
            const url = file ? URL.createObjectURL(file) : "";
            console.log(file);

            return {
                url,
                id: file.name + url,
                name: file.name,
                type: getFileType(getFileExt(file.name)) as any,
                // size: Number(file.size / 1024 / 1024),
            };
        },
        [getFileExt, getFileType]
    );

    const filesPreview = useCallback(
        (vals: File | File[]): Preview[] => {
            let preview: Preview[] = [];
            if (multiple && Array.isArray(vals)) {
                preview = vals.map((f) => getFilePreview(f));
            } else if (vals) {
                preview = [getFilePreview(vals as File)];
            }
            return [...preview, ...attachedFiles]
        },
        [getFilePreview, multiple, attachedFiles]
    );

    const getDefaultContent = (value: FieldValues) => {
        if (typeof value === 'object' || attachedFiles.length > 0) {

            if (Array.isArray(value) || attachedFiles.length > 0) {

                return <div className="flex items-center gap-2">
                    <MdOutlineAttachFile size={20}></MdOutlineAttachFile ><Typography>الملف المختار  {filesPreview(value as File).length}
                    </Typography>
                </div>
            }

            else if (value instanceof File) return <div className="flex items-center gap-2">
                <MdOutlineAttachFile size={20}></MdOutlineAttachFile >
                <Typography>{value.name.length > 40 ? value.name.slice(0, 40) + ".........." : value.name}</Typography>
            </div>
        }

        return <div className="flex items-center gap-2">
            <MdOutlineAttachFile size={20}></MdOutlineAttachFile >
            <Typography>ارفع ملف</Typography>
        </div>


    }

    const handleDelete = (idx: number, values: FieldValues, onChange: (file: FileType) => any) => {
        let newFiles;
        console.log(idx);

        if (multiple && Array.isArray(values)) {
            newFiles = values.filter((_, i) => i !== idx);
        }

        if (!newFiles || (Array.isArray(newFiles) && newFiles.length === 0)) {
            newFiles = undefined;
        }

        onChange(newFiles);
    };


    // console.log(control.(name))

    return (
        <div className={muiProps.className}>
            <Controller name={name} defaultValue={defaultValue ? defaultValue : undefined}
                control={control} rules={rules} render={(context) => (
                    <>
                        <label htmlFor={`input-file-${id}`}>
                            <InputLabel>{label}</InputLabel>
                            <div className="flex flex-col">
                                <Box
                                    sx={(t) => ({
                                        p: 1,
                                        border: 1,
                                        borderWidth: 2,
                                        borderColor: context.fieldState.invalid
                                            ? t.palette.error[t.palette.mode]
                                            : colors.grey[400],
                                        borderRadius: 0.8,
                                        borderStyle: "dashed",
                                        textAlign: "center",
                                        display: "flex",
                                        justifyContent: "center",
                                        color: t.palette.text.secondary,
                                        cursor: "pointer",
                                        "&:hover": { borderColor: t.palette.text.primary },
                                    })}
                                >
                                    {children ? (
                                        children({ ...context.field }, [...filesPreview(context.field.value),], handleDelete, getDefaultContent(context.field.value), getFilePreview))
                                        : getDefaultContent(context.field.value)

                                    }
                                </Box>
                                <TextField
                                    InputProps={{ id: `input-file-${id}` }}
                                    sx={{ display: "none" }}
                                    onChange={(e) =>
                                        handleChange(
                                            e as ChangeEvent<HTMLInputElement>,
                                            context.field.onChange
                                        )
                                    }
                                    error={context.fieldState.invalid}
                                    helperText={context.fieldState.error?.message}
                                    onBlur={context.field.onBlur}
                                    label={label}
                                    disabled={disabled}
                                    fullWidth
                                    inputProps={{ multiple }}
                                    type="file"
                                    {...muiProps}
                                />
                                {context.fieldState.invalid && (
                                    <FormHelperText
                                        sx={(t) => ({ color: t.palette.error[t.palette.mode] })}
                                    >
                                        {context.fieldState.error?.message}
                                    </FormHelperText>
                                )}
                            </div>
                        </label>
                        {filesPreview.length > 0 && !noPreview && (
                            <>
                                <FilesPreview
                                    listProps={{ sx: { maxHeight: "300px", overflow: "auto" } }}
                                    onDelete={(e) => { removePreviewList?.(e); handleDelete(e, context.field.value, context.field.onChange) }}
                                    listPreview={[...filesPreview(context.field.value)]}
                                ></FilesPreview>
                            </>
                        )}
                    </>
                )
                } />
        </div>
    )
}
