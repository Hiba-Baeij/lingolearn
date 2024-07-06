import Confirm from '@/shared/types/confirm'
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React, { PropsWithChildren, createContext , useState } from 'react'

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const ConfirmContext = createContext<((c: Confirm) => any)>(() => {});

export default function FeedBackProvider(props: PropsWithChildren) {
    const [confirm, setConfirmMessage] = useState<(Confirm) | null>(null)
    const [isLoading, setIsLoading] = useState(false);
    const setConfirm = (confirm: Confirm | null) => {setConfirmMessage(confirm)}

    const handleConfirm = async () => {
        if (confirm) {
            setIsLoading(true)
            await confirm.onConfirm();
            setIsLoading(false)
            setConfirmMessage(null)
        }
    }

    return (
        <>
            <Dialog fullWidth maxWidth='xs' open={Boolean(confirm && confirm.message)}>

                    <DialogTitle>
                        {confirm?.title}
                    </DialogTitle>

                <DialogContent>
                    {confirm?.message}
                </DialogContent>


                <DialogActions>
                    <Button color='error' onClick={() => setConfirm(null)}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} variant='contained'>
                        {
                            isLoading ?
                                <CircularProgress color='inherit' variant='indeterminate' size={'18px'} />
                                : "Confirm"
                        }

                    </Button>
                </DialogActions>
            </Dialog>

            <ConfirmContext.Provider value={setConfirmMessage}>

                {props.children}
            </ConfirmContext.Provider>

        </>

    )
}
