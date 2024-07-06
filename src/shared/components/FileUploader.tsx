import styled from '@emotion/styled';
import React, { ChangeEvent, useEffect, useId, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { HOST_URL } from '@/api/app.config'
import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useFile } from '../hooks/useFile';
import { urlToHttpOptions } from 'url';

type Props = {
    onChange: (payload: File | null) => void;
    onChangeUrl: (url: string) => void;
    deleteMedia?: (url: string) => void;
    value?: File | null;
    url: string;
    name: string;
    text?: string;
    dtoId?: string;
    label?: string;
    className?: string;
};

const Label = styled.label`
  border: 1px dashed #cccccc;
  width: 100%;
  min-height: 100px;
  cursor: pointer;
`;

const FileUploader = React.forwardRef<HTMLInputElement, Props>(
    ({ onChange, onChangeUrl, dtoId, value, url, text, name, label, deleteMedia, className, ...rest }, ref) => {
        const id = useId();
        const { getFileUrl, getFileType } = useFile();

        const [fileUrl, setFileUrl] = useState<string | null>(null);
        const [fileType, setFileType] = useState<string | null>(null);

        function handleChange(event: ChangeEvent<HTMLInputElement>) {
            if (event.target.files) {
                const file = event.target.files[0];
                const url = URL.createObjectURL(file);
                onChange(file);
                onChangeUrl(url);
                setFileUrl(url);
                setFileType(file.type);
            }
        }

        function reset() {
            onChange(null);
            onChangeUrl('');
            setFileUrl(null);
            setFileType(null);
        }
        useEffect(() => {
            if (url) {
                setFileType(getFileType(url))
                console.log(fileType);
            }
        }, [url])

        const renderMedia = () => {
            if (fileType?.startsWith('video')) {
                return (
                    <video className="h-72" controls>
                        <source src={url?.includes('http') ? url : getFileUrl(url)} type={fileType} />
                        Your browser does not support the video tag.
                    </video>
                );
            } else if (fileType?.startsWith('image')) {
                return (
                    <>
                        {/* {JSON.stringify(getFileUrl(url))} */}
                        <img
                            className="h-72"
                            src={url?.includes('http') ? url : getFileUrl(url)}
                            alt="media"
                        />
                    </>
                );
            }
            return null;
        };

        return (
            <>
                <div className="flex justify-between items-center">
                    {label && <label className="my-2">{label}</label>}
                </div>
                <Label
                    className={`text-center flex items-center justify-center relative ${className}`}
                    htmlFor={`input-file-${id}`}
                >
                    {(url && dtoId) && (
                        <IconButton size="small" sx={{ my: 1, position: 'absolute', top: 0, left: 10 }} onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            reset(); deleteMedia?.(url)
                        }}>
                            <Close />
                        </IconButton>
                    )}
                    {url || fileUrl ? (
                        renderMedia()
                    ) : (
                        <span>{text}</span>
                    )}
                </Label>
                <input
                    ref={ref}
                    placeholder="input"
                    name={name}
                    className="hidden"
                    id={`input-file-${id}`}
                    type="file"
                    onChange={handleChange}
                />
            </>
        );
    }
);

export default FileUploader;
