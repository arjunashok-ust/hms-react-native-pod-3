export type LoginRequestModel = {
    email: string,
    password: string,
}

export type SignUpRequestModel = {
    name: string,
    email: string,
    role: string,
    status: string,
    password: string,
    phone: string,
    gender: string,
    address: string,
    dob: Date,
    emergencyContact: string,
}