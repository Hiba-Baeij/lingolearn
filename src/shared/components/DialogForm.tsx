import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogProps,
    DialogTitle,
    IconButton,
    LinearProgress,
    Typography,
} from "@mui/material";
import React, {
    FormEvent,
    FormHTMLAttributes,
    PropsWithChildren,
    ReactNode,
    useState,
} from "react";
import Divider from "@mui/material/Divider";
import { useDarkMode } from "usehooks-ts";
import { useTranslation } from "react-i18next";
import LoadingButton from "@mui/lab/LoadingButton";
import { BiCheckDouble } from "react-icons/bi";
import { Close } from "@mui/icons-material";

interface FormProps {
    title: string;
    open: boolean;
    onOpenChange?: (value: boolean) => void;
    onReset?: () => void;
    formProps?: FormHTMLAttributes<HTMLFormElement>;
    fullWidth?: boolean;
    isForm?: boolean;
    okBtn?: boolean | string;
    closeBtn?: boolean | string;
    footer?: ReactNode | null;
    appendActions?: ReactNode;
    disableAction?: boolean;
    isLoading?: boolean;
    isPendingData?: boolean;
    size?: DialogProps["maxWidth"];
}

const RenderContent = ({
    children,
    isForm,
    formProps,
}: PropsWithChildren<FormProps>) => {
    {
        return isForm ? <form {...formProps}>{children}</form> : children;
    }
};

export default function DialogForm(
    props: PropsWithChildren<DialogProps & FormProps>
) {
    const {
        size = "sm",
        fullWidth = true,
        closeBtn = true,
        okBtn = true,
        footer,
        appendActions,
        title,
        children,
        formProps,
        isForm,
        disableAction,
        isLoading,
        isPendingData,
        onOpenChange,
        open,
        onReset,
    } = props;


    return (
        <Dialog
            fullWidth={fullWidth}
            maxWidth={size}
            open={open}
            onClose={() => {
                onOpenChange?.(false);
                onReset?.();
            }}
        >
            <RenderContent {...props}>
                {/* {isPendingData ? <Box sx={{ width: '100%' }}>
                    <LinearProgress color="primary" />
                </Box> : null} */}
                <Box
                    display={"flex"}
                    alignItems="center"
                    justifyContent={"space-between"}
                    px={2.5}
                    pt={2.5}
                >
                    <Typography variant="h6" fontWeight={"600"}>
                        {title}
                    </Typography>
                    <IconButton
                        onClick={() => {
                            onOpenChange?.(false);
                            onReset?.();
                        }}
                    >
                        <Close className="text-3xl"></Close>
                    </IconButton>
                </Box>
                <DialogContent>{children}</DialogContent>
                <Divider />
                <DialogActions>
                    {footer ?? (
                        <>
                            {closeBtn && (
                                <Button
                                    color="error"
                                    variant="text"
                                    onClick={() => {
                                        onOpenChange?.(false);
                                        onReset?.();
                                    }}
                                >
                                    {(typeof closeBtn == "string" && closeBtn) || "إلغاء"}
                                </Button>
                            )}
                            {/* isLoading={isLoading} disabled={disableAction} */}
                            {okBtn && !isLoading && (
                                <Button startIcon={<BiCheckDouble />}
                                    type={isForm ? "submit" : "button"} variant="contained">
                                    {(typeof okBtn == "string" && okBtn) || "حفظ"}
                                    {disableAction}
                                </Button>
                            )}
                            {isLoading && (
                                <LoadingButton
                                    loading
                                    loadingPosition="start"
                                    startIcon={<BiCheckDouble />}
                                    variant="outlined"
                                >
                                    حفظ
                                </LoadingButton>
                            )}
                            {appendActions}
                        </>
                    )}
                </DialogActions>
            </RenderContent>
        </Dialog>
    );
}
