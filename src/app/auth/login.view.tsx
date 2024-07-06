import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CircularProgress, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoginDto } from "@/api/auth/dto";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { LoginResponseDto } from "@/api/auth/dto";
import { AuthActions } from "@/api/auth/actions";
import { Initialize } from "@/shared/hooks/useAuth";


export default function SignIn() {
    const [isLoading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate()
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const isDark = useSelector<RootState>(state => state.app.isDark) as boolean;

    const { control, handleSubmit } = useForm<LoginDto>({
        defaultValues: {
            password: "",
            email: "",
        }
    })

    const submit = async (event: LoginDto) => {
        setLoading(true)
        // console.log("event", event);
        try {
            let loginDto: LoginResponseDto | undefined = undefined;
            loginDto = await AuthActions.Login(event) as LoginResponseDto
            console.log(loginDto);
            if (loginDto) {
                Initialize(loginDto.accessToken, loginDto.refreshToken)
                navigate('/')
            }
            setLoading(false)

        }
        catch (er) {
            setLoading(false)
            console.log(er)
        }
    };


    return (
        <>
            <div className="bg-image-login"></div>
            <div className="bg-card-login flex justify-center items-center w-full h-screen">
                <Card sx={{ width: { lg: '35rem', md: '100%' }, padding: '2rem' }}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        {
                            isDark ? <img src='/logo2-dark.svg' className="mb-2" height={60} /> : <img src='/logo2-light.svg' className="mb-2" height={60} />
                        }

                        <Typography component="h5" fontWeight='bold' sx={{ mt: 3 }}>
                            تسجيل الدخول
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit(submit)} noValidate sx={{ mt: 1 }}>
                            <Controller
                                rules={{ required: "هذا الحقل مطلوب" }}
                                control={control} name="email" render={({ field, fieldState }) =>
                                    <TextField
                                        {...field}
                                        error={fieldState.invalid}
                                        helperText={fieldState.error?.message}
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="email"
                                        label="البريد الالكتروني"
                                        type="text"
                                        autoFocus
                                    />
                                } />

                            <Controller
                                rules={{ required: "هذا الحقل مطلوب" }}
                                name="password" control={control} render={({ field, fieldState }) =>
                                    <TextField
                                        {...field}
                                        error={fieldState.invalid}
                                        helperText={fieldState.error?.message}
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="password"
                                        label="كلمة المرور"
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={handleClickShowPassword} edge="end">
                                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                } />

                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="تذكرني"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, color: '#fff' }}
                            >
                                {
                                    !isLoading ?
                                        "سجل دخول" : <CircularProgress color='inherit' size={24} />
                                }
                            </Button>

                        </Box>
                    </Box>
                </Card>
            </div>
        </>

    );
}