import bcrypt from 'bcrypt';

const hashPassword = async (password) => {
    try {
        const salt = bcrypt.genSalt(10);
        const hashedPassword = bcrypt.hash(password, salt);
        return hashedPassword;
    }catch(e) {
        throw new Error("Password hashing falid");
    }
}

export default hashPassword;